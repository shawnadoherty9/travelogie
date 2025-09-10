import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  MapPin, 
  Star, 
  Globe, 
  Camera, 
  Utensils, 
  Mountain, 
  Waves,
  Trophy,
  Crown,
  Medal,
  Zap
} from "lucide-react";

interface VisitedPlace {
  id: string;
  place_name: string;
  country: string;
  coordinates: [number, number];
  visit_date: string;
  notes?: string;
}

interface PassportRewardsProps {
  visitedPlaces: VisitedPlace[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  unlocked: boolean;
  category: 'travel' | 'culture' | 'adventure' | 'social';
}

interface Stamp {
  id: string;
  country: string;
  place: string;
  date: string;
  category: string;
  stamp: string;
}

export const PassportRewards: React.FC<PassportRewardsProps> = ({ visitedPlaces }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock stamps for passport book effect
  const passportStamps: Stamp[] = [
    { id: '1', country: 'Japan', place: 'Tokyo', date: '2023-04-15', category: 'culture', stamp: '🗾' },
    { id: '2', country: 'Spain', place: 'Barcelona', date: '2023-07-22', category: 'culture', stamp: '🏛️' },
    { id: '3', country: 'Indonesia', place: 'Bali', date: '2023-11-08', category: 'adventure', stamp: '🏄‍♂️' },
    { id: '4', country: 'France', place: 'Paris', date: '2022-09-14', category: 'culture', stamp: '🗼' },
    { id: '5', country: 'Morocco', place: 'Marrakech', date: '2023-01-30', category: 'culture', stamp: '🕌' },
    { id: '6', country: 'Turkey', place: 'Istanbul', date: '2022-12-05', category: 'culture', stamp: '🏺' },
    { id: '7', country: 'India', place: 'Varanasi', date: '2023-02-18', category: 'culture', stamp: '🛕' },
    { id: '8', country: 'Iceland', place: 'Reykjavik', date: '2023-09-12', category: 'adventure', stamp: '🌋' }
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Globe Trotter',
      description: 'Visit 5 different countries',
      icon: <Globe className="w-6 h-6" />,
      points: 500,
      unlocked: passportStamps.length >= 5,
      category: 'travel'
    },
    {
      id: '2',
      title: 'Culture Enthusiast',
      description: 'Experience 10 cultural activities',
      icon: <Star className="w-6 h-6" />,
      points: 300,
      unlocked: passportStamps.filter(s => s.category === 'culture').length >= 6,
      category: 'culture'
    },
    {
      id: '3',
      title: 'Adventure Seeker',
      description: 'Complete 5 adventure activities',
      icon: <Mountain className="w-6 h-6" />,
      points: 400,
      unlocked: passportStamps.filter(s => s.category === 'adventure').length >= 2,
      category: 'adventure'
    },
    {
      id: '4',
      title: 'Photo Master',
      description: 'Share 50 travel photos',
      icon: <Camera className="w-6 h-6" />,
      points: 200,
      unlocked: false,
      category: 'social'
    },
    {
      id: '5',
      title: 'Foodie Explorer',
      description: 'Try local cuisine in 8 destinations',
      icon: <Utensils className="w-6 h-6" />,
      points: 350,
      unlocked: passportStamps.length >= 8,
      category: 'culture'
    },
    {
      id: '6',
      title: 'Ocean Explorer',
      description: 'Visit 3 coastal destinations',
      icon: <Waves className="w-6 h-6" />,
      points: 250,
      unlocked: true,
      category: 'adventure'
    }
  ];

  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const totalPossiblePoints = achievements.reduce((sum, a) => sum + a.points, 0);
  const progressPercentage = (totalPoints / totalPossiblePoints) * 100;

  const getRankTitle = (points: number) => {
    if (points >= 2000) return { title: 'Master Explorer', icon: <Crown className="w-5 h-5" />, color: 'text-yellow-600' };
    if (points >= 1500) return { title: 'Expert Traveler', icon: <Trophy className="w-5 h-5" />, color: 'text-purple-600' };
    if (points >= 1000) return { title: 'Seasoned Adventurer', icon: <Medal className="w-5 h-5" />, color: 'text-blue-600' };
    if (points >= 500) return { title: 'Rising Explorer', icon: <Star className="w-5 h-5" />, color: 'text-green-600' };
    return { title: 'New Traveler', icon: <Zap className="w-5 h-5" />, color: 'text-gray-600' };
  };

  const currentRank = getRankTitle(totalPoints);

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Passport Header */}
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Travel Passport</h2>
                <div className="flex items-center gap-2">
                  {currentRank.icon}
                  <span className="text-lg">{currentRank.title}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{totalPoints}</p>
              <p className="text-sm opacity-80">Total Points</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Master Explorer</span>
              <span>{totalPoints}/2000</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Passport Stamps */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Passport Stamps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {passportStamps.map((stamp, index) => (
                <div 
                  key={stamp.id} 
                  className="relative group p-4 border-2 border-dashed border-muted rounded-lg hover:border-primary transition-colors cursor-pointer"
                  style={{
                    background: `linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), 
                               linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), 
                               linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), 
                               linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                  }}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{stamp.stamp}</div>
                    <p className="font-bold text-sm">{stamp.country}</p>
                    <p className="text-xs text-muted-foreground">{stamp.place}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(stamp.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Stamp effect overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-2 right-2 w-4 h-4 border-2 border-red-500 rounded-full"></div>
                    <div className="absolute bottom-2 left-2 text-xs font-bold text-red-600 transform -rotate-12">
                      VISITED
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Empty slots for future stamps */}
              {Array.from({ length: 4 }, (_, i) => (
                <div 
                  key={`empty-${i}`} 
                  className="p-4 border-2 border-dashed border-muted/50 rounded-lg opacity-50"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2 opacity-30">🌍</div>
                    <p className="text-xs text-muted-foreground">Future Adventure</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Achievements
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Button 
                variant={selectedCategory === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              <Button 
                variant={selectedCategory === 'travel' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedCategory('travel')}
              >
                Travel
              </Button>
              <Button 
                variant={selectedCategory === 'culture' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedCategory('culture')}
              >
                Culture
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredAchievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`p-3 border rounded-lg transition-all ${
                    achievement.unlocked 
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
                      : 'bg-muted/50 border-muted'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      achievement.unlocked 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge 
                          variant={achievement.unlocked ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {achievement.points} pts
                        </Badge>
                        {achievement.unlocked && (
                          <span className="text-xs text-green-600 font-medium">✓ Unlocked</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};