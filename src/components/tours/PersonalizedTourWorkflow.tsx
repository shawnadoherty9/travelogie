import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, DollarSign, Star, Users, CheckCircle } from 'lucide-react';
import { TourMap } from './TourMap';
import { useToast } from '@/hooks/use-toast';
import { ActivityCategorySelector } from './ActivityCategorySelector';
import { ActivitySelector } from './ActivitySelector';
import { getCityActivities, type Activity } from '@/data/cityActivities';

// Using Activity interface from cityActivities.ts

interface TourGuide {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  specialties: string[];
  dailyRate: number;
  languages: string[];
  experience: string;
  about: string;
}

interface PersonalizedTourWorkflowProps {
  location: string;
  interests: string;
  onComplete?: () => void;
}

export const PersonalizedTourWorkflow: React.FC<PersonalizedTourWorkflowProps> = ({
  location,
  interests,
  onComplete
}) => {
  const [step, setStep] = useState<'categories' | 'activities' | 'guide-choice' | 'self-explore' | 'guide-selection' | 'finalization'>('categories');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedGuideType, setSelectedGuideType] = useState<'self' | 'guided' | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const { toast } = useToast();

  // Get city-specific activities
  const cityActivities = getCityActivities(location);

  // Mock tour guides
  const tourGuides: TourGuide[] = [
    {
      id: 'guide1',
      name: 'Hiroshi Yamada',
      avatar: '/placeholder-guide1.jpg',
      rating: 4.9,
      reviews: 156,
      specialties: ['Cultural Heritage', 'Traditional Arts', 'Temple Tours'],
      dailyRate: 120,
      languages: ['Japanese', 'English'],
      experience: '8 years',
      about: 'Cultural historian passionate about sharing Tokyo\'s hidden gems and traditional practices.'
    },
    {
      id: 'guide2',
      name: 'Akiko Tanaka',
      avatar: '/placeholder-guide2.jpg',
      rating: 4.8,
      reviews: 203,
      specialties: ['Food Culture', 'Local Markets', 'Street Art'],
      dailyRate: 95,
      languages: ['Japanese', 'English', 'Korean'],
      experience: '6 years',
      about: 'Food enthusiast and artist who knows every hidden restaurant and gallery in the city.'
    },
    {
      id: 'guide3',
      name: 'Kenji Nakamura',
      avatar: '/placeholder-guide3.jpg',
      rating: 5.0,
      reviews: 89,
      specialties: ['Traditional Crafts', 'Spiritual Sites', 'Photography'],
      dailyRate: 140,
      languages: ['Japanese', 'English'],
      experience: '10 years',
      about: 'Master craftsman and spiritual guide offering deep cultural immersion experiences.'
    }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId) 
        : [...prev, activityId]
    );
  };

  const handleNextStep = () => {
    if (step === 'categories' && selectedCategories.length > 0) {
      setStep('activities');
    } else if (step === 'activities' && selectedActivities.length > 0) {
      setStep('guide-choice');
    } else if (step === 'guide-choice' && selectedGuideType) {
      if (selectedGuideType === 'self') {
        setStep('self-explore');
        handleSelfExploreBooking();
      } else {
        setStep('guide-selection');
      }
    } else if (step === 'guide-selection' && selectedGuide) {
      setStep('finalization');
    }
  };

  const handleSelfExploreBooking = () => {
    const selected = cityActivities.filter(a => selectedActivities.includes(a.id));
    const total = selected.reduce((sum, item) => sum + item.price, 0);
    const commission = total * 0.15;
    toast({
      title: "Booking confirmed!",
      description: `Your self-guided tour has been booked. Total: $${total} (Commission: $${commission.toFixed(2)})`
    });

    // Here you would integrate with actual booking APIs
    selected.forEach(activity => {
      console.log(`Auto-booking: ${activity.name} via ${activity.ticketUrl}`);
    });
  };

  const handleGuideBooking = () => {
    const guide = tourGuides.find(g => g.id === selectedGuide);
    const selected = cityActivities.filter(a => selectedActivities.includes(a.id));
    const activitiesTotal = selected.reduce((sum, item) => sum + item.price, 0);
    const guideTotal = guide ? guide.dailyRate : 0;
    const total = activitiesTotal + guideTotal;
    const commission = total * 0.15;
    toast({
      title: "Booking request sent!",
      description: `Your request has been sent to ${guide?.name}. Total estimate: $${total} (Commission: $${commission.toFixed(2)})`
    });

    // Here you would send email to the guide and handle payment processing
    console.log('Sending booking request email to guide:', guide?.name);
  };

  const getMapMarkers = () => {
    return cityActivities.filter(a => selectedActivities.includes(a.id)).map(a => ({
      id: a.id,
      position: a.location,
      title: a.name,
      type: a.type,
      category: a.category
    }));
  };

  return (
    <div className="space-y-6">
      {/* Category Selection Step */}
      {step === 'categories' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Choose Activity Categories for {location}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Based on your interests in {interests}, select the types of activities you'd like to experience:
            </p>
            
            <ActivityCategorySelector
              selectedCity={location}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
            />

            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {selectedCategories.length} categor{selectedCategories.length !== 1 ? 'ies' : 'y'} selected
              </div>
              <Button 
                onClick={handleNextStep} 
                disabled={selectedCategories.length === 0} 
                className="bg-gradient-wanderlust hover:opacity-90"
              >
                Choose Activities
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Selection Step */}
      {step === 'activities' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Select Your Activities in {location}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivitySelector
                selectedCity={location}
                selectedCategories={selectedCategories}
                selectedActivities={selectedActivities}
                onActivityToggle={handleActivityToggle}
              />

              {/* Map showing selected locations */}
              {selectedActivities.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Your Selected Locations</h4>
                  <TourMap 
                    markers={getMapMarkers()} 
                    center={{
                      lat: location.toLowerCase().includes('tokyo') ? 35.6762 : 
                           location.toLowerCase().includes('new york') ? 40.7829 :
                           location.toLowerCase().includes('mumbai') ? 19.0760 : 35.6762,
                      lng: location.toLowerCase().includes('tokyo') ? 139.6503 : 
                           location.toLowerCase().includes('new york') ? -73.9654 :
                           location.toLowerCase().includes('mumbai') ? 72.8777 : 139.6503
                    }} 
                  />
                </div>
              )}

              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {selectedActivities.length} activit{selectedActivities.length !== 1 ? 'ies' : 'y'} selected
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('categories')}
                  >
                    Back to Categories
                  </Button>
                  <Button 
                    onClick={handleNextStep} 
                    disabled={selectedActivities.length === 0} 
                    className="bg-gradient-wanderlust hover:opacity-90"
                  >
                    Continue to Guide Options
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Guide Choice Step */}
      {step === 'guide-choice' && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Experience Style</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all ${selectedGuideType === 'self' ? 'ring-2 ring-primary' : ''}`} 
                onClick={() => setSelectedGuideType('self')}
              >
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Self-Guided Exploration</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore at your own pace with detailed directions and recommendations
                  </p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all ${selectedGuideType === 'guided' ? 'ring-2 ring-primary' : ''}`} 
                onClick={() => setSelectedGuideType('guided')}
              >
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Local Tour Guide</h3>
                  <p className="text-sm text-muted-foreground">
                    Experience authentic culture with a knowledgeable local guide
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 text-center">
              <Button onClick={handleNextStep} disabled={!selectedGuideType} className="bg-gradient-wanderlust hover:opacity-90">
                {selectedGuideType === 'self' ? 'Book Self-Guided Tour' : 'Choose Your Guide'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guide Selection Step */}
      {step === 'guide-selection' && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Local Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {tourGuides.map(guide => (
                <Card 
                  key={guide.id} 
                  className={`cursor-pointer transition-all ${selectedGuide === guide.id ? 'ring-2 ring-primary' : ''}`} 
                  onClick={() => setSelectedGuide(guide.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={guide.avatar} alt={guide.name} />
                        <AvatarFallback>{guide.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{guide.name}</h4>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {guide.rating} ({guide.reviews})
                            </div>
                            <div className="text-sm font-medium">${guide.dailyRate}/day</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{guide.about}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {guide.specialties.map(specialty => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Languages: {guide.languages.join(', ')} • {guide.experience} experience
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button onClick={handleNextStep} disabled={!selectedGuide} className="bg-gradient-wanderlust hover:opacity-90">
                Continue to Finalization
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Finalization Step */}
      {step === 'finalization' && (
        <Card>
          <CardHeader>
            <CardTitle>Finalize Your Tour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Selected Activities:</h4>
                {cityActivities.filter(a => selectedActivities.includes(a.id)).map(activity => (
                  <div key={activity.id} className="flex justify-between items-center py-2 border-b">
                    <span>{activity.name}</span>
                    <span>${activity.price}</span>
                  </div>
                ))}
              </div>

              {selectedGuide && (
                <div>
                  <h4 className="font-semibold mb-2">Your Guide:</h4>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>{tourGuides.find(g => g.id === selectedGuide)?.name}</span>
                    <span>${tourGuides.find(g => g.id === selectedGuide)?.dailyRate}/day</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total (including 15% commission):</span>
                  <span>
                    ${cityActivities.filter(a => selectedActivities.includes(a.id)).reduce((sum, item) => sum + item.price, 0) + (selectedGuide ? tourGuides.find(g => g.id === selectedGuide)?.dailyRate || 0 : 0)}
                  </span>
                </div>
              </div>

              <Button onClick={handleGuideBooking} className="w-full bg-gradient-wanderlust hover:opacity-90" size="lg">
                Request Booking & Pay
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Self-Explore Confirmation */}
      {step === 'self-explore' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Your self-guided tour has been booked. All tickets have been automatically purchased and you'll receive confirmation emails shortly.
            </p>
            <div className="space-y-2">
              {cityActivities.filter(a => selectedActivities.includes(a.id)).map(activity => (
                <div key={activity.id} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{activity.name} - Booked</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};