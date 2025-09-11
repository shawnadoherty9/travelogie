import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { activityCategories, getActivitiesByCategory, type ActivityCategory } from '@/data/cityActivities';

interface ActivityCategorySelectorProps {
  selectedCity: string;
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
}

export const ActivityCategorySelector: React.FC<ActivityCategorySelectorProps> = ({
  selectedCity,
  selectedCategories,
  onCategoryToggle
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Activity Categories</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {activityCategories.map((category: ActivityCategory) => {
          const activitiesCount = getActivitiesByCategory(selectedCity, category.id).length;
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
              } ${activitiesCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => activitiesCount > 0 && onCategoryToggle(category.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <h4 className="font-medium mb-1">{category.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                <Badge variant="outline" className="text-xs">
                  {activitiesCount} {activitiesCount === 1 ? 'activity' : 'activities'}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};