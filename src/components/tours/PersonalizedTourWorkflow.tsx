import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, DollarSign, Star, Users, CheckCircle } from 'lucide-react';
import { TourMap } from './TourMap';
import { useToast } from '@/hooks/use-toast';

interface TourSuggestion {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  location: { lat: number; lng: number };
  type: 'activity' | 'attraction' | 'experience';
  ticketUrl?: string;
  image: string;
  rating: number;
  category: string;
}

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
  const [step, setStep] = useState<'suggestions' | 'guide-choice' | 'self-explore' | 'guide-selection' | 'finalization'>('suggestions');
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [selectedGuideType, setSelectedGuideType] = useState<'self' | 'guided' | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock tour suggestions with real coordinates for major cities
  const tourSuggestions: TourSuggestion[] = [
    {
      id: '1',
      name: 'Traditional Tea Ceremony Experience',
      description: 'Learn the ancient art of Japanese tea ceremony in a historic tea house',
      duration: '2 hours',
      price: 45,
      location: { lat: 35.6762, lng: 139.6503 },
      type: 'experience',
      ticketUrl: 'https://example.com/tea-ceremony',
      image: '/placeholder-tea-ceremony.jpg',
      rating: 4.8,
      category: 'Cultural'
    },
    {
      id: '2',
      name: 'Senso-ji Temple Visit',
      description: 'Explore Tokyo\'s oldest Buddhist temple with guided meditation',
      duration: '1.5 hours',
      price: 25,
      location: { lat: 35.7148, lng: 139.7967 },
      type: 'attraction',
      ticketUrl: 'https://example.com/sensoji',
      image: '/placeholder-temple.jpg',
      rating: 4.9,
      category: 'Spiritual'
    },
    {
      id: '3',
      name: 'Street Food Walking Tour',
      description: 'Discover hidden gems and authentic local flavors in vibrant neighborhoods',
      duration: '3 hours',
      price: 65,
      location: { lat: 35.6684, lng: 139.6833 },
      type: 'activity',
      ticketUrl: 'https://example.com/street-food',
      image: '/placeholder-food.jpg',
      rating: 4.7,
      category: 'Culinary'
    },
    {
      id: '4',
      name: 'Local Artisan Workshop',
      description: 'Create traditional crafts with master artisans',
      duration: '4 hours',
      price: 85,
      location: { lat: 35.6586, lng: 139.7454 },
      type: 'experience',
      ticketUrl: 'https://example.com/artisan',
      image: '/placeholder-craft.jpg',
      rating: 4.9,
      category: 'Cultural'
    }
  ];

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

  const handleSuggestionToggle = (suggestionId: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestionId) 
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    );
  };

  const handleNextStep = () => {
    if (step === 'suggestions' && selectedSuggestions.length > 0) {
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
    const selected = tourSuggestions.filter(s => selectedSuggestions.includes(s.id));
    const total = selected.reduce((sum, item) => sum + item.price, 0);
    const commission = total * 0.15;
    
    toast({
      title: "Booking confirmed!",
      description: `Your self-guided tour has been booked. Total: $${total} (Commission: $${commission.toFixed(2)})`
    });

    // Here you would integrate with actual booking APIs
    selected.forEach(suggestion => {
      console.log(`Auto-booking: ${suggestion.name} via ${suggestion.ticketUrl}`);
    });
  };

  const handleGuideBooking = () => {
    const guide = tourGuides.find(g => g.id === selectedGuide);
    const selected = tourSuggestions.filter(s => selectedSuggestions.includes(s.id));
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
    return tourSuggestions
      .filter(s => selectedSuggestions.includes(s.id))
      .map(s => ({
        id: s.id,
        position: s.location,
        title: s.name,
        type: s.type,
        category: s.category
      }));
  };

  return (
    <div className="space-y-6">
      {step === 'suggestions' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Personalized Tour Suggestions for {location}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Based on your interests in {interests}, here are our curated recommendations:
              </p>
              
              {/* Map showing selected locations */}
              {selectedSuggestions.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Your Selected Locations</h4>
                  <TourMap markers={getMapMarkers()} center={{ lat: 35.6762, lng: 139.6503 }} />
                </div>
              )}

              <div className="grid gap-4">
                {tourSuggestions.map((suggestion) => (
                  <Card key={suggestion.id} className={`border-2 transition-all ${
                    selectedSuggestions.includes(suggestion.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedSuggestions.includes(suggestion.id)}
                          onCheckedChange={() => handleSuggestionToggle(suggestion.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{suggestion.name}</h4>
                            <Badge variant="outline">{suggestion.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {suggestion.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {suggestion.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${suggestion.price}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {suggestion.rating}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {selectedSuggestions.length} experience{selectedSuggestions.length !== 1 ? 's' : ''} selected
                </div>
                <Button 
                  onClick={handleNextStep}
                  disabled={selectedSuggestions.length === 0}
                  className="bg-gradient-wanderlust hover:opacity-90"
                >
                  Continue to Guide Options
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'guide-choice' && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Experience Style</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedGuideType === 'self' ? 'ring-2 ring-primary' : ''
                }`}
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
                className={`cursor-pointer transition-all ${
                  selectedGuideType === 'guided' ? 'ring-2 ring-primary' : ''
                }`}
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
              <Button 
                onClick={handleNextStep}
                disabled={!selectedGuideType}
                className="bg-gradient-wanderlust hover:opacity-90"
              >
                {selectedGuideType === 'self' ? 'Book Self-Guided Tour' : 'Choose Your Guide'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'guide-selection' && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Local Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {tourGuides.map((guide) => (
                <Card 
                  key={guide.id}
                  className={`cursor-pointer transition-all ${
                    selectedGuide === guide.id ? 'ring-2 ring-primary' : ''
                  }`}
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
                          {guide.specialties.map((specialty) => (
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
              <Button 
                onClick={handleNextStep}
                disabled={!selectedGuide}
                className="bg-gradient-wanderlust hover:opacity-90"
              >
                Continue to Finalization
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'finalization' && (
        <Card>
          <CardHeader>
            <CardTitle>Finalize Your Tour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Selected Experiences:</h4>
                {tourSuggestions
                  .filter(s => selectedSuggestions.includes(s.id))
                  .map(suggestion => (
                    <div key={suggestion.id} className="flex justify-between items-center py-2 border-b">
                      <span>{suggestion.name}</span>
                      <span>${suggestion.price}</span>
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
                    ${(
                      tourSuggestions
                        .filter(s => selectedSuggestions.includes(s.id))
                        .reduce((sum, item) => sum + item.price, 0) +
                      (selectedGuide ? tourGuides.find(g => g.id === selectedGuide)?.dailyRate || 0 : 0)
                    )}
                  </span>
                </div>
              </div>

              <Button 
                onClick={handleGuideBooking}
                className="w-full bg-gradient-wanderlust hover:opacity-90"
                size="lg"
              >
                Request Booking & Pay
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
              {tourSuggestions
                .filter(s => selectedSuggestions.includes(s.id))
                .map(suggestion => (
                  <div key={suggestion.id} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>{suggestion.name} - Booked</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};