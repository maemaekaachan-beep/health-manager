import type { MealEntry, SleepEntry, WeightEntry, StepEntry, BowelEntry, Profile } from '../types';
import type { CustomFoodItem } from '../data/foodDatabase';

export const BACKUP_VERSION = 3;

export interface BackupData {
  version: number;
  exportedAt: string;
  meals: MealEntry[];
  sleepEntries: SleepEntry[];
  weightEntries: WeightEntry[];
  stepEntries: StepEntry[];
  bowelEntries: BowelEntry[];
  customFoods: CustomFoodItem[];
  profile: Profile;
}

export function exportBackup(data: Omit<BackupData, 'version' | 'exportedAt'>) {
  const backup: BackupData = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    ...data,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `health-backup-${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function parseBackupFile(file: File): Promise<BackupData> {
  const text = await file.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error('JSONファイルの形式が正しくありません');
  }

  if (!json || typeof json !== 'object') {
    throw new Error('バックアップファイルの形式が正しくありません');
  }

  const data = json as Record<string, unknown>;
  const isArray = (v: unknown): v is unknown[] => Array.isArray(v);

  if (
    !isArray(data.meals) ||
    !isArray(data.sleepEntries) ||
    !isArray(data.weightEntries) ||
    (data.stepEntries !== undefined && !isArray(data.stepEntries)) ||
    (data.customFoods !== undefined && !isArray(data.customFoods)) ||
    !isArray(data.bowelEntries) ||
    typeof data.profile !== 'object' ||
    data.profile === null
  ) {
    throw new Error('バックアップファイルの内容が正しくありません');
  }

  return {
    version: typeof data.version === 'number' ? data.version : 1,
    exportedAt: typeof data.exportedAt === 'string' ? data.exportedAt : '',
    meals: data.meals as MealEntry[],
    sleepEntries: data.sleepEntries as SleepEntry[],
    weightEntries: data.weightEntries as WeightEntry[],
    stepEntries: isArray(data.stepEntries) ? (data.stepEntries as StepEntry[]) : [],
    bowelEntries: data.bowelEntries as BowelEntry[],
    customFoods: isArray(data.customFoods) ? (data.customFoods as CustomFoodItem[]) : [],
    profile: data.profile as Profile,
  };
}
