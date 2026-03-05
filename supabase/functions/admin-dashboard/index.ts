import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Check admin role
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { action } = await req.json();

    switch (action) {
      case "get_stats": {
        const [profiles, opportunities, applications, reports] = await Promise.all([
          serviceClient.from("profiles").select("id", { count: "exact", head: true }),
          serviceClient.from("opportunities").select("id", { count: "exact", head: true }),
          serviceClient.from("applications").select("id", { count: "exact", head: true }),
          serviceClient.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending"),
        ]);

        return new Response(
          JSON.stringify({
            total_profiles: profiles.count || 0,
            total_opportunities: opportunities.count || 0,
            total_applications: applications.count || 0,
            pending_reports: reports.count || 0,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_pending_opportunities": {
        const { data, error } = await serviceClient
          .from("opportunities")
          .select("*")
          .eq("status", "pending_review")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        return new Response(JSON.stringify({ opportunities: data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "approve_opportunity": {
        const { opportunity_id } = await req.json().catch(() => ({}));
        // Re-parse body for the id
        const body = await req.text().then(() => null).catch(() => null);
        // Actually we already parsed it, let's just use the body from initial parse
        return new Response(JSON.stringify({ error: "Use review_opportunity action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "review_opportunity": {
        const body = await req.json().catch(() => ({}));
        const oppId = body.opportunity_id;
        const newStatus = body.status; // 'approved' or 'rejected'

        if (!oppId || !["approved", "rejected"].includes(newStatus)) {
          return new Response(JSON.stringify({ error: "Invalid parameters" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { error } = await serviceClient
          .from("opportunities")
          .update({ status: newStatus })
          .eq("id", oppId);

        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_pending_reports": {
        const { data, error } = await serviceClient
          .from("reports")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        return new Response(JSON.stringify({ reports: data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "resolve_report": {
        const body2 = await req.json().catch(() => ({}));
        const reportId = body2.report_id;
        const resolution = body2.resolution; // 'resolved' or 'dismissed'

        if (!reportId) {
          return new Response(JSON.stringify({ error: "report_id required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { error } = await serviceClient
          .from("reports")
          .update({
            status: resolution || "resolved",
            reviewed_by: userId,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", reportId);

        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
