'use client';

import { useState, useEffect } from 'react';
import { Calendar, BookOpen, Target, ShoppingBag, User, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loadAppData, getTasksByMonth, getMonthlyStats, completeTask } from '@/lib/storage';
import { Task, UserData, MONTHS, TASK_CATEGORIES } from '@/types';
import Link from 'next/link';

export default function HomePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentMonthTasks, setCurrentMonthTasks] = useState<Task[]>([]);
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const data = loadAppData();
    setUserData(data.userData);
    setCurrentMonthTasks(getTasksByMonth(currentMonth, currentYear));
  }, [currentMonth, currentYear]);

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
    const data = loadAppData();
    setUserData(data.userData);
    setCurrentMonthTasks(getTasksByMonth(currentMonth, currentYear));
  };

  const monthStats = getMonthlyStats(currentMonth, currentYear);

  if (!userData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">School Calendar</h1>
                <p className="text-sm text-gray-500">Learn & Earn Points</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
                <Target className="w-4 h-4 text-yellow-600" />
                <span className="font-semibold text-yellow-800">{userData.availablePoints} Points</span>
              </div>
              
              <nav className="hidden md:flex items-center space-x-2">
                <Link href="/tasks">
                  <Button variant="ghost" size="sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Tasks
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="ghost" size="sm">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Shop
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600">
            Ready to learn and earn points in {MONTHS[currentMonth - 1]} {currentYear}?
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Points</p>
                  <p className="text-2xl font-bold text-indigo-600">{userData.totalPoints}</p>
                </div>
                <Target className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed Tasks</p>
                  <p className="text-2xl font-bold text-green-600">{userData.completedTasks}</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Current Streak</p>
                  <p className="text-2xl font-bold text-orange-600">{userData.currentStreak}</p>
                </div>
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🔥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">This Month</p>
                  <p className="text-2xl font-bold text-purple-600">{monthStats.completionRate}%</p>
                </div>
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Month Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{MONTHS[currentMonth - 1]} Progress</span>
              <Badge variant="secondary">{monthStats.completedTasks}/{monthStats.totalTasks} Tasks</Badge>
            </CardTitle>
            <CardDescription>
              Your learning progress for this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completion Rate</span>
                  <span>{monthStats.completionRate}%</span>
                </div>
                <Progress value={monthStats.completionRate} className="h-2" />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Points Earned This Month: {monthStats.pointsEarned}</span>
                <span>Tasks Remaining: {monthStats.totalTasks - monthStats.completedTasks}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Month Tasks */}
        <Tabs defaultValue="pending" className="mb-8">
          <TabsList>
            <TabsTrigger value="pending">Pending Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMonthTasks.filter(task => !task.completed).map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onComplete={() => handleCompleteTask(task.id)} 
                />
              ))}
              {currentMonthTasks.filter(task => !task.completed).length === 0 && (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All tasks completed!</h3>
                  <p className="text-gray-500 mb-4">Great job! You've finished all tasks for this month.</p>
                  <Link href="/tasks">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Task
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMonthTasks.filter(task => task.completed).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMonthTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onComplete={!task.completed ? () => handleCompleteTask(task.id) : undefined}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/tasks">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-5 h-5 mr-2" />
              Add New Task
            </Button>
          </Link>
          <Link href="/shop">
            <Button size="lg" variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Visit Shop
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onComplete?: () => void;
}

function TaskCard({ task, onComplete }: TaskCardProps) {
  const categoryInfo = TASK_CATEGORIES[task.category];
  
  return (
    <Card className={`${task.completed ? 'opacity-75 bg-gray-50' : 'hover:shadow-md'} transition-all duration-200`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={`${categoryInfo.color} text-white`}>
              {categoryInfo.label}
            </Badge>
            <Badge variant="secondary">+{task.points} pts</Badge>
          </div>
          {task.completed && (
            <div className="text-green-600 font-semibold text-sm">✓ Completed</div>
          )}
        </div>
        <CardTitle className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {task.imageUrl && (
          <div className="mb-4">
            <img
              src={task.imageUrl}
              alt={task.title}
              className="w-full h-40 object-cover rounded-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8b5d8f9d-43ee-4f5e-9491-5a69ae7f84ee.png';
              }}
            />
          </div>
        )}
        <p className="text-sm text-gray-600 mb-4">{task.description}</p>
        
        {task.dueDate && (
          <p className="text-xs text-gray-500 mb-3">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
        
        {onComplete && (
          <Button 
            onClick={onComplete} 
            className="w-full bg-green-600 hover:bg-green-700"
            size="sm"
          >
            Mark Complete (+{task.points} points)
          </Button>
        )}
      </CardContent>
    </Card>
  );
}