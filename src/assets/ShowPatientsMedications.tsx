import { useEffect, useMemo, useState } from 'react';
import { 
  Search, 
  Trash2, 
  Phone, 
  ChevronRight, 
  History, 
  ClipboardList, 
  Clock,
  FileText,
  Pill
} from 'lucide-react';
import { format } from 'date-fns';

// Define the interface for Props to keep TypeScript happy
interface ShowPatientsMedicationsProps {
  view: string;
  setView: (view: any) => void;
  selectedHistoryPatient: any;
  patientMedHistory: any[];
  searchQuery: string;
  searchResults: any[];
  handleSearch: (val: string) => void;
  selectPatient: (patient: any, matchedPatients?: any[]) => void;
  setSearchQuery: (val: string) => void;
  setSearchResults: (results: any[]) => void;
}

function ShowPatientsMedications({
  view,
  setView,
  selectedHistoryPatient,
  patientMedHistory,
  searchQuery,
  searchResults,
  handleSearch,
  selectPatient,
  setSearchQuery,
  setSearchResults
}: ShowPatientsMedicationsProps) {
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number | null>(null);

  const groupedSearchResults = searchResults.reduce((groups: any[], patient: any) => {
    const groupKey = `${(patient.name || '').trim().toLowerCase()}::${patient.phone || ''}`;
    const existingGroup = groups.find((item) => item.groupKey === groupKey);

    if (existingGroup) {
      existingGroup.matches.push(patient);
      return groups;
    }

    groups.push({
      groupKey,
      representative: patient,
      matches: [patient]
    });

    return groups;
  }, []);

  useEffect(() => {
    setSelectedRecordIndex(null);
  }, [selectedHistoryPatient?.id, patientMedHistory.length]);

  const selectedRecord =
    selectedRecordIndex !== null ? patientMedHistory[selectedRecordIndex] : null;

  const patientRecordStats = useMemo(() => {
    const totalMedicines = patientMedHistory.reduce((count, item) => {
      return count + (item.prescriptions?.length || 0);
    }, 0);

    return {
      totalVisits: patientMedHistory.length,
      totalMedicines
    };
  }, [patientMedHistory]);

  return (
    <div className="space-y-6">
      {/* 1. SEARCH BAR SECTION (Always visible or conditional) */}
      <div className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-slate-700"
          placeholder="Find returning patient by Name or Phone Number..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchQuery.length > 0 && (
          <button 
            onClick={() => {setSearchQuery(''); setSearchResults([]);}}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Found Records</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {groupedSearchResults.map((group) => (
                <button
                  key={group.groupKey}
                  onClick={() => selectPatient(group.representative, group.matches)}
                  className="w-full flex items-center justify-between p-4 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0 group"
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="font-bold text-slate-900 group-hover:text-blue-700">{group.representative.name}</span>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {group.representative.phone}</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">{group.representative.age}Y / {group.representative.gender}</span>
                      {group.matches.length > 1 && (
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          {group.matches.length} records
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. PATIENT RECORDS DETAILS VIEW */}
      {view === 'patient_records' && selectedHistoryPatient && (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setView('list')}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm transition-all"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Dashboard
            </button>
            <div className="px-4 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
              Archive / ID: {selectedHistoryPatient.id}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left: Bio Data Card */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-40" />
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg shadow-blue-100">
                    {selectedHistoryPatient.name[0]}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedHistoryPatient.name}</h2>
                  <p className="text-blue-600 font-bold text-sm flex items-center gap-2 mt-1 mb-6">
                    <Phone className="w-4 h-4" /> {selectedHistoryPatient.phone}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Age / Sex</p>
                      <p className="font-bold text-slate-700">{selectedHistoryPatient.age}Y / {selectedHistoryPatient.gender}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">BP (Last)</p>
                      <p className="font-bold text-slate-700">{selectedHistoryPatient.bp || '--'}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-2">Residential Address</p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{selectedHistoryPatient.address || 'No address provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visit Cards + Detail */}
            <div className="col-span-12 lg:col-span-8 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="text-left">
                  <h3 className="text-xl font-black text-slate-900">Previous Medication Records</h3>
                  <p className="text-sm text-slate-500 font-medium">Select a visit card to open the full prescription details</p>
                </div>
                <History className="w-8 h-8 text-slate-200" />
              </div>

              <div className="p-8 flex-1 overflow-y-auto max-h-[600px] space-y-8">
                {patientMedHistory.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {patientMedHistory.map((item, idx) => {
                        const isActive = selectedRecordIndex === idx;
                        const medicineCount = item.prescriptions?.length || 0;

                        return (
                          <button
                            key={`${item.visit_id || idx}`}
                            type="button"
                            onClick={() => setSelectedRecordIndex(idx)}
                            className={`rounded-3xl border p-5 text-left transition-all ${
                              isActive
                                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                                : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-lg font-black text-slate-900">{selectedHistoryPatient.name}</p>
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mt-1">
                                  Medication Record
                                </p>
                              </div>
                              <div className={`rounded-2xl p-3 ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-500'}`}>
                                <ClipboardList className="w-5 h-5" />
                              </div>
                            </div>

                            <div className="mt-5 space-y-3">
                              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-600 border border-slate-100">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                {item.created_at ? format(new Date(item.created_at), 'PPP') : 'Unknown date'}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                                  <Pill className="w-3.5 h-3.5" />
                                  {medicineCount} meds
                                </span>
                                {item.chief_complaint && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                                    <FileText className="w-3.5 h-3.5" />
                                    Notes
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-500 line-clamp-2">
                                {item.chief_complaint || item.advice || 'Click to view full medication details'}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="rounded-[28px] border border-slate-200 bg-slate-50/50 p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                        <div>
                          <h4 className="text-lg font-black text-slate-900">Record Details</h4>
                          <p className="text-sm text-slate-500">
                            {selectedRecord
                              ? `Visit from ${format(new Date(selectedRecord.created_at), 'PPP')}`
                              : 'Choose any card above to inspect that visit'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <div className="rounded-2xl bg-white px-4 py-2 border border-slate-200">
                            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Visits</p>
                            <p className="text-sm font-bold text-slate-700">{patientRecordStats.totalVisits}</p>
                          </div>
                          <div className="rounded-2xl bg-white px-4 py-2 border border-slate-200">
                            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Medicines</p>
                            <p className="text-sm font-bold text-slate-700">{patientRecordStats.totalMedicines}</p>
                          </div>
                        </div>
                      </div>

                      {selectedRecord ? (
                        <div className="mt-6 space-y-5 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                              {selectedRecord.created_at ? format(new Date(selectedRecord.created_at), 'PPP') : 'Unknown date'}
                            </span>
                          </div>

                          {selectedRecord.chief_complaint && (
                            <p className="text-sm text-slate-600">
                              <span className="font-bold text-slate-800">Chief Complaint:</span> {selectedRecord.chief_complaint}
                            </p>
                          )}
                          {selectedRecord.investigations && (
                            <p className="text-sm text-slate-600">
                              <span className="font-bold text-slate-800">Investigations:</span> {selectedRecord.investigations}
                            </p>
                          )}
                          {selectedRecord.advice && (
                            <p className="text-sm text-slate-600">
                              <span className="font-bold text-slate-800">Advice:</span> {selectedRecord.advice}
                            </p>
                          )}

                          <div className="space-y-3">
                            {selectedRecord.prescriptions?.length > 0 ? (
                              selectedRecord.prescriptions.map((prescription: any, rxIdx: number) => (
                                <div key={rxIdx} className="rounded-2xl border border-slate-100 bg-white p-4">
                                  <h4 className="text-base font-black text-slate-800 uppercase tracking-tight mb-2">
                                    {prescription.brand_name}
                                  </h4>
                                  <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                                      {prescription.dosage || '--'} {prescription.frequency ? `— ${prescription.frequency}` : ''}
                                    </div>
                                    <div className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                      Duration: {prescription.days || '--'} Days
                                    </div>
                                    <div className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                      Route: {prescription.route || 'Oral'}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                                No medicines were recorded for this visit.
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="py-16 text-center">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                            <ClipboardList className="w-7 h-7 text-slate-300" />
                          </div>
                          <p className="font-bold text-slate-500">Select a medication card to view visit details.</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <Search className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="font-bold text-slate-400">No past medications found for this patient.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowPatientsMedications;
