import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ProfileRow {
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  home_city: string | null;
  profile_image_url: string | null;
  languages: string[] | null;
  interests: string[] | null;
  birthdate: string | null;
}

export interface TourOperatorRow {
  id: string;
  business_name: string | null;
  description: string | null;
  specialties: string[] | null;
  cities_covered: string[] | null;
  languages_spoken: string[] | null;
  hourly_rate: number | null;
  daily_rate: number | null;
  profile_image_url: string | null;
  gallery_urls: string[] | null;
  certifications: string[] | null;
  insurance_verified: boolean;
  background_checked: boolean;
  is_active: boolean;
}

export interface ServiceRow {
  id: string;
  title: string;
  description: string | null;
  service_type: string;
  duration_hours: number;
  price_per_hour: number;
  is_active: boolean;
  is_online: boolean;
  is_in_person: boolean;
  media_urls: string[] | null;
  created_at: string;
}

export interface TourBookingRow {
  id: string;
  total_amount: number;
  currency: string;
  booking_status: string;
  payment_status: string;
  booking_date: string;
  confirmation_number: string | null;
}

export interface PersonalizedTourRow {
  id: string;
  tour_name: string;
  start_date: string;
  end_date: string;
  status: string;
  total_days: number;
  total_budget: number | null;
  currency: string;
}

export interface EventBookingRow {
  id: string;
  guest_name: string;
  ticket_count: number;
  total_amount: number | null;
  currency: string;
  status: string;
  booking_type: string;
  confirmation_number: string;
  created_at: string;
}

export const useRoleDashboardData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [tourOperator, setTourOperator] = useState<TourOperatorRow | null>(null);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [tourBookings, setTourBookings] = useState<TourBookingRow[]>([]);
  const [personalizedTours, setPersonalizedTours] = useState<PersonalizedTourRow[]>([]);
  const [eventBookings, setEventBookings] = useState<EventBookingRow[]>([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [
          profileRes,
          operatorRes,
          servicesRes,
          tourBookingsRes,
          personalizedToursRes,
          eventBookingsRes,
        ] = await Promise.all([
          supabase
            .from('profiles')
            .select('first_name,last_name,bio,home_city,profile_image_url,languages,interests,birthdate')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('tour_operators')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('services')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('tour_bookings')
            .select('id,total_amount,currency,booking_status,payment_status,booking_date,confirmation_number')
            .eq('user_id', user.id)
            .order('booking_date', { ascending: false })
            .limit(10),
          supabase
            .from('personalized_tours')
            .select('id,tour_name,start_date,end_date,status,total_days,total_budget,currency')
            .eq('user_id', user.id)
            .order('start_date', { ascending: false })
            .limit(10),
          supabase
            .from('event_bookings')
            .select('id,guest_name,ticket_count,total_amount,currency,status,booking_type,confirmation_number,created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10),
        ]);

        if (cancelled) return;
        setProfile((profileRes.data as ProfileRow) ?? null);
        setTourOperator((operatorRes.data as TourOperatorRow) ?? null);
        setServices((servicesRes.data as ServiceRow[]) ?? []);
        setTourBookings((tourBookingsRes.data as TourBookingRow[]) ?? []);
        setPersonalizedTours((personalizedToursRes.data as PersonalizedTourRow[]) ?? []);
        setEventBookings((eventBookingsRes.data as EventBookingRow[]) ?? []);
      } catch (err) {
        console.error('Error loading role dashboard data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return {
    loading,
    profile,
    tourOperator,
    services,
    tourBookings,
    personalizedTours,
    eventBookings,
  };
};
