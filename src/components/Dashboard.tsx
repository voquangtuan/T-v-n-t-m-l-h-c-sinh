import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, AlertTriangle, Smile, Meh, Frown, Heart } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const history = JSON.parse(localStorage.getItem('mood_history') || '[]');
  
  const chartData = history.slice(-10).map((item: any) => ({
    time: new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    score: item.score,
    mood: item.mood
  }));

  const abnormalCount = history.filter((item: any) => item.isAbnormal).length;
  const latestMood = history[history.length - 1]?.mood || 'Chưa có dữ liệu';

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'vui': return <Smile className="text-green-500" />;
      case 'buồn': return <Frown className="text-blue-500" />;
      case 'lo lắng': return <AlertTriangle className="text-yellow-500" />;
      case 'tức giận': return <AlertTriangle className="text-red-500" />;
      case 'nguy cấp': return <AlertTriangle className="text-red-700 animate-pulse" />;
      default: return <Meh className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-olive/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
            <TrendingUp className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-brand-olive/60 uppercase tracking-wider font-bold">Chỉ số tâm trạng</p>
            <h4 className="text-2xl font-serif font-bold">{history[history.length - 1]?.score || 0}%</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-olive/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
            {getMoodIcon(latestMood)}
          </div>
          <div>
            <p className="text-xs text-brand-olive/60 uppercase tracking-wider font-bold">Trạng thái gần nhất</p>
            <h4 className="text-2xl font-serif font-bold capitalize">{latestMood}</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-olive/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertTriangle className={abnormalCount > 0 ? "text-red-600" : "text-gray-400"} />
          </div>
          <div>
            <p className="text-xs text-brand-olive/60 uppercase tracking-wider font-bold">Cảnh báo bất thường</p>
            <h4 className="text-2xl font-serif font-bold">{abnormalCount} lần</h4>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-olive/10">
        <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-brand-olive" />
          Biểu đồ diễn biến tâm lý
        </h3>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5A5A40" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5A5A40" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5A5A40', opacity: 0.6 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5A5A40', opacity: 0.6 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#5A5A40" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-brand-olive/40 italic">
              Bắt đầu trò chuyện với Tâm An để xem dữ liệu phân tích.
            </div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-olive/10">
          <h3 className="font-serif font-bold text-xl mb-4">Nhật ký phân tích</h3>
          <div className="space-y-3">
            {history.slice(-5).reverse().map((item: any, i: number) => (
              <div key={i} className={cn(
                "p-4 rounded-2xl border flex items-start gap-4",
                item.isAbnormal ? "bg-red-50 border-red-100" : "bg-brand-cream/20 border-brand-olive/5"
              )}>
                <div className="mt-1">{getMoodIcon(item.mood)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm capitalize">{item.mood}</span>
                    <span className="text-[10px] text-brand-olive/40">{new Date(item.date).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-brand-olive/80">{item.summary}</p>
                  <p className="text-xs text-brand-olive/60 mt-1 italic">Gợi ý: {item.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
