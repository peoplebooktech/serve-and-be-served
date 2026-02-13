-- Fix user_streaks: restrict SELECT to own streaks only
DROP POLICY IF EXISTS "Users can view streaks" ON public.user_streaks;
CREATE POLICY "Users can view own streaks"
  ON public.user_streaks
  FOR SELECT
  USING (auth.uid() = user_id);