import { LayoutDashboard, Utensils, Moon, Scale, Footprints, Apple, ClipboardList, User } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { MealEntry, SleepEntry, WeightEntry, StepEntry, BowelEntry, Profile, TabType } from './types';
import type { CustomFoodItem } from './data/foodDatabase';
import Dashboard from './components/Dashboard';
import MealTracker from './components/MealTracker';
import SleepTracker from './components/SleepTracker';
import WeightTracker from './components/WeightTracker';
import StepTracker from './components/StepTracker';
import NutritionTracker from './components/NutritionTracker';
import BowelTracker from './components/BowelTracker';
import ProfileSettings from './components/ProfileSettings';
import './App.css';

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'ダッシュボード', icon: <LayoutDashboard size={20} /> },
  { id: 'meal', label: '食事', icon: <Utensils size={20} /> },
  { id: 'sleep', label: '睡眠', icon: <Moon size={20} /> },
  { id: 'weight', label: '体重', icon: <Scale size={20} /> },
  { id: 'steps', label: '歩数', icon: <Footprints size={20} /> },
  { id: 'nutrition', label: '栄養素', icon: <Apple size={20} /> },
  { id: 'bowel', label: '排便', icon: <ClipboardList size={20} /> },
  { id: 'profile', label: 'プロフィール', icon: <User size={20} /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useLocalStorage<TabType>('health-active-tab', 'dashboard');
  const [meals, setMeals] = useLocalStorage<MealEntry[]>('health-meals', []);
  const [sleepEntries, setSleepEntries] = useLocalStorage<SleepEntry[]>('health-sleep', []);
  const [weightEntries, setWeightEntries] = useLocalStorage<WeightEntry[]>('health-weight', []);
  const [stepEntries, setStepEntries] = useLocalStorage<StepEntry[]>('health-steps', []);
  const [bowelEntries, setBowelEntries] = useLocalStorage<BowelEntry[]>('health-bowel', []);
  const [customFoods, setCustomFoods] = useLocalStorage<CustomFoodItem[]>('health-custom-foods', []);
  const [profile, setProfile] = useLocalStorage<Profile>('health-profile', {});

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="app-logo">
            <span className="logo-icon">🌿</span>
            <span className="logo-text">HealthTracker</span>
          </div>
        </div>
      </header>

      <nav className="tab-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' && (
          <Dashboard meals={meals} sleep={sleepEntries} weight={weightEntries} steps={stepEntries} />
        )}
        {activeTab === 'meal' && (
          <MealTracker
            entries={meals}
            customFoods={customFoods}
            onAdd={e => setMeals(prev => [...prev, e])}
            onDelete={id => setMeals(prev => prev.filter(e => e.id !== id))}
          />
        )}
        {activeTab === 'sleep' && (
          <SleepTracker
            entries={sleepEntries}
            onAdd={e => setSleepEntries(prev => [...prev, e])}
            onDelete={id => setSleepEntries(prev => prev.filter(e => e.id !== id))}
          />
        )}
        {activeTab === 'weight' && (
          <WeightTracker
            entries={weightEntries}
            onAdd={e => setWeightEntries(prev => [...prev, e])}
            onDelete={id => setWeightEntries(prev => prev.filter(e => e.id !== id))}
          />
        )}
        {activeTab === 'steps' && (
          <StepTracker
            entries={stepEntries}
            onAdd={e => setStepEntries(prev => [...prev, e])}
            onDelete={id => setStepEntries(prev => prev.filter(e => e.id !== id))}
          />
        )}
        {activeTab === 'nutrition' && (
          <NutritionTracker
            entries={meals}
            profile={profile}
            customFoods={customFoods}
            onAddFood={f => setCustomFoods(prev => [...prev, f])}
            onUpdateFood={f => setCustomFoods(prev => prev.map(item => item.id === f.id ? f : item))}
            onDeleteFood={id => setCustomFoods(prev => prev.filter(f => f.id !== id))}
          />
        )}
        {activeTab === 'bowel' && (
          <BowelTracker
            entries={bowelEntries}
            onAdd={e => setBowelEntries(prev => [...prev, e])}
            onDelete={id => setBowelEntries(prev => prev.filter(e => e.id !== id))}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileSettings
            profile={profile}
            onSave={setProfile}
            backupData={{ meals, sleepEntries, weightEntries, stepEntries, bowelEntries, customFoods, profile }}
            onRestore={data => {
              setMeals(data.meals);
              setSleepEntries(data.sleepEntries);
              setWeightEntries(data.weightEntries);
              setStepEntries(data.stepEntries);
              setBowelEntries(data.bowelEntries);
              setCustomFoods(data.customFoods);
              setProfile(data.profile);
            }}
          />
        )}
      </main>
    </div>
  );
}
