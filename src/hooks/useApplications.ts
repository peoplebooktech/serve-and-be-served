import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Application {
  id: string;
  opportunity_id: string;
  applicant_id: string;
  cover_note: string | null;
  voice_note_url: string | null;
  status: string;
  match_score: number | null;
  match_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const applyToOpportunity = useCallback(async (opportunityId: string, coverNote?: string) => {
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('applications' as any)
      .insert({
        opportunity_id: opportunityId,
        applicant_id: user.id,
        cover_note: coverNote || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Already Applied',
          description: 'You have already applied to this opportunity',
          variant: 'destructive',
        });
        return null;
      }
      throw error;
    }

    toast({
      title: 'Application Submitted',
      description: 'Your application has been submitted successfully',
    });

    return data;
  }, [user, toast]);

  const getMyApplications = useCallback(async () => {
    if (!user) return [];
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications' as any)
        .select('*')
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const apps = (data as any[]) || [];
      setApplications(apps);
      return apps;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getApplicantsForOpportunity = useCallback(async (opportunityId: string) => {
    const { data, error } = await supabase
      .from('applications' as any)
      .select('*')
      .eq('opportunity_id', opportunityId)
      .order('match_score', { ascending: false });

    if (error) throw error;
    return (data as any[]) || [];
  }, []);

  const updateApplicationStatus = useCallback(async (applicationId: string, status: string) => {
    const { error } = await supabase
      .from('applications' as any)
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq('id', applicationId);

    if (error) throw error;

    toast({
      title: 'Updated',
      description: `Application ${status}`,
    });
  }, [toast]);

  return {
    applications,
    loading,
    applyToOpportunity,
    getMyApplications,
    getApplicantsForOpportunity,
    updateApplicationStatus,
  };
}
