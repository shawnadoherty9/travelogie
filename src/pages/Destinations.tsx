import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Globe, Users, Calendar } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

// Import background image
import kumbhMelaBackground from "@/assets/kumbh-mela-destinations-background.jpg";

// Import destination images
import varanasiDestination from "@/assets/varanasi-destination.jpg";
import tokyoDestination from "@/assets/tokyo-destination.jpg";
import barcelonaDestination from "@/assets/barcelona-destination.jpg";
import mumbaiDestination from "@/assets/mumbai-destination.jpg";
import parisDestination from "@/assets/paris-destination.jpg";
import bangkokDestination from "@/assets/bangkok-destination.jpg";

const Destinations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapboxToken, setMapboxToken] = useState("");
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const popularDestinations = [
    {
      name: "Varanasi, India",
      description: "Spiritual capital of India",
      coordinates: [83.0047, 25.3176] as [number, number],
      experiences: 45,
      guides: 23,
      image: varanasiDestination
    },
    {
      name: "Tokyo, Japan", 
      description: "Modern culture meets tradition",
      coordinates: [139.6917, 35.6895] as [number, number],
      experiences: 78,
      guides: 34,
      image: tokyoDestination
    },
    {
      name: "Barcelona, Spain",
      description: "Architecture and Mediterranean culture",
      coordinates: [2.1734, 41.3851] as [number, number],
      experiences: 56,
      guides: 28,
      image: barcelonaDestination
    },
    {
      name: "Mumbai, India",
      description: "Bollywood and street culture",
      coordinates: [72.8777, 19.0760] as [number, number],
      experiences: 67,
      guides: 31,
      image: mumbaiDestination
    },
    {
      name: "Paris, France",
      description: "City of lights and culture",
      coordinates: [2.3522, 48.8566] as [number, number],
      experiences: 89,
      guides: 42,
      image: parisDestination
    },
    {
      name: "Bangkok, Thailand",
      description: "Temples and vibrant markets",
      coordinates: [100.5018, 13.7563] as [number, number],
      experiences: 52,
      guides: 26,
      image: bangkokDestination
    }
  ];

  // Fetch Mapbox token from edge function
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        if (data?.token) {
          setMapboxToken(data.token);
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
      } finally {
        setIsLoadingToken(false);
      }
    };

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [30, 15],
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });
    });

    // Add markers for popular destinations
    popularDestinations.forEach((destination) => {
      const el = document.createElement('div');
      el.className = 'w-4 h-4 bg-travel-sunset rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(destination.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold text-sm">${destination.name}</h3>
                <p class="text-xs text-muted-foreground">${destination.description}</p>
                <div class="flex gap-2 mt-2 text-xs">
                  <span>${destination.experiences} experiences</span>
                  <span>${destination.guides} guides</span>
                </div>
              </div>
            `)
        )
        .addTo(map.current!);
    });

    // Rotation animation settings
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    // Spin globe function
    function spinGlobe() {
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // Event listeners for interaction
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', () => {
      spinGlobe();
    });

    // Start the globe spinning
    spinGlobe();

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  const handleDestinationClick = (destination: typeof popularDestinations[0]) => {
    if (map.current) {
      map.current.flyTo({
        center: destination.coordinates,
        zoom: 12,
        pitch: 60,
        duration: 2000
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement geocoding to search for locations
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section with Kumbh Mela Background */}
        <section 
          className="py-20 bg-gradient-wanderlust text-white relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(32, 130, 180, 0.8), rgba(220, 95, 75, 0.8)), url(${kumbhMelaBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Explore authentic cultural experiences around the world with local guides
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-lg mb-2 font-semibold">
                🇮🇳 Proud Partner of the Indian Government
              </p>
              <p className="text-base opacity-90">
                Official cultural exchange partner for Kumbh Mela Festival via MIT Nanda Project
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Where do you want to go?</h2>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search destinations, countries, or cities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-3 text-lg"
                  />
                </div>
                <Button type="submit" size="lg" className="bg-gradient-wanderlust hover:opacity-90">
                  Explore
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {isLoadingToken && (
          <section className="py-16">
            <div className="container mx-auto px-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-travel-ocean mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading interactive map...</p>
            </div>
          </section>
        )}

        {/* Interactive Map */}
        {!isLoadingToken && mapboxToken && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-center mb-8">Explore Destinations Worldwide</h2>
              <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-2xl">
                <div ref={mapContainer} className="absolute inset-0" />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/5 rounded-xl" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm font-semibold text-foreground">
                    Click markers to explore destinations
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Popular Destinations */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Popular Destinations</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Discover these amazing destinations loved by travelers worldwide
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularDestinations.map((destination, index) => (
                <Card 
                  key={index} 
                  className="hover:travel-shadow transition-all duration-300 cursor-pointer"
                  onClick={() => handleDestinationClick(destination)}
                >
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{destination.name}</h3>
                        <p className="text-sm text-muted-foreground">{destination.description}</p>
                      </div>
                      <MapPin className="w-5 h-5 text-travel-sunset mt-1" />
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{destination.experiences} experiences</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{destination.guides} guides</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-wanderlust hover:opacity-90"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDestinationClick(destination);
                      }}
                    >
                      Explore Destination
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Travelogie Destinations?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-wanderlust rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">Local Expertise</h3>
                <p className="text-muted-foreground">
                  Connect with verified local guides who share authentic cultural insights and hidden gems.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-wanderlust rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">Global Reach</h3>
                <p className="text-muted-foreground">
                  Explore destinations across 6 continents with personalized experiences tailored to your interests.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-wanderlust rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">Flexible Booking</h3>
                <p className="text-muted-foreground">
                  Book experiences that fit your schedule with instant confirmation and 24/7 support.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Destinations;