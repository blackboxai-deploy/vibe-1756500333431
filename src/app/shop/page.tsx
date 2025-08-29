'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Star, Lock, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { loadAppData, purchaseItem } from '@/lib/storage';
import { ShopItem, UserData } from '@/types';

export default function ShopPage() {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const data = loadAppData();
    setShopItems(data.shopItems);
    setUserData(data.userData);
  }, []);

  const handlePurchase = (itemId: string) => {
    const success = purchaseItem(itemId);
    if (success) {
      const updatedData = loadAppData();
      setShopItems(updatedData.shopItems);
      setUserData(updatedData.userData);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Items', count: shopItems.length },
    { id: 'theme', label: 'Themes', count: shopItems.filter(i => i.category === 'theme').length },
    { id: 'avatar', label: 'Avatars', count: shopItems.filter(i => i.category === 'avatar').length },
    { id: 'tool', label: 'Tools', count: shopItems.filter(i => i.category === 'tool').length },
    { id: 'badge', label: 'Badges', count: shopItems.filter(i => i.category === 'badge').length },
    { id: 'decoration', label: 'Decorations', count: shopItems.filter(i => i.category === 'decoration').length },
  ];

  if (!userData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
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
                <h1 className="text-2xl font-bold text-gray-900">Reward Shop</h1>
                <p className="text-sm text-gray-500">Spend your earned points on amazing items</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-800">{userData.availablePoints} Points</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-600 p-3 rounded-full">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to the Reward Shop! 🛍️
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use your earned points to unlock amazing themes, avatars, tools, and decorations. 
            Keep completing tasks to earn more points!
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.label}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ShopItemCard 
              key={item.id} 
              item={item} 
              userPoints={userData.availablePoints}
              onPurchase={() => handlePurchase(item.id)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No items in this category</h3>
            <p className="text-gray-500">Check back later for new items!</p>
          </div>
        )}

        {/* How to Earn Points */}
        <Card className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-6 h-6 mr-2" />
              How to Earn More Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="font-semibold mb-2">Complete Lessons</h3>
                <p className="text-sm opacity-90">Earn 10 points for each lesson completed</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-semibold mb-2">Finish Homework</h3>
                <p className="text-sm opacity-90">Get 15 points for homework tasks</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold mb-2">Ace Exams</h3>
                <p className="text-sm opacity-90">Earn up to 30 points for exam preparation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

interface ShopItemCardProps {
  item: ShopItem;
  userPoints: number;
  onPurchase: () => void;
}

function ShopItemCard({ item, userPoints, onPurchase }: ShopItemCardProps) {
  const canPurchase = userPoints >= item.price && !item.purchased && item.unlocked;
  const canAfford = userPoints >= item.price;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'theme': return 'bg-blue-500';
      case 'avatar': return 'bg-green-500';
      case 'tool': return 'bg-purple-500';
      case 'badge': return 'bg-red-500';
      case 'decoration': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'theme': return '🎨';
      case 'avatar': return '👤';
      case 'tool': return '🛠️';
      case 'badge': return '🏆';
      case 'decoration': return '✨';
      default: return '📦';
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-200 ${
      item.purchased 
        ? 'bg-green-50 border-green-200' 
        : canPurchase 
          ? 'hover:shadow-lg cursor-pointer' 
          : 'opacity-60'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge className={`${getCategoryColor(item.category)} text-white`}>
            {getCategoryIcon(item.category)} {item.category}
          </Badge>
          {item.purchased && (
            <div className="bg-green-100 p-1 rounded-full">
              <Check className="w-4 h-4 text-green-600" />
            </div>
          )}
          {!item.unlocked && (
            <div className="bg-gray-100 p-1 rounded-full">
              <Lock className="w-4 h-4 text-gray-600" />
            </div>
          )}
        </div>
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <CardDescription className="text-sm">{item.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="mb-4">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-32 object-cover rounded-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1629a3ac-d788-455a-88ae-9d9ee70cdd54.png';
            }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-lg">{item.price}</span>
            <span className="text-sm text-gray-500">points</span>
          </div>
          
          {item.purchased ? (
            <Badge className="bg-green-600 text-white">Owned</Badge>
          ) : !item.unlocked ? (
            <Badge variant="secondary" className="bg-gray-200">
              <Lock className="w-3 h-3 mr-1" />
              Locked
            </Badge>
          ) : canAfford ? (
            <Button 
              onClick={onPurchase}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Buy Now
            </Button>
          ) : (
            <Badge variant="outline" className="border-red-300 text-red-600">
              Need {item.price - userPoints} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}