import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

interface PersonalizedTourFormProps {
  location: string;
  interests: string;
  onLocationChange: (value: string) => void;
  onInterestsChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export const PersonalizedTourForm = ({
  location,
  interests,
  onLocationChange,
  onInterestsChange,
  onSubmit,
  isLoading = false
}: PersonalizedTourFormProps) => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <Sparkles className="w-8 h-8 text-travel-sunset mx-auto mb-3" />
          <h3 className="text-2xl font-bold mb-2">Create Your Perfect Tour</h3>
          <p className="text-muted-foreground">
            Tell us about your dream destination and what excites you most about travel
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="location" className="text-base font-medium">
              Where would you like to explore?
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="e.g., Tokyo, Paris, Mumbai, Bangkok..."
              className="mt-2"
            />
          </div>
          
          <div>
            <Label htmlFor="interests" className="text-base font-medium">
              What interests you most?
            </Label>
            <Textarea
              id="interests"
              value={interests}
              onChange={(e) => onInterestsChange(e.target.value)}
              placeholder="e.g., traditional cooking, historical sites, local markets, street art, music culture..."
              className="mt-2 min-h-[100px]"
            />
          </div>
          
          <Button 
            onClick={onSubmit}
            disabled={!location || !interests || isLoading}
            className="w-full bg-gradient-wanderlust hover:opacity-90 text-lg py-6"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Creating Your Tour...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate My Personalized Tour
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};