'use client';

interface Visit {
  date: string;
  doctor: string;
  reason: string;
  notes: string;
  vitals: { bp: string; weight: string; glucose: string };
}

interface EHRRecords {
  recentVisits: Visit[];
  allergies: string[];
  bloodType: string;
  emergencyContact: { name: string; relation: string; phone: string };
}

interface PatientHistory {
  id: string;
  name: string;
  dob: string;
  conditions: string[];
  medications: string[];
  insurance: {
    provider: string;
    plan: string;
    memberId: string;
  };
  primaryCare: string;
  clinic: string;
  lastVisit: string;
  ehrRecords: EHRRecords;
}

function age(dob: string) {
  const d = new Date(dob);
  const now = new Date();
  return now.getFullYear() - d.getFullYear() - (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const CONDITION_COLORS: Record<string, { bg: string; text: string }> = {
  'Type 2 Diabetes': { bg: '#fef3c7', text: '#92400e' },
  'Hypertension':    { bg: '#fee2e2', text: '#991b1b' },
};

function conditionStyle(c: string) {
  return CONDITION_COLORS[c] ?? { bg: '#ede9fe', text: '#5b21b6' };
}

function VitalChip({ label, value, flag }: { label: string; value: string; flag?: boolean }) {
  return (
    <div className={`flex flex-col items-center rounded-lg px-3 py-2 ${flag ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50 border border-gray-100'}`}>
      <span className={`text-sm font-bold tabular-nums ${flag ? 'text-amber-700' : 'text-gray-800'}`}>{value}</span>
      <span className="text-[10px] text-gray-400 mt-0.5">{label}</span>
    </div>
  );
}

export function PatientHistoryCard({ data }: { data: PatientHistory }) {
  const { name, dob, conditions, medications, primaryCare, clinic, ehrRecords } = data;
  const { recentVisits, allergies, bloodType, emergencyContact } = ehrRecords;
  const latestVisit = recentVisits[0];

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* Patient header */}
      <div className="flex items-start justify-between gap-4 px-4 py-3"
        style={{ background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)' }}>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-600">EHR — Patient Profile</p>
          <p className="text-lg font-bold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">
            {age(dob)} yrs · DOB {fmtDate(dob)} · Blood type <span className="font-semibold text-gray-700">{bloodType}</span>
          </p>
        </div>
        <div className="text-right text-xs text-gray-500 flex-shrink-0">
          <p className="font-medium text-gray-700">{primaryCare}</p>
          <p>{clinic}</p>
          <p className="mt-1 text-[10px] text-teal-600">Last visit {fmtDate(data.lastVisit)}</p>
        </div>
      </div>

      <div className="divide-y divide-gray-100">

        {/* Conditions + Allergies */}
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <div className="px-4 py-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Active Conditions</p>
            <div className="flex flex-wrap gap-1.5">
              {conditions.map((c) => {
                const s = conditionStyle(c);
                return (
                  <span key={c} className="rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ background: s.bg, color: s.text }}>
                    {c}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Allergies ⚠️</p>
            <div className="flex flex-wrap gap-1.5">
              {allergies.map((a) => (
                <span key={a} className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 border border-red-100">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Latest vitals */}
        {latestVisit && (
          <div className="px-4 py-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Latest Vitals — {fmtDate(latestVisit.date)} with {latestVisit.doctor}
            </p>
            <div className="flex gap-2">
              <VitalChip label="Blood Pressure" value={latestVisit.vitals.bp}
                flag={parseInt(latestVisit.vitals.bp) > 130} />
              <VitalChip label="Weight" value={latestVisit.vitals.weight} />
              <VitalChip label="Glucose" value={latestVisit.vitals.glucose}
                flag={parseInt(latestVisit.vitals.glucose) > 100} />
            </div>
            {latestVisit.notes && (
              <p className="mt-2 rounded-lg bg-teal-50 px-3 py-2 text-xs text-teal-800 border border-teal-100">
                <span className="font-semibold">Dr. notes: </span>{latestVisit.notes}
              </p>
            )}
          </div>
        )}

        {/* Visit history table */}
        {recentVisits.length > 1 && (
          <div className="px-4 py-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Recent Visits</p>
            <div className="overflow-hidden rounded-lg border border-gray-100">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-3 py-2 font-semibold text-gray-500">Date</th>
                    <th className="px-3 py-2 font-semibold text-gray-500">Doctor</th>
                    <th className="px-3 py-2 font-semibold text-gray-500">Reason</th>
                    <th className="px-3 py-2 font-semibold text-gray-500 text-right">BP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentVisits.map((v, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{fmtDate(v.date)}</td>
                      <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">{v.doctor}</td>
                      <td className="px-3 py-2 text-gray-500">{v.reason}</td>
                      <td className="px-3 py-2 text-right font-mono text-gray-600 whitespace-nowrap">{v.vitals.bp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Current medications */}
        <div className="px-4 py-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Current Medications</p>
          <div className="flex flex-wrap gap-2">
            {medications.map((m) => (
              <span key={m} className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-100">
                💊 {m}
              </span>
            ))}
          </div>
        </div>

        {/* Emergency contact */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>🆘</span>
            <span className="font-medium text-gray-700">{emergencyContact.name}</span>
            <span>({emergencyContact.relation})</span>
            <span className="font-mono">{emergencyContact.phone}</span>
          </div>
          <span className="text-[10px] text-gray-400">Insurance: {data.insurance.provider} {data.insurance.plan}</span>
        </div>
      </div>
    </div>
  );
}
