import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar } from "lucide-react";

interface TourModeSelectionProps {
  selectedMode: 'personalized' | 'preorganized' | null;
  onSelectMode: (mode: 'personalized' | 'preorganized') => void;
}

export const TourModeSelection = ({ selectedMode, onSelectMode }: TourModeSelectionProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Choose Your Adventure Style</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:travel-shadow ${
              selectedMode === 'personalized' ? 'ring-2 ring-primary' : ''
            }`} 
            onClick={() => onSelectMode('personalized')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-travel-sunset" />
                Personalized Tours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Let our AI agent create a unique experience tailored to your interests, 
                schedule, and preferences. Perfect for travelers seeking authentic, 
                off-the-beaten-path adventures.
              </p>
              <Badge variant="secondary">AI-Powered Customization</Badge>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-300 hover:travel-shadow ${
              selectedMode === 'preorganized' ? 'ring-2 ring-primary' : ''
            }`} 
            onClick={() => onSelectMode('preorganized')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-travel-ocean" />
                Pre-Organized Tours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Browse curated experiences created by local experts. 
                Ready-to-book tours with set itineraries, perfect for 
                travelers who prefer structured adventures.
              </p>
              <Badge variant="outline">Expert-Curated</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};