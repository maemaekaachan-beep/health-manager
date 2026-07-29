import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Apple, Plus, Trash2, Pencil, X, AlertTriangle } from 'lucide-react';
import type { MealEntry, NutrientKey, NutrientValues, Profile } from '../types';
import type { CustomFoodItem } from '../data/foodDatabase';
import {
  NUTRIENT_META, NUTRIENT_ORDER, getNutrientTargets, getStatus, STATUS_LABEL,
  type TargetSpec, type NutrientStatus,
} from '../data/nutritionReference';

interface Props {
  entries: MealEntry[];
  profile: Profile;
  customFoods: CustomFoodItem[];
  onAddFood: (food: CustomFoodItem) => void;
  onUpdateFood: (food: CustomFoodItem) => void;
  onDeleteFood: (id: string) => void;
}

type ViewType = 'graph' | 'foods';

const EMPTY_FOOD_FORM = {
  name: '', unit: '', calories: '',
  protein: '', fat: '', carbs: '',
  calcium: '', iron: '',
  vitaminA: '', vitaminB1: '', vitaminB2: '', vitaminC: '', vitaminE: '',
  fiber: '', salt: '',
};

type FoodFormState = typeof EMPTY_FOOD_FORM;

function toNutrientValues(form: FoodFormState): NutrientValues {
  const result: NutrientValues = {};
  (Object.keys(NUTRIENT_META) as NutrientKey[]).forEach(key => {
    const raw = form[key];
    if (raw !== '') result[key] = Number(raw);
  });
  return result;
}

function formatTarget(spec: TargetSpec, unit: string): string {
  if (spec.kind === 'target') return `目安 ${round(spec.value)}${unit}`;
  if (spec.kind === 'range') return `目安 ${round(spec.min)}〜${round(spec.max)}${unit}`;
  return `${round(spec.value)}${unit}未満`;
}

function round(n: number): string {
  return Math.round(n * 100) / 100 + '';
}

function percentFill(intake: number, spec: TargetSpec): number {
  const denom = spec.kind === 'range' ? spec.max : spec.value;
  if (!denom) return 0;
  return Math.max(0, Math.min(100, (intake / denom) * 100));
}

const STATUS_CLASS: Record<NutrientStatus, string> = {
  low: 'status-pill--low',
  good: 'status-pill--good',
  high: 'status-pill--high',
};

