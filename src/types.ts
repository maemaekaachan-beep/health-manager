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
  bodyFat?: number;
  note?: string;
}

export interface BowelEntry {
  id: string;
  date: string;
  time: string;
  bristol: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  amount: 'small' | 'medium' | 'large';
  count?: number;
  note?: string;
}

export type TabType = 'dashboard' | 'meal' | 'sleep' | 'weight' | 'bowel';
