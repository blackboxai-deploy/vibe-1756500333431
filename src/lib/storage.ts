import { AppData, UserData, Task, ShopItem } from '@/types';

const STORAGE_KEY = 'school_calendar_data';

// Default initial data
const getDefaultUserData = (): UserData => ({
  totalPoints: 0,
  availablePoints: 0,
  completedTasks: 0,
  currentStreak: 0,
  longestStreak: 0,
  purchasedItems: [],
  achievements: [],
  joinedDate: new Date(),
});

const getDefaultShopItems = (): ShopItem[] => [
  {
    id: 'theme-ocean',
    name: 'Ocean Theme',
    description: 'Calming blue ocean theme for your calendar',
    price: 50,
    category: 'theme',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6fa3d3d8-e637-427b-b58c-8e6dc00026b8.png',
    purchased: false,
    unlocked: true,
  },
  {
    id: 'theme-forest',
    name: 'Forest Theme',
    description: 'Nature-inspired green forest theme',
    price: 50,
    category: 'theme',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/674ca191-b60b-4731-a355-82776e2da3a2.png',
    purchased: false,
    unlocked: true,
  },
  {
    id: 'avatar-student',
    name: 'Student Avatar',
    description: 'Classic student character avatar',
    price: 30,
    category: 'avatar',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/44f8522d-7b0d-487b-aeff-806b92b21f8b.png',
    purchased: false,
    unlocked: true,
  },
  {
    id: 'avatar-scientist',
    name: 'Scientist Avatar',
    description: 'Lab coat wearing scientist avatar',
    price: 35,
    category: 'avatar',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/aafe1f2b-c0a0-4711-8f46-fdf6dfc8b730.png',
    purchased: false,
    unlocked: false,
  },
  {
    id: 'tool-calculator',
    name: 'Golden Calculator',
    description: 'Special calculator tool for math tasks',
    price: 75,
    category: 'tool',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4ea39e9d-560f-4c74-8b17-5ce018f19762.png',
    purchased: false,
    unlocked: false,
  },
  {
    id: 'badge-achiever',
    name: 'High Achiever Badge',
    description: 'Badge for completing 50 tasks',
    price: 100,
    category: 'badge',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c5f4090c-cccf-46fc-ab3c-4636bc33ed40.png',
    purchased: false,
    unlocked: false,
  },
  {
    id: 'decoration-plant',
    name: 'Study Plant',
    description: 'Virtual plant decoration for your desk',
    price: 25,
    category: 'decoration',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4b6e901e-3081-4bbc-80d7-711cc37cfd3a.png',
    purchased: false,
    unlocked: true,
  },
  {
    id: 'decoration-trophy',
    name: 'Golden Trophy',
    description: 'Trophy decoration for your achievements',
    price: 80,
    category: 'decoration',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9d7c5a40-de90-4bf6-9c77-56933fb40b1e.png',
    purchased: false,
    unlocked: false,
  },
];

const getDefaultTasks = (): Task[] => [
  {
    id: 'task-1',
    title: 'Learn Multiplication Tables',
    description: 'Practice multiplication tables 1-12 and complete the worksheet',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7d65d717-4554-4673-a7d8-6979257e16e5.png',
    points: 15,
    completed: false,
    category: 'lesson',
    createdAt: new Date(),
  },
  {
    id: 'task-2',
    title: 'Read Chapter 5: Ecosystems',
    description: 'Read and summarize the ecosystems chapter in your science book',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fe9bc173-012a-4eb7-a9b1-69f9b285574f.png',
    points: 20,
    completed: false,
    category: 'homework',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    createdAt: new Date(),
  },
];

export const loadAppData = (): AppData => {
  if (typeof window === 'undefined') {
    return {
      userData: getDefaultUserData(),
      tasks: [],
      shopItems: getDefaultShopItems(),
      monthlyData: [],
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const defaultData: AppData = {
        userData: getDefaultUserData(),
        tasks: getDefaultTasks(),
        shopItems: getDefaultShopItems(),
        monthlyData: [],
      };
      saveAppData(defaultData);
      return defaultData;
    }

    const parsed = JSON.parse(stored);
    
    // Ensure all required fields exist (migration logic)
    return {
      userData: { ...getDefaultUserData(), ...parsed.userData },
      tasks: parsed.tasks || getDefaultTasks(),
      shopItems: parsed.shopItems || getDefaultShopItems(),
      monthlyData: parsed.monthlyData || [],
    };
  } catch (error) {
    console.error('Error loading app data:', error);
    return {
      userData: getDefaultUserData(),
      tasks: getDefaultTasks(),
      shopItems: getDefaultShopItems(),
      monthlyData: [],
    };
  }
};

export const saveAppData = (data: AppData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving app data:', error);
  }
};

export const addTask = (task: Omit<Task, 'id' | 'createdAt'>): void => {
  const data = loadAppData();
  const newTask: Task = {
    ...task,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
  };
  
  data.tasks.push(newTask);
  saveAppData(data);
};

export const completeTask = (taskId: string): void => {
  const data = loadAppData();
  const task = data.tasks.find(t => t.id === taskId);
  
  if (task && !task.completed) {
    task.completed = true;
    data.userData.completedTasks += 1;
    data.userData.totalPoints += task.points;
    data.userData.availablePoints += task.points;
    
    // Update streak logic
    data.userData.currentStreak += 1;
    if (data.userData.currentStreak > data.userData.longestStreak) {
      data.userData.longestStreak = data.userData.currentStreak;
    }
    
    saveAppData(data);
  }
};

export const purchaseItem = (itemId: string): boolean => {
  const data = loadAppData();
  const item = data.shopItems.find(i => i.id === itemId);
  
  if (item && !item.purchased && data.userData.availablePoints >= item.price) {
    item.purchased = true;
    data.userData.availablePoints -= item.price;
    data.userData.purchasedItems.push(itemId);
    saveAppData(data);
    return true;
  }
  
  return false;
};

export const getTasksByMonth = (month: number, year: number): Task[] => {
  const data = loadAppData();
  return data.tasks.filter(task => task.month === month && task.year === year);
};

export const getMonthlyStats = (month: number, year: number) => {
  const tasks = getTasksByMonth(month, year);
  const completedTasks = tasks.filter(task => task.completed);
  const totalPoints = completedTasks.reduce((sum, task) => sum + task.points, 0);
  
  return {
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    completionRate: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
    pointsEarned: totalPoints,
  };
};