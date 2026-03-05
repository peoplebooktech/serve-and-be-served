import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface OpportunityMatch {
  opportunity_id: string;
  title: string;
  score: number;
  reasons: string[];
}

export function useOpportunityMatching() {
  const [matches, setMatches] = useState<OpportunityMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMatches = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('opportunity-matching', {});

      if (error) throw error;
      setMatches(data?.matches || []);
    } catch (error: any) {
      console.error('Matching error:', error);
      toast({
        title: 'Note',
        description: 'AI matching is loading in the background.',
        variant: 'default',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const getCachedMatches = useCallback(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('opportunity_matches' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('score', { ascending: false });

    if (error) throw error;
    return (data as any[]) || [];
  }, [user]);

  return {
    matches,
    loading,
    fetchMatches,
    getCachedMatches,
  };
}
