import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ResetEmailRequest {
  email: string;
  origin?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { email, origin }: ResetEmailRequest = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Processing password reset for ${email}`);

    // Generate a secure reset token
    const resetToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Look up user by email using the admin API
    const { data: usersData, error: userError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });

    // Find user by email from auth
    let userName = email.split("@")[0];
    
    // Use getUserById after finding via listUsers, or just look up profile directly
    const { data: profiles } = await supabase
      .from("profiles")
      .select("name")
      .limit(1);

    // Try to find the user's name from profiles via a join approach
    // Since we can't directly query by email in profiles, look up user first
    const { data: authUser } = await supabase.auth.admin.listUsers();
    const matchedUser = authUser?.users?.find(u => u.email === email);
    
    if (matchedUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", matchedUser.id)
        .single();
      
      if (profile?.name) {
        userName = profile.name;
      }
    }

    // Store reset token in database
    const { error: insertError } = await supabase
      .from("password_reset_tokens")
      .insert({
        email,
        token: resetToken,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

    if (insertError) {
      console.error("Failed to store reset token:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to process reset request" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Use the origin from the request, or fall back to a default
    const baseUrl = origin || "https://serve-and-be-served.lovable.app";
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    const emailResponse = await resend.emails.send({
      from: "PeopleBook.ai Security <security@peoplebook.ai>",
      to: [email],
      subject: "Reset your PeopleBook.ai password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #6366f1; font-size: 32px; margin: 0;">PeopleBook.ai</h1>
            <p style="color: #64748b; font-size: 16px; margin: 10px 0;">Password Reset Request</p>
          </div>

          <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h2 style="color: #dc2626; margin: 0 0 15px 0;">🔒 Password Reset Request</h2>
            <p style="color: #7f1d1d; margin: 0; line-height: 1.6;">
              We received a request to reset the password for your PeopleBook.ai account.
            </p>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              Hello ${userName},
            </p>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              To reset your password, click the button below. This link will expire in <strong>1 hour</strong> for security reasons.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block;">
              Reset My Password
            </a>
          </div>

          <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <p style="color: #374151; margin: 0 0 10px 0; font-weight: 500;">🔗 Alternative Link:</p>
            <p style="color: #6b7280; font-size: 14px; margin: 0; word-break: break-all;">
              ${resetUrl}
            </p>
          </div>

          <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #92400e; margin: 0 0 10px 0;">⚠️ Security Notice:</h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>This link expires in 1 hour</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; color: #6b7280; font-size: 14px;">
            <p style="margin: 0;">
              If you're having trouble clicking the button, copy and paste the link above into your web browser.
            </p>
            <p style="margin: 15px 0 0 0;">
              Best regards,<br>
              The PeopleBook.ai Security Team
            </p>
          </div>
        </div>
      `,
    });

    console.log("Password reset email sent successfully:", emailResponse);

    // Always return success to prevent email enumeration
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "If an account exists with that email, a password reset link has been sent.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-reset-email function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send password reset email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
