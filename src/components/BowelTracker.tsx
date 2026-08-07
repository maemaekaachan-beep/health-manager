import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Plus, Trash2, ClipboardList } from 'lucide-react';
import type { BowelEntry } from '../types';

const BRISTOL: { scale: BowelEntry['bristol']; desc: string; color: string }[] = [
  { scale: 1, desc: '硬塊',  color: '#7c5c3e' },
  { scale: 2, desc: '硬い',  color: '#9b7c5e' },
  { scale: 3, desc: 'やや硬', color: '#c4a97d' },
  { scale: 4, desc: '普通',  color: '#4ade80' },
  { scale: 5, desc: 'やや軟', color: '#facc15' },
  { scale: 6, desc: '軟便',  color: '#fb923c' },
  { scale: 7, desc: '水様',  color: '#f87171' },
];

const AMOUNT: { value: BowelEntry['amount']; label: string }[] = [
  { value: 'small',  label: '少' },
  { value: 'medium', label: '中' },
  { value: 'large',  label: '多' },
];

const AMOUNT_LABEL: Record<BowelEntry['amount'], string> = {
  small: '少', medium: '中', large: '多',
};

interface Props {
  entries: BowelEntry[];
  onAdd: (entry: BowelEntry) => void;
  onDelete: (id: string) => void;
}

export default function BowelTracker({ entries, onAdd, onDelete }: Props) {
  const now = new Date();
  const [form, setForm] = useState({
    date: format(now, 'yyyy-MM-dd'),
    time: format(now, 'HH:mm'),
    bristol: 4 as BowelEntry['bristol'],
    amount: 'medium' as BowelEntry['amount'],
    count: 1,
    note: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: crypto.randomUUID(),
      date: form.date,
      time: form.time,
      bristol: form.bristol,
      amount: form.amount,
      count: form.count,
      note: form.note || undefined,
    });
    const n = new Date();
    setForm(prev => ({
      ...prev,
      date: format(n, 'yyyy-MM-dd'),
      time: format(n, 'HH:mm'),
      count: 1,
      note: '',
    }));
  };

  const sorted = [...entries].sort((a, b) =>
    `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
  );

  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <ClipboardList size={24} />
        <h2>排便記録</h2>
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
            <label>時刻</label>
            <input
              type="time"
              value={form.time}
              onChange={e => setForm(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>
          <div className="form-group" style={{ maxWidth: 100 }}>
            <label>回数</label>
            <input
              type="number"
              min={1}
              max={99}
              value={form.count}
              onChange={e => setForm(prev => ({ ...prev, count: Math.max(1, Number(e.target.value)) }))}
            />
          </div>
        </div>

        <div className="form-group">
          <label>硬さ（ブリストルスケール）</label>
          <div className="bristol-selector">
            {BRISTOL.map(b => (
              <button
                key={b.scale}
                type="button"
                className={`bristol-btn${form.bristol === b.scale ? ' active' : ''}`}
                style={form.bristol === b.scale
                  ? { backgroundColor: b.color, borderColor: b.color, color: '#fff' }
                  : { borderColor: b.color + '80', color: b.color }}
                onClick={() => setForm(prev => ({ ...prev, bristol: b.scale }))}
              >
                <span className="bristol-num">{b.scale}</span>
                <span className="bristol-desc">{b.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>量</label>
            <div className="amount-selector">
              {AMOUNT.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`amount-btn${form.amount === opt.value ? ' active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, amount: opt.value }))}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group flex-2">
            <label>メモ（任意）</label>
            <input
              type="text"
              placeholder="例: 腹痛あり"
              value={form.note}
              onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn-primary">
            <Plus size={18} /> 記録
          </button>
        </div>
      </form>

      <div className="entries-list">
        {sorted.length === 0 ? (
          <div className="empty-state">排便記録がありません</div>
        ) : (
          sorted.slice(0, 30).map(entry => {
            const b = BRISTOL.find(x => x.scale === entry.bristol)!;
            return (
              <div key={entry.id} className="entry-card">
                <div
                  className="bowel-badge"
                  style={{ background: b.color + '22', borderColor: b.color, color: b.color }}
                >
                  <span className="bowel-badge-num">{entry.bristol}型</span>
                  <span className="bowel-badge-desc">{b.desc}</span>
                </div>
                <div className="entry-info">
                  <span className="entry-name">
                    {format(new Date(entry.date + 'T00:00:00'), 'M月d日(E)', { locale: ja })} {entry.time}
                  </span>
                  {entry.note && <span className="entry-time">{entry.note}</span>}
                </div>
                <span className="entry-calories">量: {AMOUNT_LABEL[entry.amount]}　{entry.count ?? 1}回</span>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(entry.id)}
                  aria-label="削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
