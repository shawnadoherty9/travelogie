import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, MapPin, Calendar, Plus } from "lucide-react";

interface Trip {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  trip_type: 'upcoming' | 'future';
  notes?: string;
}

export const CompactUpcomingTrips: React.FC = () => {
  const mockTrips: Trip[] = [
    {
      id: '1',
      destination: 'Tokyo, Japan',
      start_date: '2024-02-15',
      end_date: '2024-02-22',
      trip_type: 'upcoming',
      notes: 'Cherry blossom season exploration'
    },
    {
      id: '2',
      destination: 'Barcelona, Spain',
      start_date: '2024-03-10',
      end_date: '2024-03-17',
      trip_type: 'upcoming',
      notes: 'Architecture and gastronomy tour'
    },
    {
      id: '3',
      destination: 'Bali, Indonesia',
      start_date: '2024-05-20',
      end_date: '2024-06-02',
      trip_type: 'future',
      notes: 'Yoga retreat and cultural immersion'
    }
  ];

  const upcomingTrips = mockTrips.filter(trip => trip.trip_type === 'upcoming');
  const futureTrips = mockTrips.filter(trip => trip.trip_type === 'future');

  const getDaysUntil = (dateString: string) => {
    const tripDate = new Date(dateString);
    const today = new Date();
    const diffTime = tripDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
            <Plane className="w-5 h-5" />
            My Trips
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Next Trip Highlight */}
        {upcomingTrips[0] && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">Next Trip</h4>
              <Badge variant="default" className="text-xs">
                {getDaysUntil(upcomingTrips[0].start_date)} days
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">{upcomingTrips[0].destination}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{formatDateRange(upcomingTrips[0].start_date, upcomingTrips[0].end_date)}</span>
              </div>
              {upcomingTrips[0].notes && (
                <p className="text-xs text-muted-foreground mt-1">{upcomingTrips[0].notes}</p>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Trips */}
        {upcomingTrips.length > 1 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Upcoming</h4>
            <div className="space-y-2">
              {upcomingTrips.slice(1, 3).map(trip => (
                <div key={trip.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{trip.destination}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateRange(trip.start_date, trip.end_date)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getDaysUntil(trip.start_date)} days
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Future Plans */}
        {futureTrips.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Future Plans</h4>
            <div className="space-y-2">
              {futureTrips.slice(0, 2).map(trip => (
                <div key={trip.id} className="flex items-center justify-between p-2 border-dashed border rounded-lg opacity-75">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Plane className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{trip.destination}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mockTrips.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Plane className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No trips planned yet</p>
            <Button variant="outline" size="sm" className="mt-2">
              <Plus className="w-4 h-4 mr-1" />
              Plan Trip
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};