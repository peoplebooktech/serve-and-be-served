import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResetPasswordRequest {
  token: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405, 
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }

  try {
    const { token, password }: ResetPasswordRequest = await req.json();

    // Validate inputs
    if (!token || typeof token !== 'string' || token.length < 10) {
      return new Response(
        JSON.stringify({ error: "Invalid reset token" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (password.length > 72) {
      return new Response(
        JSON.stringify({ error: "Password is too long" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create admin client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Validate the token server-side
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('password_reset_tokens')
      .select('email, expires_at, used')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      console.error('Token validation error:', tokenError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired reset link" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (tokenData.used) {
      return new Response(
        JSON.stringify({ error: "This reset link has already been used" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (new Date() > new Date(tokenData.expires_at)) {
      return new Response(
        JSON.stringify({ error: "This reset link has expired" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get the user by email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error listing users:', userError);
      return new Response(
        JSON.stringify({ error: "Failed to find user" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const user = userData.users.find(u => u.email === tokenData.email);
    
    if (!user) {
      console.error('User not found for email:', tokenData.email);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update the user's password using admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update password" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Mark token as used
    const { error: markUsedError } = await supabaseAdmin
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('token', token);

    if (markUsedError) {
      console.error('Error marking token as used:', markUsedError);
      // Don't fail the request - password was already updated
    }

    console.log(`Password reset successful for user: ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Password updated successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in reset-password-with-token function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
