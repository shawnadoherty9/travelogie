import { useMemo } from 'react';
import { useRoles, AppRole } from '@/hooks/useRoles';
import { useRoleDashboardData } from '@/hooks/useRoleDashboardData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { TravelerDashboard } from './TravelerDashboard';
import { TourOperatorDashboard } from './TourOperatorDashboard';
import { ServiceProviderDashboard } from './ServiceProviderDashboard';

interface RoleTabConfig {
  role: AppRole;
  label: string;
}

const ROLE_TABS: RoleTabConfig[] = [
  { role: 'user', label: 'Traveler' },
  { role: 'tour_operator', label: 'Tour Operator' },
  { role: 'language_teacher', label: 'Language Teacher' },
  { role: 'cultural_guide', label: 'Cultural Experience' },
  { role: 'event_venue', label: 'Event Venue' },
];

export const RoleDashboards = () => {
  const { roles, loading: rolesLoading } = useRoles();
  const data = useRoleDashboardData();

  const availableTabs = useMemo(() => {
    const filtered = ROLE_TABS.filter(({ role }) => roles.includes(role));
    // Always include traveler view if user has no specific role yet
    if (filtered.length === 0) return [ROLE_TABS[0]];
    return filtered;
  }, [roles]);

  if (rolesLoading || data.loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          Loading your dashboards…
        </CardContent>
      </Card>
    );
  }

  const defaultTab = availableTabs[0].role;

  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <TabsList className="flex flex-wrap h-auto">
        {availableTabs.map((t) => (
          <TabsTrigger key={t.role} value={t.role}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {availableTabs.map((t) => (
        <TabsContent key={t.role} value={t.role}>
          {t.role === 'user' && (
            <TravelerDashboard
              profile={data.profile}
              tours={data.personalizedTours}
              bookings={data.tourBookings}
              events={data.eventBookings}
            />
          )}
          {t.role === 'tour_operator' && (
            <TourOperatorDashboard operator={data.tourOperator} />
          )}
          {t.role === 'language_teacher' && (
            <ServiceProviderDashboard
              profile={data.profile}
              services={data.services}
              serviceTypeFilter={['language_lesson', 'language', 'lesson']}
              roleLabel="Language Lesson"
              emptyMessage="You haven't created any language lessons yet."
            />
          )}
          {t.role === 'cultural_guide' && (
            <ServiceProviderDashboard
              profile={data.profile}
              services={data.services}
              serviceTypeFilter={['cultural_experience', 'experience', 'cultural']}
              roleLabel="Cultural Experience"
              emptyMessage="You haven't created any cultural experiences yet."
            />
          )}
          {t.role === 'event_venue' && (
            <ServiceProviderDashboard
              profile={data.profile}
              services={data.services}
              serviceTypeFilter={['event_venue', 'venue', 'event']}
              roleLabel="Event Space"
              emptyMessage="You haven't listed any event spaces yet."
            />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};
