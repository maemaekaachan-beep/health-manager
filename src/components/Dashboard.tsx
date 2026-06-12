import { format, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Flame, Moon, Scale, TrendingDown, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { MealEntry, SleepEntry, WeightEntry } from '../types';

interface Props {
  meals: MealEntry[];
  sleep: SleepEntry[];
  weight: WeightEntry[];
}

export default function Dashboard({ meals, sleep, weight }: Props) {
  const today = format(new Date(), 'yyyy-MM-dd');

  const todayCalories = meals
    .filter(e => e.date === today)
    .reduce((s, e) => s + e.calories, 0);

  const lastSleep = [...sleep].sort((a, b) => b.date.localeCompare(a.date))[0];
  const latestWeight = [...weight].sort((a, b) => b.date.localeCompare(a.date))[0];
  const prevWeight = [...weight]
    .filter(e => e.date !== latestWeight?.date)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  const weightDiff = latestWeight && prevWeight
    ? latestWeight.weight - prevWeight.weight
    : null;

  // Calorie chart for last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const label = format(subDays(new Date(), 6 - i), 'M/d');
    const cal = meals.filter(e => e.date === d).reduce((s, e) => s + e.calories, 0);
    return { date: label, calories: cal };
  });

  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <h2>ダッシュボード</h2>
        <span className="today-label">{format(new Date(), 'yyyy年M月d日 (E)', { locale: ja })}</span>
      </div>

      <div className="dashboard-cards">
        <div className="dash-card">
          <div className="dash-card-icon" style={{ color: '#f59e0b' }}>
            <Flame size={28} />
          </div>
          <div className="dash-card-body">
            <span className="dash-card-label">今日の摂取カロリー</span>
            <span className="dash-card-value">{todayCalories.toLocaleString()} kcal</span>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-icon" style={{ color: '#818cf8' }}>
            <Moon size={28} />
          </div>
          <div className="dash-card-body">
            <span className="dash-card-label">最終睡眠</span>
            <span className="dash-card-value">
              {lastSleep
                ? `${Math.floor(lastSleep.duration / 60)}h ${lastSleep.duration % 60}m`
                : '—'}
            </span>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-icon" style={{ color: '#34d399' }}>
            <Scale size={28} />
          </div>
          <div className="dash-card-body">
            <span className="dash-card-label">最新の体重</span>
            <span className="dash-card-value">
              {latestWeight ? `${latestWeight.weight} kg` : '—'}
            </span>
            {weightDiff !== null && (
              <span className={`trend-badge ${weightDiff > 0 ? 'up' : 'down'}`}>
                {weightDiff > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)} kg
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h3>直近7日間のカロリー摂取</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={last7}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3d" />
            <XAxis dataKey="date" stroke="#8884d8" tick={{ fontSize: 12 }} />
            <YAxis stroke="#8884d8" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #444' }}
              formatter={(v) => [`${v} kcal`, 'カロリー']}
            />
            <Bar dataKey="calories" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {meals.length === 0 && sleep.length === 0 && weight.length === 0 && (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          各タブからデータを入力してください
        </div>
      )}
    </div>
  );
}
