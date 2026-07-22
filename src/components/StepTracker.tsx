import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Plus, Trash2, Footprints } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { StepEntry } from '../types';

interface Props {
  entries: StepEntry[];
  onAdd: (entry: StepEntry) => void;
  onDelete: (id: string) => void;
}

type RangeType = 'week' | 'month';

export default function StepTracker({ entries, onAdd, onDelete }: Props) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState({ date: today, steps: '' });
  const [range, setRange] = useState<RangeType>('week');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.steps) return;
    onAdd({
      id: crypto.randomUUID(),
      date: form.date,
      steps: Number(form.steps),
    });
    setForm(prev => ({ ...prev, steps: '' }));
  };

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(sorted.map(e => [e.date, e.steps]));

  const days = range === 'week' ? 7 : 30;
  const chartData = Array.from({ length: days }, (_, i) => {
    const d = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
    return {
      date: format(new Date(d + 'T00:00:00'), 'M/d'),
      steps: byDate.get(d) ?? 0,
    };
  });

  const latest = sorted[sorted.length - 1];
  const prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;
  const diff = latest && prev ? latest.steps - prev.steps : null;

  const periodEntries = sorted.filter(e => {
    const cutoff = format(subDays(new Date(), days - 1), 'yyyy-MM-dd');
    return e.date >= cutoff && e.date <= today;
  });
  const periodAvg = periodEntries.length
    ? Math.round(periodEntries.reduce((s, e) => s + e.steps, 0) / periodEntries.length)
    : null;

  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <Footprints size={24} />
        <h2>歩数記録</h2>
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
            <label>歩数 (歩)</label>
            <input
              type="number"
              placeholder="8000"
              step="1"
              min="0"
              value={form.steps}
              onChange={e => setForm(prev => ({ ...prev, steps: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn-primary">
            <Plus size={18} /> 追加
          </button>
        </div>
      </form>

      {latest && (
        <div className="summary-card">
          <span>最新の記録</span>
          <div className="weight-summary">
            <span className="calories-total">{latest.steps.toLocaleString()} 歩</span>
            {diff !== null && (
              <span className={`weight-diff ${diff > 0 ? 'up' : 'down'}`}>
                {diff > 0 ? '+' : ''}{diff.toLocaleString()} 歩
              </span>
            )}
            {periodAvg !== null && (
              <span className="bodyfat-label">
                {range === 'week' ? '週間' : '月間'}平均 {periodAvg.toLocaleString()} 歩
              </span>
            )}
          </div>
        </div>
      )}

      <div className="chart-container">
        <div className="chart-header">
          <h3>推移グラフ</h3>
          <div className="amount-selector">
            <button
              type="button"
              className={`amount-btn${range === 'week' ? ' active' : ''}`}
              onClick={() => setRange('week')}
            >
              週間
            </button>
            <button
              type="button"
              className={`amount-btn${range === 'month' ? ' active' : ''}`}
              onClick={() => setRange('month')}
            >
              月間
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3d" />
            <XAxis dataKey="date" stroke="#8884d8" tick={{ fontSize: 11 }} />
            <YAxis
              stroke="#6366f1"
              tick={{ fontSize: 11 }}
              domain={['auto', 'auto']}
              tickFormatter={v => `${v.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #444' }}
              formatter={(v) => [`${Number(v).toLocaleString()} 歩`, '歩数']}
            />
            <Line
              type="monotone"
              dataKey="steps"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="entries-list">
        {sorted.length === 0 ? (
          <div className="empty-state">歩数記録がありません</div>
        ) : (
          [...sorted].reverse().slice(0, 20).map(entry => (
            <div key={entry.id} className="entry-card">
              <div className="entry-info">
                <span className="entry-name">
                  {format(new Date(entry.date + 'T00:00:00'), 'M月d日 (E)', { locale: ja })}
                </span>
              </div>
              <span className="entry-calories">{entry.steps.toLocaleString()} 歩</span>
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
