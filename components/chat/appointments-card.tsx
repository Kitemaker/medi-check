'use client';

interface Slot {
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  location: string;
}

interface AppointmentsOutput {
  slots: Slot[];
  message?: string;
}

const SPECIALTY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Primary Care':   { bg: '#f0fdfa', text: '#0f766e', dot: '#0d9488' },
  'Orthopedics':    { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
  'Endocrinology':  { bg: '#fdf4ff', text: '#7e22ce', dot: '#a855f7' },
  'Cardiology':     { bg: '#fff1f2', text: '#be123c', dot: '#f43f5e' },
  'Dermatology':    { bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
};

function specialtyStyle(s: string) {
  return SPECIALTY_COLORS[s] ?? { bg: '#f8fafc', text: '#475569', dot: '#94a3b8' };
}

function fmtDate(d: string) {
  const date = new Date(d);
  const today = new Date();
  today.setHours(0,0,0,0);
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
  const dayLabel = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateStr  = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { dayLabel, dateStr, isToday: diff === 0, isTomorrow: diff === 1 };
}

function groupByDate(slots: Slot[]): Map<string, Slot[]> {
  const map = new Map<string, Slot[]>();
  for (const slot of slots) {
    const key = slot.date;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(slot);
  }
  return map;
}

export function AppointmentsCard({ data }: { data: AppointmentsOutput }) {
  const { slots } = data;
  if (!slots || slots.length === 0) {
    return (
      <div className="mt-2 rounded-xl border border-gray-200 bg-white px-4 py-6 text-center shadow-sm">
        <p className="text-sm text-gray-400">No available appointment slots found.</p>
      </div>
    );
  }

  const grouped = groupByDate(slots);
  const specialties = [...new Set(slots.map(s => s.specialty))];

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
        style={{ background: 'linear-gradient(135deg, #f0fdfa, #f8fafc)' }}>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Available Appointments</p>
          <p className="text-base font-bold text-gray-900">{slots.length} open slot{slots.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-end">
          {specialties.map((sp) => {
            const s = specialtyStyle(sp);
            return (
              <span key={sp} className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: s.bg, color: s.text }}>
                <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                {sp}
              </span>
            );
          })}
        </div>
      </div>

      {/* Timeline grouped by date */}
      <div className="divide-y divide-gray-50 px-4 py-3 space-y-4">
        {[...grouped.entries()].map(([date, daySlots]) => {
          const { dayLabel, dateStr, isToday, isTomorrow } = fmtDate(date);
          return (
            <div key={date}>
              {/* Date header */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`flex-shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold
                  ${isToday ? 'bg-teal-600 text-white' : isTomorrow ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}>
                  {dayLabel}
                </div>
                <span className="text-xs text-gray-400">{dateStr}</span>
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] text-gray-400">{daySlots.length} slot{daySlots.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Slots */}
              <div className="space-y-2 pl-1">
                {daySlots.map((slot, i) => {
                  const s = specialtyStyle(slot.specialty);
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5 hover:bg-teal-50/30 transition-colors">
                      {/* Time */}
                      <div className="flex-shrink-0 text-center w-14">
                        <p className="text-sm font-bold text-gray-800 tabular-nums">{slot.time.replace(' ', '\u00A0')}</p>
                      </div>

                      <div className="w-px h-8 bg-gray-200 flex-shrink-0" />

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-800">{slot.doctor}</span>
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{ background: s.bg, color: s.text }}>
                            {slot.specialty}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{slot.location}</p>
                      </div>

                      {/* Slot dot indicator */}
                      <div className="flex-shrink-0">
                        <div className="h-2.5 w-2.5 rounded-full border-2 border-gray-200 bg-white" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-[10px] text-gray-400">
        Tell MediCheck which slot you want — it will book and send a confirmation email.
      </div>
    </div>
  );
}
