'use client';

interface MedicationDetail {
  name: string;
  genericName?: string;
  purpose?: string;
  warnings?: string[];
  dosage?: string;
  adverseReactions?: string[];
  interactions?: string[];
  source?: string;
}

function Section({ title, items, color }: { title: string; items: string[]; color: 'red' | 'amber' | 'blue' | 'gray' }) {
  if (!items || items.length === 0) return null;
  const styles = {
    red:   { wrap: 'bg-red-50 border-red-100',   title: 'text-red-700',  dot: 'bg-red-400' },
    amber: { wrap: 'bg-amber-50 border-amber-100', title: 'text-amber-700', dot: 'bg-amber-400' },
    blue:  { wrap: 'bg-blue-50 border-blue-100',  title: 'text-blue-700', dot: 'bg-blue-400' },
    gray:  { wrap: 'bg-gray-50 border-gray-100',  title: 'text-gray-700', dot: 'bg-gray-400' },
  }[color];

  return (
    <div className={`rounded-lg border px-3 py-2.5 ${styles.wrap}`}>
      <p className={`text-[10px] font-bold uppercase tracking-wide mb-1.5 ${styles.title}`}>{title}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
            <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${styles.dot}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MedicationDetailCard({ data }: { data: MedicationDetail }) {
  const { name, genericName, purpose, warnings, dosage, adverseReactions, interactions, source } = data;

  const hasWarnings = warnings && warnings.length > 0;

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100"
        style={{ background: hasWarnings ? 'linear-gradient(135deg,#fefce8,#fffbeb)' : 'linear-gradient(135deg,#f0fdfa,#f8fafc)' }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">FDA Drug Database</p>
            <p className="text-lg font-bold text-gray-900">{name}</p>
            {genericName && genericName !== name && (
              <p className="text-xs text-gray-400">Generic: <span className="text-gray-600">{genericName}</span></p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {hasWarnings && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                ⚠ {warnings!.length} Warning{warnings!.length !== 1 ? 's' : ''}
              </span>
            )}
            {source && (
              <span className="text-[10px] text-gray-400">Source: {source}</span>
            )}
          </div>
        </div>

        {purpose && (
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">{purpose}</p>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-3 flex flex-col gap-2.5">
        {dosage && (
          <div className="rounded-lg bg-teal-50 border border-teal-100 px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-teal-600 mb-1">Dosage Information</p>
            <p className="text-xs text-gray-700 leading-relaxed">{dosage}</p>
          </div>
        )}

        <Section title="⚠ Warnings & Contraindications" items={warnings ?? []} color="red" />
        <Section title="Adverse Reactions" items={adverseReactions ?? []} color="amber" />
        <Section title="Drug Interactions" items={interactions ?? []} color="blue" />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-[10px] text-gray-400">
        Information from OpenFDA public database. Always consult your physician before changing medications.
      </div>
    </div>
  );
}
