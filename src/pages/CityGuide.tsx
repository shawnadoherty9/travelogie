import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Camera, Calendar, Plane, DollarSign, Cloud, Car, Building, Clock, Star, Palette, Music, Brush, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CityGuideSection } from '@/components/cityGuide/CityGuideSection';
import { CityGuideNavigation } from '@/components/cityGuide/CityGuideNavigation';
import { cityGuides } from '@/data/cityGuides';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const CityGuide = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('history');

  const cityData = cityId ? cityGuides[cityId] : null;

  useEffect(() => {
    if (!cityData) {
      navigate('/destinations');
    }
  }, [cityData, navigate]);

  if (!cityData) {
    return null;
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-travel-sand via-background to-travel-sage/10 w-full flex">
        {/* Sidebar Navigation */}
        <CityGuideNavigation 
          onSectionClick={scrollToSection}
          activeSection={activeSection}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header with Sidebar Trigger */}
          <div className="relative h-96 overflow-hidden">
            <img 
              src={cityData.heroImage} 
              alt={`${cityData.cityName}, ${cityData.country}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
            <div className="absolute top-4 left-4 z-10">
              <SidebarTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/20" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <Button 
                variant="outline" 
                onClick={() => navigate('/destinations')}
                className="mb-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Destinations
              </Button>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                {cityData.cityName}
              </h1>
              <p className="text-xl text-white/90">{cityData.country}</p>
            </div>
          </div>

          <main className="container mx-auto px-4 py-8">
            <div className="space-y-8">
              {/* Local Scenes Section - Moved to top center */}
              <div id="localscenes">
                <CityGuideSection 
                  title="Local Scenes" 
                  icon={<Palette className="w-6 h-6" />}
                >
                  <div className="space-y-6">
                    {/* Header with background image */}
                    <div className="relative h-64 rounded-lg overflow-hidden">
                      <img 
                        src={cityData.localScenes.backgroundImage} 
                        alt={`${cityData.cityName} local culture scene`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-white text-lg leading-relaxed">{cityData.localScenes.overview}</p>
                      </div>
                    </div>

                    {/* Scene Cards */}
                    <div className="grid gap-6">
                      {cityData.localScenes.scenes.map((scene, index) => {
                        const getCategoryIcon = (category: string) => {
                          switch (category.toLowerCase()) {
                            case 'music': return <Music className="w-5 h-5" />;
                            case 'arts & crafts':
                            case 'arts & museums': 
                            case 'art':
                            case 'traditional arts':
                            case 'architecture & design':
                            case 'contemporary arts': return <Brush className="w-5 h-5" />;
                            case 'technology & innovation':
                            case 'tech': return <Gamepad2 className="w-5 h-5" />;
                            default: return <Palette className="w-5 h-5" />;
                          }
                        };

                        return (
                          <Card key={index} className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-travel-ocean/10 text-travel-ocean">
                                {getCategoryIcon(scene.category)}
                              </div>
                              <div>
                                <span className="text-sm font-medium text-travel-sunset bg-travel-sand px-2 py-1 rounded-full">
                                  {scene.category}
                                </span>
                                <h4 className="text-xl font-semibold text-travel-ocean mt-1">{scene.name}</h4>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-4">{scene.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                              <div>
                                <strong className="text-travel-ocean">Location:</strong>
                                <p className="text-sm">{scene.location}</p>
                              </div>
                              <div>
                                <strong className="text-travel-ocean">Best Time:</strong>
                                <p className="text-sm">{scene.bestTime}</p>
                              </div>
                              <div>
                                <strong className="text-travel-ocean">Cost:</strong>
                                <p className="text-sm">{scene.cost}</p>
                              </div>
                              <div>
                                <strong className="text-travel-ocean">Highlights:</strong>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {scene.highlights.slice(0, 2).map((highlight, idx) => (
                                    <li key={idx} className="text-muted-foreground">{highlight}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            {scene.highlights.length > 2 && (
                              <div>
                                <strong className="text-travel-ocean">More Highlights:</strong>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {scene.highlights.slice(2).map((highlight, idx) => (
                                    <span key={idx} className="text-xs bg-travel-sage/20 text-travel-ocean px-2 py-1 rounded-full">
                                      {highlight}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </CityGuideSection>
              </div>

              {/* History Section */}
              <div id="history">
                <CityGuideSection 
                  title="City History" 
                  icon={<Building className="w-6 h-6" />}
                >
                  <div className="space-y-6">
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {cityData.history.overview}
                    </p>
                    <div className="grid gap-4">
                      {cityData.history.periods.map((period, index) => (
                        <Card key={index} className="p-4">
                          <h4 className="font-semibold text-travel-ocean mb-2">{period.era}</h4>
                          <p className="text-muted-foreground">{period.description}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CityGuideSection>
              </div>

              {/* Attractions Section */}
              <div id="attractions">
                <CityGuideSection 
                  title="Top 10 Attractions" 
                  icon={<Camera className="w-6 h-6" />}
                >
                  <div className="grid gap-6">
                    {cityData.attractions.map((attraction, index) => (
                      <Card key={index} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-xl font-semibold text-travel-ocean">{attraction.name}</h4>
                          <div className="flex items-center text-travel-sunset">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 text-sm font-medium">#{index + 1}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">{attraction.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <strong className="text-travel-ocean">Location:</strong>
                            <p>{attraction.location}</p>
                          </div>
                          <div>
                            <strong className="text-travel-ocean">Hours:</strong>
                            <p>{attraction.hours}</p>
                          </div>
                          <div>
                            <strong className="text-travel-ocean">Cost:</strong>
                            <p>{attraction.cost}</p>
                          </div>
                          <div>
                            <strong className="text-travel-ocean">Tips:</strong>
                            <p className="text-travel-sunset">{attraction.tips}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CityGuideSection>
              </div>

              {/* Day Trips Section */}
              <div id="daytrips">
                <CityGuideSection 
                  title="Top 5 Day Trips" 
                  icon={<MapPin className="w-6 h-6" />}
                >
                  <div className="grid gap-6">
                    {cityData.dayTrips.map((trip, index) => (
                      <Card key={index} className="p-6">
                        <h4 className="text-xl font-semibold text-travel-ocean mb-2">{trip.name}</h4>
                        <p className="text-muted-foreground mb-4">{trip.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-travel-ocean" />
                            <span className="font-medium">Distance:</span>
                            <span>{trip.distance}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-travel-ocean" />
                            <span className="font-medium">Duration:</span>
                            <span>{trip.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-travel-ocean" />
                            <span className="font-medium">Cost:</span>
                            <span>{trip.cost}</span>
                          </div>
                        </div>
                        <div>
                          <strong className="text-travel-ocean">Highlights:</strong>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            {trip.highlights.map((highlight, idx) => (
                              <li key={idx} className="text-muted-foreground">{highlight}</li>
                            ))}
                          </ul>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CityGuideSection>
              </div>

              {/* Transportation Section */}
              <div id="transportation">
                <CityGuideSection 
                  title="Local Transportation" 
                  icon={<Car className="w-6 h-6" />}
                >
                  <div className="grid gap-4">
                    {cityData.transportation.map((transport, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-semibold text-travel-ocean mb-2">{transport.type}</h4>
                        <p className="text-muted-foreground mb-2">{transport.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <strong className="text-travel-ocean">Cost:</strong> {transport.cost}
                          </div>
                          <div>
                            <strong className="text-travel-ocean">Tips:</strong> 
                            <span className="text-travel-sunset ml-1">{transport.tips}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CityGuideSection>
              </div>

              {/* Airport Section */}
              <div id="airport">
                <CityGuideSection 
                  title="Airport & Transportation" 
                  icon={<Plane className="w-6 h-6" />}
                >
                  <Card className="p-6">
                    <h4 className="text-xl font-semibold text-travel-ocean mb-2">
                      {cityData.airport.name} ({cityData.airport.code})
                    </h4>
                    <p className="text-muted-foreground mb-4">{cityData.airport.description}</p>
                    <div className="mb-4">
                      <strong className="text-travel-ocean">Distance:</strong> {cityData.airport.distance}
                    </div>
                    <div>
                      <strong className="text-travel-ocean">Transportation Options:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {cityData.airport.transportOptions.map((option, index) => (
                          <li key={index} className="text-muted-foreground">{option}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </CityGuideSection>
              </div>

              {/* Currency Section */}
              <div id="currency">
                <CityGuideSection 
                  title="Currency & Money" 
                  icon={<DollarSign className="w-6 h-6" />}
                >
                  <Card className="p-6">
                    <h4 className="text-xl font-semibold text-travel-ocean mb-2">
                      {cityData.currency.name} ({cityData.currency.code}) - {cityData.currency.symbol}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <strong className="text-travel-ocean">Denominations:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {cityData.currency.denominations.map((denom, index) => (
                            <li key={index} className="text-muted-foreground">{denom}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong className="text-travel-ocean">Exchange Tips:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {cityData.currency.exchangeTips.map((tip, index) => (
                            <li key={index} className="text-muted-foreground">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </CityGuideSection>
              </div>

              {/* Climate Section */}
              <div id="climate">
                <CityGuideSection 
                  title="Climate & Weather" 
                  icon={<Cloud className="w-6 h-6" />}
                >
                  <div className="space-y-6">
                    <Card className="p-6">
                      <p className="text-muted-foreground mb-4">{cityData.climate.overview}</p>
                      <p className="text-sm text-travel-ocean mb-4">
                        <strong>Annual Rainfall:</strong> {cityData.climate.rainfall}
                      </p>
                    </Card>
                    
                    <div className="grid gap-4">
                      {cityData.climate.seasons.map((season, index) => (
                        <Card key={index} className="p-4">
                          <h4 className="font-semibold text-travel-ocean mb-2">{season.season}</h4>
                          <div className="flex items-center gap-4 mb-2">
                            <span className="text-travel-sunset font-medium">{season.temperature}</span>
                          </div>
                          <p className="text-muted-foreground">{season.description}</p>
                        </Card>
                      ))}
                    </div>

                    <Card className="p-6">
                      <strong className="text-travel-ocean">What to Pack:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {cityData.climate.clothing.map((item, index) => (
                          <li key={index} className="text-muted-foreground">{item}</li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </CityGuideSection>
              </div>

              {/* Festivals Section */}
              <div id="festivals">
                <CityGuideSection 
                  title="Festivals & Celebrations" 
                  icon={<Calendar className="w-6 h-6" />}
                >
                  <div className="grid gap-4">
                    {cityData.festivals.map((festival, index) => (
                      <Card key={index} className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-xl font-semibold text-travel-ocean">{festival.name}</h4>
                          <span className="bg-travel-sand text-travel-ocean px-3 py-1 rounded-full text-sm font-medium">
                            {festival.month}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-2">{festival.description}</p>
                        <div className="text-sm text-travel-sunset">
                          <strong>Duration:</strong> {festival.duration}
                        </div>
                      </Card>
                    ))}
                  </div>
                </CityGuideSection>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CityGuide;