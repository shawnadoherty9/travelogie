import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Globe, Clock, DollarSign } from 'lucide-react';
import { TourGuide } from '@/data/tourGuides';

interface TourGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  guides: TourGuide[];
  selectedGuide: string | null;
  onSelectGuide: (guideId: string) => void;
  onConfirm: () => void;
  cityName: string;
}

export const TourGuideModal: React.FC<TourGuideModalProps> = ({
  isOpen,
  onClose,
  guides,
  selectedGuide,
  onSelectGuide,
  onConfirm,
  cityName
}) => {
  console.log('TourGuideModal render:', { isOpen, guidesCount: guides.length, cityName });
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Local Tour Guides in {cityName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Choose from our verified local guides who know {cityName} like the back of their hand.
          </p>
          
          <div className="grid gap-4">
            {guides.map((guide) => (
              <Card 
                key={guide.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedGuide === guide.id 
                    ? 'ring-2 ring-primary shadow-lg scale-[1.02]' 
                    : 'hover:scale-[1.01]'
                }`}
                onClick={() => onSelectGuide(guide.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20 border-2 border-background shadow-lg">
                        <AvatarImage src={guide.avatar} alt={guide.name} />
                        <AvatarFallback className="text-lg font-semibold">
                          {guide.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {selectedGuide === guide.id && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 fill-white text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-lg">{guide.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {guide.experience} experience
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{guide.rating}</span>
                            <span className="text-sm text-muted-foreground">({guide.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1 text-lg font-bold text-primary">
                            <DollarSign className="w-4 h-4" />
                            {guide.dailyRate}/day
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-3 leading-relaxed">
                        {guide.about}
                      </p>
                      
                      <div className="space-y-2">
                        <div>
                          <h5 className="font-medium text-sm mb-1">Specialties:</h5>
                          <div className="flex flex-wrap gap-1">
                            {guide.specialties.map(specialty => (
                              <Badge 
                                key={specialty} 
                                variant="secondary" 
                                className="text-xs px-2 py-1"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-sm mb-1">Languages:</h5>
                          <div className="flex flex-wrap gap-1">
                            {guide.languages.map(language => (
                              <Badge 
                                key={language} 
                                variant="outline" 
                                className="text-xs px-2 py-1 bg-blue-50 border-blue-200 text-blue-700"
                              >
                                <Globe className="w-3 h-3 mr-1" />
                                {language}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={onConfirm} 
              disabled={!selectedGuide}
              className="bg-gradient-wanderlust hover:opacity-90"
            >
              Continue with Selected Guide
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};