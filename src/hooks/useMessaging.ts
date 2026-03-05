import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Conversation {
  id: string;
  participant_one: string;
  participant_two: string;
  opportunity_id: string | null;
  last_message_at: string;
  created_at: string;
}

export interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  voice_note_url: string | null;
  read_at: string | null;
  created_at: string;
}

export function useMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations' as any)
        .select('*')
        .or(`participant_one.eq.${user.id},participant_two.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations((data as any[]) || []);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    const { data, error } = await supabase
      .from('direct_messages' as any)
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    setMessages((data as any[]) || []);
    setActiveConversation(conversationId);
  }, []);

  const sendMessage = useCallback(async (conversationId: string, content: string, messageType = 'text') => {
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('direct_messages' as any)
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        message_type: messageType,
      })
      .select()
      .single();

    if (error) throw error;

    // Update conversation's last_message_at
    await supabase
      .from('conversations' as any)
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    // Add to local state
    setMessages(prev => [...prev, data as any]);
    return data;
  }, [user]);

  const startConversation = useCallback(async (otherUserId: string, opportunityId?: string) => {
    if (!user) throw new Error('Not authenticated');

    // Check if conversation exists
    const { data: existing } = await supabase
      .from('conversations' as any)
      .select('*')
      .or(`and(participant_one.eq.${user.id},participant_two.eq.${otherUserId}),and(participant_one.eq.${otherUserId},participant_two.eq.${user.id})`)
      .maybeSingle();

    if (existing) return existing as any;

    const { data, error } = await supabase
      .from('conversations' as any)
      .insert({
        participant_one: user.id,
        participant_two: otherUserId,
        opportunity_id: opportunityId || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data as any;
  }, [user]);

  // Subscribe to real-time messages for active conversation
  useEffect(() => {
    if (!activeConversation) return;

    const channel = supabase
      .channel(`messages:${activeConversation}`)
      .on(
        'postgres_changes' as any,
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `conversation_id=eq.${activeConversation}`,
        },
        (payload: any) => {
          setMessages(prev => {
            if (prev.some(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    messages,
    activeConversation,
    loading,
    fetchConversations,
    fetchMessages,
    sendMessage,
    startConversation,
  };
}
