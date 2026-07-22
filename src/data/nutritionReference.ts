import type { NutrientKey, Profile } from '../types';

export const NUTRIENT_META: Record<NutrientKey, { label: string; unit: string }> = {
  protein: { label: 'たんぱく質', unit: 'g' },
  fat: { label: '脂質', unit: 'g' },
  carbs: { label: '炭水化物', unit: 'g' },
  calcium: { label: 'カルシウム', unit: 'mg' },
  iron: { label: '鉄', unit: 'mg' },
  vitaminA: { label: 'ビタミンA', unit: 'μg' },
  vitaminB1: { label: 'ビタミンB1', unit: 'mg' },
  vitaminB2: { label: 'ビタミンB2', unit: 'mg' },
  vitaminC: { label: 'ビタミンC', unit: 'mg' },
  vitaminE: { label: 'ビタミンE', unit: 'mg' },
  fiber: { label: '食物繊維', unit: 'g' },
  salt: { label: '塩分', unit: 'g' },
};

export const NUTRIENT_ORDER: NutrientKey[] = [
  'protein', 'fat', 'carbs',
  'calcium', 'iron',
  'vitaminA', 'vitaminB1', 'vitaminB2', 'vitaminC', 'vitaminE',
  'fiber', 'salt',
];

type Gender = 'male' | 'female';

type AgeBand = '18-29' | '30-49' | '50-64' | '65-74' | '75+';

function bandForAge(age: number): AgeBand {
  if (age < 30) return '18-29';
  if (age < 50) return '30-49';
  if (age < 65) return '50-64';
  if (age < 75) return '65-74';
  return '75+';
}

// 参考値: 厚生労働省「日本人の食事摂取基準（2020年版）」の推奨量・目安量・目標量をもとにした簡易目安。
// 個人の状態（妊娠・授乳・疾患等）は考慮していません。あくまで参考値です。
const ENERGY_KCAL: Record<AgeBand, Record<Gender, number>> = {
  '18-29': { male: 2650, female: 2000 },
  '30-49': { male: 2700, female: 2050 },
  '50-64': { male: 2600, female: 1950 },
  '65-74': { male: 2400, female: 1850 },
  '75+': { male: 2100, female: 1650 },
};

const PROTEIN_G: Record<AgeBand, Record<Gender, number>> = {
  '18-29': { male: 65, female: 50 },
  '30-49': { male: 65, female: 50 },
  '50-64': { male: 65, female: 50 },
  '65-74': { male: 60, female: 50 },
  '75+': { male: 60, female: 50 },
};

const CALCIUM_MG: Record<AgeBand, Record<Gender, number>> = {
  '18-29': { male: 800, female: 650 },
  '30-49': { male: 750, female: 650 },
  '50-64': { male: 750, female: 650 },
  '65-74': { male: 750, female: 650 },
  '75+': { male: 700, female: 600 },
};

const IRON_MG: Record<AgeBand, Record<Gender, number>> = {
  '18-29': { male: 7.5, female: 10.5 },
  '30-49': { male: 7.5, female: 10.5 },
  '50-64': { male: 7.5, female: 11.0 },
  '65-74': { male: 7.5, female: 6.0 },
  '75+': { male: 7.0, female: 6.0 },
};

const VITAMIN_A_UG: Record<AgeBand, Record<Gender, number>> = {
  '18-29': { male: 850, female: 650 },
  '30-49': { male: 900, female: 700 },
  '50-64': { male: 900, female: 700 },
  '65-74': { male: 850, female: 700 },
  '75+': { male: 800, female: 650 },
};

const VITAMIN_B1_MG: Record<AgeBand, Record<Gender, number>> = {
  '18-29': { male: 1.4, female: 1.1 },
  '30-49': { male: 1.4, female: 1.1 },
  '50-64': { male: 1.3, female: 1.1 },
  '65-74': { male: 1.3, female: 1.1 },
  '75+': { male: 1.2, female: 0.9 },
};

