'use client';

interface Medication {
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  refillsRemaining: number;
  nextRefillDate: string;
}

interface MedicationsOutput {
  medications: Medication[];
}

const MAX_REFILLS = 5;

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(dateStr: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  const due   = new Date(dateStr); due.setHours(0,0,0,0);
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

function RefillBar({ refills }: { refills: number }) {
  const pct   = Math.min((refills / MAX_REFILLS) * 100, 100);
  const color = refills <= 1 ? '#ef4444' : refills <= 2 ? '#f59e0b' : '#0d9488';
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-gray-400">Refills remaining</span>
        <span className="font-semibold" style={{ color }}>{refills}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export function MedicationsCard({ data }: { data: MedicationsOutput }) {
  const { medications } = data;

  const lowRefill = medications.filter(m => m.refillsRemaining <= 1);
  const totalMeds = medications.length;

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
        style={{ background: 'linear-gradient(135deg, #f0fdfa, #f8fafc)' }}>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Current Prescriptions</p>
          <p className="text-base font-bold text-gray-900">{totalMeds} active medication{totalMeds !== 1 ? 's' : ''}</p>
        </div>
        {lowRefill.length > 0 && (
          <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-1.5 text-xs text-red-700 font-medium">
            ⚠ {lowRefill.length} refill{lowRefill.length !== 1 ? 's' : ''} needed soon
          </div>
        )}
      </div>

      {/* Medication list */}
      <div className="divide-y divide-gray-50">
        {medications.map((med, i) => {
          const days  = daysUntil(med.nextRefillDate);
          const isLow = med.refillsRemaining <= 1;
          const soon  = days <= 7;

          return (
            <div key={i} className={`px-4 py-3.5 ${isLow ? 'bg-red-50/30' : ''}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  {/* Pill icon */}
                  <div className={`flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-lg
                    ${isLow ? 'bg-red-100' : 'bg-teal-50'}`}>
                    <svg className={`h-5 w-5 ${isLow ? 'text-red-500' : 'text-teal-600'}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                      <path d="m8.5 8.5 7 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{med.name}</p>
                    <p className="text-xs text-gray-400">{med.genericName}</p>
                  </div>
                </div>

                {/* Dosage + frequency */}
                <div className="flex-shrink-0 text-right">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-100">
                    {med.dosage}
                  </span>
                  <p className="mt-1 text-[10px] text-gray-400">{med.frequency}</p>
                </div>
              </div>

              {/* Refill bar */}
              <RefillBar refills={med.refillsRemaining} />

              {/* Footer row */}
              <div className="mt-2 flex items-center justify-between text-[10px]">
                <span className="text-gray-400">Prescribed by <span className="text-gray-600 font-medium">{med.prescribedBy}</span></span>
                <span className={`font-medium ${soon ? 'text-amber-600' : 'text-gray-400'}`}>
                  Next refill: {fmtDate(med.nextRefillDate)}
                  {soon && ` (${days}d)`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-[10px] text-gray-400">
        Ask MediCheck to look up any medication or set a refill reminder.
      </div>
    </div>
  );
}
