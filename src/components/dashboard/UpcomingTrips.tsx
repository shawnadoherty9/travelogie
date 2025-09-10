import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, Plus, MapPin, Clock, Plane } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Trip {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  notes?: string;
  trip_type: 'upcoming' | 'planned';
}

export const UpcomingTrips: React.FC = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [newTrip, setNewTrip] = useState({
    destination: '',
    notes: '',
    trip_type: 'planned' as 'upcoming' | 'planned'
  });

  useEffect(() => {
    fetchTrips();
  }, [user]);

  const fetchTrips = async () => {
    if (!user) return;

    try {
      // For now, we'll use a mock data since we don't have a trips table yet
      // In a real implementation, you'd create a trips table
      const mockTrips: Trip[] = [
        {
          id: '1',
          destination: 'Tokyo, Japan',
          start_date: '2024-03-15',
          end_date: '2024-03-25',
          notes: 'Cherry blossom season!',
          trip_type: 'upcoming'
        },
        {
          id: '2',
          destination: 'Barcelona, Spain',
          start_date: '2024-06-10',
          end_date: '2024-06-20',
          notes: 'Architecture tour with locals',
          trip_type: 'planned'
        }
      ];
      setTrips(mockTrips);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const handleAddTrip = async () => {
    if (!user || !newTrip.destination || !selectedDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newTripData: Trip = {
        id: Date.now().toString(),
        destination: newTrip.destination,
        start_date: selectedDate.toISOString().split('T')[0],
        end_date: endDate ? endDate.toISOString().split('T')[0] : selectedDate.toISOString().split('T')[0],
        notes: newTrip.notes,
        trip_type: newTrip.trip_type
      };

      setTrips(prev => [...prev, newTripData]);
      toast.success('Trip added successfully!');
      
      // Reset form
      setNewTrip({ destination: '', notes: '', trip_type: 'planned' });
      setSelectedDate(undefined);
      setEndDate(undefined);
      setShowAddTrip(false);
    } catch (error) {
      console.error('Error adding trip:', error);
      toast.error('Failed to add trip');
    }
  };

  const upcomingTrips = trips.filter(trip => trip.trip_type === 'upcoming');
  const plannedTrips = trips.filter(trip => trip.trip_type === 'planned');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trip Planning</h2>
        <Button onClick={() => setShowAddTrip(!showAddTrip)}>
          <Plus className="w-4 h-4 mr-2" />
          Plan New Trip
        </Button>
      </div>

      {showAddTrip && (
        <Card>
          <CardHeader>
            <CardTitle>Plan a New Trip</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Destination"
                value={newTrip.destination}
                onChange={(e) => setNewTrip(prev => ({ ...prev, destination: e.target.value }))}
              />
              
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <Input
              placeholder="Notes (what you want to do there)"
              value={newTrip.notes}
              onChange={(e) => setNewTrip(prev => ({ ...prev, notes: e.target.value }))}
            />
            
            <div className="flex gap-2">
              <Button onClick={handleAddTrip}>Add Trip</Button>
              <Button variant="outline" onClick={() => setShowAddTrip(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Trips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-green-600" />
              Upcoming Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTrips.map((trip) => (
                <div key={trip.id} className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{trip.destination}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(trip.start_date), "MMM dd")} - {format(new Date(trip.end_date), "MMM dd, yyyy")}
                        </p>
                        {trip.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{trip.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Soon!</span>
                    </div>
                  </div>
                </div>
              ))}
              {upcomingTrips.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming trips</p>
                  <p className="text-sm">Book your next adventure!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Planned Trips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              Future Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plannedTrips.map((trip) => (
                <div key={trip.id} className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{trip.destination}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(trip.start_date), "MMM dd")} - {format(new Date(trip.end_date), "MMM dd, yyyy")}
                        </p>
                        {trip.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{trip.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <CalendarDays className="w-4 h-4" />
                      <span className="text-sm font-medium">Planned</span>
                    </div>
                  </div>
                </div>
              ))}
              {plannedTrips.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No planned trips</p>
                  <p className="text-sm">Start planning your dream destinations!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};