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
    const { type, prompt, name, title, company, content, category } = await req.json();

    if (!type || !prompt) {
      throw new Error('Type and prompt are required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    let imagePrompt = '';

    if (type === 'profile_picture') {
      imagePrompt = `Professional headshot portrait of a person. ${prompt}. Clean background, professional lighting, corporate style, high quality, professional photography style. The person should look approachable and confident.`;
    } else if (type === 'post_image') {
      imagePrompt = `Create a visually appealing image for a social media post about: ${prompt}. Modern, clean design, professional look, engaging visual that complements the content. No text overlays needed.`;
    } else {
      imagePrompt = prompt;
    }

    console.log('Generating image with prompt:', imagePrompt);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: imagePrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'b64_json',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to generate image');
    }

    const data = await response.json();
    const imageData = data.data[0].b64_json;

    console.log('Image generated successfully');
    return new Response(JSON.stringify({ 
      imageUrl: `data:image/png;base64,${imageData}`,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-image-generator:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});