'use client';

import type { DynamicToolUIPart, ToolUIPart } from 'ai';
import { PatientHistoryCard } from './patient-history-card';
import { InsuranceCard } from './insurance-card';
import { AppointmentsCard } from './appointments-card';
import { MedicationsCard } from './medications-card';
import { MedicationDetailCard } from './medication-detail-card';
import { BookingConfirmationCard } from './booking-confirmation-card';
import { ServiceIcon } from '@/components/ui/logo';

const SERVICE_META: Record<string, { icon: string; name: string; serviceId: string }> = {
  getPatientHistory:        { icon: '🏥', name: 'EHR Records',      serviceId: 'ehr' },
  checkInsuranceCoverage:   { icon: '🛡️', name: 'Insurance',        serviceId: 'insurance' },
  getAvailableAppointments: { icon: '📅', name: 'Calendar',         serviceId: 'calendar' },
  bookAppointment:          { icon: '📅', name: 'Calendar',         serviceId: 'calendar' },
  getCurrentMedications:    { icon: '💊', name: 'Pharmacy',         serviceId: 'pharmacy' },
  lookupMedication:         { icon: '🔬', name: 'FDA Drug Database', serviceId: 'fda' },
  sendHealthReminder:       { icon: '📧', name: 'Email',            serviceId: 'email' },
};

type AnyToolPart = ToolUIPart | DynamicToolUIPart;

interface ToolInvocationCardProps {
  toolName: string;
  part: AnyToolPart;
}

type NotAuthorizedResult = {
  error: 'NOT_AUTHORIZED';
  service: string;
  message: string;
  connectUrl: string;
};

function getSuccessSummary(toolName: string, output: unknown): string {
  if (toolName === 'getPatientHistory') {
    const name = (output as Record<string, unknown>)?.name;
    return typeof name === 'string' ? `Medical history loaded for ${name}` : 'Medical history loaded';
  }
  if (toolName === 'checkInsuranceCoverage') {
    const pct = (output as Record<string, unknown>)?.coveragePercent;
    return typeof pct === 'number' ? `${pct}% coverage verified` : 'Coverage verified';
  }
  if (toolName === 'getAvailableAppointments') {
    const slots = (output as Record<string, unknown>)?.slots;
    const count = Array.isArray(slots) ? slots.length : null;
    return count !== null ? `${count} available slot${count !== 1 ? 's' : ''} found` : 'Slots retrieved';
  }
  if (toolName === 'bookAppointment') return 'Appointment booked successfully';
  if (toolName === 'getCurrentMedications') {
    const meds = (output as Record<string, unknown>)?.medications;
    const count = Array.isArray(meds) ? meds.length : null;
    return count !== null ? `${count} active medication${count !== 1 ? 's' : ''} retrieved` : 'Medications retrieved';
  }
  if (toolName === 'lookupMedication') {
    const name = (output as Record<string, unknown>)?.name;
    return typeof name === 'string' ? `Drug info: ${name}` : 'Drug information retrieved';
  }
  if (toolName === 'sendHealthReminder') return 'Health reminder sent';
  return 'Completed';
}

function hasKey(obj: unknown, key: string): boolean {
  return obj != null && typeof obj === 'object' && key in (obj as object);
}

export function ToolInvocationCard({ toolName, part }: ToolInvocationCardProps) {
  const meta = SERVICE_META[toolName] ?? { icon: '🔧', name: toolName, serviceId: '' };

  const state = part.state;
  const isLoading = state === 'input-streaming' || state === 'input-available';
  const hasOutput = state === 'output-available';
  const output = hasOutput ? (part as { output: unknown }).output : null;

  const notAuth =
    output != null &&
    typeof output === 'object' &&
    (output as Record<string, unknown>).error === 'NOT_AUTHORIZED'
      ? (output as NotAuthorizedResult)
      : null;

  const isSuccess = hasOutput && !notAuth;

  const inputRaw = (part as Record<string, unknown>).input;
  const inputEntries: [string, string][] =
    inputRaw != null && typeof inputRaw === 'object'
      ? Object.entries(inputRaw as Record<string, unknown>)
          .filter(([, v]) => v !== undefined && v !== null && v !== '')
          .map(([k, v]) => [k, String(v)])
      : [];

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className="my-1 flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm animate-pulse">
        <span className="text-teal-600">
          <ServiceIcon serviceId={meta.serviceId} className="h-4 w-4" />
        </span>
        <span className="font-medium text-gray-600">{meta.name}</span>
        <span className="text-gray-300">•</span>
        <span className="text-xs text-gray-400">Fetching token from Auth0 Token Vault...</span>
        <span className="flex items-end gap-0.5 pb-0.5">
          {[0, 150, 300].map(d => (
            <span key={d} className="inline-block h-1 w-1 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${d}ms` }} />
          ))}
        </span>
      </div>
    );
  }

  /* ── NOT_AUTHORIZED state ── */
  if (notAuth) {
    return (
      <div className="my-1 rounded-lg border border-l-4 border-red-200 border-l-red-500 bg-red-50 px-3 py-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-red-400"><ServiceIcon serviceId={meta.serviceId} className="h-4 w-4" /></span>
          <span className="font-medium text-gray-700">{meta.name}</span>
          <span className="font-medium text-red-600">✗ Not authorized</span>
        </div>
        <div className="mt-1 text-xs text-red-500">
          <a href={notAuth.connectUrl} className="underline hover:no-underline">
            Connect {meta.name} to continue →
          </a>
        </div>
      </div>
    );
  }

  /* ── Success state ── */
  if (isSuccess) {
    const summary = getSuccessSummary(toolName, output);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = output as any;

    return (
      <div className="my-1">
        {/* Status pill */}
        <div className="rounded-lg border border-l-4 border-teal-200 border-l-teal-500 bg-teal-50 px-3 py-2 text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-teal-600"><ServiceIcon serviceId={meta.serviceId} className="h-4 w-4" /></span>
            <span className="font-medium text-gray-700">{meta.name}</span>
            <span className="font-medium text-teal-600">✓</span>
            <span className="text-teal-700">{summary}</span>
          </div>
          {inputEntries.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {inputEntries.map(([k, v]) => (
                <span key={k} className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">
                  <span className="font-medium text-gray-600">{k}:</span> {v}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Rich data cards */}
        {toolName === 'getPatientHistory' && hasKey(out, 'name') && (
          <PatientHistoryCard data={out} />
        )}
        {toolName === 'checkInsuranceCoverage' && hasKey(out, 'coveragePercent') && (
          <InsuranceCard data={out} />
        )}
        {toolName === 'getAvailableAppointments' && hasKey(out, 'slots') && Array.isArray(out.slots) && (
          <AppointmentsCard data={out} />
        )}
        {toolName === 'bookAppointment' && (hasKey(out, 'appointment') || hasKey(out, 'message')) && (
          <BookingConfirmationCard data={out} />
        )}
        {toolName === 'getCurrentMedications' && hasKey(out, 'medications') && Array.isArray(out.medications) && (
          <MedicationsCard data={out} />
        )}
        {toolName === 'lookupMedication' && hasKey(out, 'name') && (
          <MedicationDetailCard data={out} />
        )}
      </div>
    );
  }

  /* ── Fallback ── */
  return (
    <div className="my-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-400"><ServiceIcon serviceId={meta.serviceId} className="h-4 w-4" /></span>
        <span className="font-medium text-gray-700">{meta.name}</span>
      </div>
    </div>
  );
}
