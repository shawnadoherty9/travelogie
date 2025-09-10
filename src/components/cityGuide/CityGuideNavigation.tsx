import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Camera, Calendar, Plane, DollarSign, Cloud, Car, Building } from 'lucide-react';

interface NavigationItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface CityGuideNavigationProps {
  onSectionClick: (sectionId: string) => void;
  activeSection?: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'history', title: 'City History', icon: <Building className="w-5 h-5" /> },
  { id: 'attractions', title: 'Top City Attractions', icon: <Camera className="w-5 h-5" /> },
  { id: 'daytrips', title: 'Day Trips', icon: <MapPin className="w-5 h-5" /> },
  { id: 'transportation', title: 'Local Transportation', icon: <Car className="w-5 h-5" /> },
  { id: 'airport', title: 'Airport', icon: <Plane className="w-5 h-5" /> },
  { id: 'currency', title: 'Currency', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'climate', title: 'Climate', icon: <Cloud className="w-5 h-5" /> },
  { id: 'festivals', title: 'Festivals & Events', icon: <Calendar className="w-5 h-5" /> },
];

export const CityGuideNavigation = ({ onSectionClick, activeSection }: CityGuideNavigationProps) => {
  return (
    <Card className="sticky top-4">
      <CardContent className="p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-travel-sand/20 ${
                activeSection === item.id ? 'bg-travel-sand text-travel-ocean' : 'text-muted-foreground'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.title}</span>
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};