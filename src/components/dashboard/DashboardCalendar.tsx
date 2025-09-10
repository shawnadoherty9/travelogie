import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Clock, Users, Plus } from "lucide-react";
import { format } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'trip' | 'experience' | 'lesson' | 'booking';
  location?: string;
  time?: string;
}

export const DashboardCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock events for demonstration
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Tokyo Photography Tour',
      date: new Date(2024, 2, 15), // March 15, 2024
      type: 'experience',
      location: 'Tokyo, Japan',
      time: '9:00 AM'
    },
    {
      id: '2',
      title: 'Spanish Lesson with Maria',
      date: new Date(2024, 2, 18), // March 18, 2024
      type: 'lesson',
      location: 'Online',
      time: '2:00 PM'
    },
    {
      id: '3',
      title: 'Barcelona Architecture Tour',
      date: new Date(2024, 2, 22), // March 22, 2024
      type: 'trip',
      location: 'Barcelona, Spain',
      time: '10:00 AM'
    },
    {
      id: '4',
      title: 'Cooking Class in Tuscany',
      date: new Date(2024, 2, 25), // March 25, 2024
      type: 'experience',
      location: 'Florence, Italy',
      time: '3:00 PM'
    },
    {
      id: '5',
      title: 'Calligraphy Workshop',
      date: new Date(2024, 2, 28), // March 28, 2024
      type: 'booking',
      location: 'Kyoto, Japan',
      time: '11:00 AM'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'trip': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'experience': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'lesson': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'booking': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'trip': return <MapPin className="w-4 h-4" />;
      case 'experience': return <Users className="w-4 h-4" />;
      case 'lesson': return <CalendarDays className="w-4 h-4" />;
      case 'booking': return <Clock className="w-4 h-4" />;
      default: return <CalendarDays className="w-4 h-4" />;
    }
  };

  const selectedDateEvents = mockEvents.filter(event => 
    selectedDate && event.date.toDateString() === selectedDate.toDateString()
  );

  const upcomingEvents = mockEvents
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  // Get dates that have events for highlighting
  const eventDates = mockEvents.map(event => event.date);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Travel Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border w-full"
            modifiers={{
              hasEvent: eventDates,
            }}
            modifiersStyles={{
              hasEvent: {
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                fontWeight: 'bold',
              },
            }}
          />
          
          {selectedDate && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">
                Events for {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`p-2 rounded-full ${getEventTypeColor(event.type)}`}>
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {event.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.time}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No events on this date</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <div key={event.id} className="p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-full ${getEventTypeColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(event.date, "MMM d")} at {event.time}
                    </p>
                    {event.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {upcomingEvents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming events</p>
                <p className="text-sm">Plan your next adventure!</p>
              </div>
            )}
          </div>
          
          <Button className="w-full mt-4" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Schedule New Event
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};