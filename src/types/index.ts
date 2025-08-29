export interface Task {
  id: string;
  title: string;
  description: string;
  month: number; // 1-12
  year: number;
  imageUrl?: string;
  points: number;
  completed: boolean;
  category: 'lesson' | 'homework' | 'project' | 'exam' | 'activity';
  dueDate?: Date;
  createdAt: Date;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'theme' | 'avatar' | 'tool' | 'badge' | 'decoration';
  imageUrl: string;
  purchased: boolean;
  unlocked: boolean;
}

export interface UserData {
  totalPoints: number;
  availablePoints: number;
  completedTasks: number;
  currentStreak: number;
  longestStreak: number;
  purchasedItems: string[];
  achievements: Achievement[];
  joinedDate: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  points: number;
}

export interface MonthData {
  month: number;
  year: number;
  theme?: string;
  lessonTitle?: string;
  lessonDescription?: string;
  tasks: Task[];
}

export interface AppData {
  userData: UserData;
  tasks: Task[];
  shopItems: ShopItem[];
  monthlyData: MonthData[];
}

export const TASK_CATEGORIES = {
  lesson: { label: 'Lesson', color: 'bg-blue-500', points: 10 },
  homework: { label: 'Homework', color: 'bg-green-500', points: 15 },
  project: { label: 'Project', color: 'bg-purple-500', points: 25 },
  exam: { label: 'Exam', color: 'bg-red-500', points: 30 },
  activity: { label: 'Activity', color: 'bg-orange-500', points: 12 },
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];