import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify the JWT and get user claims
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error('Auth error:', claimsError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log(`Authenticated request from user: ${userId}`);

    const { action, content, role, skills, vertical } = await req.json();

    // Validate inputs
    if (!action || typeof action !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Action is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!content || typeof content !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (content.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Content is too long (max 5000 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validActions = ['enhance_post', 'generate_hashtags', 'summarize_post'];
    if (!validActions.includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Use: enhance_post, generate_hashtags, or summarize_post' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Sanitize inputs
    const sanitizedRole = (role || 'Professional').slice(0, 50);
    const sanitizedSkills = Array.isArray(skills) ? skills.slice(0, 20).map(s => String(s).slice(0, 50)).join(', ') : 'General';
    const sanitizedVertical = (vertical || 'General').slice(0, 50);

    let prompt = '';
    let systemMessage = '';

    if (action === 'enhance_post') {
      systemMessage = 'You are a professional content creator for PeopleBook.ai, specializing in creating engaging posts for professional networking.';
      prompt = `Transform these rough notes into a polished, engaging post for PeopleBook.ai:

User Details:
- Role: ${sanitizedRole}
- Skills: ${sanitizedSkills}
- Vertical: ${sanitizedVertical}

Raw Content: ${content}

Requirements:
1. Professional yet conversational tone
2. Relevant to ${sanitizedVertical} vertical
3. Engaging and actionable
4. Include relevant keywords naturally
5. 200-300 words maximum
6. Add call-to-action if appropriate

Return only the enhanced post content.`;

    } else if (action === 'generate_hashtags') {
      systemMessage = 'You are a hashtag expert for professional social networking platforms.';
      prompt = `Generate 3-5 relevant, trending hashtags for this post content:

Content: ${content}
Vertical: ${sanitizedVertical}
User Role: ${sanitizedRole}

Requirements:
1. Mix of popular and niche hashtags
2. Relevant to ${sanitizedVertical}
3. Professional and appropriate
4. Include both broad and specific tags

Return hashtags as a simple comma-separated list (e.g., #ai, #networking, #innovation, #mentorship, #growth)`;

    } else if (action === 'summarize_post') {
      systemMessage = 'You are a content summarization expert.';
      prompt = `Create a concise TL;DR summary of this post:

Content: ${content}

Requirements:
1. 1-2 sentences maximum
2. Capture key points and value
3. Maintain professional tone
4. Start with "TL;DR:"

Return only the summary.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: action === 'enhance_post' ? 400 : 100,
        temperature: action === 'summarize_post' ? 0.3 : 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to process content');
    }

    const data = await response.json();
    const result = data.choices[0].message.content.trim();

    console.log(`AI post assistant: ${action} completed successfully for user: ${userId}`);
    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-post-assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
