import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'experience' | 'trip' | 'lesson';
  location?: string;
}

export const CompactCalendar: React.FC = () => {
  const [currentDate] = useState(new Date(2025, 8, 1)); // September 2025
  
  const mockEvents: Event[] = [
    { id: '1', title: 'Traditional Cooking in Tuscany', date: '2025-09-14', time: '2:00 PM', type: 'experience', location: 'Florence' },
    { id: '2', title: 'Calligraphy Workshop', date: '2025-09-15', time: '10:00 AM', type: 'lesson', location: 'Kyoto' },
    { id: '3', title: 'Photography Walk', date: '2025-09-18', time: '9:00 AM', type: 'experience', location: 'Barcelona' }
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'experience': return 'bg-blue-500';
      case 'trip': return 'bg-green-500';
      case 'lesson': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventByDay = (day: number) => {
    return mockEvents.find(event => {
      const eventDay = parseInt(event.date.split('-')[2]);
      return eventDay === day;
    });
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
            Travel Calendar
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calendar Header */}
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-base">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h4>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="space-y-1">
          <div className="grid grid-cols-7 gap-1 text-xs font-medium text-muted-foreground">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center p-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-sm">
            {/* Empty cells for days before month starts */}
            {emptyDays.map(day => (
              <div key={`empty-${day}`} className="h-8"></div>
            ))}
            
            {/* Days of the month */}
            {days.map(day => {
              const event = getEventByDay(day);
              const isToday = day === 10; // Highlighting day 10 as today like in screenshot
              
              return (
                <div 
                  key={day} 
                  className={`relative h-8 flex items-center justify-center rounded text-sm font-medium cursor-pointer transition-colors ${
                    isToday 
                      ? 'bg-blue-600 text-white' 
                      : event 
                        ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                        : 'hover:bg-muted'
                  }`}
                >
                  {day}
                  {event && (
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${getEventColor(event.type)}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm">Upcoming Events</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {mockEvents.length}
            </Badge>
          </div>
          
          {mockEvents.length > 0 ? (
            <div className="space-y-2">
              {mockEvents.slice(0, 2).map(event => (
                <div key={event.id} className="flex items-center gap-3 p-2 border rounded-lg bg-muted/30">
                  <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.time} • {event.location}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No upcoming events</p>
              <p className="text-xs">Plan your next adventure!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};