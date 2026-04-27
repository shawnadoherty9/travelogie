import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { CompletionChecklist, ChecklistStep } from './CompletionChecklist';
import type { ServiceRow } from '@/hooks/useRoleDashboardData';

interface ProfileLite {
  bio: string | null;
  profile_image_url: string | null;
  languages: string[] | null;
}

interface Props {
  profile: ProfileLite | null;
  services: ServiceRow[];
  serviceTypeFilter: string[];
  roleLabel: string;
  emptyMessage: string;
}

export const ServiceProviderDashboard = ({
  profile,
  services,
  serviceTypeFilter,
  roleLabel,
  emptyMessage,
}: Props) => {
  const filtered = services.filter((s) =>
    serviceTypeFilter.length === 0 ? true : serviceTypeFilter.includes(s.service_type),
  );
  const active = filtered.filter((s) => s.is_active);

  const steps: ChecklistStep[] = [
    { key: 'photo', label: 'Upload a profile photo', done: !!profile?.profile_image_url },
    { key: 'bio', label: 'Write a short bio', done: !!(profile?.bio && profile.bio.length >= 20) },
    { key: 'languages', label: 'List languages you speak', done: (profile?.languages?.length ?? 0) > 0 },
    { key: 'service', label: `Create at least one ${roleLabel.toLowerCase()} listing`, done: filtered.length > 0 },
    { key: 'active', label: 'Have at least one active listing', done: active.length > 0 },
    { key: 'media', label: 'Add photos to a listing', done: filtered.some((s) => (s.media_urls?.length ?? 0) > 0) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <CompletionChecklist steps={steps} editLabel={`Edit ${roleLabel} Profile`} />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Your {roleLabel} Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">{emptyMessage}</p>
            ) : (
              <ul className="space-y-3">
                {filtered.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.duration_hours}h · ${s.price_per_hour}/hr · {s.is_online ? 'Online' : ''}{s.is_online && s.is_in_person ? ' & ' : ''}{s.is_in_person ? 'In-person' : ''}
                      </p>
                    </div>
                    <Badge variant={s.is_active ? 'secondary' : 'outline'}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </Badge>
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
