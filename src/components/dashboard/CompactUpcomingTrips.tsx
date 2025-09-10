import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, MapPin, Calendar, Plus, Sparkles } from "lucide-react";

interface Trip {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  trip_type: 'upcoming' | 'future';
  notes?: string;
  status?: 'soon' | 'planned';
}

export const CompactUpcomingTrips: React.FC = () => {
  const mockTrips: Trip[] = [
    {
      id: '1',
      destination: 'Tokyo, Japan',
      start_date: '2024-03-14',
      end_date: '2024-03-24',
      trip_type: 'upcoming',
      notes: 'Cherry blossom season!',
      status: 'soon'
    },
    {
      id: '2',
      destination: 'Barcelona, Spain',
      start_date: '2024-06-09',
      end_date: '2024-06-19',
      trip_type: 'future',
      notes: 'Architecture tour with locals',
      status: 'planned'
    }
  ];

  const upcomingTrips = mockTrips.filter(trip => trip.trip_type === 'upcoming');
  const futureTrips = mockTrips.filter(trip => trip.trip_type === 'future');

  const getDaysUntil = (dateString: string) => {
    const tripDate = new Date(dateString);
    const today = new Date();
    const diffTime = tripDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-green-600" />
            Trip Planning
          </CardTitle>
          <Button variant="default" size="sm" className="h-8 px-3 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-1" />
            Plan New Trip
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upcoming Trips Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-sm">Upcoming Trips</h4>
          </div>
          
          {upcomingTrips.length > 0 ? (
            <div className="space-y-3">
              {upcomingTrips.map(trip => (
                <div key={trip.id} className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/20 dark:border-green-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-sm">{trip.destination}</span>
                    </div>
                    <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                      Soon!
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                    </div>
                    {trip.notes && (
                      <p className="text-xs text-green-700 dark:text-green-300">{trip.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No upcoming trips</p>
            </div>
          )}
        </div>

        {/* Future Plans Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-sm">Future Plans</h4>
          </div>
          
          {futureTrips.length > 0 ? (
            <div className="space-y-3">
              {futureTrips.map(trip => (
                <div key={trip.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/20 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-sm">{trip.destination}</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-blue-600 text-blue-600">
                      Planned
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                    </div>
                    {trip.notes && (
                      <p className="text-xs text-blue-700 dark:text-blue-300">{trip.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 text-muted-foreground">
              <Plane className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No future plans yet</p>
            </div>
          )}
        </div>

        {/* Empty State */}
        {mockTrips.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Plane className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No trips planned yet</p>
            <p className="text-sm mb-3">Start planning your next adventure!</p>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Plan Your First Trip
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};