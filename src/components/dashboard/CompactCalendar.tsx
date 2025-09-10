import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'experience' | 'trip' | 'lesson';
  location?: string;
}

export const CompactCalendar: React.FC = () => {
  const [currentDate] = useState(new Date());
  
  const mockEvents: Event[] = [
    { id: '1', title: 'Cooking Class in Tuscany', date: '2024-01-15', type: 'experience', location: 'Florence' },
    { id: '2', title: 'Japanese Language Lesson', date: '2024-01-16', type: 'lesson', location: 'Online' },
    { id: '3', title: 'Photography Walk', date: '2024-01-18', type: 'experience', location: 'Barcelona' },
    { id: '4', title: 'Weekend in Prague', date: '2024-01-20', type: 'trip', location: 'Prague' }
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'experience': return 'bg-blue-500';
      case 'trip': return 'bg-green-500';
      case 'lesson': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5" />
          This Month
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini Calendar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-sm">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h4>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-xs">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center text-muted-foreground font-medium p-1">
                {day}
              </div>
            ))}
            {emptyDays.map(day => (
              <div key={`empty-${day}`} className="h-6"></div>
            ))}
            {days.map(day => {
              const hasEvent = mockEvents.some(event => 
                parseInt(event.date.split('-')[2]) === day
              );
              return (
                <div 
                  key={day} 
                  className={`text-center p-1 h-6 text-xs rounded ${
                    hasEvent ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h4 className="font-medium text-sm mb-2">Upcoming Events</h4>
          <div className="space-y-2">
            {mockEvents.slice(0, 3).map(event => (
              <div key={event.id} className="flex items-center gap-2 p-2 border rounded-lg">
                <div className={`w-2 h-2 rounded-full ${getEventColor(event.type)}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};