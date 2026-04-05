'use client';

interface BookingResult {
  success?: boolean;
  appointment?: {
    date: string;
    time: string;
    doctor: string;
    specialty: string;
    location: string;
    reason: string;
  };
  confirmationNumber?: string;
  emailSent?: boolean;
  message?: string;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export function BookingConfirmationCard({ data }: { data: BookingResult }) {
  const { appointment, confirmationNumber, emailSent, message } = data;

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-teal-200 bg-white shadow-sm">

      {/* Success header */}
      <div className="flex items-center gap-3 px-4 py-3"
        style={{ background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)' }}>
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100">
          <svg className="h-5 w-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-600">Appointment Confirmed</p>
          <p className="text-base font-bold text-gray-900">Booking successful!</p>
          {confirmationNumber && (
            <p className="text-xs text-gray-400 font-mono">Conf. #{confirmationNumber}</p>
          )}
        </div>
        {emailSent && (
          <span className="ml-auto rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-700 flex-shrink-0">
            📧 Confirmation sent
          </span>
        )}
      </div>

      {/* Appointment details */}
      {appointment && (
        <div className="px-4 py-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Date & Time</p>
              <p className="text-sm font-bold text-gray-900">{fmtDate(appointment.date)}</p>
              <p className="text-sm text-teal-600 font-semibold">{appointment.time}</p>
            </div>
            <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5">
              <p className="text-[10px] text-gray-400 mb-1">Doctor</p>
              <p className="text-sm font-bold text-gray-900">{appointment.doctor}</p>
              <p className="text-xs text-gray-400">{appointment.specialty}</p>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5 flex items-start gap-2">
            <svg className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div>
              <p className="text-xs font-medium text-gray-700">{appointment.location}</p>
              {appointment.reason && (
                <p className="text-xs text-gray-400 mt-0.5">Reason: {appointment.reason}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {message && !appointment && (
        <p className="px-4 py-3 text-sm text-gray-600">{message}</p>
      )}

      {/* Footer */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-[10px] text-gray-400">
        Add to calendar · Arrive 15 minutes early · Bring your insurance card
      </div>
    </div>
  );
}
