export interface FoodItem {
  name: string;
  calories: number;
  unit: string;
}

export const FOOD_DATABASE: FoodItem[] = [
  // 主食
  { name: 'ご飯（茶碗1杯）', calories: 252, unit: '150g' },
  { name: 'ご飯（大盛り）', calories: 336, unit: '200g' },
  { name: 'おにぎり（梅）', calories: 170, unit: '1個' },
  { name: 'おにぎり（鮭）', calories: 185, unit: '1個' },
  { name: 'おにぎり（ツナマヨ）', calories: 220, unit: '1個' },
  { name: '食パン（6枚切り）', calories: 158, unit: '1枚' },
  { name: 'クロワッサン', calories: 210, unit: '1個' },
  { name: 'うどん（茹で）', calories: 270, unit: '1玉' },
  { name: 'そば（茹で）', calories: 264, unit: '1玉' },
  { name: 'ラーメン（醤油）', calories: 450, unit: '1杯' },
  { name: 'ラーメン（豚骨）', calories: 550, unit: '1杯' },
  { name: 'パスタ（ナポリタン）', calories: 480, unit: '1人前' },
  { name: 'パスタ（カルボナーラ）', calories: 620, unit: '1人前' },
  { name: 'チャーハン', calories: 520, unit: '1人前' },
  { name: 'カレーライス', calories: 700, unit: '1人前' },
  { name: 'オムライス', calories: 600, unit: '1人前' },
  { name: '親子丼', calories: 620, unit: '1杯' },
  { name: '牛丼', calories: 650, unit: '1杯' },
  { name: '天丼', calories: 720, unit: '1杯' },
  { name: '鉄火丼', calories: 500, unit: '1杯' },

  // 麺類
  { name: 'かけうどん', calories: 310, unit: '1杯' },
  { name: 'きつねうどん', calories: 400, unit: '1杯' },
  { name: 'ざるそば', calories: 320, unit: '1人前' },
  { name: 'もりそば', calories: 300, unit: '1人前' },
  { name: '焼きそば', calories: 480, unit: '1人前' },
  { name: 'インスタントラーメン', calories: 440, unit: '1袋' },
  { name: 'パスタ（ミートソース）', calories: 550, unit: '1人前' },
  { name: 'スパゲッティ（ペペロンチーノ）', calories: 480, unit: '1人前' },

  // 肉類
  { name: '鶏むね肉（焼き）', calories: 190, unit: '100g' },
  { name: '鶏もも肉（焼き）', calories: 253, unit: '100g' },
  { name: '鶏から揚げ', calories: 290, unit: '3個' },
  { name: '豚ロース（焼き）', calories: 263, unit: '100g' },
  { name: '豚バラ（焼き）', calories: 366, unit: '100g' },
  { name: '豚の生姜焼き', calories: 380, unit: '1人前' },
  { name: '牛ステーキ（サーロイン）', calories: 320, unit: '150g' },
  { name: '牛薄切り肉（焼き）', calories: 280, unit: '100g' },
  { name: 'ハンバーグ', calories: 350, unit: '1個' },
  { name: '餃子', calories: 250, unit: '5個' },
  { name: '焼肉（カルビ）', calories: 360, unit: '100g' },
  { name: '焼肉（ロース）', calories: 300, unit: '100g' },
  { name: 'ウインナー', calories: 200, unit: '3本' },
  { name: 'ベーコン', calories: 170, unit: '3枚' },

  // 魚介類
  { name: '焼き魚（鮭）', calories: 200, unit: '1切れ' },
  { name: '焼き魚（サバ）', calories: 230, unit: '1切れ' },
  { name: '焼き魚（秋刀魚）', calories: 260, unit: '1尾' },
  { name: 'マグロ刺身', calories: 125, unit: '5切れ' },
  { name: 'サーモン刺身', calories: 150, unit: '5切れ' },
  { name: 'エビフライ', calories: 280, unit: '3本' },
  { name: '寿司（10貫）', calories: 500, unit: '10貫' },
  { name: 'ちらし寿司', calories: 550, unit: '1人前' },
  { name: '天ぷら（エビ）', calories: 120, unit: '1本' },
  { name: '煮魚（鮭）', calories: 180, unit: '1切れ' },
  { name: 'ツナ缶（水煮）', calories: 95, unit: '1缶70g' },

  // 卵・豆腐
  { name: '卵（ゆで）', calories: 80, unit: '1個' },
  { name: '目玉焼き', calories: 100, unit: '1個' },
  { name: '卵焼き', calories: 120, unit: '3切れ' },
  { name: 'スクランブルエッグ', calories: 130, unit: '1人前' },
  { name: '豆腐（木綿）', calories: 80, unit: '1/2丁' },
  { name: '豆腐（絹ごし）', calories: 56, unit: '1/2丁' },
  { name: '冷奴', calories: 80, unit: '1丁' },
  { name: '麻婆豆腐', calories: 350, unit: '1人前' },
  { name: '納豆', calories: 100, unit: '1パック' },

  // 野菜・サラダ
  { name: 'サラダ（グリーン）', calories: 30, unit: '1皿' },
  { name: 'シーザーサラダ', calories: 200, unit: '1皿' },
  { name: 'ポテトサラダ', calories: 180, unit: '1皿' },
  { name: 'コールスロー', calories: 120, unit: '1皿' },
  { name: 'ほうれん草のおひたし', calories: 25, unit: '1皿' },
  { name: 'ブロッコリー（蒸し）', calories: 33, unit: '100g' },
  { name: 'かぼちゃの煮物', calories: 150, unit: '1皿' },
  { name: 'きんぴらごぼう', calories: 120, unit: '1皿' },
  { name: 'ひじきの煮物', calories: 80, unit: '1皿' },
  { name: '大根の煮物', calories: 60, unit: '1皿' },
  { name: 'にんじんのグラッセ', calories: 80, unit: '1皿' },

  // 汁物
  { name: '味噌汁', calories: 40, unit: '1杯' },
  { name: '豚汁', calories: 130, unit: '1杯' },
  { name: 'コーンスープ', calories: 100, unit: '1杯' },
  { name: 'コンソメスープ', calories: 25, unit: '1杯' },
  { name: 'クラムチャウダー', calories: 180, unit: '1杯' },

  // 乳製品
  { name: '牛乳', calories: 138, unit: '200ml' },
  { name: 'ヨーグルト（無糖）', calories: 62, unit: '100g' },
  { name: 'ヨーグルト（加糖）', calories: 62, unit: '100g' },
  { name: 'チーズ（スライス）', calories: 68, unit: '1枚' },
  { name: 'アイスクリーム', calories: 160, unit: '1個' },

  // パン・サンドイッチ
  { name: 'サンドイッチ（ハム）', calories: 280, unit: '1個' },
  { name: 'バーガー（チーズ）', calories: 380, unit: '1個' },
  { name: 'ホットドッグ', calories: 280, unit: '1本' },
  { name: 'ピザ（マルゲリータ）', calories: 600, unit: '1枚' },

  // ファストフード
  { name: 'ハンバーガー', calories: 300, unit: '1個' },
  { name: 'フライドポテト（M）', calories: 340, unit: '1個' },
  { name: 'チキンナゲット（5個）', calories: 230, unit: '5個' },
  { name: 'フライドチキン', calories: 320, unit: '1ピース' },

  // スナック・お菓子
  { name: 'ポテトチップス', calories: 300, unit: '1袋60g' },
  { name: 'チョコレート', calories: 270, unit: '1枚50g' },
  { name: 'クッキー', calories: 160, unit: '3枚' },
  { name: 'ケーキ（ショートケーキ）', calories: 350, unit: '1個' },
  { name: 'シュークリーム', calories: 190, unit: '1個' },
  { name: 'プリン', calories: 150, unit: '1個' },
  { name: 'どら焼き', calories: 250, unit: '1個' },
  { name: '和菓子（あんこ）', calories: 200, unit: '1個' },
  { name: 'おせんべい', calories: 120, unit: '5枚' },
  { name: 'グミ', calories: 130, unit: '1袋' },
  { name: 'アーモンド', calories: 180, unit: '30粒' },
  { name: 'バナナ', calories: 86, unit: '1本' },
  { name: 'りんご', calories: 54, unit: '1/2個' },
  { name: 'みかん', calories: 45, unit: '1個' },
  { name: 'ぶどう', calories: 60, unit: '1房' },
  { name: 'いちご', calories: 34, unit: '10個' },

  // 飲み物
  { name: 'コーヒー（ブラック）', calories: 5, unit: '1杯' },
  { name: 'カフェラテ', calories: 100, unit: '1杯' },
  { name: '緑茶', calories: 2, unit: '1杯' },
  { name: 'オレンジジュース', calories: 100, unit: '200ml' },
  { name: 'コーラ', calories: 90, unit: '250ml' },
  { name: 'エナジードリンク', calories: 100, unit: '250ml' },
  { name: 'ビール', calories: 150, unit: '350ml' },
  { name: 'ワイン（赤）', calories: 130, unit: 'グラス1杯' },
  { name: '日本酒', calories: 190, unit: '1合' },
  { name: 'スポーツドリンク', calories: 60, unit: '500ml' },
];

export function searchFoods(query: string): FoodItem[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return FOOD_DATABASE.filter(
    f => f.name.toLowerCase().includes(q) || f.unit.toLowerCase().includes(q)
  ).slice(0, 8);
}