export default function NutritionTracker({
  entries, profile, customFoods, onAddFood, onUpdateFood, onDeleteFood,
}: Props) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [view, setView] = useState<ViewType>('graph');
  const [date, setDate] = useState(today);
  const [foodForm, setFoodForm] = useState<FoodFormState>(EMPTY_FOOD_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const targets = getNutrientTargets(profile);

  const dayEntries = entries.filter(e => e.date === date && !e.skipped);

  const totals: Partial<Record<NutrientKey, { sum: number; hasData: boolean }>> = {};
  NUTRIENT_ORDER.forEach(key => {
    const values = dayEntries
      .map(e => e[key])
      .filter((v): v is number => v !== undefined);
    totals[key] = { sum: values.reduce((s, v) => s + v, 0), hasData: values.length > 0 };
  });

  const handleFoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodForm.name || !foodForm.unit || !foodForm.calories) return;
    const base = {
      name: foodForm.name,
      unit: foodForm.unit,
      calories: Number(foodForm.calories),
      ...toNutrientValues(foodForm),
    };
    if (editingId) {
      onUpdateFood({ id: editingId, ...base });
    } else {
      onAddFood({ id: crypto.randomUUID(), ...base });
    }
    setFoodForm(EMPTY_FOOD_FORM);
    setEditingId(null);
  };

  const startEdit = (food: CustomFoodItem) => {
    setEditingId(food.id);
    setFoodForm({
      name: food.name, unit: food.unit, calories: String(food.calories),
      protein: food.protein?.toString() ?? '',
      fat: food.fat?.toString() ?? '',
      carbs: food.carbs?.toString() ?? '',
      calcium: food.calcium?.toString() ?? '',
      iron: food.iron?.toString() ?? '',
      vitaminA: food.vitaminA?.toString() ?? '',
      vitaminB1: food.vitaminB1?.toString() ?? '',
      vitaminB2: food.vitaminB2?.toString() ?? '',
      vitaminC: food.vitaminC?.toString() ?? '',
      vitaminE: food.vitaminE?.toString() ?? '',
      fiber: food.fiber?.toString() ?? '',
      salt: food.salt?.toString() ?? '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFoodForm(EMPTY_FOOD_FORM);
  };

  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <Apple size={24} />
        <h2>栄養素</h2>
      </div>

      <div className="amount-selector">
        <button
          type="button"
          className={`amount-btn${view === 'graph' ? ' active' : ''}`}
          onClick={() => setView('graph')}
        >
          栄養グラフ
        </button>
        <button
          type="button"
          className={`amount-btn${view === 'foods' ? ' active' : ''}`}
          onClick={() => setView('foods')}
        >
          食品登録
        </button>
      </div>

      {view === 'graph' ? (
        <>
          <div className="entry-form">
            <div className="form-row">
              <div className="form-group">
                <label>日付</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <span className="today-label" style={{ alignSelf: 'center' }}>
                {format(new Date(date + 'T00:00:00'), 'M月d日 (E)', { locale: ja })} の摂取状況
              </span>
            </div>
          </div>

          {!targets ? (
            <div className="empty-state">
              <AlertTriangle size={16} style={{ marginBottom: 6 }} />
              <div>基準値を計算するには、プロフィールで性別・年齢を設定してください。</div>
            </div>
          ) : (
            <div className="nutrient-list">
              {NUTRIENT_ORDER.map(key => {
                const meta = NUTRIENT_META[key];
                const spec = targets[key];
                const total = totals[key]!;
                if (!total.hasData) {
                  return (
                    <div key={key} className="nutrient-row nutrient-row--empty">
                      <div className="nutrient-row-top">
                        <span className="nutrient-label">{meta.label}</span>
                        <span className="nutrient-nodata">データなし</span>
                      </div>
                      <div className="nutrient-meter-track">
                        <div className="nutrient-meter-fill nutrient-meter-fill--empty" style={{ width: '0%' }} />
                      </div>
                    </div>
                  );
                }
                const status = getStatus(total.sum, spec);
                return (
                  <div key={key} className="nutrient-row">
                    <div className="nutrient-row-top">
                      <span className="nutrient-label">{meta.label}</span>
                      <span className={`status-pill ${STATUS_CLASS[status]}`}>{STATUS_LABEL[status]}</span>
                    </div>
                    <div className="nutrient-meter-track">
                      <div
                        className={`nutrient-meter-fill nutrient-meter-fill--${status}`}
                        style={{ width: `${percentFill(total.sum, spec)}%` }}
                      />
                    </div>
                    <div className="nutrient-row-bottom">
                      <span>{round(total.sum)}{meta.unit} 摂取</span>
                      <span>{formatTarget(spec, meta.unit)}</span>
                    </div>
                  </div>
                );
              })}
              <p className="nutrition-disclaimer">
                基準値は厚生労働省「日本人の食事摂取基準」を参考にした簡易な目安です（プロフィールの性別・年齢から算出）。
                食品データに栄養素が未登録の場合、その栄養素の合計からは除外されます。
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <form onSubmit={handleFoodSubmit} className="entry-form">
            <div className="form-row">
              <div className="form-group flex-2">
                <label>食品名</label>
                <input
                  type="text"
                  placeholder="例: 鶏むね肉の蒸し鶏"
                  value={foodForm.name}
                  onChange={e => setFoodForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>単位</label>
                <input
                  type="text"
                  placeholder="100g"
                  value={foodForm.unit}
                  onChange={e => setFoodForm(prev => ({ ...prev, unit: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>カロリー (kcal)</label>
                <input
                  type="number"
                  placeholder="150"
                  min="0"
                  value={foodForm.calories}
                  onChange={e => setFoodForm(prev => ({ ...prev, calories: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-row">
              {NUTRIENT_ORDER.map(key => (
                <div className="form-group" key={key}>
                  <label>{NUTRIENT_META[key].label} ({NUTRIENT_META[key].unit}) 任意</label>
                  <input
                    type="number"
                    placeholder="未入力可"
                    step="0.01"
                    min="0"
                    value={foodForm[key]}
                    onChange={e => setFoodForm(prev => ({ ...prev, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>

            <div className="form-row">
              <button type="submit" className="btn-primary">
                <Plus size={18} /> {editingId ? '更新' : '登録'}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={cancelEdit}>
                  <X size={16} /> キャンセル
                </button>
              )}
            </div>
          </form>

          <div className="entries-list">
            {customFoods.length === 0 ? (
              <div className="empty-state">登録された食品がありません</div>
            ) : (
              customFoods.map(food => (
                <div key={food.id} className="entry-card">
                  <div className="entry-info">
                    <span className="entry-name">{food.name}</span>
                    <span className="entry-time">
                      {food.unit}・{food.calories} kcal
                      {NUTRIENT_ORDER.some(k => food[k] != null) && '・栄養素登録済み'}
                    </span>
                  </div>
                  <button className="btn-edit" onClick={() => startEdit(food)} aria-label="編集">
                    <Pencil size={16} />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDeleteFood(food.id)}
                    aria-label="削除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
          <p className="nutrition-disclaimer">
            ここで登録した食品は、食事記録の食品名検索の候補に表示され、選択するとカロリーと栄養素が自動入力されます。
            内蔵の食品データベースは編集できません。
          </p>
        </>
      )}
    </div>
  );
}
