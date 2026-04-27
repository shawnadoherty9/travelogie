import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Calendar, MapPin, Ticket } from 'lucide-react';
import { CompletionChecklist, ChecklistStep } from './CompletionChecklist';
import type {
  PersonalizedTourRow,
  TourBookingRow,
  EventBookingRow,
} from '@/hooks/useRoleDashboardData';

interface ProfileLite {
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  home_city: string | null;
  profile_image_url: string | null;
  languages: string[] | null;
  interests: string[] | null;
}

interface Props {
  profile: ProfileLite | null;
  tours: PersonalizedTourRow[];
  bookings: TourBookingRow[];
  events: EventBookingRow[];
}

export const TravelerDashboard = ({ profile, tours, bookings, events }: Props) => {
  const steps: ChecklistStep[] = [
    {
      key: 'name',
      label: 'Add your name',
      done: !!(profile?.first_name && profile?.last_name),
    },
    {
      key: 'home_city',
      label: 'Set your home city',
      description: 'Helps us recommend nearby experiences',
      done: !!profile?.home_city,
    },
    {
      key: 'photo',
      label: 'Upload a profile photo',
      description: 'Locals trust travelers with photos',
      done: !!profile?.profile_image_url,
    },
    {
      key: 'languages',
      label: 'Add at least one language',
      done: (profile?.languages?.length ?? 0) > 0,
    },
    {
      key: 'interests',
      label: 'Pick a few interests',
      done: (profile?.interests?.length ?? 0) >= 3,
    },
    {
      key: 'bio',
      label: 'Write a short bio',
      done: !!(profile?.bio && profile.bio.trim().length >= 20),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <CompletionChecklist steps={steps} editLabel="Edit Traveler Profile" />
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5" /> Your Personalized Tours
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tours.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tours planned yet.</p>
            ) : (
              <ul className="space-y-3">
                {tours.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium">{t.tour_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(t.start_date).toLocaleDateString()} → {new Date(t.end_date).toLocaleDateString()} · {t.total_days} days
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize">{t.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Tour Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tour bookings yet.</p>
            ) : (
              <ul className="space-y-3">
                {bookings.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium">{b.confirmation_number || b.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(b.booking_date).toLocaleDateString()} · {b.currency} {b.total_amount}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="secondary" className="capitalize">{b.booking_status}</Badge>
                      <Badge variant="outline" className="capitalize text-xs">{b.payment_status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5" /> Event Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground">No event bookings yet.</p>
            ) : (
              <ul className="space-y-3">
                {events.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium">{e.confirmation_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {e.ticket_count} ticket(s) · {e.booking_type}
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize">{e.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
