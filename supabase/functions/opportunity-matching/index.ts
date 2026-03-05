import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Profile {
  skills: string[];
  district: string | null;
  village: string | null;
  preferred_job_types: string[];
  max_commute_km: number | null;
  relocation_willing: boolean;
  languages: string[];
  preferred_hours: string | null;
  education_level: string | null;
}

interface Opportunity {
  id: string;
  title: string;
  skills_required: string[];
  district: string | null;
  opportunity_type: string;
  education_required: string | null;
  working_hours: string | null;
  wage_min: number | null;
  wage_max: number | null;
}

function calculateMatchScore(profile: Profile, opp: Opportunity): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Skill match (0-40 points)
  const profileSkills = (profile.skills || []).map(s => s.toLowerCase());
  const requiredSkills = (opp.skills_required || []).map(s => s.toLowerCase());
  if (requiredSkills.length > 0) {
    const matchedSkills = requiredSkills.filter(s => profileSkills.includes(s));
    const skillScore = (matchedSkills.length / requiredSkills.length) * 40;
    score += skillScore;
    if (matchedSkills.length > 0) {
      reasons.push(`Skills match: ${matchedSkills.join(", ")}`);
    }
  } else {
    score += 20; // No specific skills required
  }

  // Location match (0-25 points)
  if (profile.district && opp.district) {
    if (profile.district.toLowerCase() === opp.district.toLowerCase()) {
      score += 25;
      reasons.push(`Same district: ${opp.district}`);
    } else if (profile.relocation_willing) {
      score += 10;
      reasons.push("Open to relocation");
    }
  } else if (!opp.district) {
    score += 15; // Remote or flexible location
    reasons.push("Flexible location");
  }

  // Job type match (0-20 points)
  const preferredTypes = (profile.preferred_job_types || []).map(t => t.toLowerCase());
  if (preferredTypes.length > 0 && preferredTypes.includes(opp.opportunity_type.toLowerCase())) {
    score += 20;
    reasons.push(`Preferred job type: ${opp.opportunity_type}`);
  } else if (preferredTypes.length === 0) {
    score += 10;
  }

  // Education match (0-15 points)
  if (!opp.education_required || !profile.education_level) {
    score += 10;
  } else {
    const eduLevels = ["none", "primary", "secondary", "higher_secondary", "diploma", "graduate", "postgraduate"];
    const profileEdu = eduLevels.indexOf(profile.education_level.toLowerCase());
    const requiredEdu = eduLevels.indexOf(opp.education_required.toLowerCase());
    if (profileEdu >= requiredEdu) {
      score += 15;
      reasons.push("Education requirement met");
    }
  }

  return { score: Math.min(100, Math.round(score)), reasons };
}

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

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("skills, district, village, preferred_job_types, max_commute_km, relocation_willing, languages, preferred_hours, education_level")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found. Please create a profile first." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch approved opportunities
    const { data: opportunities, error: oppError } = await supabase
      .from("opportunities")
      .select("id, title, skills_required, district, opportunity_type, education_required, working_hours, wage_min, wage_max")
      .eq("status", "approved");

    if (oppError) {
      throw oppError;
    }

    // Calculate matches
    const matches = (opportunities || [])
      .map((opp) => {
        const { score, reasons } = calculateMatchScore(profile as Profile, opp as Opportunity);
        return { opportunity_id: opp.id, score, reasons, title: opp.title };
      })
      .filter((m) => m.score >= 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    // Upsert matches into opportunity_matches
    if (matches.length > 0) {
      const upsertData = matches.map((m) => ({
        user_id: userId,
        opportunity_id: m.opportunity_id,
        score: m.score,
        match_reasons: m.reasons,
      }));

      await supabase.from("opportunity_matches").upsert(upsertData, {
        onConflict: "user_id,opportunity_id",
      });
    }

    return new Response(
      JSON.stringify({
        matches: matches.map((m) => ({
          opportunity_id: m.opportunity_id,
          title: m.title,
          score: m.score,
          reasons: m.reasons,
        })),
        total: matches.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Matching error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
