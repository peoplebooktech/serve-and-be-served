import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(userId, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
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

    const { userSkills, userRole, userBio } = await req.json();

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const adminClient = createClient(supabaseUrl, SUPABASE_SERVICE_KEY);

    // Fetch all other profiles except current user
    const { data: profiles, error } = await adminClient
      .from('profiles')
      .select('id, name, title, company, bio, skills, user_id')
      .neq('user_id', userId)
      .limit(20);

    if (error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }

    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ recommendations: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create embeddings for current user
    const userContent = `Role: ${userRole}. Skills: ${userSkills?.join(', ')}. Bio: ${userBio}`;
    
    const userEmbeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: userContent,
      }),
    });

    if (!userEmbeddingResponse.ok) {
      throw new Error('Failed to create user embedding');
    }

    const userEmbeddingData = await userEmbeddingResponse.json();
    const userEmbedding = userEmbeddingData.data[0].embedding;

    // Calculate similarity scores
    const profileScores = await Promise.all(
      profiles.map(async (profile) => {
        const profileContent = `Skills: ${profile.skills?.join(', ')}. Bio: ${profile.bio}. Title: ${profile.title}. Company: ${profile.company}`;
        
        const profileEmbeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-ada-002',
            input: profileContent,
          }),
        });

        if (!profileEmbeddingResponse.ok) {
          return { profile, score: 0 };
        }

        const profileEmbeddingData = await profileEmbeddingResponse.json();
        const profileEmbedding = profileEmbeddingData.data[0].embedding;

        const dotProduct = userEmbedding.reduce((sum: number, a: number, idx: number) => sum + a * profileEmbedding[idx], 0);
        const normA = Math.sqrt(userEmbedding.reduce((sum: number, a: number) => sum + a * a, 0));
        const normB = Math.sqrt(profileEmbedding.reduce((sum: number, b: number) => sum + b * b, 0));
        const similarity = dotProduct / (normA * normB);

        return { profile, score: similarity };
      })
    );

    const recommendations = profileScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ profile, score }) => ({
        ...profile,
        matchScore: Math.round(score * 100)
      }));

    console.log('Generated AI recommendations successfully');
    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-recommendations:', error.message);
    return new Response(JSON.stringify({ error: 'An error occurred generating recommendations.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});