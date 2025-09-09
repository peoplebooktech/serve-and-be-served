import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { bio, skills, title, company, role } = await req.json();

    if (!bio) {
      throw new Error('Bio is required for enhancement');
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

    const prompt = `You are a professional profile enhancer for PeopleBook.ai, an AI-powered platform connecting mentors and learners.

Current Profile:
- Role: ${role} ${roleContext[role as keyof typeof roleContext] || ''}
- Title: ${title || 'Not specified'}
- Company: ${company || 'Not specified'}
- Current Bio: ${bio}
- Skills: ${skills?.join(', ') || 'Not specified'}

Please enhance this bio to be:
1. Professional and engaging
2. Clearly highlighting expertise and value proposition
3. Optimized for AI matching algorithms
4. Role-appropriate (${role})
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
      throw new Error(error.error?.message || 'Failed to enhance profile');
    }

    const data = await response.json();
    const enhancedBio = data.choices[0].message.content.trim();

    console.log('Profile enhanced successfully');
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