import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Tour {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  price_from: number;
  price_to?: number;
  duration_hours: number;
  rating: number;
  review_count: number;
  image_urls: string[];
  tags: string[];
  currency: string;
  city_id: string;
  is_active: boolean;
  attractions: any[];
  activities: any[];
}

interface Attraction {
  id: string;
  name: string;
  short_description: string;
  description: string;
  price_from: number;
  price_to?: number;
  duration_hours: number;
  rating: number;
  review_count: number;
  image_urls: string[];
  tags: string[];
  currency: string;
  address: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
}

interface Activity {
  id: string;
  name: string;
  short_description: string;
  description: string;
  price_from: number;
  price_to?: number;
  duration_hours: number;
  rating: number;
  review_count: number;
  image_urls: string[];
  tags: string[];
  currency: string;
  address: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
}

export const useTours = (cityId?: string) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchToursData();
  }, [cityId]);

  const fetchToursData = async () => {
    try {
      setLoading(true);
      
      // For now, we'll use mock data since the database migration is pending
      // TODO: Update to use actual database tables once migration is complete
      
      const mockTours: Tour[] = [
        {
          id: '1',
          name: 'Tokyo Food & Culture Walking Tour',
          description: 'Explore authentic Tokyo through its incredible food scene and hidden cultural gems.',
          short_description: 'Authentic Tokyo food and culture experience',
          price_from: 120,
          duration_hours: 6,
          rating: 4.9,
          review_count: 156,
          image_urls: ['/src/assets/tokyo-food-tour.jpg'],
          tags: ['Food', 'Culture', 'Walking'],
          currency: 'USD',
          city_id: '1',
          is_active: true,
          attractions: [],
          activities: []
        }
      ];

      const mockAttractions: Attraction[] = [
        {
          id: '1',
          name: 'Senso-ji Temple',
          short_description: 'Ancient Buddhist temple in Asakusa',
          description: 'Tokyo\'s oldest temple and one of its most significant.',
          price_from: 0,
          duration_hours: 2,
          rating: 4.8,
          review_count: 1234,
          image_urls: ['/src/assets/tokyo-wallpaper.jpg'],
          tags: ['Temple', 'Culture', 'Historic'],
          currency: 'USD',
          address: 'Asakusa, Tokyo',
          latitude: 35.7148,
          longitude: 139.7967,
          is_active: true
        }
      ];

      const mockActivities: Activity[] = [
        {
          id: '1',
          name: 'Sushi Making Class',
          short_description: 'Learn to make authentic sushi',
          description: 'Hands-on sushi making experience with a master chef.',
          price_from: 80,
          duration_hours: 3,
          rating: 4.9,
          review_count: 456,
          image_urls: ['/src/assets/tokyo-food-tour.jpg'],
          tags: ['Cooking', 'Food', 'Traditional'],
          currency: 'USD',
          address: 'Shibuya, Tokyo',
          latitude: 35.6598,
          longitude: 139.7023,
          is_active: true
        }
      ];

      setTours(mockTours);
      setAttractions(mockAttractions);
      setActivities(mockActivities);
      
    } catch (error) {
      console.error('Error fetching tours data:', error);
      toast({
        title: "Error loading tours",
        description: "Failed to load tours data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const bookTour = async (tourId: string) => {
    toast({
      title: "Booking Tour",
      description: "Redirecting to booking page...",
    });
    // TODO: Implement booking logic
  };

  const bookAttraction = async (attractionId: string) => {
    toast({
      title: "Booking Attraction",
      description: "Redirecting to booking page...",
    });
    // TODO: Implement booking logic
  };

  const bookActivity = async (activityId: string) => {
    toast({
      title: "Booking Activity",
      description: "Redirecting to booking page...",
    });
    // TODO: Implement booking logic
  };

  return {
    tours,
    attractions,
    activities,
    loading,
    bookTour,
    bookAttraction,
    bookActivity,
    refetch: fetchToursData,
  };
};