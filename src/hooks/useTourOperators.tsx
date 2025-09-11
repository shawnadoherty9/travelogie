import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TourOperator {
  id: string;
  business_name: string | null;
  description: string | null;
  specialties: string[] | null;
  languages_spoken: string[] | null;
  cities_covered: string[] | null;
  experience_years: number | null;
  rating: number | null;
  review_count: number | null;
  hourly_rate: number | null;
  daily_rate: number | null;
  currency: string;
  website_url: string | null;
  social_media_links: any | null;
  profile_image_url: string | null;
  gallery_urls: string[] | null;
  certifications: string[] | null;
  insurance_verified: boolean | null;
  background_checked: boolean | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TourOperatorContact {
  contact_email: string | null;
  contact_phone: string | null;
}

export const useTourOperators = () => {
  const [operators, setOperators] = useState<TourOperator[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTourOperators();
  }, []);

  const fetchTourOperators = async () => {
    try {
      setLoading(true);
      
      // Use the secure function that doesn't expose contact information
      const { data, error } = await supabase.rpc('get_public_tour_operators');
      
      if (error) {
        throw error;
      }
      
      setOperators(data || []);
    } catch (error) {
      console.error('Error fetching tour operators:', error);
      toast({
        title: "Error loading tour operators",
        description: "Failed to load tour operators. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTourOperatorContact = async (operatorId: string): Promise<TourOperatorContact | null> => {
    try {
      // This function requires authentication and only returns contact info for legitimate booking purposes
      const { data, error } = await supabase.rpc('get_tour_operator_contact', {
        operator_id: operatorId
      });
      
      if (error) {
        throw error;
      }
      
      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching tour operator contact:', error);
      toast({
        title: "Contact information unavailable",
        description: "Please sign in to access contact information for booking.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    operators,
    loading,
    refetch: fetchTourOperators,
    getTourOperatorContact,
  };
};