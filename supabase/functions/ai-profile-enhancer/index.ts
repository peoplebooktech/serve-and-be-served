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

    const { bio, skills, title, company, role } = await req.json();

    // Validate input
    if (!bio || typeof bio !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Bio is required for enhancement' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (bio.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Bio is too long (max 2000 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Create role-specific enhancement prompt
    const roleContext = {
      'Consumer': 'as someone seeking expertise and mentorship',
      'Producer': 'as an expert who shares knowledge and mentors others', 
      'Ad-Hoc': 'as a connector who facilitates relationships between consumers and producers'
    };

    // Sanitize inputs for the prompt
    const sanitizedTitle = (title || 'Not specified').slice(0, 100);
    const sanitizedCompany = (company || 'Not specified').slice(0, 100);
    const sanitizedSkills = Array.isArray(skills) ? skills.slice(0, 20).map(s => String(s).slice(0, 50)).join(', ') : 'Not specified';
    const sanitizedRole = role && roleContext[role as keyof typeof roleContext] ? role : 'Consumer';

    const prompt = `You are a professional profile enhancer for PeopleBook.ai, an AI-powered platform connecting mentors and learners.

Current Profile:
- Role: ${sanitizedRole} ${roleContext[sanitizedRole as keyof typeof roleContext] || ''}
- Title: ${sanitizedTitle}
- Company: ${sanitizedCompany}
- Current Bio: ${bio}
- Skills: ${sanitizedSkills}

Please enhance this bio to be:
1. Professional and engaging
2. Clearly highlighting expertise and value proposition
3. Optimized for AI matching algorithms
4. Role-appropriate (${sanitizedRole})
5. Maximum 150 words
6. Include relevant keywords naturally

Return ONLY the enhanced bio text, no additional formatting or explanations.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional profile enhancement expert. Return only the enhanced bio text, no additional formatting.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to enhance profile');
    }

    const data = await response.json();
    const enhancedBio = data.choices[0].message.content.trim();

    console.log(`Profile enhanced successfully for user: ${userId}`);
    return new Response(JSON.stringify({ enhancedBio }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-profile-enhancer:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
