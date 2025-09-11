import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, DollarSign, Star, Users, CheckCircle } from 'lucide-react';
import { TourMap } from './TourMap';
import { TourGuideModal } from './TourGuideModal';
import { useToast } from '@/hooks/use-toast';
import { ActivityCategorySelector } from './ActivityCategorySelector';
import { ActivitySelector } from './ActivitySelector';
import { getCityActivities, type Activity } from '@/data/cityActivities';
import { getTourGuidesByCity, getTourGuidesBySpecialty, type TourGuide } from '@/data/tourGuides';

// Using Activity and TourGuide interfaces from respective data files
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
  const [showGuideModal, setShowGuideModal] = useState(false);
  const { toast } = useToast();

  // Get city-specific activities and guides
  const cityActivities = getCityActivities(location);
  const cityId = location.toLowerCase().replace(/\s+/g, '-');
  const availableGuides = getTourGuidesByCity(cityId);

  // Get city center coordinates
  const getCityCenter = (locationName: string) => {
    const cityCoords = {
      'tokyo': { lat: 35.6762, lng: 139.6503 },
      'new-york': { lat: 40.7829, lng: -73.9654 },
      'mumbai': { lat: 19.0760, lng: 72.8777 }
    };
    const key = locationName.toLowerCase().replace(/\s+/g, '-') as keyof typeof cityCoords;
    return cityCoords[key] || cityCoords['tokyo'];
  };
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]);
  };
  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities(prev => prev.includes(activityId) ? prev.filter(id => id !== activityId) : [...prev, activityId]);
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
        setShowGuideModal(true);
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
  const handleGuideSelection = (guideId: string) => {
    setSelectedGuide(guideId);
  };

  const handleGuideConfirm = () => {
    setShowGuideModal(false);
    setStep('finalization');
  };

  const handleGuideBooking = () => {
    const guide = availableGuides.find(g => g.id === selectedGuide);
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
    const selectedData = cityActivities.filter(a => selectedActivities.includes(a.id));
    console.log('Selected activities for map:', selectedData);
    
    return selectedData.map(a => ({
      id: a.id,
      position: a.location,
      title: a.name,
      type: a.type as 'activity' | 'attraction' | 'experience',
      category: a.category
    }));
  };
  return <div className="space-y-6">
      {/* Category Selection Step */}
      {step === 'categories' && <Card>
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
            
            <ActivityCategorySelector selectedCity={location} selectedCategories={selectedCategories} onCategoryToggle={handleCategoryToggle} />

            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {selectedCategories.length} categor{selectedCategories.length !== 1 ? 'ies' : 'y'} selected
              </div>
              <Button onClick={handleNextStep} disabled={selectedCategories.length === 0} className="bg-gradient-wanderlust hover:opacity-90 bg-sky-600 hover:bg-sky-500">
                Choose Activities
              </Button>
            </div>
          </CardContent>
        </Card>}

      {/* Activity Selection Step */}
      {step === 'activities' && <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Select Your Activities in {location}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivitySelector selectedCity={location} selectedCategories={selectedCategories} selectedActivities={selectedActivities} onActivityToggle={handleActivityToggle} />

              {/* Map showing selected locations */}
              {selectedActivities.length > 0 && <div className="mt-6">
                  <h4 className="font-semibold mb-2">Your Selected Locations ({selectedActivities.length} activities)</h4>
                  <TourMap 
                    markers={getMapMarkers()} 
                    center={getCityCenter(location)}
                    className="h-96 w-full rounded-lg"
                  />
                </div>}

              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {selectedActivities.length} activit{selectedActivities.length !== 1 ? 'ies' : 'y'} selected
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep('categories')}>
                    Back to Categories
                  </Button>
                  <Button onClick={handleNextStep} disabled={selectedActivities.length === 0} className="bg-gradient-wanderlust hover:opacity-90">
                    Continue to Guide Options
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>}

      {/* Guide Choice Step */}
      {step === 'guide-choice' && <Card>
          <CardHeader>
            <CardTitle>Choose Your Experience Style</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className={`cursor-pointer transition-all ${selectedGuideType === 'self' ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedGuideType('self')}>
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Self-Guided Exploration</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore at your own pace with detailed directions and recommendations
                  </p>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-all ${selectedGuideType === 'guided' ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedGuideType('guided')}>
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
        </Card>}

      {/* Tour Guide Modal */}
      <TourGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        guides={availableGuides}
        selectedGuide={selectedGuide}
        onSelectGuide={handleGuideSelection}
        onConfirm={handleGuideConfirm}
        cityName={location}
      />

      {/* Finalization Step */}
      {step === 'finalization' && <Card>
          <CardHeader>
            <CardTitle>Finalize Your Tour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Selected Activities:</h4>
                {cityActivities.filter(a => selectedActivities.includes(a.id)).map(activity => <div key={activity.id} className="flex justify-between items-center py-2 border-b">
                    <span>{activity.name}</span>
                    <span>${activity.price}</span>
                  </div>)}
              </div>

              {selectedGuide && <div>
                  <h4 className="font-semibold mb-2">Your Guide:</h4>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>{availableGuides.find(g => g.id === selectedGuide)?.name}</span>
                    <span>${availableGuides.find(g => g.id === selectedGuide)?.dailyRate}/day</span>
                  </div>
                </div>}

              <div className="pt-4 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total (including 15% commission):</span>
                  <span>
                    ${cityActivities.filter(a => selectedActivities.includes(a.id)).reduce((sum, item) => sum + item.price, 0) + (selectedGuide ? availableGuides.find(g => g.id === selectedGuide)?.dailyRate || 0 : 0)}
                  </span>
                </div>
              </div>

              <Button onClick={handleGuideBooking} className="w-full bg-gradient-wanderlust hover:opacity-90" size="lg">
                Request Booking & Pay
              </Button>
            </div>
          </CardContent>
        </Card>}

      {/* Self-Explore Confirmation */}
      {step === 'self-explore' && <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Your self-guided tour has been booked. All tickets have been automatically purchased and you'll receive confirmation emails shortly.
            </p>
            <div className="space-y-2">
              {cityActivities.filter(a => selectedActivities.includes(a.id)).map(activity => <div key={activity.id} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{activity.name} - Booked</span>
                </div>)}
            </div>
          </CardContent>
        </Card>}
    </div>;
};