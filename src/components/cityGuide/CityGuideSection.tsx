import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CityGuideSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const CityGuideSection = ({ title, children, icon, className }: CityGuideSectionProps) => {
  return (
    <Card className={cn("mb-8", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl text-travel-ocean">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};