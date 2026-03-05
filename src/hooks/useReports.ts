import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useReports() {
  const { user } = useAuth();
  const { toast } = useToast();

  const submitReport = useCallback(async (
    entityType: string,
    entityId: string,
    reason: string,
    details?: string
  ) => {
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('reports' as any)
      .insert({
        reporter_id: user.id,
        reported_entity_type: entityType,
        reported_entity_id: entityId,
        reason,
        details: details || null,
      });

    if (error) throw error;

    toast({
      title: 'Report Submitted',
      description: 'Thank you for reporting. Our team will review it.',
    });
  }, [user, toast]);

  return { submitReport };
}
