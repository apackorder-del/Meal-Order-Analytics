/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Utensils, ClipboardList, Hash, RefreshCcw } from 'lucide-react';

const DEFAULT_DATA = `位置	員工編號	姓名	餐點
6F	114203	yaohui	招牌排骨酥泡飯(大) $100
6F	108032	Leon	肉燥乾麵(大) $50
5F	110088	張秋華	招牌排骨酥泡飯 $85
6F	114197	Queena	招牌排骨酥麵 $85
6F	114205	Shon	招牌排骨酥麵(大) $100
5F	108034	偉	肉燥乾麵(大) $50
6F	110058	趙光平	招牌排骨酥麵 $85
6F	114198	Annie	肉燥乾麵(大) $50
6F	106018	ella	肉燥乾麵(大) $50
5F	111128	廖逸榛	招牌排骨酥泡飯 $85
5F	112169	Allen	招牌排骨酥麵(大) $100
6F	108038	lily	招牌排骨酥泡飯 $85
6F	110073	irene	招牌排骨酥泡飯 $85
6F	113190	Sei	招牌排骨酥泡飯(大) $100
5F	111124	Alan	招牌排骨酥泡飯 $85
6F	114199	Catherine 	招牌排骨酥麵 $85
6F	113194	Ben	招牌排骨酥泡飯 $85
6F	110083	Andy 	肉燥乾麵(大) $50
5F	110082	林上崴	滷肉飯(大) $45
6F	114201	o	招牌排骨酥泡飯(大) $100
5F	111129	陳嬿惠	招牌排骨酥湯 $70
6F	113191	Neil	招牌排骨酥湯 $70, 肉燥乾麵 $40
6F	114206	曾姿璇	招牌排骨酥麵 $85
6F	106002	Sandy	招牌排骨酥湯 $70, 肉燥乾麵(大) $50, 肉燥乾麵 $40
6F	112178	Angel	招牌排骨酥泡飯 $85
6F	114205	Shon	招牌排骨酥泡飯 $85
6F	108032	Leon	招牌排骨酥泡飯 $85
5F	113193	紅竹	招牌排骨酥麵 $85
5F	110076	Leo	肉燥乾麵(大) $50`;

export default function App() {
  const [rawData, setRawData] = useState('');

  const mealStats = useMemo(() => {
    const locationCounts: Record<string, Record<string, number>> = {};
    const locations = new Set<string>();
    let totalItems = 0;
    
    const lines = rawData.trim().split('\n');
    
    lines.forEach((line, index) => {
      if (index === 0 && (line.includes('位置') || line.includes('姓名'))) return;
      
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      let parts = trimmedLine.split('\t').map(p => p.trim()).filter(p => p.length > 0);
      
      if (parts.length < 4) {
        parts = trimmedLine.split(/\s{2,}/).map(p => p.trim()).filter(p => p.length > 0);
      }

      if (parts.length < 4) {
        const match = trimmedLine.match(/^(\S+)\s+(\d+)\s+(.+?)\s+(.+)$/);
        if (match) {
          parts = [match[1], match[2], match[3], match[4]];
        }
      }

      if (parts.length >= 4) {
        const location = parts[0];
        const mealStr = parts[3];
        locations.add(location);
        
        const items = mealStr.split(',').map(i => i.trim()).filter(i => i.length > 0);
        
        items.forEach(item => {
          totalItems += 1;
          if (!locationCounts[location]) {
            locationCounts[location] = {};
          }
          locationCounts[location][item] = (locationCounts[location][item] || 0) + 1;
        });
      }
    });

    // Sort locations (e.g., 6F, 5F) - usually descending for floor numbers
    const sortedLocations = Array.from(locations).sort((a, b) => b.localeCompare(a));

    const result = sortedLocations.map(loc => {
      const meals = Object.entries(locationCounts[loc])
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      
      const locTotal = meals.reduce((acc, m) => acc + m.count, 0);
      
      return {
        location: loc,
        meals,
        total: locTotal
      };
    });

    return { result, totalItems };
  }, [rawData]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <header className="border-b border-stone-200 pb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Utensils className="w-6 h-6 text-orange-600" />
            餐點數量統計
          </h1>
          <p className="text-stone-500 text-sm mt-1">依樓層分組計算餐點總份數</p>
        </header>

        <main className="grid gap-8">
          {/* Input Area */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                數據輸入
              </h2>
              <div className="flex gap-3">
                <button 
                  onClick={() => setRawData(DEFAULT_DATA)}
                  className="text-xs text-stone-400 hover:text-orange-600 flex items-center gap-1 transition-colors"
                >
                  <RefreshCcw className="w-3 h-3" />
                  範例數據
                </button>
                <button 
                  onClick={() => setRawData('')}
                  className="text-xs text-stone-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  清空
                </button>
              </div>
            </div>
            <textarea 
              className="w-full h-48 p-4 text-sm font-mono bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-inner"
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              placeholder="請在此貼上表格內容 (例如：位置 員工編號 姓名 餐點)..."
            />
          </section>

          {/* Result Sections by Location */}
          <div className="space-y-8">
            {mealStats.result.length > 0 ? (
              <>
                <div className="flex justify-end">
                  <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full shadow-sm">
                    全公司總計: {mealStats.totalItems} 份
                  </span>
                </div>
                
                {mealStats.result.map((group, gIdx) => (
                  <section key={gIdx} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="bg-stone-800 px-6 py-3 flex justify-between items-center">
                      <h2 className="text-sm font-bold tracking-widest text-white flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-orange-400" />
                        {group.location} 統計結果
                      </h2>
                      <span className="text-xs font-medium text-stone-300">
                        樓層小計: {group.total} 份
                      </span>
                    </div>
                    
                    <div className="divide-y divide-stone-100">
                      {group.meals.map((item, idx) => (
                        <div key={idx} className="px-6 py-4 flex justify-between items-center hover:bg-stone-50 transition-colors">
                          <span className="font-medium text-stone-800">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-orange-600">{item.count}</span>
                            <span className="text-stone-400 text-sm">份</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </>
            ) : (
              <section className="bg-white rounded-xl border border-stone-200 shadow-sm p-12 text-center">
                <p className="text-stone-400 italic">請在上方輸入資料以顯示統計結果</p>
              </section>
            )}
          </div>
        </main>

        <footer className="pt-8 text-center text-stone-400 text-xs">
          Meal Order Analytics Tool &bull; {new Date().toLocaleDateString()}
        </footer>
      </div>
    </div>
  );
}