const VITAMIN_B2_MG: Record<AgeBand, Record<Gender, number>> = {
  '18-29': { male: 1.6, female: 1.2 },
  '30-49': { male: 1.6, female: 1.2 },
  '50-64': { male: 1.5, female: 1.2 },
  '65-74': { male: 1.5, female: 1.2 },
  '75+': { male: 1.3, female: 1.0 },
};

const VITAMIN_C_MG = 100; // 全年齢・性別共通

const VITAMIN_E_MG: Record<AgeBand, Record<Gender, number>> = {
  '18-29': { male: 6.0, female: 5.0 },
  '30-49': { male: 6.0, female: 5.5 },
  '50-64': { male: 7.0, female: 6.0 },
  '65-74': { male: 7.0, female: 6.5 },
  '75+': { male: 6.5, female: 6.5 },
};

const FIBER_G: Record<AgeBand, Record<Gender, number>> = {
  '18-29': { male: 21, female: 18 },
  '30-49': { male: 21, female: 18 },
  '50-64': { male: 21, female: 18 },
  '65-74': { male: 20, female: 17 },
  '75+': { male: 20, female: 17 },
};

const SALT_G: Record<Gender, number> = { male: 7.5, female: 6.5 };

export type TargetSpec =
  | { kind: 'target'; value: number }
  | { kind: 'range'; min: number; max: number }
  | { kind: 'upper'; value: number };

export type NutrientStatus = 'low' | 'good' | 'high';

export function getStatus(intake: number, spec: TargetSpec): NutrientStatus {
  if (spec.kind === 'target') {
    const ratio = intake / spec.value;
    if (ratio < 0.8) return 'low';
    if (ratio > 1.2) return 'high';
    return 'good';
  }
  if (spec.kind === 'range') {
    if (intake < spec.min) return 'low';
    if (intake > spec.max) return 'high';
    return 'good';
  }
  // upper: 目標量の上限。下回っている分には「不足」とはしない。
  return intake > spec.value ? 'high' : 'good';
}

export const STATUS_LABEL: Record<NutrientStatus, string> = {
  low: '不足',
  good: '適正',
  high: '過剰',
};

function averageOfGenders(getValue: (g: Gender) => number): number {
  return (getValue('male') + getValue('female')) / 2;
}

export function getNutrientTargets(profile: Profile): Record<NutrientKey, TargetSpec> | null {
  if (!profile.age || !profile.gender) return null;
  const band = bandForAge(profile.age);
  const gender: Gender = profile.gender === 'other' ? 'male' : profile.gender;
  const pick = (table: Record<AgeBand, Record<Gender, number>>) =>
    profile.gender === 'other'
      ? averageOfGenders(g => table[band][g])
      : table[band][gender];

  const energy = pick(ENERGY_KCAL);
  const fatMin = (energy * 0.20) / 9;
  const fatMax = (energy * 0.30) / 9;
  const carbsMin = (energy * 0.50) / 4;
  const carbsMax = (energy * 0.65) / 4;

  return {
    protein: { kind: 'target', value: pick(PROTEIN_G) },
    fat: { kind: 'range', min: fatMin, max: fatMax },
    carbs: { kind: 'range', min: carbsMin, max: carbsMax },
    calcium: { kind: 'target', value: pick(CALCIUM_MG) },
    iron: { kind: 'target', value: pick(IRON_MG) },
    vitaminA: { kind: 'target', value: pick(VITAMIN_A_UG) },
    vitaminB1: { kind: 'target', value: pick(VITAMIN_B1_MG) },
    vitaminB2: { kind: 'target', value: pick(VITAMIN_B2_MG) },
    vitaminC: { kind: 'target', value: VITAMIN_C_MG },
    vitaminE: { kind: 'target', value: pick(VITAMIN_E_MG) },
    fiber: { kind: 'target', value: pick(FIBER_G) },
    salt: { kind: 'upper', value: profile.gender === 'other' ? averageOfGenders(g => SALT_G[g]) : SALT_G[gender] },
  };
}
