import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Crown, Trophy, Medal, Star, Zap } from "lucide-react";

interface CompactPassportRewardsProps {
  totalPoints?: number;
  recentStamps?: number;
}

export const CompactPassportRewards: React.FC<CompactPassportRewardsProps> = ({ 
  totalPoints = 1250, 
  recentStamps = 8 
}) => {
  const getRankTitle = (points: number) => {
    if (points >= 2000) return { title: 'Master Explorer', icon: <Crown className="w-4 h-4" />, color: 'text-yellow-600' };
    if (points >= 1500) return { title: 'Expert Traveler', icon: <Trophy className="w-4 h-4" />, color: 'text-purple-600' };
    if (points >= 1000) return { title: 'Seasoned Adventurer', icon: <Medal className="w-4 h-4" />, color: 'text-blue-600' };
    if (points >= 500) return { title: 'Rising Explorer', icon: <Star className="w-4 h-4" />, color: 'text-green-600' };
    return { title: 'New Traveler', icon: <Zap className="w-4 h-4" />, color: 'text-gray-600' };
  };

  const currentRank = getRankTitle(totalPoints);
  const progressPercentage = (totalPoints / 2000) * 100;

  const recentStampsData = [
    { country: 'Japan', stamp: '🗾' },
    { country: 'Spain', stamp: '🏛️' },
    { country: 'Indonesia', stamp: '🏄‍♂️' },
    { country: 'France', stamp: '🗼' }
  ];

  return (
    <Card className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="w-5 h-5" />
          Travel Passport
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentRank.icon}
            <span className="text-sm font-medium">{currentRank.title}</span>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">{totalPoints}</p>
            <p className="text-xs opacity-80">Points</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress to Master</span>
            <span>{totalPoints}/2000</span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
        </div>

        <div>
          <p className="text-xs opacity-80 mb-2">Recent Stamps</p>
          <div className="flex gap-2">
            {recentStampsData.map((stamp, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-lg">{stamp.stamp}</div>
                <p className="text-xs opacity-70">{stamp.country}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};