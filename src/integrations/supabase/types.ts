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
      activities: {
        Row: {
          address: string | null
          booking_api_endpoint: string | null
          booking_requirements: Json | null
          category_id: string | null
          city_id: string | null
          created_at: string
          currency: string
          description: string | null
          duration_hours: number | null
          external_booking_url: string | null
          id: string
          image_urls: string[] | null
          is_active: boolean
          latitude: number | null
          longitude: number | null
          name: string
          operating_hours: Json | null
          price_from: number | null
          price_to: number | null
          rating: number | null
          review_count: number | null
          seasonal_availability: Json | null
          short_description: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          booking_api_endpoint?: string | null
          booking_requirements?: Json | null
          category_id?: string | null
          city_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          duration_hours?: number | null
          external_booking_url?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          operating_hours?: Json | null
          price_from?: number | null
          price_to?: number | null
          rating?: number | null
          review_count?: number | null
          seasonal_availability?: Json | null
          short_description?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          booking_api_endpoint?: string | null
          booking_requirements?: Json | null
          category_id?: string | null
          city_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          duration_hours?: number | null
          external_booking_url?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          operating_hours?: Json | null
          price_from?: number | null
          price_to?: number | null
          rating?: number | null
          review_count?: number | null
          seasonal_availability?: Json | null
          short_description?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "activity_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      availability: {
        Row: {
          created_at: string
          currency: string | null
          date: string
          end_time: string
          id: string
          is_available: boolean
          price_per_hour: number | null
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          date: string
          end_time: string
          id?: string
          is_available?: boolean
          price_per_hour?: number | null
          start_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          date?: string
          end_time?: string
          id?: string
          is_available?: boolean
          price_per_hour?: number | null
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          availability_id: string
          booking_date: string
          created_at: string
          currency: string | null
          customer_id: string
          end_time: string
          id: string
          notes: string | null
          payment_status: string
          provider_id: string
          service_description: string | null
          service_title: string
          service_type: string
          start_time: string
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          availability_id: string
          booking_date: string
          created_at?: string
          currency?: string | null
          customer_id: string
          end_time: string
          id?: string
          notes?: string | null
          payment_status?: string
          provider_id: string
          service_description?: string | null
          service_title: string
          service_type: string
          start_time: string
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          availability_id?: string
          booking_date?: string
          created_at?: string
          currency?: string | null
          customer_id?: string
          end_time?: string
          id?: string
          notes?: string | null
          payment_status?: string
          provider_id?: string
          service_description?: string | null
          service_title?: string
          service_type?: string
          start_time?: string
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_availability_id_fkey"
            columns: ["availability_id"]
            isOneToOne: false
            referencedRelation: "availability"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          best_time_to_visit: string | null
          country_id: string | null
          created_at: string
          description: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          timezone: string
          updated_at: string
        }
        Insert: {
          best_time_to_visit?: string | null
          country_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          timezone: string
          updated_at?: string
        }
        Update: {
          best_time_to_visit?: string | null
          country_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          country_code: string
          created_at: string
          currency: string
          id: string
          name: string
          timezone: string
          updated_at: string
        }
        Insert: {
          country_code: string
          created_at?: string
          currency: string
          id?: string
          name: string
          timezone: string
          updated_at?: string
        }
        Update: {
          country_code?: string
          created_at?: string
          currency?: string
          id?: string
          name?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_bookings: {
        Row: {
          booking_type: string
          confirmation_number: string
          created_at: string
          currency: string
          event_id: string
          guest_email: string
          guest_name: string
          id: string
          notes: string | null
          payment_status: string
          status: string
          ticket_count: number
          total_amount: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_type?: string
          confirmation_number?: string
          created_at?: string
          currency?: string
          event_id: string
          guest_email: string
          guest_name: string
          id?: string
          notes?: string | null
          payment_status?: string
          status?: string
          ticket_count?: number
          total_amount?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_type?: string
          confirmation_number?: string
          created_at?: string
          currency?: string
          event_id?: string
          guest_email?: string
          guest_name?: string
          id?: string
          notes?: string | null
          payment_status?: string
          status?: string
          ticket_count?: number
          total_amount?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          booking_api_endpoint: string | null
          capacity: number | null
          category_id: string | null
          city_id: string | null
          created_at: string
          currency: string
          description: string | null
          end_date: string
          end_time: string | null
          event_type: string | null
          id: string
          image_urls: string[] | null
          is_active: boolean
          latitude: number | null
          longitude: number | null
          name: string
          price_from: number | null
          price_to: number | null
          short_description: string | null
          start_date: string
          start_time: string | null
          tags: string[] | null
          ticket_url: string | null
          tickets_sold: number | null
          updated_at: string
          venue_name: string | null
        }
        Insert: {
          address?: string | null
          booking_api_endpoint?: string | null
          capacity?: number | null
          category_id?: string | null
          city_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          end_date: string
          end_time?: string | null
          event_type?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          price_from?: number | null
          price_to?: number | null
          short_description?: string | null
          start_date: string
          start_time?: string | null
          tags?: string[] | null
          ticket_url?: string | null
          tickets_sold?: number | null
          updated_at?: string
          venue_name?: string | null
        }
        Update: {
          address?: string | null
          booking_api_endpoint?: string | null
          capacity?: number | null
          category_id?: string | null
          city_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          end_date?: string
          end_time?: string | null
          event_type?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          price_from?: number | null
          price_to?: number | null
          short_description?: string | null
          start_date?: string
          start_time?: string | null
          tags?: string[] | null
          ticket_url?: string | null
          tickets_sold?: number | null
          updated_at?: string
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "activity_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
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
      interest_tags: {
        Row: {
          category: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      lesson_recordings: {
        Row: {
          booking_id: string
          created_at: string
          duration_minutes: number | null
          id: string
          lesson_notes: string | null
          recording_url: string | null
          student_id: string
          teacher_id: string
          transcription: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          lesson_notes?: string | null
          recording_url?: string | null
          student_id: string
          teacher_id: string
          transcription?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          lesson_notes?: string | null
          recording_url?: string | null
          student_id?: string
          teacher_id?: string
          transcription?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_recordings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          currency: string
          id: string
          payment_status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          tour_booking_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          payment_status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          tour_booking_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          payment_status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          tour_booking_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_tour_booking_id_fkey"
            columns: ["tour_booking_id"]
            isOneToOne: false
            referencedRelation: "tour_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      personalized_tours: {
        Row: {
          city_id: string | null
          created_at: string
          currency: string
          description: string | null
          end_date: string
          id: string
          interests: string[] | null
          operator_daily_rate: number | null
          preferences: Json | null
          start_date: string
          status: string
          total_budget: number | null
          total_days: number
          tour_name: string
          tour_operator_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          end_date: string
          id?: string
          interests?: string[] | null
          operator_daily_rate?: number | null
          preferences?: Json | null
          start_date: string
          status?: string
          total_budget?: number | null
          total_days: number
          tour_name: string
          tour_operator_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          end_date?: string
          id?: string
          interests?: string[] | null
          operator_daily_rate?: number | null
          preferences?: Json | null
          start_date?: string
          status?: string
          total_budget?: number | null
          total_days?: number
          tour_name?: string
          tour_operator_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personalized_tours_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personalized_tours_tour_operator_id_fkey"
            columns: ["tour_operator_id"]
            isOneToOne: false
            referencedRelation: "tour_operators"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string | null
          coordinates: unknown
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
          coordinates?: unknown
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
          coordinates?: unknown
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
      rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          identifier: string
          request_count: number
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          identifier: string
          request_count?: number
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          identifier?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          cancellation_policy: string | null
          created_at: string
          currency: string | null
          description: string | null
          duration_hours: number
          equipment_needed: string | null
          id: string
          is_active: boolean
          is_in_person: boolean | null
          is_online: boolean | null
          max_participants: number | null
          media_urls: string[] | null
          price_per_hour: number
          requirements: string | null
          service_type: string
          skill_level: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancellation_policy?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_hours?: number
          equipment_needed?: string | null
          id?: string
          is_active?: boolean
          is_in_person?: boolean | null
          is_online?: boolean | null
          max_participants?: number | null
          media_urls?: string[] | null
          price_per_hour: number
          requirements?: string | null
          service_type: string
          skill_level?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancellation_policy?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_hours?: number
          equipment_needed?: string | null
          id?: string
          is_active?: boolean
          is_in_person?: boolean | null
          is_online?: boolean | null
          max_participants?: number | null
          media_urls?: string[] | null
          price_per_hour?: number
          requirements?: string | null
          service_type?: string
          skill_level?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tour_bookings: {
        Row: {
          activities_cost: number | null
          booking_date: string
          booking_status: string
          confirmation_number: string | null
          created_at: string
          currency: string
          emergency_contact: Json | null
          id: string
          operator_fee: number | null
          payment_status: string
          platform_fee: number | null
          special_requests: string | null
          total_amount: number
          tour_id: string | null
          tour_operator_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          activities_cost?: number | null
          booking_date?: string
          booking_status?: string
          confirmation_number?: string | null
          created_at?: string
          currency?: string
          emergency_contact?: Json | null
          id?: string
          operator_fee?: number | null
          payment_status?: string
          platform_fee?: number | null
          special_requests?: string | null
          total_amount: number
          tour_id?: string | null
          tour_operator_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          activities_cost?: number | null
          booking_date?: string
          booking_status?: string
          confirmation_number?: string | null
          created_at?: string
          currency?: string
          emergency_contact?: Json | null
          id?: string
          operator_fee?: number | null
          payment_status?: string
          platform_fee?: number | null
          special_requests?: string | null
          total_amount?: number
          tour_id?: string | null
          tour_operator_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "personalized_tours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_bookings_tour_operator_id_fkey"
            columns: ["tour_operator_id"]
            isOneToOne: false
            referencedRelation: "tour_operators"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_itinerary: {
        Row: {
          activity_id: string | null
          booking_reference: string | null
          booking_status: string | null
          cost: number | null
          created_at: string
          currency: string
          custom_activity_description: string | null
          custom_activity_name: string | null
          day_number: number
          estimated_duration_hours: number | null
          event_id: string | null
          id: string
          notes: string | null
          scheduled_time: string | null
          tour_id: string | null
        }
        Insert: {
          activity_id?: string | null
          booking_reference?: string | null
          booking_status?: string | null
          cost?: number | null
          created_at?: string
          currency?: string
          custom_activity_description?: string | null
          custom_activity_name?: string | null
          day_number: number
          estimated_duration_hours?: number | null
          event_id?: string | null
          id?: string
          notes?: string | null
          scheduled_time?: string | null
          tour_id?: string | null
        }
        Update: {
          activity_id?: string | null
          booking_reference?: string | null
          booking_status?: string | null
          cost?: number | null
          created_at?: string
          currency?: string
          custom_activity_description?: string | null
          custom_activity_name?: string | null
          day_number?: number
          estimated_duration_hours?: number | null
          event_id?: string | null
          id?: string
          notes?: string | null
          scheduled_time?: string | null
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_itinerary_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_itinerary_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_itinerary_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "personalized_tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_operator_availability: {
        Row: {
          created_at: string
          current_bookings: number | null
          date: string
          end_time: string
          id: string
          is_available: boolean
          max_bookings: number | null
          operator_id: string | null
          rate_override: number | null
          start_time: string
        }
        Insert: {
          created_at?: string
          current_bookings?: number | null
          date: string
          end_time: string
          id?: string
          is_available?: boolean
          max_bookings?: number | null
          operator_id?: string | null
          rate_override?: number | null
          start_time: string
        }
        Update: {
          created_at?: string
          current_bookings?: number | null
          date?: string
          end_time?: string
          id?: string
          is_available?: boolean
          max_bookings?: number | null
          operator_id?: string | null
          rate_override?: number | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_operator_availability_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "tour_operators"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_operators: {
        Row: {
          background_checked: boolean | null
          business_name: string | null
          certifications: string[] | null
          cities_covered: string[] | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          currency: string
          daily_rate: number | null
          description: string | null
          experience_years: number | null
          gallery_urls: string[] | null
          hourly_rate: number | null
          id: string
          insurance_verified: boolean | null
          is_active: boolean
          languages_spoken: string[] | null
          profile_image_url: string | null
          rating: number | null
          review_count: number | null
          social_media_links: Json | null
          specialties: string[] | null
          updated_at: string
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          background_checked?: boolean | null
          business_name?: string | null
          certifications?: string[] | null
          cities_covered?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string
          daily_rate?: number | null
          description?: string | null
          experience_years?: number | null
          gallery_urls?: string[] | null
          hourly_rate?: number | null
          id?: string
          insurance_verified?: boolean | null
          is_active?: boolean
          languages_spoken?: string[] | null
          profile_image_url?: string | null
          rating?: number | null
          review_count?: number | null
          social_media_links?: Json | null
          specialties?: string[] | null
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          background_checked?: boolean | null
          business_name?: string | null
          certifications?: string[] | null
          cities_covered?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string
          daily_rate?: number | null
          description?: string | null
          experience_years?: number | null
          gallery_urls?: string[] | null
          hourly_rate?: number | null
          id?: string
          insurance_verified?: boolean | null
          is_active?: boolean
          languages_spoken?: string[] | null
          profile_image_url?: string | null
          rating?: number | null
          review_count?: number | null
          social_media_links?: Json | null
          specialties?: string[] | null
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      travel_suggestion_upvotes: {
        Row: {
          created_at: string
          id: string
          suggestion_id: string
          user_id: string | null
          user_ip: string
        }
        Insert: {
          created_at?: string
          id?: string
          suggestion_id: string
          user_id?: string | null
          user_ip: string
        }
        Update: {
          created_at?: string
          id?: string
          suggestion_id?: string
          user_id?: string | null
          user_ip?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_suggestion_upvotes_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "travel_suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_suggestions: {
        Row: {
          author: string | null
          created_at: string
          description: string
          id: string
          latitude: number
          longitude: number
          photo_url: string | null
          tags: string[] | null
          title: string
          updated_at: string
          upvotes: number | null
        }
        Insert: {
          author?: string | null
          created_at?: string
          description: string
          id?: string
          latitude: number
          longitude: number
          photo_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          upvotes?: number | null
        }
        Update: {
          author?: string | null
          created_at?: string
          description?: string
          id?: string
          latitude?: number
          longitude?: number
          photo_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          upvotes?: number | null
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
      user_privacy_settings: {
        Row: {
          allow_location_sharing: boolean | null
          created_at: string | null
          id: string
          show_location_in_posts: boolean | null
          show_travel_history: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allow_location_sharing?: boolean | null
          created_at?: string | null
          id?: string
          show_location_in_posts?: boolean | null
          show_travel_history?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allow_location_sharing?: boolean | null
          created_at?: string | null
          id?: string
          show_location_in_posts?: boolean | null
          show_travel_history?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      visited_places: {
        Row: {
          coordinates: unknown
          country: string
          created_at: string
          id: string
          notes: string | null
          place_name: string
          user_id: string
          visit_date: string | null
        }
        Insert: {
          coordinates?: unknown
          country: string
          created_at?: string
          id?: string
          notes?: string | null
          place_name: string
          user_id: string
          visit_date?: string | null
        }
        Update: {
          coordinates?: unknown
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
      check_rate_limit: {
        Args: {
          p_endpoint: string
          p_identifier: string
          p_max_requests: number
          p_window_minutes: number
        }
        Returns: boolean
      }
      get_booking_payment_status: {
        Args: { booking_id_param: string }
        Returns: {
          amount: number
          currency: string
          payment_status: string
        }[]
      }
      get_public_posts_safe: {
        Args: never
        Returns: {
          content: string
          created_at: string
          id: string
          location_name: string
          media_urls: string[]
          post_type: string
          tags: string[]
          title: string
        }[]
      }
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
      get_public_profile_data: {
        Args: { profile_user_id: string }
        Returns: {
          bio: string
          first_name: string
          languages: string[]
          last_name: string
          profile_image_url: string
          user_type: string
        }[]
      }
      get_public_tour_operators: {
        Args: never
        Returns: {
          background_checked: boolean
          business_name: string
          certifications: string[]
          cities_covered: string[]
          created_at: string
          currency: string
          daily_rate: number
          description: string
          experience_years: number
          gallery_urls: string[]
          hourly_rate: number
          id: string
          insurance_verified: boolean
          is_active: boolean
          languages_spoken: string[]
          profile_image_url: string
          rating: number
          review_count: number
          social_media_links: Json
          specialties: string[]
          updated_at: string
          website_url: string
        }[]
      }
      get_tour_booking_payment_status: {
        Args: { tour_booking_id_param: string }
        Returns: {
          amount: number
          currency: string
          payment_status: string
        }[]
      }
      get_tour_operator_contact: {
        Args: { operator_id: string }
        Returns: {
          contact_email: string
          contact_phone: string
        }[]
      }
      get_user_posts_with_location: {
        Args: never
        Returns: {
          content: string
          coordinates: unknown
          created_at: string
          id: string
          is_public: boolean
          location_name: string
          media_urls: string[]
          post_type: string
          tags: string[]
          title: string
          updated_at: string
          user_id: string
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
      increment_suggestion_upvotes: {
        Args: { suggestion_id: string }
        Returns: Json
      }
      make_admin: { Args: { user_email: string }; Returns: undefined }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "tour_operator"
        | "language_teacher"
        | "cultural_guide"
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
      app_role: [
        "admin",
        "moderator",
        "user",
        "tour_operator",
        "language_teacher",
        "cultural_guide",
      ],
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
