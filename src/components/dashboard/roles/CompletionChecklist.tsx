import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export interface ChecklistStep {
  key: string;
  label: string;
  description?: string;
  done: boolean;
}

interface CompletionChecklistProps {
  steps: ChecklistStep[];
  editPath?: string;
  editLabel?: string;
}

export const CompletionChecklist = ({
  steps,
  editPath = '/registration',
  editLabel = 'Complete Profile',
}: CompletionChecklistProps) => {
  const navigate = useNavigate();
  const completed = steps.filter((s) => s.done).length;
  const total = steps.length || 1;
  const pct = Math.round((completed / total) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>
              {completed} of {total} steps complete
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-sky-600">{pct}%</div>
          </div>
        </div>
        <Progress value={pct} className="mt-3" />
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2">
          {steps.map((step) => (
            <li key={step.key} className="flex items-start gap-3">
              {step.done ? (
                <Check className="w-5 h-5 mt-0.5 text-sky-600 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" />
              )}
              <div>
                <p className={`text-sm font-medium ${step.done ? 'line-through text-muted-foreground' : ''}`}>
                  {step.label}
                </p>
                {step.description && !step.done && (
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
        {pct < 100 && (
          <Button
            onClick={() => navigate(editPath)}
            className="w-full bg-sky-600 hover:bg-sky-500"
          >
            {editLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
