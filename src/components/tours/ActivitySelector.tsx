import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Star } from 'lucide-react';
import { getActivitiesByCategory, type Activity } from '@/data/cityActivities';

interface ActivitySelectorProps {
  selectedCity: string;
  selectedCategories: string[];
  selectedActivities: string[];
  onActivityToggle: (activityId: string) => void;
}

export const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  selectedCity,
  selectedCategories,
  selectedActivities,
  onActivityToggle
}) => {
  const getActivitiesForCategories = (): Activity[] => {
    const allActivities: Activity[] = [];
    selectedCategories.forEach(categoryId => {
      const categoryActivities = getActivitiesByCategory(selectedCity, categoryId);
      allActivities.push(...categoryActivities);
    });
    return allActivities;
  };

  const activities = getActivitiesForCategories();

  if (selectedCategories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Please select activity categories first
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No activities found for the selected categories in {selectedCity}
      </div>
    );
  }

  const groupedActivities = selectedCategories.reduce((acc, categoryId) => {
    const categoryActivities = getActivitiesByCategory(selectedCity, categoryId);
    if (categoryActivities.length > 0) {
      acc[categoryId] = categoryActivities;
    }
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Choose Your Activities</h3>
      
      {Object.entries(groupedActivities).map(([categoryId, categoryActivities]) => {
        const category = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
        
        return (
          <div key={categoryId} className="space-y-3">
            <h4 className="font-medium text-primary capitalize">{category} Activities</h4>
            <div className="grid gap-3">
              {categoryActivities.map((activity: Activity) => (
                <Card
                  key={activity.id}
                  className={`border-2 transition-all ${
                    selectedActivities.includes(activity.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedActivities.includes(activity.id)}
                        onCheckedChange={() => onActivityToggle(activity.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold">{activity.name}</h5>
                          <Badge variant="outline" className="capitalize">{activity.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {activity.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${activity.price}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {activity.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};