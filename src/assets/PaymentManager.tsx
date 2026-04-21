import { useEffect } from 'react';
import { IndianRupee, CreditCard, Banknote, TrendingUp } from 'lucide-react';

interface PaymentProps {
  consultationFee: number;
  setConsultationFee: (val: number) => void;
  paymentType: 'Cash' | 'Online';
  setPaymentType: (val: 'Cash' | 'Online') => void;
  onGenerate: () => void; 
  isGenerating?: boolean; 
}

export const PaymentManager = ({ 
  consultationFee, 
  setConsultationFee, 
  paymentType, 
  setPaymentType,onGenerate,isGenerating
}: PaymentProps) => {
  useEffect(() => {
    fetchDailyStats();
  }, []);

  const fetchDailyStats = async () => {
    try {
      const res = await fetch('https://clinicbackend2-production.up.railway.app/api/reports/daily-collection');
      await res.json();
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Payment Selection Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-green-600" />
          Billing Details
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consultation Fee</label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2.5 text-slate-400">₹</span>
              <input 
                type="number" 
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                className="w-full pl-7 p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mode of Payment</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                onClick={() => setPaymentType('Cash')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                  paymentType === 'Cash' 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'bg-slate-50 text-slate-500 border border-slate-100'
                }`}
              >
                <Banknote className="w-4 h-4" /> Cash
              </button>
              <button
                onClick={() => setPaymentType('Online')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                  paymentType === 'Online' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-slate-50 text-slate-500 border border-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Online
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Bill Action */}
<div className="bg-emerald-600 p-5 rounded-2xl shadow-xl shadow-emerald-100 text-white space-y-4">
  <div className="flex items-center gap-3">
    <div className="p-2 bg-emerald-500/50 rounded-lg">
      <TrendingUp className="w-5 h-5 text-white" />
    </div>
    <div>
      <h3 className="font-bold text-sm">Finalize Billing</h3>
      <p className="text-[10px] text-emerald-100">Click to confirm payment and print receipt</p>
    </div>
  </div>
  
  <button 
    onClick={onGenerate}
    disabled={isGenerating}
    className="w-full py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
  >
    {isGenerating ? (
      <span className="animate-pulse">Processing...</span>
    ) : (
      <>
        <CreditCard className="w-4 h-4" />
        Generate & Print Bill
      </>
    )}
  </button>
</div>
    </div>
  );
};
