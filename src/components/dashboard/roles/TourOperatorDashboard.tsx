import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, ShieldCheck, Star } from 'lucide-react';
import { CompletionChecklist, ChecklistStep } from './CompletionChecklist';
import type { TourOperatorRow } from '@/hooks/useRoleDashboardData';

interface Props {
  operator: TourOperatorRow | null;
}

export const TourOperatorDashboard = ({ operator }: Props) => {
  const steps: ChecklistStep[] = [
    { key: 'business', label: 'Add your business name', done: !!operator?.business_name },
    { key: 'desc', label: 'Write a description (50+ chars)', done: !!(operator?.description && operator.description.length >= 50) },
    { key: 'cities', label: 'List cities you cover', done: (operator?.cities_covered?.length ?? 0) > 0 },
    { key: 'specialties', label: 'Add specialties', done: (operator?.specialties?.length ?? 0) > 0 },
    { key: 'languages', label: 'List languages spoken', done: (operator?.languages_spoken?.length ?? 0) > 0 },
    { key: 'rate', label: 'Set hourly or daily rate', done: !!(operator?.hourly_rate || operator?.daily_rate) },
    { key: 'photo', label: 'Upload a profile photo', done: !!operator?.profile_image_url },
    { key: 'gallery', label: 'Add gallery photos', done: (operator?.gallery_urls?.length ?? 0) >= 3 },
    { key: 'cert', label: 'Add certifications', done: (operator?.certifications?.length ?? 0) > 0 },
    { key: 'insurance', label: 'Verify insurance', done: !!operator?.insurance_verified },
    { key: 'background', label: 'Complete background check', done: !!operator?.background_checked },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <CompletionChecklist steps={steps} editLabel="Edit Tour Operator Profile" />
      </div>
      <div className="lg:col-span-2 space-y-6">
        {!operator ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No tour operator profile yet. Complete registration to get started.
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" /> {operator.business_name || 'Untitled Business'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {operator.description || 'No description yet.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(operator.cities_covered ?? []).map((c) => (
                    <Badge key={c} variant="secondary">{c}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <ShieldCheck className="w-6 h-6 mx-auto text-sky-600" />
                  <p className="text-sm text-muted-foreground mt-2">Insurance</p>
                  <p className="font-medium">{operator.insurance_verified ? 'Verified' : 'Pending'}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <ShieldCheck className="w-6 h-6 mx-auto text-sky-600" />
                  <p className="text-sm text-muted-foreground mt-2">Background</p>
                  <p className="font-medium">{operator.background_checked ? 'Cleared' : 'Pending'}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="w-6 h-6 mx-auto text-sky-600" />
                  <p className="text-sm text-muted-foreground mt-2">Status</p>
                  <p className="font-medium">{operator.is_active ? 'Active' : 'Inactive'}</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
