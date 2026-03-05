import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Opportunity {
  id: string;
  employer_id: string;
  title: string;
  description: string | null;
  location_text: string | null;
  district: string | null;
  opportunity_type: string;
  category: string;
  skills_required: string[];
  education_required: string | null;
  wage_min: number | null;
  wage_max: number | null;
  currency: string;
  duration: string | null;
  working_hours: string | null;
  facilities: string[];
  start_date: string | null;
  slots: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOpportunityInput {
  title: string;
  description?: string;
  location_text?: string;
  district?: string;
  opportunity_type?: string;
  category?: string;
  skills_required?: string[];
  education_required?: string;
  wage_min?: number;
  wage_max?: number;
  duration?: string;
  working_hours?: string;
  facilities?: string[];
  start_date?: string;
  slots?: number;
}

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOpportunities = useCallback(async (filters?: {
    district?: string;
    category?: string;
    opportunity_type?: string;
    search?: string;
  }) => {
    setLoading(true);
    try {
      let query = supabase
        .from('opportunities' as any)
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (filters?.district) {
        query = query.eq('district', filters.district);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.opportunity_type) {
        query = query.eq('opportunity_type', filters.opportunity_type);
      }
      if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setOpportunities((data as any[]) || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load opportunities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createOpportunity = useCallback(async (input: CreateOpportunityInput) => {
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('opportunities' as any)
      .insert({
        ...input,
        employer_id: user.id,
        status: 'pending_review',
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: 'Success',
      description: 'Opportunity created and submitted for review',
    });

    return data;
  }, [user, toast]);

  const getMyOpportunities = useCallback(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('opportunities' as any)
      .select('*')
      .eq('employer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as any[]) || [];
  }, [user]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  return {
    opportunities,
    loading,
    fetchOpportunities,
    createOpportunity,
    getMyOpportunities,
  };
}
