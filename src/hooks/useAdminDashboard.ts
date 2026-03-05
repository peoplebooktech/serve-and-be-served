import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminStats {
  total_profiles: number;
  total_opportunities: number;
  total_applications: number;
  pending_reports: number;
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingOpportunities, setPendingOpportunities] = useState<any[]>([]);
  const [pendingReports, setPendingReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-dashboard', {
        body: { action: 'get_stats' },
      });
      if (error) throw error;
      setStats(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch admin stats',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchPendingOpportunities = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-dashboard', {
        body: { action: 'get_pending_opportunities' },
      });
      if (error) throw error;
      setPendingOpportunities(data?.opportunities || []);
    } catch (error) {
      console.error('Error fetching pending opportunities:', error);
    }
  }, []);

  const reviewOpportunity = useCallback(async (opportunityId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase.functions.invoke('admin-dashboard', {
        body: { action: 'review_opportunity', opportunity_id: opportunityId, status },
      });
      if (error) throw error;
      toast({
        title: 'Success',
        description: `Opportunity ${status}`,
      });
      await fetchPendingOpportunities();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to review opportunity',
        variant: 'destructive',
      });
    }
  }, [toast, fetchPendingOpportunities]);

  const fetchPendingReports = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-dashboard', {
        body: { action: 'get_pending_reports' },
      });
      if (error) throw error;
      setPendingReports(data?.reports || []);
    } catch (error) {
      console.error('Error fetching pending reports:', error);
    }
  }, []);

  const resolveReport = useCallback(async (reportId: string, resolution: 'resolved' | 'dismissed') => {
    try {
      const { error } = await supabase.functions.invoke('admin-dashboard', {
        body: { action: 'resolve_report', report_id: reportId, resolution },
      });
      if (error) throw error;
      toast({
        title: 'Success',
        description: `Report ${resolution}`,
      });
      await fetchPendingReports();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resolve report',
        variant: 'destructive',
      });
    }
  }, [toast, fetchPendingReports]);

  return {
    stats,
    pendingOpportunities,
    pendingReports,
    loading,
    fetchStats,
    fetchPendingOpportunities,
    reviewOpportunity,
    fetchPendingReports,
    resolveReport,
  };
}
