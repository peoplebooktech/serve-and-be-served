import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

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
    const { userId, userSkills, userRole, userBio } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Fetch all other profiles except current user
    const { data: profiles, error } = await supabase
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

        // Calculate cosine similarity
        const dotProduct = userEmbedding.reduce((sum: number, a: number, idx: number) => sum + a * profileEmbedding[idx], 0);
        const normA = Math.sqrt(userEmbedding.reduce((sum: number, a: number) => sum + a * a, 0));
        const normB = Math.sqrt(profileEmbedding.reduce((sum: number, b: number) => sum + b * b, 0));
        const similarity = dotProduct / (normA * normB);

        return { profile, score: similarity };
      })
    );

    // Sort by score and get top 5
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
    console.error('Error in ai-recommendations:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});