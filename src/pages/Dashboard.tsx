import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  BookOpen, 
  Globe, 
  TrendingUp,
  Heart,
  MessageSquare,
  Settings,
  Plus
} from 'lucide-react';
import Header from '@/components/layout/Header';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  bio: string;
  location: string;
  languages: string[];
  profile_image_url: string;
  is_verified: boolean;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile for user:', user?.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }
      console.log('Profile data:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getDashboardContent = () => {
    const userType = profile?.user_type || 'traveler';
    
    switch (userType) {
      case 'traveler':
        return {
          title: 'Traveler Dashboard',
          description: 'Discover and book amazing local experiences',
          stats: [
            { label: 'Experiences Booked', value: '3', icon: Calendar },
            { label: 'Countries Visited', value: '2', icon: Globe },
            { label: 'Local Guides Met', value: '5', icon: Users },
            { label: 'Reviews Given', value: '8', icon: Star }
          ],
          quickActions: [
            { label: 'Find Experiences', icon: MapPin, action: 'browse' },
            { label: 'My Bookings', icon: Calendar, action: 'bookings' },
            { label: 'Wishlist', icon: Heart, action: 'wishlist' },
            { label: 'Messages', icon: MessageSquare, action: 'messages' }
          ]
        };
      
      case 'tour_operator':
        return {
          title: 'Tour Operator Dashboard',
          description: 'Manage your tours and connect with travelers',
          stats: [
            { label: 'Active Tours', value: '12', icon: MapPin },
            { label: 'Bookings This Month', value: '47', icon: Calendar },
            { label: 'Revenue', value: '$2,340', icon: TrendingUp },
            { label: 'Average Rating', value: '4.8', icon: Star }
          ],
          quickActions: [
            { label: 'Create New Tour', icon: Plus, action: 'create-tour' },
            { label: 'Manage Bookings', icon: Calendar, action: 'manage-bookings' },
            { label: 'Analytics', icon: TrendingUp, action: 'analytics' },
            { label: 'Messages', icon: MessageSquare, action: 'messages' }
          ]
        };

      case 'local_expert':
        return {
          title: 'Local Expert Dashboard',
          description: 'Share your local knowledge and culture',
          stats: [
            { label: 'Active Experiences', value: '8', icon: MapPin },
            { label: 'Travelers Guided', value: '156', icon: Users },
            { label: 'This Month Earnings', value: '$890', icon: TrendingUp },
            { label: 'Expert Rating', value: '4.9', icon: Star }
          ],
          quickActions: [
            { label: 'Create Experience', icon: Plus, action: 'create-experience' },
            { label: 'My Schedule', icon: Calendar, action: 'schedule' },
            { label: 'Reviews', icon: Star, action: 'reviews' },
            { label: 'Messages', icon: MessageSquare, action: 'messages' }
          ]
        };

      case 'language_tutor':
        return {
          title: 'Language Tutor Dashboard',
          description: 'Teach languages to curious travelers',
          stats: [
            { label: 'Active Students', value: '23', icon: Users },
            { label: 'Lessons This Week', value: '18', icon: BookOpen },
            { label: 'Languages Taught', value: '3', icon: Globe },
            { label: 'Student Rating', value: '4.7', icon: Star }
          ],
          quickActions: [
            { label: 'Schedule Lesson', icon: Plus, action: 'schedule-lesson' },
            { label: 'Student Progress', icon: TrendingUp, action: 'progress' },
            { label: 'Resources', icon: BookOpen, action: 'resources' },
            { label: 'Messages', icon: MessageSquare, action: 'messages' }
          ]
        };

      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to Travelogie',
          stats: [],
          quickActions: []
        };
    }
  };

  const dashboardContent = getDashboardContent();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {profile?.first_name || 'User'}! 👋
                </h1>
                <p className="text-muted-foreground mt-2">{dashboardContent.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="capitalize">
                  {profile?.user_type?.replace('_', ' ')}
                </Badge>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {dashboardContent.stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks for your account type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dashboardContent.quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-auto p-6 flex flex-col items-center gap-2"
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-sm">{action.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Traditional Cooking in Tuscany</p>
                          <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</p>
                        </div>
                        <Badge>Confirmed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Calligraphy Workshop</p>
                          <p className="text-sm text-muted-foreground">Dec 15, 10:00 AM</p>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Maria from Tuscany Cooking</p>
                          <p className="text-xs text-muted-foreground">Looking forward to tomorrow's session!</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Yuki - Japanese Lessons</p>
                          <p className="text-xs text-muted-foreground">Practice materials for next lesson</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Booking confirmed</p>
                        <p className="text-sm text-muted-foreground">Traditional Cooking in Tuscany - 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Review received</p>
                        <p className="text-sm text-muted-foreground">5 stars from John D. - 1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <p className="text-sm text-muted-foreground">{profile?.first_name} {profile?.last_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">{profile?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">User Type</label>
                      <p className="text-sm text-muted-foreground capitalize">{profile?.user_type?.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <p className="text-sm text-muted-foreground">{profile?.location || 'Not specified'}</p>
                    </div>
                  </div>
                  <Button>Edit Profile</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;