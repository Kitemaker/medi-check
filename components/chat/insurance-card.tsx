'use client';

interface InsuranceCoverageOutput {
  covered: boolean;
  coveragePercent: number;
  copay: number;
  requiresReferral: boolean;
  notes: string;
  plan?: string;
  provider?: string;
  memberId?: string;
  deductible?: number;
  deductibleMet?: number;
  procedureType?: string;
  specialistType?: string;
}

function GaugeArc({ pct, color }: { pct: number; color: string }) {
  // Half-circle gauge (180° arc)
  const r = 36, cx = 50, cy = 46;
  const circumference = Math.PI * r; // half circle
  const filled = (pct / 100) * circumference;
  const gap    = circumference - filled;

  return (
    <svg viewBox="0 0 100 52" className="w-full max-w-[160px]">
      {/* Track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="#f1f5f9" strokeWidth="9" strokeLinecap="round"
      />
      {/* Filled arc — rotate from left (180°) */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
        strokeDasharray={`${filled} ${gap}`}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {/* Center label */}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>
        {pct}%
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="#94a3b8">
        covered
      </text>
    </svg>
  );
}

function ProgressBar({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-700">${value.toLocaleString()} / ${max.toLocaleString()}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="mt-0.5 text-[10px] text-gray-400">${(max - value).toLocaleString()} remaining</p>
    </div>
  );
}

export function InsuranceCard({ data }: { data: InsuranceCoverageOutput }) {
  const {
    covered, coveragePercent, copay, requiresReferral, notes,
    plan, provider, memberId, deductible, deductibleMet,
    procedureType, specialistType,
  } = data;

  const gaugeColor = coveragePercent >= 80 ? '#0d9488' : coveragePercent >= 50 ? '#f59e0b' : '#ef4444';
  const deductibleColor = deductibleMet && deductible && deductibleMet >= deductible * 0.8 ? '#0d9488' : '#6366f1';

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between gap-4"
        style={{ background: covered ? 'linear-gradient(135deg,#f0fdfa,#ccfbf1)' : 'linear-gradient(135deg,#fef2f2,#fee2e2)' }}>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Insurance Verification</p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${covered ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700'}`}>
              {covered ? '✓ Covered' : '✗ Not Covered'}
            </span>
            {requiresReferral && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                ⚠ Referral Required
              </span>
            )}
          </div>
          {(procedureType || specialistType) && (
            <p className="mt-1 text-xs text-gray-500">
              {[procedureType, specialistType].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        {provider && (
          <div className="text-right text-xs text-gray-500 flex-shrink-0">
            <p className="font-semibold text-gray-700">{provider}</p>
            {plan && <p>{plan}</p>}
            {memberId && <p className="font-mono text-[10px] text-gray-400">{memberId}</p>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-[auto_1fr] divide-x divide-gray-100">
        {/* Coverage gauge */}
        <div className="flex flex-col items-center justify-center px-5 py-4">
          <GaugeArc pct={coveragePercent} color={gaugeColor} />
          <div className="mt-2 text-center">
            <p className="text-[10px] text-gray-400">Your copay</p>
            <p className="text-lg font-bold text-gray-800">${copay}</p>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-3 px-4 py-4">
          {/* Deductible progress */}
          {deductible != null && deductibleMet != null && (
            <ProgressBar
              value={deductibleMet}
              max={deductible}
              label="Deductible Met"
              color={deductibleColor}
            />
          )}

          {/* Copay breakdown */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-gray-50 px-3 py-2 text-center border border-gray-100">
              <p className="text-xs text-gray-400">This visit</p>
              <p className="text-base font-bold text-gray-800">${copay}</p>
              <p className="text-[10px] text-gray-400">after coverage</p>
            </div>
            <div className="rounded-lg bg-teal-50 px-3 py-2 text-center border border-teal-100">
              <p className="text-xs text-teal-500">Plan covers</p>
              <p className="text-base font-bold text-teal-700">{coveragePercent}%</p>
              <p className="text-[10px] text-teal-400">of allowed amount</p>
            </div>
          </div>

          {/* Referral */}
          {requiresReferral && (
            <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-800">
              <span className="font-semibold">Referral required</span> — contact your primary care physician before booking this specialist.
            </div>
          )}

          {/* Notes */}
          {notes && (
            <p className="text-xs text-gray-500 leading-relaxed">{notes}</p>
          )}
        </div>
      </div>
    </div>
  );
}
