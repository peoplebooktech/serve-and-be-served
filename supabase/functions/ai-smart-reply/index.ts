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

    const { message, context, userRole, conversationHistory } = await req.json();

    // Validate inputs
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required for smart reply generation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (message.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Message is too long (max 2000 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const roleGuidance = {
      'Consumer': 'as someone seeking expertise and asking thoughtful questions',
      'Producer': 'as an expert providing helpful guidance and insights',
      'Ad-Hoc': 'as a facilitator connecting people and building relationships'
    };

    // Sanitize inputs
    const sanitizedUserRole = userRole && roleGuidance[userRole as keyof typeof roleGuidance] ? userRole : 'Consumer';
    const sanitizedContext = (context || 'General professional conversation').slice(0, 500);
    const sanitizedHistory = Array.isArray(conversationHistory) 
      ? conversationHistory.slice(-2).map(h => String(h).slice(0, 500)).join('\n') 
      : 'No prior context';

    const prompt = `Generate 3 smart reply suggestions for this message in a professional networking context:

Incoming Message: "${message}"
Your Role: ${sanitizedUserRole} - respond ${roleGuidance[sanitizedUserRole as keyof typeof roleGuidance]}
Context: ${sanitizedContext}
Recent Conversation: ${sanitizedHistory}

Requirements:
1. Professional and contextually appropriate
2. Role-specific tone and approach
3. Varying lengths: brief, medium, detailed
4. Natural and conversational
5. Actionable when appropriate

Format as JSON array with 3 objects:
[
  {"type": "brief", "text": "Short response"},
  {"type": "medium", "text": "Medium length response"},
  {"type": "detailed", "text": "Comprehensive response"}
]

Return only the JSON array, no additional text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional communication assistant. Always return valid JSON format.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to generate smart replies');
    }

    const data = await response.json();
    let suggestions = [];
    
    try {
      suggestions = JSON.parse(data.choices[0].message.content.trim());
    } catch (parseError) {
      // Fallback if JSON parsing fails
      const rawText = data.choices[0].message.content.trim();
      suggestions = [
        { type: "brief", text: "Thank you for your message. I'll get back to you soon." },
        { type: "medium", text: "Thanks for reaching out! I appreciate your message and will respond with more details shortly." },
        { type: "detailed", text: rawText }
      ];
    }

    console.log(`Smart replies generated successfully for user: ${userId}`);
    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-smart-reply:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
