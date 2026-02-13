
-- ============================================================
-- Peoplebook.ai — Full Backend Data Model
-- ============================================================

-- 1. Extend profiles with onboarding fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS goals text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS availability text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS niche text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS embedding_synced boolean DEFAULT false;

-- 2. Squads (groups of 2-5 users)
CREATE TABLE public.squads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  max_members int NOT NULL DEFAULT 5,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.squad_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id uuid NOT NULL REFERENCES public.squads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(squad_id, user_id)
);

ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;

-- Squad RLS: members can view their own squads
CREATE POLICY "Members can view their squads" ON public.squads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.squad_members sm WHERE sm.squad_id = id AND sm.user_id = auth.uid())
  );

CREATE POLICY "Creator can update squad" ON public.squads
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Creator can delete squad" ON public.squads
  FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create squads" ON public.squads
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Squad members RLS
CREATE POLICY "Members can view squad members" ON public.squad_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.squad_members sm2 WHERE sm2.squad_id = squad_id AND sm2.user_id = auth.uid())
  );

CREATE POLICY "Squad creator can manage members" ON public.squad_members
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.squads s WHERE s.id = squad_id AND s.created_by = auth.uid())
    OR auth.uid() = user_id
  );

CREATE POLICY "Members can leave squad" ON public.squad_members
  FOR DELETE USING (auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.squads s WHERE s.id = squad_id AND s.created_by = auth.uid())
  );

-- 3. Matches (AI-suggested user matches)
CREATE TABLE public.matches (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  matched_user_id uuid NOT NULL,
  synergy_score numeric(4,2) NOT NULL DEFAULT 0,
  match_reason text,
  complementary_strengths text[],
  status text NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, matched_user_id)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their matches" ON public.matches
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

CREATE POLICY "System can create matches" ON public.matches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their match status" ON public.matches
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. Roadmaps (per squad or per user)
CREATE TABLE public.roadmaps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id uuid REFERENCES public.squads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  ai_generated boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their roadmaps" ON public.roadmaps
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.squad_members sm WHERE sm.squad_id = roadmaps.squad_id AND sm.user_id = auth.uid())
  );

CREATE POLICY "Users can create roadmaps" ON public.roadmaps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their roadmaps" ON public.roadmaps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their roadmaps" ON public.roadmaps
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Roadmap tasks
CREATE TABLE public.roadmap_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id uuid NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo', -- todo, in_progress, done
  assigned_to uuid,
  milestone text,
  position int NOT NULL DEFAULT 0,
  due_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmap_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view roadmap tasks" ON public.roadmap_tasks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.roadmaps r WHERE r.id = roadmap_id AND (
      r.user_id = auth.uid()
      OR EXISTS (SELECT 1 FROM public.squad_members sm WHERE sm.squad_id = r.squad_id AND sm.user_id = auth.uid())
    ))
  );

CREATE POLICY "Users can manage roadmap tasks" ON public.roadmap_tasks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.roadmaps r WHERE r.id = roadmap_id AND r.user_id = auth.uid())
  );

CREATE POLICY "Users can update roadmap tasks" ON public.roadmap_tasks
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.roadmaps r WHERE r.id = roadmap_id AND (
      r.user_id = auth.uid()
      OR EXISTS (SELECT 1 FROM public.squad_members sm WHERE sm.squad_id = r.squad_id AND sm.user_id = auth.uid())
    ))
  );

CREATE POLICY "Users can delete roadmap tasks" ON public.roadmap_tasks
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.roadmaps r WHERE r.id = roadmap_id AND r.user_id = auth.uid())
  );

-- 6. Contributions (verifiable activity ledger)
CREATE TABLE public.contributions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  squad_id uuid REFERENCES public.squads(id) ON DELETE SET NULL,
  roadmap_task_id uuid REFERENCES public.roadmap_tasks(id) ON DELETE SET NULL,
  type text NOT NULL, -- task_completed, review, mentoring, marketplace_sale, etc.
  title text NOT NULL,
  description text,
  verified boolean DEFAULT false,
  verified_by uuid,
  points int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view contributions" ON public.contributions
  FOR SELECT USING (true); -- public ledger

CREATE POLICY "Users can create own contributions" ON public.contributions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Verifiers can update contributions" ON public.contributions
  FOR UPDATE USING (
    auth.uid() = verified_by
    OR EXISTS (SELECT 1 FROM public.squad_members sm WHERE sm.squad_id = contributions.squad_id AND sm.user_id = auth.uid())
  );

-- 7. Badges
CREATE TABLE public.badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  icon text, -- icon name or URL
  category text NOT NULL DEFAULT 'general', -- general, streak, collaboration, marketplace
  threshold int NOT NULL DEFAULT 1, -- points/count needed
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges" ON public.badges
  FOR SELECT USING (true);

CREATE TABLE public.user_badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view user badges" ON public.user_badges
  FOR SELECT USING (true);

CREATE POLICY "System can award badges" ON public.user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Streaks
CREATE TABLE public.user_streaks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  current_streak int NOT NULL DEFAULT 0,
  longest_streak int NOT NULL DEFAULT 0,
  last_activity_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view streaks" ON public.user_streaks
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own streak" ON public.user_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak" ON public.user_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- 9. Marketplace
CREATE TABLE public.marketplace_listings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'knowledge', -- knowledge, service, mentoring
  price_cents int NOT NULL DEFAULT 0, -- 0 = free
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'active', -- active, paused, sold
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active listings" ON public.marketplace_listings
  FOR SELECT USING (status = 'active' OR auth.uid() = seller_id);

CREATE POLICY "Users can create listings" ON public.marketplace_listings
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update listings" ON public.marketplace_listings
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete listings" ON public.marketplace_listings
  FOR DELETE USING (auth.uid() = seller_id);

CREATE TABLE public.marketplace_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, completed, cancelled
  price_cents int NOT NULL,
  stripe_payment_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers and sellers can view their orders" ON public.marketplace_orders
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can create orders" ON public.marketplace_orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Participants can update orders" ON public.marketplace_orders
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- 10. Updated_at triggers for all new tables
CREATE TRIGGER update_squads_updated_at BEFORE UPDATE ON public.squads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roadmaps_updated_at BEFORE UPDATE ON public.roadmaps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roadmap_tasks_updated_at BEFORE UPDATE ON public.roadmap_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_listings_updated_at BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_orders_updated_at BEFORE UPDATE ON public.marketplace_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_streaks_updated_at BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Seed badges
INSERT INTO public.badges (name, description, icon, category, threshold) VALUES
  ('First Steps', 'Completed onboarding', 'rocket', 'general', 1),
  ('Team Player', 'Joined first squad', 'users', 'collaboration', 1),
  ('Road Builder', 'Created first roadmap', 'map', 'general', 1),
  ('Contributor', 'Made 10 contributions', 'star', 'general', 10),
  ('Streak Master', '7-day streak', 'flame', 'streak', 7),
  ('Mentor', 'Completed 5 mentoring sessions', 'graduation-cap', 'collaboration', 5),
  ('Marketplace Pro', 'Sold 3 services', 'shopping-bag', 'marketplace', 3),
  ('Synergy Seeker', 'Accepted 5 matches', 'handshake', 'collaboration', 5);
