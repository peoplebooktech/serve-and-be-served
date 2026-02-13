import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// In-memory rate limiting (per-user, resets on cold start)
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX = 5; // 5 requests per window
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(userId, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = claimsData.claims.sub;

    // Rate limit check
    if (!checkRateLimit(userId)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a minute.' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use service role to fetch all profiles for matching
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, serviceKey);

    // Get current user's profile
    const { data: userProfile, error: profileError } = await adminClient
      .from('profiles')
      .select('id, name, title, company, bio, skills, goals, niche, user_id')
      .eq('user_id', userId)
      .single();

    if (profileError || !userProfile) {
      return new Response(JSON.stringify({ error: 'Profile not found. Complete onboarding first.' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get existing matches to exclude
    const { data: existingMatches } = await adminClient
      .from('matches')
      .select('matched_user_id')
      .eq('user_id', userId);

    const excludeUserIds = [userId, ...(existingMatches?.map(m => m.matched_user_id) || [])];

    // Fetch candidate profiles
    const { data: candidates, error: candidatesError } = await adminClient
      .from('profiles')
      .select('id, name, title, company, bio, skills, goals, niche, user_id')
      .not('user_id', 'in', `(${excludeUserIds.join(',')})`)
      .limit(50);

    if (candidatesError || !candidates || candidates.length === 0) {
      return new Response(JSON.stringify({ matches: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use Lovable AI to analyze matches
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('AI API key not configured');
    }

    const userSummary = `Name: ${userProfile.name}. Title: ${userProfile.title}. Skills: ${userProfile.skills?.join(', ')}. Goals: ${userProfile.goals?.join(', ')}. Niche: ${userProfile.niche}. Bio: ${userProfile.bio}`;

    const candidateSummaries = candidates.map((c, i) => 
      `[${i}] ${c.name} | Title: ${c.title} | Skills: ${c.skills?.join(', ')} | Goals: ${c.goals?.join(', ')} | Niche: ${c.niche} | Bio: ${c.bio}`
    ).join('\n');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are a collaboration matching engine. Analyze skill complementarity, goal alignment, and potential synergy between users. Focus on how users can help EACH OTHER grow — complementary skills are more valuable than identical skills. Return structured match data.`
          },
          {
            role: 'user',
            content: `Match this user:\n${userSummary}\n\nAgainst these candidates:\n${candidateSummaries}\n\nReturn the top 5 matches.`
          }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'return_matches',
            description: 'Return ranked matches with synergy analysis',
            parameters: {
              type: 'object',
              properties: {
                matches: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      candidate_index: { type: 'number', description: 'Index from candidate list' },
                      synergy_score: { type: 'number', description: 'Score 0-100' },
                      match_reason: { type: 'string', description: 'Why this is a good match, 1-2 sentences' },
                      complementary_strengths: { type: 'array', items: { type: 'string' }, description: '2-4 complementary strength areas' }
                    },
                    required: ['candidate_index', 'synergy_score', 'match_reason', 'complementary_strengths'],
                    additionalProperties: false
                  }
                }
              },
              required: ['matches'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'return_matches' } }
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limited. Try again shortly.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('AI matching failed');
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No match results from AI');
    }

    const matchResults = JSON.parse(toolCall.function.arguments);

    // Store matches in database
    const matchInserts = matchResults.matches
      .filter((m: any) => m.candidate_index >= 0 && m.candidate_index < candidates.length)
      .map((m: any) => ({
        user_id: userId,
        matched_user_id: candidates[m.candidate_index].user_id,
        synergy_score: Math.min(99.99, Math.max(0, m.synergy_score)),
        match_reason: m.match_reason,
        complementary_strengths: m.complementary_strengths,
        status: 'pending',
      }));

    if (matchInserts.length > 0) {
      const { error: insertError } = await adminClient
        .from('matches')
        .upsert(matchInserts, { onConflict: 'user_id,matched_user_id' });

      if (insertError) {
        console.error('Failed to store matches:', insertError);
      }
    }

    // Return enriched match data
    const enrichedMatches = matchResults.matches
      .filter((m: any) => m.candidate_index >= 0 && m.candidate_index < candidates.length)
      .map((m: any) => {
        const candidate = candidates[m.candidate_index];
        return {
          id: candidate.id,
          name: candidate.name,
          title: candidate.title,
          company: candidate.company,
          skills: candidate.skills,
          image_url: null,
          synergy_score: m.synergy_score,
          match_reason: m.match_reason,
          complementary_strengths: m.complementary_strengths,
        };
      });

    console.log(`Generated ${enrichedMatches.length} AI matches for user`);
    return new Response(JSON.stringify({ matches: enrichedMatches }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-matching:', error.message);
    return new Response(JSON.stringify({ error: 'An error occurred during matching.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
