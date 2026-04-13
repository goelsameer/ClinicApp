import { useState, useEffect, useRef } from 'react';
import React from 'react';
import logoMed from './assets/logoMed.jpeg';
import { PaymentManager } from './assets/PaymentManager';
import DailyEarnings from './assets/DailyEarnings';
import { 
  UserPlus, 
  Stethoscope, 
  ClipboardList, 
  Plus, 
  Trash2, 
  Printer, 
  Calendar, 
  History,
  Clock,
  Search,
  ChevronRight,
  LogOut,
  Phone,
  Wallet
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { format, parseISO } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ShowPatientsMedications from './assets/ShowPatientsMedications';
// import { Patient, Visit, Prescription } from './types';

interface ExtraDataAboutMedicine{
  id?: number;
  visit_id?: number;
  brand_name?: string;
  // frequency?: string;
  // days?: string;
  sideEffects:string;
  // route?: string;
  system?: string;
  generic1?: string;
  generic2?: string;
  price?: string;
  useCase?: string;
  manufacturer?: string;
  offline?: string;
  class?:string;
  category?:string;
}

interface Patient {
  id: number;
  name: string;
  age?: string;
  gender: string;
  address: string;
  phone: string;
  weight: string;
  height: string;
  bp: string;
  pulse?: string;
  rr?: string;
  bmi?: string;
  visit_type?: string;
  created_at: string;
}

 interface Prescription {
  id?: number;
  visit_id?: number;
  brand_name: string;
  dosage: string;
  frequency: string;
  days: string;
  route: string;
  ExtraDetails?: string[];
}

interface Visit {
  id: number;
  
  patient_id: number;
  patient_name?: string;
  age?: number;
  gender?: string;
  address?: string;
  phone?: string;
  weight?: string;
  height?: string;
  bp?: string;
  pulse?: string;
  rr?: string;
  bmi?: string;
  visit_type?: string;
  paymentType?: 'Cash' | 'Online';
  status: 'checked_in' | 'consulting' | 'completed';
  chief_complaint: string;
  diagnosis?: string;
  past_history: string;
  personal_history: string;
  family_history: string;
  family_history_dm?: boolean;        // New field for Diabetes
  family_history_htn?: boolean;
  family_history_thyroid?: boolean;
  treatment_history: string;
  allergies: string;
  advice: string;
  follow_up_date: string;
  created_at: string;
  prescriptions: Prescription[];
  investigations: string;
}

interface PreviousPrescriptionRecord {
  brand_name: string;
  dosage?: string;
  frequency?: string;
  days?: string;
  route?: string;
  created_at?: string;
}

interface PreviousReportMatch {
  id?: number;
  name?: string;
  phone?: string;
  last_visit_date?: string;
  last_medicines?: PreviousPrescriptionRecord[];
  chief_complaint?: string;
  diagnosis?: string;
  past_history?: string;
  personal_history?: string;
  family_history?: string;
  treatment_history?: string;
  allergies?: string;
  advice?: string;
  investigations?: string;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PATIENT_FEEDBACK_URL = 'https://share.google/RGU9SXsGwXMBoAWYI';
const PATIENT_FEEDBACK_QR_SRC =
  `https://quickchart.io/qr?text=${encodeURIComponent(PATIENT_FEEDBACK_URL)}&size=400&margin=4&ecLevel=M`;
// --- Components ---
// PrescriptionPrint.tsx logic integrated into App.tsx
const PrescriptionPrint = React.forwardRef<
  HTMLDivElement, 
  { 
    visit: Visit, 
    extraData: Record<number, ExtraDataAboutMedicine>,
    isHindi: boolean,
    previousReports: PreviousReportMatch[]
  }
>(({ visit, extraData, isHindi, previousReports }, ref) => {
  const heightCm = Number(visit.height);
  const weightKg = Number(visit.weight);
  const calculatedBmi =
    Number.isFinite(heightCm) &&
    Number.isFinite(weightKg) &&
    heightCm > 0 &&
    weightKg > 0
      ? (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1)
      : '';

  return (
    <div ref={ref} className="bg-white p-12 text-[12px] text-black font-sans leading-relaxed">
      {/* HEADER */}
      <div className="flex justify-between border-b-2 border-slate-900 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold uppercase font-bold text-purple-950">Dr.Pawan Goel</h1>
          <p className="font-bold">DM Endocrinology(SGPI Lucknow)</p>
           <p className="font-bold">MD Medicine(AIIMS Delhi)</p>
            <p className="font-bold">M.B.B.S.(MAMC)</p>
             <p className="font-bold">DMC -R/16869</p>
            <p className="font-bold text-purple-950">Consultant Endocrinologist and Diabetologist</p>
        </div>
        <div className="text-right text-[14px] text-slate-950 mt-5">
            <p className="text-bold"><b>Date:</b> {format(new Date(visit.created_at), 'PPP')}</p>
          <img src={logoMed} alt="Clinic Logo" className="w-24 h-24 object-contain ml-10" />
        </div>
      </div>

      {/* PATIENT INFO */}
      <div className="">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4 font-semibold text-slate-900 border-b-2 border-slate-900 pb-4">
  {/* Name */}
  <div className="flex items-end flex-1 min-w-[200px]">
    <span className="whitespace-nowrap mr-2">Name:</span>
    <span className="border-b border-black flex-1 px-2 text-center">{visit.patient_name}</span>
  </div>

  {/* Age */}
  <div className="flex items-end w-24">
    <span className="whitespace-nowrap mr-2">Age:</span>
    <span className="border-b border-black flex-1 text-center">{visit.age}Y</span>
  </div>

  {/* Sex */}
  <div className="flex items-end w-24">
    <span className="whitespace-nowrap mr-2">Sex:</span>
    <span className="border-b border-black flex-1 text-center">{visit.gender}</span>
  </div>

  {/* Height */}
  <div className="flex items-end w-24">
    <span className="whitespace-nowrap mr-2">Height:</span>
    <span className="border-b border-black flex-1 text-center">{visit.height || ''}cm</span>
  </div>

  {/* Weight */}
  <div className="flex items-end w-24">
    <span className="whitespace-nowrap mr-2">Weight:</span>
    <span className="border-b border-black flex-1 text-center">{visit.weight || ''}Kg</span>
  </div>

  {/* BMI */}
  <div className="flex items-end w-24">
    <span className="whitespace-nowrap mr-2">BMI:</span>
    <span className="border-b border-black flex-1 text-center">{calculatedBmi}</span>
  </div>

  {/* BP/P */}
  <div className="flex items-end w-32">
    <span className="whitespace-nowrap mr-2">BP/P:</span>
    <span className="border-b border-black flex-1 text-center">{visit.bp || ''}</span>
  </div>

  {/* SpO2 */}
  <div className="flex items-end w-24">
    <span className="whitespace-nowrap mr-2">SpO2:</span>
    <span className="border-b border-black flex-1 text-center"></span>
  </div>

  {/* RBS */}
  <div className="flex items-end w-24">
    <span className="whitespace-nowrap mr-2">RBS:</span>
    <span className="border-b border-black flex-1 text-center"></span>
  </div>
</div>
      </div>

      {/* CLINICAL SECTION */}
      <div className="mb-6">
        <h3 className="font-bold border-b mb-2 uppercase text-[10px] text-slate-500">Clinical Notes & History</h3>
        <p className="mb-2"><b>Chief Complaint:</b> {visit.chief_complaint || 'None'}</p>
        <p className="mb-2"><b>Diagnosis:</b> {visit.diagnosis || 'N/A'}</p>
        <p className="text-xs text-slate-700"><b>Allergies:</b> {visit.allergies || 'No known allergies'}</p>
      </div>

      {previousReports.some((report) =>
        Boolean(
          report.chief_complaint ||
          report.diagnosis ||
          report.past_history ||
          report.personal_history ||
          report.family_history ||
          report.treatment_history ||
          report.allergies ||
          report.advice ||
          report.investigations ||
          (report.last_medicines && report.last_medicines.length > 0)
        )
      ) && (
        <div className="mb-6">
          <h3 className="font-bold border-b mb-2 uppercase text-[10px] text-slate-500">Previous Clinical Notes & Old Reports</h3>

          {previousReports.map((report, index) => {
            const hasClinicalContent = Boolean(
              report.chief_complaint ||
              report.diagnosis ||
              report.past_history ||
              report.personal_history ||
              report.family_history ||
              report.treatment_history ||
              report.allergies ||
              report.advice ||
              report.investigations
            );
            const hasMedicineContent = Boolean(report.last_medicines && report.last_medicines.length > 0);

            if (!hasClinicalContent && !hasMedicineContent) {
              return null;
            }

            return (
              <div key={`${report.last_visit_date || 'report'}-${index}`} className="mb-3 rounded border border-slate-200 p-3 bg-slate-50">
                {report.last_visit_date && (
                  <p className="font-semibold">
                    Previous Visit: {format(new Date(report.last_visit_date), 'PPP')}
                  </p>
                )}
                <div className="mt-2 space-y-1 text-xs text-slate-700">
                  {report.chief_complaint && <p><b>Chief Complaint:</b> {report.chief_complaint}</p>}
                  {report.diagnosis && <p><b>Diagnosis:</b> {report.diagnosis}</p>}
                  {report.past_history && <p><b>Past History:</b> {report.past_history}</p>}
                  {report.personal_history && <p><b>Personal History:</b> {report.personal_history}</p>}
                  {report.family_history && <p><b>Family History:</b> {report.family_history}</p>}
                  {report.treatment_history && <p><b>Treatment History:</b> {report.treatment_history}</p>}
                  {report.allergies && <p><b>Allergies:</b> {report.allergies}</p>}
                  {report.advice && <p><b>Advice:</b> {report.advice}</p>}
                  {report.investigations && <p><b>Investigations:</b> {report.investigations}</p>}
                  {report.last_medicines && report.last_medicines.length > 0 && (
                    <p>
                      <b>Previous Medicines:</b>{' '}
                      {report.last_medicines
                        .map((medicine) =>
                          `${medicine.brand_name}${medicine.dosage ? ` (${medicine.dosage})` : ''}${medicine.frequency ? ` - ${medicine.frequency}` : ''}`
                        )
                        .join(', ')}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-bold border-b mb-2 uppercase text-[10px] text-slate-500">Investigations / Tests</h3>
        <p className="text-xs text-slate-700">{visit.investigations || 'None'}</p>
      </div>

      {/* MEDICINES */}
      <div className="mb-8">
        <h3 className="font-bold border-b mb-3 uppercase text-[10px] text-slate-500 flex items-center gap-1">
          <span className="text-lg">℞</span> Medicine Advised
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="border p-2">S.No</th>
              <th className="border p-2">Medicine (Brand)</th>
              <th className="border p-2">Frequency</th>
              <th className="border p-2">Route</th>
              <th className="border p-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            {/* Inside PrescriptionPrint Table Body */}
{visit.prescriptions.map((m, i) => {
  // Helper to translate
  const translate = (val: string) => {
    if (!isHindi) return val;
    // Look up the translation, or return original if not found
    const key = val.toLowerCase().trim();
    const HINDI_MAP: Record<string, string> = {
         // Frequency
  'od': 'दिन में एक बार (OD)',
  'bd': 'दिन में दो बार (BD)',
  'tds': 'दिन में तीन बार (TDS)',
  'qid': 'दिन में चार बार (QID)',
  'hs': 'रात को सोते समय (HS)',
  'sos': 'ज़रूरत पड़ने पर (SOS)',
  'bbf': 'नाश्ते से पहले (BBF)',
  'abf': 'नाश्ते के बाद (ABF)',
  // Route
  'oral': 'मुंह द्वारा (Oral)',
  'iv': 'नस द्वारा (IV)',
  'im': 'मांसपेशी द्वारा (IM)',
  'topical': 'त्वचा पर लगाने के लिए (Topical)',
  // Units
  'Days': 'दिन',

      };
      return HINDI_MAP[key] || val;
  };

  const medicineExtra = extraData[i];
  const genericNames = [medicineExtra?.generic1, medicineExtra?.generic2]
    .filter((name): name is string => Boolean(name && name !== 'Data unavailable'))
    .join(', ');

  return (
    <tr key={i}>
      <td className="border p-2 text-center">{i + 1}</td>
      <td className="border p-2 font-bold">
        <div className="font-bold">{m.brand_name}</div>
        {genericNames && <div className="mt-1 font-normal">({genericNames})</div>}
      </td>
      {/* Translated Frequency */}
      <td className="border p-2 font-medium">
        {isHindi ? translate(m.frequency) : m.frequency}
      </td>
      {/* Translated Route */}
      <td className="border p-2">
        {isHindi ? translate(m.route) : m.route}
      </td>
      {/* Translated Duration */}
      <td className="border p-2">
        {m.days} {isHindi ? "दिन" : "Days"}
      </td>
    </tr>
  );
})}
          </tbody>
        </table>
      </div>

      {/* ADVICE */}
      <div className="mb-6">
        <h3 className="font-bold border-b mb-1 uppercase text-[10px] text-slate-500">Advice</h3>
        <p className="italic text-slate-700 bg-slate-50 p-3 rounded">{visit.advice || 'General rest and hydration.'}</p>
      </div>

      <div className="mb-6 flex justify-start">
        <div className="rounded border border-slate-300 bg-white p-4">
          <img
            src={PATIENT_FEEDBACK_QR_SRC}
            alt="Barcode linking to clinic page"
            className="h-28 w-28 object-contain"
          />
        </div>
      </div>

      {/* FOLLOWUP & SIGNATURE */}
      <div className="mt-12 border-t border-slate-200 pt-6">
      <div className="flex justify-between items-end gap-6">
        <div>
          <p><b>Next Follow Up:</b> {visit.follow_up_date ? format(parseISO(visit.follow_up_date), 'PPP') : 'As needed'}</p>
        </div>
        <div className="text-center">
          <div className="mt-8 w-40 border-b border-black mb-1"></div>
          <p className="font-bold">Dr.Pawan Goel</p>
        </div>
      </div>
      <div className="mt-6 bg-indigo-800 text-white text-[11px] px-6 py-3 flex flex-wrap justify-between items-start gap-4">

  {/* LEFT SIDE */}
  <div className="space-y-1">
    <p>📍 AE-164, Shalimar Bagh, Delhi, 110088</p>
    <p>📞 Contact: 9999078196, Email: Pawangoel0@gmail.com</p>
  </div>

  {/* RIGHT SIDE */}
  <div className="text-right space-y-1">
    <p>Timings (Mon - Sat 8:00 to 9:30 am 6:00 to 9:00 pm)</p>
    <p>Valid for 5 days Non MLC</p>
  </div>

</div>
    </div>
    </div>
    
  );
});

const BillPrint = React.forwardRef<
  HTMLDivElement,
  {
    visit: Visit;
    consultationFee: number;
    paymentType: 'Cash' | 'Online';
  }
>(({ visit, consultationFee, paymentType }, ref) => {
  return (
    <div ref={ref} className="bg-white p-10 text-black">
      <div className="border-2 border-slate-900 rounded-3xl overflow-hidden">
        <div className="bg-slate-900 px-8 py-6 text-white flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Clinic Bill</p>
            <h2 className="mt-2 text-3xl font-black">Dr. Pawan Goel Clinic</h2>
            <p className="mt-1 text-sm text-slate-300">AE-164, Shalimar Bagh, Delhi, 110088</p>
          </div>
          <div className="text-right text-sm">
            <p><b>Date:</b> {format(new Date(), 'PPP')}</p>
            <p className="mt-1"><b>Bill For:</b> Consultation</p>
          </div>
        </div>

        <div className="px-8 py-8 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Patient</p>
              <p className="mt-3 text-2xl font-black text-slate-900">{visit.patient_name || 'N/A'}</p>
              <p className="mt-2 text-sm text-slate-600">{visit.age || '--'}Y / {visit.gender || '--'}</p>
              <p className="mt-1 text-sm text-slate-600">{visit.phone || 'No phone'}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 p-5 bg-emerald-50">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">Payment Mode</p>
              <p className="mt-3 text-2xl font-black text-emerald-900">{paymentType}</p>
              <p className="mt-2 text-sm text-emerald-800">Consultation charges collected</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] bg-slate-100 px-6 py-4 text-sm font-bold text-slate-600">
              <p>Description</p>
              <p>Amount</p>
            </div>
            <div className="grid grid-cols-[1fr_auto] px-6 py-5 text-base text-slate-800 border-t border-slate-200">
              <p>Doctor Consultation Fee</p>
              <p className="font-bold">Rs. {consultationFee}</p>
            </div>
            <div className="grid grid-cols-[1fr_auto] px-6 py-5 text-xl font-black text-slate-900 border-t-2 border-slate-900">
              <p>Total</p>
              <p>Rs. {consultationFee}</p>
            </div>
          </div>

          <div className="flex justify-between items-end gap-6 pt-10">
            <div className="text-sm text-slate-500">
              <p>This is a computer-generated bill.</p>
              <p>Please keep it for your records.</p>
            </div>
            <div className="text-center">
              <div className="w-40 border-b border-black mb-2" />
              <p className="font-bold">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const FormInput = ({ label, value, onChange, placeholder, required = false }: any) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
      {label} {!required && <span className="text-slate-300 font-normal">(Optional)</span>}
    </label>
    <input 
      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default function App() {
  const API_BASE_URL = 'https://clinicbackend2-production.up.railway.app';
  const [role, setRole] = useState<'receptionist' | 'doctor' | null>(null);
  const [activeRouteIndex, setActiveRouteIndex] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [view, setView] = useState<'list' | 'register' | 'consult' | 'history' | 'medication_manager' | 'patient_records' | 'bill_preview' | 'daily_earnings'>('list');
  const [selectedHistoryPatient, setSelectedHistoryPatient] = useState<Patient | null>(null);
const [patientMedHistory, setPatientMedHistory] = useState<any[]>([]);
  const [showToast] = useState(false);
  const [paymentType, setPaymentType] = useState<'Cash' | 'Online'>('Cash');
const [consultationFee, setConsultationFee] = useState<number>(1400);
const [activeFreqIndex, setActiveFreqIndex] = useState<number | null>(null);
const [newMed, setNewMed] = useState({
 brand_name: '',
  price: '',
  manufacturer: '',
  category: '',
  unit: '', // New field for the "tube of 25 gm" part
  generic1: '',
  generic2: '',
  sideEffects: '',
  useCase: '',
  offline: 'No',
  class: '',
  system: ''
});
  const [patients, setPatients] = useState<Patient[]>([]);
  const [queue, setQueue] = useState<Visit[]>([]);
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [activeVisit, setActiveVisit] = useState<Visit | null>(null);
  const [medHistory, setMedHistory] = useState<any[]>([]);
  const [queueSearchQuery, setQueueSearchQuery] = useState('');
  const [patientRecordsSearchQuery, setPatientRecordsSearchQuery] = useState('');
const [suggestions, setSuggestions] = useState<any[]>([]);
const [typedMedicine, setTypedMedicine] = useState<string>("");
const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);
// const [showHistory, setShowHistory] = useState(false);
const [ExtraItemsData, setExtraItemsData] = useState<Record<number, ExtraDataAboutMedicine>>({});
const [isHindi, setIsHindi] = useState(false);
// const [searchQueryPatient,setsearchqueryPatient]=useState('');
const [searchResults, setSearchResults] = useState<Patient[]>([]);
const [completeAfterBillPrint, setCompleteAfterBillPrint] = useState(false);
const [isGeneratingDiagnosis, setIsGeneratingDiagnosis] = useState(false);
const [diagnosisError, setDiagnosisError] = useState('');
const diagnosisTimerRef = useRef<number | null>(null);
const diagnosisRequestRef = useRef(0);
// const checkReturningPatient = async (name: string, phone: string) => {
//   if (!name || !phone) return;
useEffect(()=>{
  console.log(medHistory);
},[])
//   try {
//     const response = await fetch(
//       `https://clinicbackend2-production.up.railway.app/api/patients/last-prescriptions?name=${encodeURIComponent(name)}&phone=${phone}`
//     );
//     const data = await response.json();
    
//     if (data.length > 0) {
//       console.log("Found existing patient medicines:", data[0].last_medicines);
//       setMedHistory(data[0].last_medicines);
//     } else {
//       setMedHistory([]); // No exact match found
//     }
//   } catch (error) {
//     console.error("Error matching patient:", error);
//   }
// };
const normalizeValue = (value?: string) => (value || '').trim().toLowerCase();
const normalizePhone = (value?: string) => (value || '').replace(/\D/g, '');

const loadPatientHistoryForPrint = async (visit: Visit) => {
  if (!visit.patient_name || !visit.phone) {
    setPatientHistory([]);
    setMedHistory([]);
    return;
  }

  try {
    const exactHistoryRes = await fetch(
      `https://clinicbackend2-production.up.railway.app/api/patients/last-prescriptions?name=${encodeURIComponent(visit.patient_name)}&phone=${encodeURIComponent(visit.phone)}`
    );
    const exactHistoryData = exactHistoryRes.ok ? await exactHistoryRes.json() : [];
    const matchedReports = Array.isArray(exactHistoryData)
      ? exactHistoryData.filter((item) =>
          normalizeValue(item.name) === normalizeValue(visit.patient_name) &&
          normalizePhone(item.phone) === normalizePhone(visit.phone)
        )
      : [];
    setPatientHistory(matchedReports);

    const patientSearchRes = await fetch(
      `https://clinicbackend2-production.up.railway.app/api/patients/search?query=${encodeURIComponent(visit.phone)}`
    );
    const patientSearchData = patientSearchRes.ok ? await patientSearchRes.json() : [];
    const matchedPatient = Array.isArray(patientSearchData)
      ? patientSearchData.find((patient: Patient) =>
          normalizeValue(patient.name) === normalizeValue(visit.patient_name) &&
          normalizePhone(patient.phone) === normalizePhone(visit.phone)
        )
      : null;

    if (matchedPatient?.id) {
      const medicationHistoryRes = await fetch(
        `https://clinicbackend2-production.up.railway.app/api/patients/${matchedPatient.id}/medication-history`
      );
      const medicationHistoryData = medicationHistoryRes.ok ? await medicationHistoryRes.json() : [];
      setMedHistory(Array.isArray(medicationHistoryData) ? medicationHistoryData : []);
    } else {
      setMedHistory([]);
    }
  } catch (error) {
    console.error("Error loading previous patient history for print:", error);
    setPatientHistory([]);
    setMedHistory([]);
  }
};

useEffect(() => {
  if (!activeVisit?.id) {
    setPatientHistory([]);
    setMedHistory([]);
    return;
  }

  loadPatientHistoryForPrint(activeVisit);
}, [activeVisit?.id]);

useEffect(() => {
  return () => {
    if (diagnosisTimerRef.current) {
      window.clearTimeout(diagnosisTimerRef.current);
      diagnosisTimerRef.current = null;
    }
  };
}, []);

const clearDiagnosisTimer = () => {
  if (diagnosisTimerRef.current) {
    window.clearTimeout(diagnosisTimerRef.current);
    diagnosisTimerRef.current = null;
  }
};

const requestDiagnosisSuggestion = async (visitId: number, complaint: string) => {
  const trimmedComplaint = complaint.trim();
  if (!trimmedComplaint) return;

  const requestId = Date.now();
  diagnosisRequestRef.current = requestId;

  try {
    setIsGeneratingDiagnosis(true);
    setDiagnosisError('');

    const res = await fetch(`http://localhost:3000/api/diagnosis/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chief_complaint: trimmedComplaint })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || 'Failed to generate diagnosis');
    }

    if (diagnosisRequestRef.current !== requestId) return;

    setActiveVisit((current) => {
      if (!current || current.id !== visitId) return current;
      if ((current.chief_complaint || '').trim() !== trimmedComplaint) return current;
      return { ...current, diagnosis: data.diagnosis || '' };
    });
  } catch (error) {
    console.error('Diagnosis generation failed:', error);
    if (diagnosisRequestRef.current === requestId) {
      setDiagnosisError('Diagnosis suggestion unavailable');
    }
  } finally {
    if (diagnosisRequestRef.current === requestId) {
      setIsGeneratingDiagnosis(false);
    }
  }
};

const scheduleDiagnosisSuggestion = () => {
  if (!activeVisit?.id) return;

  const complaint = activeVisit.chief_complaint?.trim();
  clearDiagnosisTimer();

  if (!complaint) {
    setDiagnosisError('');
    setIsGeneratingDiagnosis(false);
    return;
  }

  diagnosisTimerRef.current = window.setTimeout(() => {
    requestDiagnosisSuggestion(activeVisit.id, complaint);
  }, 5000);
};

// const [isSearching, setIsSearching] = useState(false);
const printRef = useRef<HTMLDivElement>(null);
const billPrintRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });
  const handleBillPrint = useReactToPrint({
    contentRef: billPrintRef,
    onAfterPrint: async () => {
      if (!completeAfterBillPrint) return;
      setCompleteAfterBillPrint(false);
      await saveConsultation('completed');
    }
  });
  const handleSearch = async (val: string) => {
  setPatientRecordsSearchQuery(val);
  if (val.length < 3) {
    setSearchResults([]);
    return;
  }

  try {
    const res = await fetch(`https://clinicbackend2-production.up.railway.app/api/patients/search?query=${val}`);
    const data = await res.json();
    setSearchResults(data);
  } catch (err) {
    console.error("Search error", err);
  }
};
const selectPatient = async (patient: Patient, matchedPatients: Patient[] = [patient]) => {
  try {
    const uniquePatients = matchedPatients.filter(
      (item, index, self) =>
        item?.id &&
        self.findIndex((candidate) => String(candidate.id) === String(item.id)) === index
    );

    const histories = await Promise.all(
      uniquePatients.map(async (matchedPatient) => {
        const res = await fetch(`https://clinicbackend2-production.up.railway.app/api/patients/${matchedPatient.id}/medication-history`);
        if (!res.ok) return [];
        const history = await res.json();
        return Array.isArray(history) ? history : [];
      })
    );

    const mergedHistory = histories
      .flat()
      .filter(
        (item, index, self) =>
          self.findIndex((candidate) => String(candidate.visit_id) === String(item.visit_id)) === index
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // 2. Update states
    setPatientMedHistory(mergedHistory);
    setSelectedHistoryPatient(patient);
    
    // 3. Clear search and switch view
    setPatientRecordsSearchQuery('');
    setSearchResults([]);
    setView('patient_records'); 
  } catch (err) {
    console.error("Failed to load history:", err);
  }
};
const parseMedicineDetails = (dataString: string,idx:number) => {
  if (!dataString || typeof dataString !== 'string') return null;
  console.log(dataString);
  const parts = dataString.split('|');
  
  // Helper to handle 'nan' or empty values
  const clean = (val: string) => {
    if (!val || val.toLowerCase() === 'nan' || val.trim() === '') {
      return "Data unavailable";
    }
    return val.trim();
  };
setExtraItemsData((prev) => ({
  ...prev,
  [idx]: {
    price: clean(parts[0]),
    manufacturer: clean(parts[1]),
    system: clean(parts[2]),
    generic1: clean(parts[4]),
    generic2: clean(parts[5]),
    useCase: clean(parts[7]),
    offline: clean(parts[8]),
  } as ExtraDataAboutMedicine
}));
};

const fetchMedicineDetails = async (medicineName: string, idx: number) => {
  if (!medicineName) return;

  try {
    const res = await fetch(`https://clinicbackend2-production.up.railway.app/api/medicine-details?name=${encodeURIComponent(medicineName)}`);
    if (!res.ok) return;
    const data = await res.json();

    if (typeof data === 'string') {
      parseMedicineDetails(data, idx);
      return;
    }

    if (data && typeof data === 'object') {
      const detailsString = [
        data.price,
        data.manufacturer,
        data.system,
        '',
        data.generic1,
        data.generic2,
        '',
        data.useCase,
        data.offline
      ].join('|');
      parseMedicineDetails(detailsString, idx);
    }
  } catch (error) {
    console.error("Failed to fetch medicine details:", error);
  }
};

const selectMedicineSuggestion = async (idx: number, medicine: any) => {
  updatePrescription(idx, 'brand_name', medicine.name || medicine.brand_name || '');
  setTypedMedicine('');
  setSuggestions([]);
  setActiveInputIndex(null);
  await fetchMedicineDetails(medicine.name || medicine.brand_name || '', idx);
};
  // Form States
  const [newPatient, setNewPatient] = useState({
    name: '', age: '', gender: 'Male', address: '', phone: '', weight: '', height: '', bp: '',bmi: '',  
  pulse: '',
  rr: '',visit_type: 'Walk-in'
  });

const handleAddMedicine = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!newMed.brand_name.trim()) return alert("Brand name is required");

  try {
    const response = await fetch('https://clinicbackend2-production.up.railway.app/api/medicines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMed)
    });

    if (response.ok) {
      alert("Medicine added and indexed in Redis!");
      // Reset logic...
    } else {
      const err = await response.json();
      alert(`Error: ${err.error}`);
    }
  } catch (error) {
    console.error("Connection failed", error);
  }
};
useEffect(() => {
  const timer = setTimeout(() => {
    if (!typedMedicine) {
      setSuggestions([]);
      return;
    }

    fetch(`https://clinicbackend2-production.up.railway.app/api/autocomplete?currentTyped=${encodeURIComponent(typedMedicine)}`)
      .then(res => res.json())
      .then(data => setSuggestions(data))
      .catch(err => console.error(err));

  }, 300);

  return () => clearTimeout(timer);

}, [typedMedicine]);
//   const fetchMedicines = async (value:any) => {
//   const res = await fetch(`/api/autocomplete?currentTyped=${value}`);
//   const data = await res.json();
//   setSuggestions(data);
// };
useEffect(() => {
  if (newPatient.weight && newPatient.height) {
    const weight = parseFloat(newPatient.weight);
    const heightInMeters = parseFloat(newPatient.height) / 100;
    if (heightInMeters > 0) {
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setNewPatient(prev => ({ ...prev, bmi: bmiValue }));
    }
  }
}, [newPatient.weight, newPatient.height]);
  useEffect(() => {
    if (isAuthenticated) {
      fetchPatients();
      fetchQueue();
      // Setup Polling for real-time updates (every 5 seconds)
      const pollInterval = setInterval(() => {
        fetchQueue();
        fetchPatients();
      }, 5000);

      return () => {
        clearInterval(pollInterval);
      };
    }
  }, [isAuthenticated]);

  const fetchPatients = async () => {
    const res = await fetch(`${API_BASE_URL}/api/patients`);
    setPatients(await res.json());
  };

  const fetchQueue = async () => {
    const res = await fetch(`${API_BASE_URL}/api/queue`);
    setQueue(await res.json());
  };

  const clearQueue = async () => {
    if (window.confirm('Are you sure you want to clear the entire active queue? This will mark all current visits as completed.')) {
      await fetch(`${API_BASE_URL}/api/queue/clear`, { method: 'POST' });
      fetchQueue();
    }
  };
const deleteFromQueue = async (visitId: number) => {
  if (window.confirm('Are you sure you want to remove this patient from the queue?')) {
    try {
      // Assuming your backend has a DELETE endpoint for visits
      await fetch(`${API_BASE_URL}/api/visits/${visitId}`, { 
        method: 'DELETE' 
      });

      fetchQueue();
    } catch (error) {
      console.error("Failed to remove patient from queue:", error);
    }
  }
};
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validPasswords: Record<string, string> = {
      doctor: 'doctor123',
      receptionist: 'staff123'
    };

    if (role && password === validPasswords[role]) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid password. Please try again.');
    }
  };

  const registerPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/api/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPatient)
    });
    const { id } = await res.json();
    console.log(res);
    // Auto check-in
    await fetch(`${API_BASE_URL}/api/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: id })
    });
    
    setNewPatient({ name: '', age: '', gender: 'Male', address: '', phone: '', weight: '', height: '', bp: '' ,bmi: '',pulse: '',  
  rr: '',visit_type: 'Walk-in'});
    fetchPatients();
    fetchQueue();
    setView('list');
  };
// useEffect(() => {
//   const interval = setInterval(() => {
//     console.log(medHistory);
//   }, 5000);

//   return () => clearInterval(interval); // cleanup on unmount or dependency change
// }, [medHistory]); // keep dependency if you want latest value
  const checkIn = async (patientId: number) => {
    await fetch(`${API_BASE_URL}/api/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: patientId })
    });
    fetchQueue();
  };

  const startConsultation = async (visitId: number) => {
    // Update status to consulting immediately
    await fetch(`${API_BASE_URL}/api/visits/${visitId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'consulting', prescriptions: [] })
    });

    const res = await fetch(`${API_BASE_URL}/api/visits/${visitId}`);
    const data = await res.json();
    setActiveVisit(data);
    setDiagnosisError('');
    await loadPatientHistoryForPrint(data);
    
    setView('consult');
    fetchQueue(); // Refresh queue to show "In Consultation"
  };
  const saveConsultation = async (status: 'consulting' | 'completed') => {
    if (!activeVisit) return;
    const payload = {
      ...activeVisit,
      status,
      fee: consultationFee,
      paymentType,
      completedAt: status === 'completed' ? new Date().toISOString() : null
    };

    await fetch(`${API_BASE_URL}/api/visits/${activeVisit.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (status === 'completed') {
      const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbx8uDH5Lcq4qJF8UwvZwC-nJ1UpGKDcft0aDNtfXN0XL6ry3iXRsTeD_VPtU19Tq89C/exec";
      const matchedPatient = patients.find((patient) => patient.id === activeVisit.patient_id);
      const followUpDate = activeVisit.follow_up_date
        ? format(parseISO(activeVisit.follow_up_date), 'PPP')
        : 'As needed';
      const visitType = activeVisit.visit_type || matchedPatient?.visit_type || 'N/A';
      const bmi = activeVisit.bmi || matchedPatient?.bmi || 'N/A';
      const pulseRate = activeVisit.pulse || matchedPatient?.pulse || 'N/A';
      const respiratoryRate = activeVisit.rr || matchedPatient?.rr || 'N/A';
      const paymentMode = paymentType || activeVisit.paymentType || 'N/A';
      const formattedMedicines = (activeVisit.prescriptions || [])
        .map((prescription) => {
          const medicineName = prescription.brand_name || 'Med';
          const dosage = prescription.dosage?.trim();
          return dosage ? `${medicineName} (${dosage})` : medicineName;
        })
        .join(' | ');

    const excelData = {
  date: new Date().toLocaleDateString('en-IN'),
  name: activeVisit.patient_name || 'N/A',
  phone: activeVisit.phone || 'N/A',
  age: activeVisit.age ? `${activeVisit.age}` : 'N/A',
  gender: activeVisit.gender || 'N/A',
  weight: activeVisit.weight || 'N/A',
  bp: activeVisit.bp || 'N/A',
  pulse_rate: pulseRate,
  rr: respiratoryRate,
  bmi: bmi,
  visit_type: visitType,
  payment_type: paymentMode,
  follow_up_date: followUpDate,
  // Fixed: removed quotes from activeVisit.diagnosis
  diagnosis: activeVisit.diagnosis?.trim() || 'N/A', 
  // Safely map medicines
  medicines: formattedMedicines,
  // Safe handling for investigations
  investigations: Array.isArray(activeVisit.investigations) 
    ? activeVisit.investigations.join(', ') 
    : (activeVisit.investigations || 'None')
};

// Push to Google Sheets
fetch(GOOGLE_SHEET_URL, {
  method: 'POST',
  mode: 'no-cors', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(excelData)
})
.then(() => console.log("Data sent to Google Sheets"))
.catch(err => console.error("Fetch error:", err));
      setView('list');
      setActiveVisit(null);
      fetchQueue();
    }
  };

  const addPrescription = () => {
    if (!activeVisit) return;
    setActiveVisit({
      ...activeVisit,
      prescriptions: [
        ...activeVisit.prescriptions,
        { brand_name: '', dosage: '', frequency: '', days: '', route: 'Oral' }
      ]
    });
  };

  const updatePrescription = (index: number, field: keyof Prescription, value: string) => {
    if (!activeVisit) return;
    const newRx = [...activeVisit.prescriptions];
    newRx[index] = { ...newRx[index], [field]: value };
    setActiveVisit({ ...activeVisit, prescriptions: newRx });
  };

  const removePrescription = (index: number) => {
    if (!activeVisit) return;
    const newRx = activeVisit.prescriptions.filter((_, i) => i !== index);
    setActiveVisit({ ...activeVisit, prescriptions: newRx });
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="inline-flex p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 mb-6">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Dr. Pawan Goel Clinic</h1>
            <p className="mt-2 text-slate-500">Select your workspace to continue</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => setRole('receptionist')}
              className="group relative flex items-center p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left"
            >
              <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-lg font-bold text-slate-900">Receptionist</p>
                <p className="text-sm text-slate-500">Register patients & manage check-ins</p>
              </div>
              <ChevronRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </button>
            <button 
              onClick={() => setRole('doctor')}
              className="group relative flex items-center p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left"
            >
              <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                <Stethoscope className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-lg font-bold text-slate-900">Doctor</p>
                <p className="text-sm text-slate-500">Consultations & Prescriptions</p>
              </div>
              <ChevronRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <button 
            onClick={() => setRole(null)}
            className="mb-6 text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1"
          >
            ← Back to selection
          </button>
          <div className="text-center mb-8">
            <div className={cn(
              "inline-flex p-3 rounded-xl mb-4",
              role === 'doctor' ? "bg-indigo-100 text-indigo-600" : "bg-blue-100 text-blue-600"
            )}>
              {role === 'doctor' ? <Stethoscope className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">{role} Login</h2>
            <p className="text-sm text-slate-500">Please enter your password to access the portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
                autoFocus
              />
              {loginError && <p className="text-xs text-red-600 font-medium">{loginError}</p>}
            </div>
            <button 
              type="submit"
              className={cn(
                "w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all",
                role === 'doctor' ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
              )}
            >
              Access Portal
            </button>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Demo Passwords: {role === 'doctor' ? 'doctor123' : 'staff123'}
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
  return (
    
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900">Dr.Pawan Goel Clinic</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setView('list')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
              view === 'list' ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <ClipboardList className="w-5 h-5" />
            {role === 'receptionist' ? 'Patient Queue' : 'Consultations'}
          </button>
          {role === 'receptionist' && (
            <button 
              onClick={() => setView('register')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                view === 'register' ? "bg-blue-50 text-blue-700" 
                
                : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <UserPlus className="w-5 h-5" />
              Register Patient
            </button>
          )}
          
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button 
              onClick={clearQueue}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Clear Queue
            </button>
          </div>

          {role === 'doctor' && (
            <>
              <button 
                onClick={() => setView('medication_manager')}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  view === 'medication_manager' ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <Plus className="w-5 h-5" />
                Add New Medicine
              </button>

              <button 
                onClick={() => setView('patient_records')}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  view === 'patient_records' ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <History className="w-5 h-5" />
                Patient Records
              </button>

              <button 
                onClick={() => setView('daily_earnings')}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  view === 'daily_earnings' ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <Wallet className="w-5 h-5" />
                Daily Earnings
              </button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
              {role[0].toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 capitalize">{role}</p>
              <p className="text-[10px] text-slate-500">Clinic Staff</p>
            </div>
          </div>
          <button 
            onClick={() => { setRole(null); setIsAuthenticated(false); setPassword(''); setView('list'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="relative mb-8">
  {/* Search Results Dropdown */}
  
</div>

        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-900">
            
            {view === 'list' && (role === 'receptionist' ? 'Patient Management' : 'Doctor Dashboard')}
            {view === 'register' && 'New Patient Registration'}
            {view === 'consult' && 'Active Consultation'}
            {view === 'bill_preview' && 'Billing Preview'}
            {view === 'daily_earnings' && 'Daily Earnings'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search patient..." 
                value={queueSearchQuery}
                onChange={(e) => setQueueSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all w-64"
              />
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Receptionist: Register View */}
          {/* --- Medicine Management View --- */}
{view === 'medication_manager' && (
  <div className="max-w-2xl mx-auto space-y-6">
    {/* Toast Notification */}
    {showToast && (
      <div className="fixed top-20 right-8 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
        <div className="bg-white/20 p-1 rounded-full">
          <Plus className="w-4 h-4" />
        </div>
        <p className="font-bold text-sm">Medicine submitted to database!</p>
      </div>
    )}

   <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-xl border border-slate-100">
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-slate-800">Add New Medicine</h2>
    <p className="text-slate-500 text-sm">Fill in the details to expand the clinic inventory.</p>
  </div>

  <form onSubmit={handleAddMedicine} className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* MANDATORY FIELD */}
    <div className="md:col-span-2">
      <FormInput 
        label="Brand Name" 
        value={newMed.brand_name} 
        onChange={(v:string) => setNewMed({...newMed, brand_name: v})} 
        placeholder="Enter Medicine Name (e.g., Dolo 650)"
        required={true}
      />
    </div>

    {/* NEW FIELD: Unit (Crucial for your Redis Pipe Format) */}
    <FormInput 
      label="Unit / Packaging" 
      value={newMed.unit} 
      onChange={(v:string) => setNewMed({...newMed, unit: v})} 
      placeholder="e.g., Strip of 10 tablets, 100ml bottle, tube of 25 gm" 
    />

    <FormInput label="Price" value={newMed.price} onChange={(v:string) => setNewMed({...newMed, price: v})} placeholder="e.g. 147.0" />
    
    <FormInput label="Manufacturer" value={newMed.manufacturer} onChange={(v:string) => setNewMed({...newMed, manufacturer: v})} placeholder="e.g. Cipla, Sun Pharma" />

    <FormInput label="Generic Name 1" value={newMed.generic1} onChange={(v:string) => setNewMed({...newMed, generic1: v})} placeholder="e.g. Paracetamol" />

    <FormInput label="Generic Name 2" value={newMed.generic2} onChange={(v:string) => setNewMed({...newMed, generic2: v})} placeholder="Optional salt" />

    <FormInput label="Category" value={newMed.category} onChange={(v:string) => setNewMed({...newMed, category: v})} placeholder="e.g. allopathy, ayurvedic" />

    <FormInput label="Class" value={newMed.class} onChange={(v:string) => setNewMed({...newMed, class: v})} placeholder="e.g. DERMA, ANALGESIC" />

    <FormInput label="System" value={newMed.system} onChange={(v:string) => setNewMed({...newMed, system: v})} placeholder="e.g. Digestive, Nervous" />
    
    <FormInput label="Use Case" value={newMed.useCase} onChange={(v:string) => setNewMed({...newMed, useCase: v})} placeholder="e.g. Acne, Fever" />

    <div className="md:col-span-2">
      <FormInput label="Side Effects" value={newMed.sideEffects} onChange={(v:string) => setNewMed({...newMed, sideEffects: v})} placeholder="List side effects separated by commas..." />
    </div>

    <div className="md:col-span-2 mt-4">
      <button 
        type="submit"
        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 shadow-lg shadow-slate-200 transition-all transform hover:-translate-y-1 active:scale-[0.98]"
      >
        Save Medicine to Database
      </button>
    </div>
  </form>
</div>
  </div>
)}

{view === 'daily_earnings' && role === 'doctor' && (
  <DailyEarnings />
)}
          {view === 'register' && (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Patient Details</h3>
                <p className="text-sm text-slate-500">Fill in the basic information provided by the patient.</p>
              </div>
              <form onSubmit={registerPatient} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={newPatient.name}
                      onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Age</label>
                    <input 
                      required
                      type="number" 
                      value={newPatient.age}
                      onChange={e => setNewPatient({...newPatient, age: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Years"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Gender</label>
                    <select 
                      value={newPatient.gender}
                      onChange={e => setNewPatient({...newPatient, gender: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      value={newPatient.phone}
                      onChange={e => setNewPatient({...newPatient, phone: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="+1 234..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Address</label>
                  <textarea 
                    value={newPatient.address}
                    onChange={e => setNewPatient({...newPatient, address: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px]"
                    placeholder="Residential address"
                  />
                </div>

                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Weight (kg)</label>
                    <input 
                      type="text" 
                      value={newPatient.weight}
                      onChange={e => setNewPatient({...newPatient, weight: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Height (cm)</label>
                    <input 
                      type="text" 
                      value={newPatient.height}
                      onChange={e => setNewPatient({...newPatient, height: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">BP (mmHg)</label>
                    <input 
                      type="text" 
                      value={newPatient.bp}
                      onChange={e => setNewPatient({...newPatient, bp: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="120/80"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Pulse Rate */}
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pulse Rate (bpm)</label>
    <input
      type="number"
      placeholder="e.g. 72"
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
      value={newPatient.pulse}
      onChange={(e) => setNewPatient({...newPatient, pulse: e.target.value})}
    />
  </div>

  {/* RR (Optional) */}
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RR (Optional)</label>
    <input
      type="number"
      placeholder="e.g. 16"
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
      value={newPatient.rr}
      onChange={(e) => setNewPatient({...newPatient, rr: e.target.value})}
    />
  </div>

  {/* BMI (Auto-calculated) */}
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Calculated BMI</label>
    <div className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl font-black text-blue-700 shadow-inner">
      {newPatient.bmi || '--.-'}
    </div>
  </div>
</div>
{/* Entry Type Toggle - Receptionist Only */}
<div className="space-y-3 mb-6">
  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
    Queue Category
  </label>
  <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full max-w-sm">
    {['Walk-in', 'Appointment'].map((type) => (
      <button
        key={type}
        type="button"
        onClick={() => setNewPatient({ ...newPatient, visit_type: type })}
        className={twMerge(
          "flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-200",
          newPatient.visit_type === type 
            ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" 
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
        )}
      >
        {type}
      </button>
    ))}
  </div>
</div>
                <div className="flex gap-4 pt-6">
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                  >
                    Register & Check-in
                  </button>
                  <button 
                    type="button"
                    onClick={() => setView('list')}
                    className="px-8 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List View (Queue) */}
          {view === 'list' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Waiting Queue</p>
                      <p className="text-2xl font-bold text-slate-900">{queue.filter(v => v.status === 'checked_in').length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-xl">
                      <Stethoscope className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Attending</p>
                      <p className="text-2xl font-bold text-slate-900">{queue.filter(v => v.status === 'consulting').length}</p>
                    </div>
                  </div>
                </div>
              
              </div>

              {/* Search Results for Registered Patients (Receptionist Only) */}
              {role === 'receptionist' && queueSearchQuery && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                  <div className="p-4 border-b border-slate-100 bg-blue-50/30 flex items-center justify-between">
                    <h3 className="font-bold text-blue-900 text-sm">Registered Patients (Search Results)</h3>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Not in Queue</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {patients
                      .filter(p => 
                        (p.name.toLowerCase().includes(queueSearchQuery.toLowerCase()) || p.phone.includes(queueSearchQuery)) &&
                        !queue.some(v => v.patient_id === p.id)
                      )
                      .map(patient => (
                        <div key={patient.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                              {patient.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{patient.name}</p>
                              <p className="text-[10px] text-slate-500">{patient.phone} • {patient.age}Y</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => checkIn(patient.id)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700 transition-all"
                          >
                            Check-in
                          </button>
                        </div>
                      ))
                    }
                    {patients.filter(p => 
                      (p.name.toLowerCase().includes(queueSearchQuery.toLowerCase()) || p.phone.includes(queueSearchQuery)) &&
                      !queue.some(v => v.patient_id === p.id)
                    ).length === 0 && (
                      <div className="p-8 text-center text-slate-400 text-xs italic">
                        No matching registered patients found.
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">
                    {queueSearchQuery ? `Search Results in Queue: "${queueSearchQuery}"` : 'Active Patient Queue'}
                  </h3>
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                    {format(new Date(), 'PPP')}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vitals</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Check-in Time</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        const filteredQueue = queue.filter(v => 
                          v.patient_name?.toLowerCase().includes(queueSearchQuery.toLowerCase()) ||
                          v.phone?.includes(queueSearchQuery)
                        );
                        
                        if (filteredQueue.length === 0) {
                          return (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                                {queueSearchQuery ? 'No matching patients found in queue.' : 'No patients in queue.'}
                              </td>
                            </tr>
                          );
                        }

                        const nextPatientId = filteredQueue.find(v => v.status === 'checked_in')?.id;
                        return filteredQueue.map((visit) => {
                          const isNext = visit.id === nextPatientId;
                          return (
                            <tr 
                              key={visit.id} 
                              className={cn(
                                "hover:bg-slate-50/50 transition-colors relative",
                                isNext && "bg-blue-50/30 border-l-4 border-blue-600"
                              )}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold",
                                    isNext ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
                                  )}>
                                    {visit.patient_name?.[0]}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-slate-900">{visit.patient_name}</p>
                                      {isNext && (
                                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black uppercase rounded tracking-tighter animate-pulse">
                                          Next
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-500">{visit.age}Y / {visit.gender}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-4 text-xs">
                                  <div>
                                    <p className="text-slate-400 font-medium">BP</p>
                                    <p className="font-bold text-slate-700">{visit.bp || '--'}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-400 font-medium">WT</p>
                                    <p className="font-bold text-slate-700">{visit.weight || '--'} kg</p>
                                  </div>
                                </div>
                              </td>
                              
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                  visit.status === 'checked_in' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                                )}>
                                  {visit.status === 'checked_in' ? 'Waiting' : 'Attending'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500">
                                {format(new Date(visit.created_at), 'p')}
                              </td>
                              <td className="px-6 py-4 text-right">
  <div className="flex items-center justify-end gap-3">
    {role === 'doctor' ? (
      <button 
        onClick={() => startConsultation(visit.id)}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all",
          isNext 
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100" 
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        )}
      >
        <Stethoscope className="w-3.5 h-3.5" />
        {isNext ? 'Attend Next' : 'Attend'}
      </button>
    ) : (
      <span className="text-xs text-slate-400 font-medium">Waiting for Doctor</span>
    )}
    
    {/* New Delete Button */}
    <button 
      onClick={() => deleteFromQueue(visit.id)}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Remove from queue"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Doctor: Consultation View */}
          {view === 'consult' && activeVisit && (
            <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 pb-40">
              
              {/* Left Column: Clinical Notes */}
              <div className="col-span-8 space-y-6">
                {/* Investigations Section */}
<section className="space-y-3 pt-6 border-t border-slate-100">
  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
    <Search className="w-4 h-4 text-indigo-600" />
    Investigations / Tests Advised
  </label>
  
  {/* Quick Select Chips */}
  <div className="flex flex-wrap gap-2 mb-2">
    {['HbA1c', 'FBS/PPBS', 'Lipid Profile', 'TSH/T3/T4', 'Urine R/M', 'Vitamin D3', 'CBC', 'LFT/KFT'].map(test => (
      <button
        key={test}
        type="button"
        onClick={() => {
          const current = activeVisit.investigations || '';
          const newValue = current.includes(test) ? current : current ? `${current}, ${test}` : test;
          setActiveVisit({...activeVisit, investigations: newValue});
        }}
        className="text-[10px] px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors font-bold"
      >
        + {test}
      </button>
    ))}
  </div>

  <textarea 
    value={activeVisit.investigations}
    onChange={e => setActiveVisit({...activeVisit, investigations: e.target.value})}
    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[80px] text-sm"
    placeholder="Enter required lab tests or imaging (e.g., USG Thyroid, HbA1c)..."
  />
</section>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-blue-600" />
                      Clinical Notes
                    </h3>
                    <div className="flex gap-2">

                      <button 
                        onClick={() => saveConsultation('completed')}
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100"
                      >
                        Complete Visit
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-8">
                    <button 
  onClick={() => setIsHindi(!isHindi)}
  className={cn(
    "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
    isHindi ? "bg-orange-100 border-orange-500 text-orange-700" : "bg-slate-100 border-slate-300 text-slate-700"
  )}
>
  {isHindi ? "Language: Hindi" : "Language: English"}
</button>


                    {/* Chief Complaint */}
                    <section className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Chief Complaint</label>
                      <textarea 
                        value={activeVisit.chief_complaint}
                        onChange={e => {
                          clearDiagnosisTimer();
                          setDiagnosisError('');
                          setActiveVisit({...activeVisit, chief_complaint: e.target.value});
                        }}
                        onBlur={scheduleDiagnosisSuggestion}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px]"
                        placeholder="Describe the patient's primary symptoms..."
                      />
                    </section>

                    <section className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Diagnosis</label>
                        <span className="text-xs text-slate-500">
                          {isGeneratingDiagnosis ? 'Generating from chief complaint...' : 'Auto-suggested'}
                        </span>
                      </div>
                      <textarea
                        value={activeVisit.diagnosis || ''}
                        onChange={e => setActiveVisit({...activeVisit, diagnosis: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px]"
                        placeholder="Predicted diagnosis will appear here..."
                      />
                      {diagnosisError && (
                        <p className="text-sm text-amber-600">{diagnosisError}</p>
                      )}
                    </section>

                    {/* Histories */}
                    <section className="space-y-3">
  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
    Family History
  </label>
  
  {/* Structured Checkboxes */}
  <div className="flex flex-wrap gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-2">
    {[
      { id: 'dm', label: 'DM' },
      { id: 'htn', label: 'HTN' },
      { id: 'thyroid', label: 'Thyroid' },
      { id: 'cad', label: 'CAD' }
    ].map((item) => (
      <label key={item.id} className="flex items-center gap-2 cursor-pointer">
        {/* Inside your Family History Checkbox Loop */}
<input 
  type="checkbox"
  className="..."
  // FIX: Use ?. and fallback to empty string to prevent .includes crash
  checked={(activeVisit?.family_history || "").includes(item.label)}
  onChange={(e) => {
    // FIX: Ensure current is always a string
    const current = activeVisit?.family_history || "";
    const newValue = e.target.checked 
      ? (current ? `${current}, ${item.label}` : item.label)
      : current.replace(new RegExp(`,?\\s?${item.label}`), '');
    setActiveVisit({...activeVisit!, family_history: newValue});
  }}
/>
        <span className="text-sm font-medium text-slate-700">{item.label}</span>
      </label>
    ))}
  </div>

  {/* Keep the textarea for detailed notes */}
  <textarea 
    value={activeVisit.family_history}
    onChange={e => setActiveVisit({...activeVisit, family_history: e.target.value})}
    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px] text-sm"
    placeholder="Other family history details..."
  />
</section>
                    <div className="grid grid-cols-2 gap-6">
                      <section className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Past History</label>
                        <textarea 
                          value={activeVisit.past_history}
                          onChange={e => setActiveVisit({...activeVisit, past_history: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px] text-sm"
                        />
                      </section>
                      <section className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Personal History</label>
                        <textarea 
                          value={activeVisit.personal_history}
                          onChange={e => setActiveVisit({...activeVisit, personal_history: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px] text-sm"
                        />
                      </section>
                      {/* <section className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Family History</label>
                        <textarea 
                          value={activeVisit.family_history}
                          onChange={e => setActiveVisit({...activeVisit, family_history: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px] text-sm"
                        />
                      </section> */}
                      <section className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Treatment History</label>
                        <textarea 
                          value={activeVisit.treatment_history}
                          onChange={e => setActiveVisit({...activeVisit, treatment_history: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px] text-sm"
                        />
                      </section>
                    </div>

                    {/* Allergies */}
                    <section className="space-y-3">
                      <label className="text-sm font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                        Allergies
                      </label>
                      <input 
                        type="text"
                        value={activeVisit.allergies}
                        onChange={e => setActiveVisit({...activeVisit, allergies: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-red-200 bg-red-50/30 focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm text-red-700 font-medium"
                        placeholder="e.g. Penicillin, Peanuts..."
                      />
                    </section>

                    {/* Prescription (RX) */}
                    <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/40 p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">RX Treatment</label>
                         
                        </div>

                        <button 
                          type="button"
                          onClick={addPrescription}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Medicine
                        </button>
                      </div>

                      {/* {showHistory && (
                        <div className="p-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl animate-in slide-in-from-top-4 duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              Recent Prescriptions
                            </h4>
                            <span className="text-[9px] text-indigo-400 italic">Click to add to current list</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {medHistory.length > 0 ? (
                              medHistory.map((med, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    const newRx = {
                                      brand_name: med.brand_name,
                                      dosage: med.dosage,
                                      frequency: med.frequency,
                                      route: med.route || 'Oral',
                                      days: med.days || ''
                                    };
                                    setActiveVisit({
                                      ...activeVisit!,
                                      prescriptions: [...activeVisit!.prescriptions, newRx]
                                    });
                                  }}
                                  className="flex flex-col text-left p-3 bg-white border border-indigo-100 rounded-xl hover:border-indigo-400 hover:shadow-sm transition-all group"
                                >
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                                    {med.brand_name}
                                  </span>
                                  <span className="text-[10px] text-slate-500">
                                    {med.dosage} — {med.frequency}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <div className="col-span-2 py-6 text-center">
                                <p className="text-xs text-slate-400 italic">No past medications found for this patient.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )} */}

                      <div className="space-y-3">
                        {activeVisit.prescriptions.length > 0 ? (
                          activeVisit.prescriptions.map((rx, idx) => (
                            <div key={idx} className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-200">
                              <div className="grid grid-cols-12 gap-3 items-end">
                                <div className="col-span-12 space-y-1.5 lg:col-span-4">
                                  <label className="text-[10px] font-bold uppercase text-slate-500">Medicine</label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={rx.brand_name}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        updatePrescription(idx, 'brand_name', value);
                                        setTypedMedicine(value);
                                        setActiveInputIndex(idx);
                                        if (!value.trim()) {
                                          setSuggestions([]);
                                        }
                                      }}
                                      onFocus={() => {
                                        setActiveInputIndex(idx);
                                        if (rx.brand_name.trim()) {
                                          setTypedMedicine(rx.brand_name);
                                        }
                                      }}
                                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Start typing medicine name"
                                    />

                                    {activeInputIndex === idx && suggestions.length > 0 && typedMedicine.trim() && (
                                      <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                                        {suggestions.map((medicine, suggestionIdx) => (
                                          <button
                                            key={`${medicine.name || medicine.brand_name || 'medicine'}-${suggestionIdx}`}
                                            type="button"
                                            onClick={() => selectMedicineSuggestion(idx, medicine)}
                                            className="flex w-full flex-col border-b border-slate-100 px-3 py-2 text-left last:border-b-0 hover:bg-blue-50"
                                          >
                                            <span className="text-sm font-semibold text-slate-800">
                                              {medicine.name || medicine.brand_name}
                                            </span>
                                            {(medicine.manufacturer || medicine.generic1) && (
                                              <span className="text-[10px] text-slate-500">
                                                {medicine.manufacturer || medicine.generic1}
                                              </span>
                                            )}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                               <div className="col-span-6 space-y-1.5 lg:col-span-3">
  
<div className="relative col-span-6 space-y-1.5 lg:col-span-3">
  <label className="text-[10px] font-bold uppercase text-slate-500">Schedule</label>
  
  <div className="relative group">
    <input
      type="text"
      value={rx.frequency}
      // Simplified: Just toggle the list on/off
      onFocus={() => setActiveFreqIndex(idx)}
      onBlur={() => setActiveFreqIndex(null)} 
      onChange={(e) => updatePrescription(idx, 'frequency', e.target.value)}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      placeholder="e.g. bbf"
    />

    {/* The Menu */}
    {activeFreqIndex === idx && (
      <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
        {['od','bd','tds','qid','hs','sos','bbf','abf'].map((s) => (
          <button
            key={s}
            type="button"
            // KEY TRICK: onMouseDown happens BEFORE onBlur, so no timeout needed!
            onMouseDown={() => updatePrescription(idx, 'frequency', s)}
            className="w-full px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
          >
            {s}
          </button>
        ))}
      </div>
    )}
  </div>
</div>
</div>

                                <div className="col-span-4 space-y-1.5 lg:col-span-2">
                                  <label className="text-[10px] font-bold uppercase text-slate-500">Days</label>
                                  <input
                                    type="text"
                                    value={rx.days}
                                    onChange={(e) => updatePrescription(idx, 'days', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="5"
                                  />
                                </div>

                             <div className="relative col-span-6 space-y-1.5 lg:col-span-2">
  <label className="text-[10px] font-bold uppercase text-slate-500">Route</label>
  
  <div className="relative group">
    <input
      type="text"
      value={rx.route}
      // Show menu when focused
      onFocus={() => setActiveRouteIndex(idx)} 
      // Hide menu when clicking away
      onBlur={() => setActiveRouteIndex(null)}
      onChange={(e) => updatePrescription(idx, 'route', e.target.value)}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      placeholder="e.g. Oral"
    />

    {/* The Route Menu (Matches your cinematic UI) */}
    {activeRouteIndex === idx && (
      <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
        {['Oral', 'IV', 'IM', 'Topical', 'Sublingual', 'Inhalation'].map((r) => (
          <button
            key={r}
            type="button"
            // onMouseDown fires BEFORE onBlur, selecting the value instantly
            onMouseDown={() => {
              updatePrescription(idx, 'route', r);
              setActiveRouteIndex(null);
            }}
            className="w-full px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            {r}
          </button>
        ))}
        <div className="border-t border-slate-50 p-2 bg-slate-50 rounded-b-lg">
          <p className="text-[9px] text-slate-400 text-center italic">Or type a custom route...</p>
        </div>
      </div>
    )}
  </div>
</div>

                                <div className="col-span-2 pb-1 lg:col-span-1">
                                  <button
                                    type="button"
                                    onClick={() => removePrescription(idx)}
                                    className="p-2 text-slate-400 transition-colors hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              {ExtraItemsData[idx] && (
                                <div className="mt-3 grid gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
                                  <p><b>Manufacturer:</b> {ExtraItemsData[idx].manufacturer}</p>
                                  <p><b>Price:</b> ₹{ExtraItemsData[idx].price}</p>
                                  <p><b>Generic:</b> {ExtraItemsData[idx].generic1}</p>
                                  <p><b>Use Case:</b> {ExtraItemsData[idx].useCase}</p>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
                            No medicines added yet. Use <b>Add Medicine</b> to start the prescription.
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Advice */}
                    <section className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Advice & Diet</label>
                      <textarea 
                        value={activeVisit.advice}
                        onChange={e => setActiveVisit({...activeVisit, advice: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px] text-sm italic"
                        placeholder="General advice, diet restrictions..."
                      />
                    </section>

                    {/* Follow-up */}
                    <section className="space-y-3 pt-6 border-t border-slate-100">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        Follow-up Schedule
                      </label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="date"
                          value={activeVisit.follow_up_date}
                          onFocus={(e) => {
                            e.currentTarget.scrollIntoView({
                              behavior: 'smooth',
                              block: 'center'
                            });
                          }}
                          onChange={e => setActiveVisit({...activeVisit, follow_up_date: e.target.value})}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                        />
                        <p className="text-xs text-slate-500">
                          Patient will be notified via WhatsApp 3 days prior to this date.
                        </p>
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              {/* Right Column: Patient Info & History */}
              <div className="col-span-4 space-y-6">
                {/* Patient Summary Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Patient Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-100">
                        {activeVisit.patient_name?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg leading-tight">{activeVisit.patient_name}</p>
                        <p className="text-sm text-slate-500">{activeVisit.age}Y / {activeVisit.gender}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Weight</p>
                        <p className="text-sm font-bold text-slate-700">{activeVisit.weight} kg</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">BP</p>
                        <p className="text-sm font-bold text-slate-700">{activeVisit.bp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 pt-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {activeVisit.phone}
                    </div>
                  </div>
                </div>

                {/* Print Action */}
                <div className="bg-blue-600 p-6 rounded-2xl shadow-xl shadow-blue-200 text-white space-y-4">
                  <div className="flex items-center gap-3">
                    <Printer className="w-6 h-6" />
                    <h3 className="font-bold">Generate Prescription</h3>
                  </div>
                  <p className="text-sm text-blue-100">Click below to generate a professional PDF prescription for the patient.</p>
                  <button 
                    onClick={async () => {
                      if (!activeVisit) return;
                      await loadPatientHistoryForPrint(activeVisit);
                      handlePrint();
                    }}
                    className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    Print Prescription
                  </button>
                </div>
                <div className="space-y-6">
  
  {/* NEW: Payment Manager Component */}
  <PaymentManager 
  consultationFee={consultationFee}
  setConsultationFee={setConsultationFee}
  paymentType={paymentType}
  setPaymentType={setPaymentType}
  onGenerate={async () => {
    if (!activeVisit) return;

    setView('bill_preview');
  }}
/>

</div>
              </div>

              {/* Hidden Print Component */}
              <div className="hidden">
               <PrescriptionPrint 
    ref={printRef} 
    visit={activeVisit} 
    extraData={ExtraItemsData} 
    isHindi={isHindi}
    previousReports={patientHistory}
  />
  
              </div>
              
              {/* Right Sidebar */}
            </div>
          )}

          {view === 'bill_preview' && activeVisit && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Bill Preview</h3>
                  <p className="text-sm text-slate-500">Review the bill before printing and completing the visit.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setCompleteAfterBillPrint(false);
                      setView('consult');
                    }}
                    className="px-5 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    Back to Consultation
                  </button>
                  <button
                    onClick={() => {
                      setCompleteAfterBillPrint(true);
                      handleBillPrint();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    Print Bill & Complete
                  </button>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                <BillPrint
                  ref={billPrintRef}
                  visit={activeVisit}
                  consultationFee={consultationFee}
                  paymentType={paymentType}
                />
              </div>
            </div>
          )}
          
        </div>
{view === 'patient_records' && (
  <ShowPatientsMedications 
    view={view}
    setView={setView}
    selectedHistoryPatient={selectedHistoryPatient}
    patientMedHistory={patientMedHistory}
    searchQuery={patientRecordsSearchQuery}
    searchResults={searchResults}
    handleSearch={handleSearch}
    selectPatient={selectPatient}
    setSearchQuery={setPatientRecordsSearchQuery}
    setSearchResults={setSearchResults}
  />
)}
      </main>
      
    </div>
  );
}
