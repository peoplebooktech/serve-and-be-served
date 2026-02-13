import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    // Auth check - only authenticated users can trigger welcome emails
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, name, role } = await req.json();

    // Verify the email matches the authenticated user
    if (claimsData.claims.email !== email) {
      return new Response(JSON.stringify({ error: 'Can only send welcome email to your own address' }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: "Email and name are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const roleDisplayNames: Record<string, string> = {
      consumer: "Consumer", producer: "Producer", ad_hoc: "Ad-Hoc"
    };

    const roleDescription: Record<string, string> = {
      consumer: "seeking AI-matched expertise and knowledge",
      producer: "sharing your expertise through our AI-powered platform",
      ad_hoc: "facilitating AI-enhanced connections between consumers and producers"
    };

    const emailResponse = await resend.emails.send({
      from: "PeopleBook.ai <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to PeopleBook.ai! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #6366f1; font-size: 32px; margin: 0;">PeopleBook.ai</h1>
            <p style="color: #64748b; font-size: 16px; margin: 10px 0;">AI-Powered Collaboration Platform</p>
          </div>
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
            <h2 style="color: #1e293b; margin: 0 0 20px 0;">Welcome, ${name}! 🎉</h2>
            <p style="color: #475569; line-height: 1.6;">
              Thank you for joining as a <strong>${roleDisplayNames[role] || role}</strong> — ${roleDescription[role] || "contributing to our ecosystem"}.
            </p>
          </div>
          <div style="margin-bottom: 30px;">
            <h3 style="color: #1e293b;">🚀 Getting Started:</h3>
            <ul style="color: #475569; line-height: 1.8;">
              <li>Complete your profile with skills and goals</li>
              <li>Get AI-matched with complementary collaborators</li>
              <li>Join squads and build roadmaps together</li>
              <li>Track contributions and earn badges</li>
            </ul>
          </div>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
            <p>Best regards,<br>The PeopleBook.ai Team</p>
          </div>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, messageId: emailResponse.data?.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-welcome-email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send welcome email" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
