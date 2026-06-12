import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Plus, Trash2, Utensils } from 'lucide-react';
import type { MealEntry } from '../types';

interface Props {
  entries: MealEntry[];
  onAdd: (entry: MealEntry) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES = {
  breakfast: '朝食',
  lunch: '昼食',
  dinner: '夕食',
  snack: '間食',
} as const;

const CATEGORY_COLORS = {
  breakfast: '#f59e0b',
  lunch: '#10b981',
  dinner: '#6366f1',
  snack: '#f43f5e',
};

export default function MealTracker({ entries, onAdd, onDelete }: Props) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState({
    date: today,
    time: format(new Date(), 'HH:mm'),
    name: '',
    calories: '',
    category: 'lunch' as MealEntry['category'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.calories) return;
    onAdd({
      id: crypto.randomUUID(),
      date: form.date,
      time: form.time,
      name: form.name,
      calories: Number(form.calories),
      category: form.category,
    });
    setForm(prev => ({ ...prev, name: '', calories: '' }));
  };

  const todayEntries = entries
    .filter(e => e.date === form.date)
    .sort((a, b) => a.time.localeCompare(b.time));

  const totalCalories = todayEntries.reduce((sum, e) => sum + e.calories, 0);

  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <Utensils size={24} />
        <h2>食事管理</h2>
      </div>

      <form onSubmit={handleSubmit} className="entry-form">
        <div className="form-row">
          <div className="form-group">
            <label>日付</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>時間</label>
            <input
              type="time"
              value={form.time}
              onChange={e => setForm(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>カテゴリ</label>
            <select
              value={form.category}
              onChange={e => setForm(prev => ({ ...prev, category: e.target.value as MealEntry['category'] }))}
            >
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group flex-2">
            <label>食事内容</label>
            <input
              type="text"
              placeholder="例: ご飯、味噌汁、焼き魚"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>カロリー (kcal)</label>
            <input
              type="number"
              placeholder="500"
              min="0"
              value={form.calories}
              onChange={e => setForm(prev => ({ ...prev, calories: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn-primary">
            <Plus size={18} /> 追加
          </button>
        </div>
      </form>

      <div className="summary-card">
        <span>{format(new Date(form.date + 'T00:00:00'), 'M月d日 (E)', { locale: ja })} の合計カロリー</span>
        <span className="calories-total">{totalCalories.toLocaleString()} kcal</span>
      </div>

      <div className="entries-list">
        {todayEntries.length === 0 ? (
          <div className="empty-state">この日の食事記録がありません</div>
        ) : (
          todayEntries.map(entry => (
            <div key={entry.id} className="entry-card">
              <div
                className="category-badge"
                style={{ backgroundColor: CATEGORY_COLORS[entry.category] }}
              >
                {CATEGORIES[entry.category]}
              </div>
              <div className="entry-info">
                <span className="entry-name">{entry.name}</span>
                <span className="entry-time">{entry.time}</span>
              </div>
              <span className="entry-calories">{entry.calories} kcal</span>
              <button
                className="btn-delete"
                onClick={() => onDelete(entry.id)}
                aria-label="削除"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
