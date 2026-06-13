import { useState } from 'react';
import { User, Save } from 'lucide-react';
import type { Profile } from '../types';

const GENDER_OPTIONS: { value: Profile['gender']; label: string }[] = [
  { value: 'male',   label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other',  label: 'その他' },
];

const GENDER_LABEL: Record<NonNullable<Profile['gender']>, string> = {
  male: '男性', female: '女性', other: 'その他',
};

interface Props {
  profile: Profile;
  onSave: (profile: Profile) => void;
}

export default function ProfileSettings({ profile, onSave }: Props) {
  const [form, setForm] = useState({
    height: profile.height?.toString() ?? '',
    age: profile.age?.toString() ?? '',
    gender: profile.gender ?? ('' as Profile['gender'] | ''),
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      height: form.height ? Number(form.height) : undefined,
      age: form.age ? Number(form.age) : undefined,
      gender: (form.gender || undefined) as Profile['gender'],
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasProfile = profile.height || profile.age || profile.gender;

  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <User size={24} />
        <h2>プロフィール設定</h2>
      </div>

      <form onSubmit={handleSubmit} className="entry-form">
        <div className="form-row">
          <div className="form-group">
            <label>身長 (cm)</label>
            <input
              type="number"
              placeholder="170.0"
              step="0.1"
              min="0"
              max="300"
              value={form.height}
              onChange={e => setForm(prev => ({ ...prev, height: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>年齢</label>
            <input
              type="number"
              placeholder="30"
              min="0"
              max="120"
              value={form.age}
              onChange={e => setForm(prev => ({ ...prev, age: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>性別</label>
            <div className="amount-selector">
              {GENDER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`amount-btn${form.gender === opt.value ? ' active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, gender: opt.value }))}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary">
            <Save size={18} /> {saved ? '保存しました' : '保存'}
          </button>
        </div>
      </form>

      {hasProfile && (
        <div className="summary-card">
          <span>現在の設定</span>
          <div className="profile-stats">
            {profile.height && (
              <div className="profile-stat">
                <span className="profile-stat-label">身長</span>
                <span className="profile-stat-value">{profile.height} cm</span>
              </div>
            )}
            {profile.age && (
              <div className="profile-stat">
                <span className="profile-stat-label">年齢</span>
                <span className="profile-stat-value">{profile.age} 歳</span>
              </div>
            )}
            {profile.gender && (
              <div className="profile-stat">
                <span className="profile-stat-label">性別</span>
                <span className="profile-stat-value">{GENDER_LABEL[profile.gender]}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
