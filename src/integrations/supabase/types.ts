export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          threshold: number
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          threshold?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          threshold?: number
        }
        Relationships: []
      }
      contributions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          points: number
          roadmap_task_id: string | null
          squad_id: string | null
          title: string
          type: string
          user_id: string
          verified: boolean | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          points?: number
          roadmap_task_id?: string | null
          squad_id?: string | null
          title: string
          type: string
          user_id: string
          verified?: boolean | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          points?: number
          roadmap_task_id?: string | null
          squad_id?: string | null
          title?: string
          type?: string
          user_id?: string
          verified?: boolean | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contributions_roadmap_task_id_fkey"
            columns: ["roadmap_task_id"]
            isOneToOne: false
            referencedRelation: "roadmap_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listings: {
        Row: {
          category: string
          created_at: string
          currency: string
          description: string | null
          id: string
          price_cents: number
          seller_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          price_cents?: number
          seller_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          price_cents?: number
          seller_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_orders: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          listing_id: string
          price_cents: number
          seller_id: string
          status: string
          stripe_payment_id: string | null
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          listing_id: string
          price_cents: number
          seller_id: string
          status?: string
          stripe_payment_id?: string | null
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          listing_id?: string
          price_cents?: number
          seller_id?: string
          status?: string
          stripe_payment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          complementary_strengths: string[] | null
          created_at: string
          id: string
          match_reason: string | null
          matched_user_id: string
          status: string
          synergy_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          complementary_strengths?: string[] | null
          created_at?: string
          id?: string
          match_reason?: string | null
          matched_user_id: string
          status?: string
          synergy_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          complementary_strengths?: string[] | null
          created_at?: string
          id?: string
          match_reason?: string | null
          matched_user_id?: string
          status?: string
          synergy_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          token: string
          used: boolean
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          token: string
          used?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          availability: string | null
          bio: string | null
          company: string | null
          contact_info: string | null
          created_at: string
          embedding_synced: boolean | null
          goals: string[] | null
          id: string
          image_url: string | null
          name: string
          niche: string | null
          skills: string[] | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: string | null
          bio?: string | null
          company?: string | null
          contact_info?: string | null
          created_at?: string
          embedding_synced?: boolean | null
          goals?: string[] | null
          id?: string
          image_url?: string | null
          name: string
          niche?: string | null
          skills?: string[] | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: string | null
          bio?: string | null
          company?: string | null
          contact_info?: string | null
          created_at?: string
          embedding_synced?: boolean | null
          goals?: string[] | null
          id?: string
          image_url?: string | null
          name?: string
          niche?: string | null
          skills?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      roadmap_tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          milestone: string | null
          position: number
          roadmap_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          milestone?: string | null
          position?: number
          roadmap_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          milestone?: string | null
          position?: number
          roadmap_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_tasks_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          ai_generated: boolean | null
          created_at: string
          description: string | null
          id: string
          squad_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_generated?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          squad_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_generated?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          squad_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmaps_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      squad_members: {
        Row: {
          id: string
          joined_at: string
          role: string
          squad_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string
          squad_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          squad_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "squad_members_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      squads: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          max_members: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          max_members?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          max_members?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          current_streak: number
          id: string
          last_activity_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_role: {
        Args: {
          target_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: undefined
      }
      get_authenticated_profiles: {
        Args: never
        Returns: {
          bio: string
          company: string
          created_at: string
          id: string
          image_url: string
          name: string
          skills: string[]
          title: string
          updated_at: string
          user_roles: string[]
        }[]
      }
      get_public_profile_by_id: {
        Args: { profile_id: string }
        Returns: {
          bio: string
          company: string
          contact_info: string
          created_at: string
          id: string
          image_url: string
          is_own_profile: boolean
          name: string
          skills: string[]
          title: string
          updated_at: string
          user_id: string
        }[]
      }
      get_public_profiles: {
        Args: never
        Returns: {
          bio: string
          company: string
          created_at: string
          id: string
          image_url: string
          name: string
          skills: string[]
          title: string
          updated_at: string
        }[]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: {
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      remove_user_role: {
        Args: {
          target_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "consumer" | "producer" | "ad_hoc" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["consumer", "producer", "ad_hoc", "admin"],
    },
  },
} as const
