
-- 1. Enhance profiles with rural-specific fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS village text,
  ADD COLUMN IF NOT EXISTS district text,
  ADD COLUMN IF NOT EXISTS education_level text,
  ADD COLUMN IF NOT EXISTS preferred_job_types text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS max_commute_km integer,
  ADD COLUMN IF NOT EXISTS relocation_willing boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS languages text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS preferred_hours text,
  ADD COLUMN IF NOT EXISTS age integer,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS persona_type text DEFAULT 'youth';

-- 2. Opportunities table (jobs, gigs, internships, training)
CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  location_text text,
  district text,
  latitude numeric,
  longitude numeric,
  opportunity_type text NOT NULL DEFAULT 'full_time',
  category text DEFAULT 'general',
  skills_required text[] DEFAULT '{}',
  education_required text,
  wage_min integer,
  wage_max integer,
  currency text DEFAULT 'INR',
  duration text,
  working_hours text,
  facilities text[] DEFAULT '{}',
  start_date date,
  slots integer DEFAULT 1,
  status text NOT NULL DEFAULT 'pending_review',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved opportunities
CREATE POLICY "Anyone can view approved opportunities"
  ON public.opportunities FOR SELECT
  USING (status = 'approved' OR auth.uid() = employer_id);

-- Employers can create opportunities
CREATE POLICY "Employers can create opportunities"
  ON public.opportunities FOR INSERT
  WITH CHECK (auth.uid() = employer_id);

-- Employers can update their own
CREATE POLICY "Employers can update own opportunities"
  ON public.opportunities FOR UPDATE
  USING (auth.uid() = employer_id);

-- Employers can delete their own
CREATE POLICY "Employers can delete own opportunities"
  ON public.opportunities FOR DELETE
  USING (auth.uid() = employer_id);

-- 3. Applications table
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  applicant_id uuid NOT NULL,
  cover_note text,
  voice_note_url text,
  status text NOT NULL DEFAULT 'submitted',
  match_score numeric,
  match_reason text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Applicants can view their own applications
CREATE POLICY "Applicants can view own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = applicant_id OR EXISTS (
    SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND o.employer_id = auth.uid()
  ));

-- Applicants can create applications
CREATE POLICY "Applicants can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

-- Employers can update application status
CREATE POLICY "Employers can update applications"
  ON public.applications FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND o.employer_id = auth.uid()
  ) OR auth.uid() = applicant_id);

-- 4. Conversations table
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_one uuid NOT NULL,
  participant_two uuid NOT NULL,
  opportunity_id uuid REFERENCES public.opportunities(id),
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = participant_one OR auth.uid() = participant_two);

CREATE POLICY "Users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = participant_one OR auth.uid() = participant_two);

-- 5. Direct messages table
CREATE TABLE public.direct_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  message_type text DEFAULT 'text',
  voice_note_url text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversation participants can view messages"
  ON public.direct_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
    AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
  ));

CREATE POLICY "Users can send messages in their conversations"
  ON public.direct_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
    AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
  ));

-- 6. Reports table (user flags)
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  reported_entity_type text NOT NULL,
  reported_entity_id uuid NOT NULL,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = reporter_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reports"
  ON public.reports FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- 7. Opportunity recommendations (AI matching results cache)
CREATE TABLE public.opportunity_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  score numeric NOT NULL DEFAULT 0,
  match_reasons text[] DEFAULT '{}',
  seen boolean DEFAULT false,
  applied boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, opportunity_id)
);

ALTER TABLE public.opportunity_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own matches"
  ON public.opportunity_matches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert matches"
  ON public.opportunity_matches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own matches"
  ON public.opportunity_matches FOR UPDATE
  USING (auth.uid() = user_id);

-- 8. Platform analytics (admin stats)
CREATE TABLE public.platform_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date date NOT NULL DEFAULT CURRENT_DATE,
  total_youth integer DEFAULT 0,
  total_employers integer DEFAULT 0,
  total_opportunities integer DEFAULT 0,
  total_applications integer DEFAULT 0,
  total_matches integer DEFAULT 0,
  total_placements integer DEFAULT 0,
  region text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (stat_date, region)
);

ALTER TABLE public.platform_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view stats"
  ON public.platform_stats FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage stats"
  ON public.platform_stats FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update triggers for updated_at
CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
