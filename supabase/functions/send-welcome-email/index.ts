import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
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
    const { email, name, role }: WelcomeEmailRequest = await req.json();

    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: "Email and name are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending welcome email to ${email} (${name})`);

    const roleDisplayNames: Record<string, string> = {
      consumer: "Consumer",
      producer: "Producer", 
      ad_hoc: "Ad-Hoc"
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
            <p style="color: #64748b; font-size: 16px; margin: 10px 0;">AI-Powered People Directory</p>
          </div>

          <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
            <h2 style="color: #1e293b; margin: 0 0 20px 0;">Welcome to PeopleBook.ai, ${name}! 🎉</h2>
            <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
              Thank you for joining our AI-powered community as a <strong>${roleDisplayNames[role] || role}</strong> - ${roleDescription[role] || "contributing to our ecosystem"}.
            </p>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #1e293b; margin-bottom: 15px;">🚀 Getting Started:</h3>
            <ul style="color: #475569; line-height: 1.8; padding-left: 20px;">
              <li><strong>Complete your profile:</strong> Add your bio, skills, and professional information</li>
              <li><strong>Set your availability:</strong> Let others know when you're available to connect</li>
              <li><strong>Explore connections:</strong> Discover AI-matched people in our community</li>
              <li><strong>Start collaborating:</strong> Begin meaningful conversations and partnerships</li>
            </ul>
          </div>

          <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #92400e; margin: 0 0 10px 0;">💡 Pro Tip:</h3>
            <p style="color: #92400e; margin: 0; line-height: 1.6;">
              Our AI recommendation system works better with complete profiles. Take a few minutes to fill out your bio and skills for better matches!
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="https://peoplebook.ai/edit-profile" 
               style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block;">
              Complete Your Profile
            </a>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">Need help? Reply to this email or visit our help center.</p>
            <p style="margin: 10px 0 0 0;">
              Best regards,<br>
              The PeopleBook.ai Team
            </p>
          </div>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Welcome email sent successfully",
        messageId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send welcome email" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);