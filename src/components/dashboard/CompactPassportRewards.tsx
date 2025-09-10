import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Crown, Trophy, Medal, Star, Zap, MapPin } from "lucide-react";

interface CompactPassportRewardsProps {
  totalPoints?: number;
  recentStamps?: number;
}

export const CompactPassportRewards: React.FC<CompactPassportRewardsProps> = ({ 
  totalPoints = 1800, 
  recentStamps = 8 
}) => {
  const getRankTitle = (points: number) => {
    if (points >= 2000) return { title: 'Master Explorer', icon: <Crown className="w-5 h-5" />, color: 'text-yellow-400' };
    if (points >= 1500) return { title: 'Expert Traveler', icon: <Trophy className="w-5 h-5" />, color: 'text-purple-400' };
    if (points >= 1000) return { title: 'Seasoned Adventurer', icon: <Medal className="w-5 h-5" />, color: 'text-blue-400' };
    if (points >= 500) return { title: 'Rising Explorer', icon: <Star className="w-5 h-5" />, color: 'text-green-400' };
    return { title: 'New Traveler', icon: <Zap className="w-5 h-5" />, color: 'text-gray-400' };
  };

  const currentRank = getRankTitle(totalPoints);
  const progressPercentage = (totalPoints / 2000) * 100;

  const passportStamps = [
    { country: 'Japan', city: 'Tokyo', stamp: '🗾', date: '4/14/2023' },
    { country: 'Spain', city: 'Barcelona', stamp: '🏛️', date: '7/21/2023' },
    { country: 'Indonesia', city: 'Bali', stamp: '🏄‍♂️', date: '11/7/2023' },
    { country: 'France', city: 'Paris', stamp: '🗼', date: '9/13/2022' },
    { country: 'Morocco', city: 'Marrakech', stamp: '🕌', date: '1/29/2023' },
    { country: 'Turkey', city: 'Istanbul', stamp: '🏺', date: '12/4/2022' }
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="w-6 h-6" />
            Travel Passport
          </CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold">{totalPoints}</p>
            <p className="text-xs opacity-80">Total Points</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {currentRank.icon}
          <span className="text-sm font-medium">{currentRank.title}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs opacity-90">
            <span>Progress to Master Explorer</span>
            <span>{totalPoints}/2000</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-white/20" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Passport Stamps</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {passportStamps.slice(0, 6).map((stamp, index) => (
              <div 
                key={index} 
                className="relative p-2 bg-white/10 rounded border border-white/20 text-center group hover:bg-white/20 transition-colors"
                style={{
                  background: `linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), 
                             linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%)`,
                  backgroundSize: '8px 8px'
                }}
              >
                <div className="text-lg mb-1">{stamp.stamp}</div>
                <p className="text-xs font-medium">{stamp.country}</p>
                <p className="text-xs opacity-70">{stamp.city}</p>
                <p className="text-xs opacity-60 mt-1">{stamp.date}</p>
                
                {/* Stamp effect */}
                <div className="absolute top-1 right-1 w-2 h-2 border border-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};