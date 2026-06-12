import { useState } from 'react';
import { format, differenceInMinutes, parse } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Plus, Trash2, Moon } from 'lucide-react';
import type { SleepEntry } from '../types';

interface Props {
  entries: SleepEntry[];
  onAdd: (entry: SleepEntry) => void;
  onDelete: (id: string) => void;
}

const QUALITY_LABELS = {
  1: '最悪',
  2: '悪い',
  3: '普通',
  4: '良い',
  5: '最高',
};

const QUALITY_COLORS = {
  1: '#ef4444',
  2: '#f97316',
  3: '#eab308',
  4: '#22c55e',
  5: '#06b6d4',
};

function calcDuration(bedtime: string, wakeTime: string): number {
  const bed = parse(bedtime, 'HH:mm', new Date());
  let wake = parse(wakeTime, 'HH:mm', new Date());
  let diff = differenceInMinutes(wake, bed);
  if (diff < 0) diff += 24 * 60;
  return diff;
}

export default function SleepTracker({ entries, onAdd, onDelete }: Props) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState({
    date: today,
    bedtime: '23:00',
    wakeTime: '07:00',
    quality: 3 as SleepEntry['quality'],
  });

  const previewDuration = calcDuration(form.bedtime, form.wakeTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: crypto.randomUUID(),
      date: form.date,
      bedtime: form.bedtime,
      wakeTime: form.wakeTime,
      duration: calcDuration(form.bedtime, form.wakeTime),
      quality: form.quality,
    });
  };

  const recentEntries = [...entries]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14);

  const avgDuration = entries.length
    ? entries.reduce((s, e) => s + e.duration, 0) / entries.length
    : 0;

  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <Moon size={24} />
        <h2>睡眠管理</h2>
      </div>

      <form onSubmit={handleSubmit} className="entry-form">
        <div className="form-row">
          <div className="form-group">
            <label>就寝日</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>就寝時刻</label>
            <input
              type="time"
              value={form.bedtime}
              onChange={e => setForm(prev => ({ ...prev, bedtime: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>起床時刻</label>
            <input
              type="time"
              value={form.wakeTime}
              onChange={e => setForm(prev => ({ ...prev, wakeTime: e.target.value }))}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group flex-2">
            <label>睡眠の質: {QUALITY_LABELS[form.quality]}</label>
            <div className="quality-selector">
              {([1, 2, 3, 4, 5] as const).map(q => (
                <button
                  key={q}
                  type="button"
                  className={`quality-btn ${form.quality === q ? 'active' : ''}`}
                  style={form.quality === q ? { backgroundColor: QUALITY_COLORS[q] } : {}}
                  onClick={() => setForm(prev => ({ ...prev, quality: q }))}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>睡眠時間（予測）</label>
            <div className="duration-preview">
              {Math.floor(previewDuration / 60)}時間{previewDuration % 60}分
            </div>
          </div>
          <button type="submit" className="btn-primary">
            <Plus size={18} /> 追加
          </button>
        </div>
      </form>

      {entries.length > 0 && (
        <div className="summary-card">
          <span>直近の平均睡眠時間</span>
          <span className="calories-total">
            {Math.floor(avgDuration / 60)}時間{Math.round(avgDuration % 60)}分
          </span>
        </div>
      )}

      <div className="entries-list">
        {recentEntries.length === 0 ? (
          <div className="empty-state">睡眠記録がありません</div>
        ) : (
          recentEntries.map(entry => (
            <div key={entry.id} className="entry-card">
              <div
                className="category-badge"
                style={{ backgroundColor: QUALITY_COLORS[entry.quality] }}
              >
                {QUALITY_LABELS[entry.quality]}
              </div>
              <div className="entry-info">
                <span className="entry-name">
                  {format(new Date(entry.date + 'T00:00:00'), 'M/d (E)', { locale: ja })}
                </span>
                <span className="entry-time">
                  {entry.bedtime} → {entry.wakeTime}
                </span>
              </div>
              <span className="entry-calories">
                {Math.floor(entry.duration / 60)}h{entry.duration % 60}m
              </span>
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
