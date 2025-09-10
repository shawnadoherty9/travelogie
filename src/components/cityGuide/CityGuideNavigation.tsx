import React from 'react';
import { MapPin, Camera, Calendar, Plane, DollarSign, Cloud, Car, Building, Palette } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

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
  { id: 'history', title: 'City History', icon: <Building className="w-4 h-4" /> },
  { id: 'attractions', title: 'Top Attractions', icon: <Camera className="w-4 h-4" /> },
  { id: 'localscenes', title: 'Local Scenes', icon: <Palette className="w-4 h-4" /> },
  { id: 'daytrips', title: 'Day Trips', icon: <MapPin className="w-4 h-4" /> },
  { id: 'transportation', title: 'Transportation', icon: <Car className="w-4 h-4" /> },
  { id: 'airport', title: 'Airport', icon: <Plane className="w-4 h-4" /> },
  { id: 'currency', title: 'Currency', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'climate', title: 'Climate', icon: <Cloud className="w-4 h-4" /> },
  { id: 'festivals', title: 'Festivals', icon: <Calendar className="w-4 h-4" /> },
];

export const CityGuideNavigation = ({ onSectionClick, activeSection }: CityGuideNavigationProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-travel-ocean font-semibold">
            {!isCollapsed && "City Guide"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionClick(item.id)}
                    className={`cursor-pointer transition-colors ${
                      activeSection === item.id 
                        ? 'bg-travel-sand text-travel-ocean font-medium' 
                        : 'text-muted-foreground hover:bg-travel-sand/20 hover:text-travel-ocean'
                    }`}
                  >
                    {item.icon}
                    {!isCollapsed && <span className="ml-2">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};