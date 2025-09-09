import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  to: string;
  subject: string;
  type: "connection_request" | "new_message" | "profile_view" | "custom";
  data: {
    recipientName?: string;
    senderName?: string;
    message?: string;
    actionUrl?: string;
    customHtml?: string;
  };
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
    const { to, subject, type, data }: NotificationEmailRequest = await req.json();

    if (!to || !subject || !type) {
      return new Response(
        JSON.stringify({ error: "Email, subject, and type are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending ${type} notification email to ${to}`);

    let emailHtml = "";

    switch (type) {
      case "connection_request":
        emailHtml = generateConnectionRequestEmail(data);
        break;
      case "new_message":
        emailHtml = generateNewMessageEmail(data);
        break;
      case "profile_view":
        emailHtml = generateProfileViewEmail(data);
        break;
      case "custom":
        emailHtml = data.customHtml || generateGenericEmail(data);
        break;
      default:
        emailHtml = generateGenericEmail(data);
    }

    const emailResponse = await resend.emails.send({
      from: "PeopleBook.ai <notifications@peoplebook.ai>",
      to: [to],
      subject: subject,
      html: emailHtml,
    });

    console.log("Notification email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification email sent successfully",
        messageId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in notification-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send notification email" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateConnectionRequestEmail(data: any): string {
  const { recipientName = "there", senderName, actionUrl } = data;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #6366f1; font-size: 32px; margin: 0;">PeopleBook.ai</h1>
        <p style="color: #64748b; font-size: 16px; margin: 10px 0;">New Connection Request</p>
      </div>

      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <h2 style="color: #0369a1; margin: 0 0 20px 0;">👋 You have a new connection request!</h2>
        <p style="color: #075985; line-height: 1.6; margin: 15px 0;">
          Hi ${recipientName},<br><br>
          <strong>${senderName}</strong> would like to connect with you on PeopleBook.ai.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${actionUrl || 'https://peoplebook.ai/dashboard'}" 
           style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block;">
          View Request
        </a>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
        <p style="margin: 0;">Best regards,<br>The PeopleBook.ai Team</p>
      </div>
    </div>
  `;
}

function generateNewMessageEmail(data: any): string {
  const { recipientName = "there", senderName, message, actionUrl } = data;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #6366f1; font-size: 32px; margin: 0;">PeopleBook.ai</h1>
        <p style="color: #64748b; font-size: 16px; margin: 10px 0;">New Message</p>
      </div>

      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <h2 style="color: #166534; margin: 0 0 20px 0;">💬 You have a new message!</h2>
        <p style="color: #15803d; line-height: 1.6; margin: 15px 0;">
          Hi ${recipientName},<br><br>
          <strong>${senderName}</strong> sent you a message on PeopleBook.ai.
        </p>
        ${message ? `<div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #22c55e;"><p style="color: #374151; margin: 0; font-style: italic;">"${message}"</p></div>` : ''}
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${actionUrl || 'https://peoplebook.ai/messages'}" 
           style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block;">
          View Message
        </a>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
        <p style="margin: 0;">Best regards,<br>The PeopleBook.ai Team</p>
      </div>
    </div>
  `;
}

function generateProfileViewEmail(data: any): string {
  const { recipientName = "there", senderName, actionUrl } = data;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #6366f1; font-size: 32px; margin: 0;">PeopleBook.ai</h1>
        <p style="color: #64748b; font-size: 16px; margin: 10px 0;">Profile Activity</p>
      </div>

      <div style="background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <h2 style="color: #a16207; margin: 0 0 20px 0;">👀 Someone viewed your profile!</h2>
        <p style="color: #a16207; line-height: 1.6; margin: 15px 0;">
          Hi ${recipientName},<br><br>
          <strong>${senderName}</strong> recently viewed your profile on PeopleBook.ai.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${actionUrl || 'https://peoplebook.ai/dashboard'}" 
           style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block;">
          View Your Profile
        </a>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
        <p style="margin: 0;">Best regards,<br>The PeopleBook.ai Team</p>
      </div>
    </div>
  `;
}

function generateGenericEmail(data: any): string {
  const { recipientName = "there", message = "", actionUrl } = data;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #6366f1; font-size: 32px; margin: 0;">PeopleBook.ai</h1>
        <p style="color: #64748b; font-size: 16px; margin: 10px 0;">Notification</p>
      </div>

      <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
          Hi ${recipientName},<br><br>
          ${message}
        </p>
      </div>

      ${actionUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${actionUrl}" 
           style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block;">
          Take Action
        </a>
      </div>
      ` : ''}

      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
        <p style="margin: 0;">Best regards,<br>The PeopleBook.ai Team</p>
      </div>
    </div>
  `;
}

serve(handler);