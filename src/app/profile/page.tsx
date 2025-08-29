'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, User, Trophy, Target, Calendar, Star, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { loadAppData } from '@/lib/storage';
import { UserData, ShopItem, Task, TASK_CATEGORIES, MONTHS } from '@/types';

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<ShopItem[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);

  useEffect(() => {
    const data = loadAppData();
    setUserData(data.userData);
    
    // Get purchased items
    const purchased = data.shopItems.filter(item => item.purchased);
    setPurchasedItems(purchased);
    
    // Get recent completed tasks (last 5)
    const recent = data.tasks
      .filter(task => task.completed)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    setRecentTasks(recent);
    
    // Calculate monthly statistics
    const stats = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      const monthTasks = data.tasks.filter(task => task.month === month && task.year === year);
      const completedTasks = monthTasks.filter(task => task.completed);
      
      stats.push({
        month: MONTHS[month - 1],
        year,
        totalTasks: monthTasks.length,
        completedTasks: completedTasks.length,
        points: completedTasks.reduce((sum, task) => sum + task.points, 0),
        completionRate: monthTasks.length > 0 ? Math.round((completedTasks.length / monthTasks.length) * 100) : 0,
      });
    }
    setMonthlyStats(stats);
  }, []);

  if (!userData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const memberSince = new Date(userData.joinedDate).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
                <p className="text-sm text-gray-500">Track your learning journey and achievements</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <div className="bg-white/20 p-4 rounded-full">
                <User className="w-12 h-12" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">Learning Champion! 🌟</h2>
                <p className="text-lg opacity-90 mb-4">
                  Member since {memberSince}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/10 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">{userData.totalPoints}</p>
                    <p className="text-sm opacity-90">Total Points</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">{userData.completedTasks}</p>
                    <p className="text-sm opacity-90">Tasks Done</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">{userData.currentStreak}</p>
                    <p className="text-sm opacity-90">Current Streak</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">{userData.longestStreak}</p>
                    <p className="text-sm opacity-90">Best Streak</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Your latest completed tasks</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTasks.length > 0 ? (
                  <div className="space-y-4">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-full ${TASK_CATEGORIES[task.category].color}`}>
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-gray-500">
                            {MONTHS[task.month - 1]} {task.year} • {TASK_CATEGORIES[task.category].label}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          +{task.points} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No completed tasks yet. Start learning to see your achievements here!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Monthly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Monthly Progress
                </CardTitle>
                <CardDescription>Your learning progress over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyStats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {stat.month} {stat.year}
                        </span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            {stat.completedTasks}/{stat.totalTasks} tasks
                          </span>
                          <Badge variant="secondary">
                            {stat.points} pts
                          </Badge>
                        </div>
                      </div>
                      <Progress value={stat.completionRate} className="h-2" />
                      <p className="text-xs text-gray-500 text-right">
                        {stat.completionRate}% completion
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Achievement Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Achievement Badges
                </CardTitle>
                <CardDescription>Unlock badges by reaching milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg text-center ${
                    userData.completedTasks >= 5 ? 'bg-yellow-100 border-yellow-200' : 'bg-gray-100 border-gray-200'
                  } border-2`}>
                    <div className="text-2xl mb-2">🌟</div>
                    <p className="text-xs font-medium">First Steps</p>
                    <p className="text-xs text-gray-500">Complete 5 tasks</p>
                    {userData.completedTasks >= 5 && (
                      <Badge className="mt-2 bg-yellow-600">Earned!</Badge>
                    )}
                  </div>

                  <div className={`p-4 rounded-lg text-center ${
                    userData.completedTasks >= 25 ? 'bg-blue-100 border-blue-200' : 'bg-gray-100 border-gray-200'
                  } border-2`}>
                    <div className="text-2xl mb-2">🚀</div>
                    <p className="text-xs font-medium">Rising Star</p>
                    <p className="text-xs text-gray-500">Complete 25 tasks</p>
                    {userData.completedTasks >= 25 && (
                      <Badge className="mt-2 bg-blue-600">Earned!</Badge>
                    )}
                  </div>

                  <div className={`p-4 rounded-lg text-center ${
                    userData.currentStreak >= 7 ? 'bg-orange-100 border-orange-200' : 'bg-gray-100 border-gray-200'
                  } border-2`}>
                    <div className="text-2xl mb-2">🔥</div>
                    <p className="text-xs font-medium">On Fire</p>
                    <p className="text-xs text-gray-500">7 day streak</p>
                    {userData.currentStreak >= 7 && (
                      <Badge className="mt-2 bg-orange-600">Earned!</Badge>
                    )}
                  </div>

                  <div className={`p-4 rounded-lg text-center ${
                    userData.totalPoints >= 500 ? 'bg-purple-100 border-purple-200' : 'bg-gray-100 border-gray-200'
                  } border-2`}>
                    <div className="text-2xl mb-2">💎</div>
                    <p className="text-xs font-medium">Point Master</p>
                    <p className="text-xs text-gray-500">Earn 500 points</p>
                    {userData.totalPoints >= 500 && (
                      <Badge className="mt-2 bg-purple-600">Earned!</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owned Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Your Collection
                </CardTitle>
                <CardDescription>Items you've purchased from the shop</CardDescription>
              </CardHeader>
              <CardContent>
                {purchasedItems.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {purchasedItems.map((item) => (
                      <div key={item.id} className="text-center p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 mx-auto mb-2 rounded object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bc6737d2-6729-4e46-88b4-141f7662c923.png';
                          }}
                        />
                        <p className="text-xs font-medium truncate">{item.name}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8 text-sm">
                    No items purchased yet. Visit the shop to get your first reward!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Available Points:</span>
                    <span className="font-medium">{userData.availablePoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Items Owned:</span>
                    <span className="font-medium">{purchasedItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Best Month:</span>
                    <span className="font-medium">
                      {monthlyStats.length > 0 
                        ? monthlyStats.reduce((best, current) => 
                            current.points > best.points ? current : best
                          ).month || 'N/A'
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}