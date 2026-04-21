import { useEffect, useState } from 'react';
import { IndianRupee, CreditCard, Banknote, Receipt, RefreshCw } from 'lucide-react';

interface DailyStats {
  totalCash: number;
  totalOnline: number;
  count: number;
}

export default function DailyEarnings() {
  const [stats, setStats] = useState<DailyStats>({ totalCash: 0, totalOnline: 0, count: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDailyStats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('https://clinicbackend2-production.up.railway.app/api/reports/daily-collection');
      const data = await res.json();
      setStats({
        totalCash: Number(data?.totalCash || 0),
        totalOnline: Number(data?.totalOnline || 0),
        count: Number(data?.count || 0),
      });
    } catch (err) {
      console.error('Error fetching daily earnings:', err);
      setStats({ totalCash: 0, totalOnline: 0, count: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyStats();
  }, []);

  const total = stats.totalCash + stats.totalOnline;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Daily Earnings</h3>
          <p className="text-sm text-slate-500">Track today&apos;s consultation collections by payment mode.</p>
        </div>
        <button
          onClick={fetchDailyStats}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Cash</p>
              <p className="mt-1 text-3xl font-black text-slate-900">Rs. {stats.totalCash}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-blue-200 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">Online</p>
              <p className="mt-1 text-3xl font-black text-slate-900">Rs. {stats.totalOnline}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-100 text-slate-700">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Bills</p>
              <p className="mt-1 text-3xl font-black text-slate-900">{stats.count}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-8 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/10">
            <IndianRupee className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">Today&apos;s Total Collection</p>
            <p className="mt-2 text-5xl font-black">Rs. {total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
