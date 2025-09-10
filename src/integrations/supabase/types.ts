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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string
          favorited_id: string
          favorited_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          favorited_id: string
          favorited_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          favorited_id?: string
          favorited_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string | null
          coordinates: unknown | null
          created_at: string
          id: string
          is_public: boolean | null
          location_name: string | null
          media_urls: string[] | null
          post_type: string
          tags: string[] | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          coordinates?: unknown | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          location_name?: string | null
          media_urls?: string[] | null
          post_type: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          coordinates?: unknown | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          location_name?: string | null
          media_urls?: string[] | null
          post_type?: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          birthdate: string | null
          created_at: string
          custom_interests: string[] | null
          email: string
          first_name: string | null
          geographic_availability: string | null
          home_city: string | null
          id: string
          identification_uploaded: boolean | null
          interests: string[] | null
          is_profile_public: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          last_name: string | null
          location: string | null
          profile_image_url: string | null
          social_media_links: Json | null
          travel_dream_list: string[] | null
          upcoming_travel: string | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"] | null
          verification_status: string | null
        }
        Insert: {
          bio?: string | null
          birthdate?: string | null
          created_at?: string
          custom_interests?: string[] | null
          email: string
          first_name?: string | null
          geographic_availability?: string | null
          home_city?: string | null
          id?: string
          identification_uploaded?: boolean | null
          interests?: string[] | null
          is_profile_public?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          last_name?: string | null
          location?: string | null
          profile_image_url?: string | null
          social_media_links?: Json | null
          travel_dream_list?: string[] | null
          upcoming_travel?: string | null
          updated_at?: string
          user_id: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
          verification_status?: string | null
        }
        Update: {
          bio?: string | null
          birthdate?: string | null
          created_at?: string
          custom_interests?: string[] | null
          email?: string
          first_name?: string | null
          geographic_availability?: string | null
          home_city?: string | null
          id?: string
          identification_uploaded?: boolean | null
          interests?: string[] | null
          is_profile_public?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          last_name?: string | null
          location?: string | null
          profile_image_url?: string | null
          social_media_links?: Json | null
          travel_dream_list?: string[] | null
          upcoming_travel?: string | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
          verification_status?: string | null
        }
        Relationships: []
      }
      user_languages: {
        Row: {
          created_at: string
          fluency_level: string
          id: string
          is_primary: boolean | null
          language_code: string
          language_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fluency_level: string
          id?: string
          is_primary?: boolean | null
          language_code: string
          language_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          fluency_level?: string
          id?: string
          is_primary?: boolean | null
          language_code?: string
          language_name?: string
          user_id?: string
        }
        Relationships: []
      }
      visited_places: {
        Row: {
          coordinates: unknown | null
          country: string
          created_at: string
          id: string
          notes: string | null
          place_name: string
          user_id: string
          visit_date: string | null
        }
        Insert: {
          coordinates?: unknown | null
          country: string
          created_at?: string
          id?: string
          notes?: string | null
          place_name: string
          user_id: string
          visit_date?: string | null
        }
        Update: {
          coordinates?: unknown | null
          country?: string
          created_at?: string
          id?: string
          notes?: string | null
          place_name?: string
          user_id?: string
          visit_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_profile: {
        Args: { profile_user_id: string }
        Returns: {
          bio: string
          first_name: string
          id: string
          is_verified: boolean
          languages: string[]
          last_name: string
        }[]
      }
    }
    Enums: {
      user_type:
        | "traveler"
        | "tour_operator"
        | "language_teacher"
        | "cultural_experience"
        | "event_venue"
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
      user_type: [
        "traveler",
        "tour_operator",
        "language_teacher",
        "cultural_experience",
        "event_venue",
      ],
    },
  },
} as const
