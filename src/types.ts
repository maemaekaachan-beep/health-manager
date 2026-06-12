export interface MealEntry {
  id: string;
  date: string;
  time: string;
  name: string;
  calories: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: 1 | 2 | 3 | 4 | 5;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  note?: string;
}

export type TabType = 'dashboard' | 'meal' | 'sleep' | 'weight';
