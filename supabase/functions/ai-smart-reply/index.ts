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
    const { message, context, userRole, conversationHistory } = await req.json();

    if (!message) {
      throw new Error('Message is required for smart reply generation');
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

    const prompt = `Generate 3 smart reply suggestions for this message in a professional networking context:

Incoming Message: "${message}"
Your Role: ${userRole} - respond ${roleGuidance[userRole as keyof typeof roleGuidance]}
Context: ${context || 'General professional conversation'}
Recent Conversation: ${conversationHistory?.slice(-2).join('\n') || 'No prior context'}

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

    console.log('Smart replies generated successfully');
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