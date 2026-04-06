'use client';

import { useState } from 'react';
import type { ConnectedService } from '@/types';
import { ServiceIcon } from '@/components/ui/logo';

interface ServiceCardProps {
  service: ConnectedService;
  onConnect: (serviceId: string) => Promise<void>;
  onRevoke: (serviceId: string) => Promise<void>;
}

const SERVICE_SCOPES: Record<string, string[]> = {
  ehr: [
    'Read medical history & diagnoses',
    'View conditions and allergies',
    'Access clinical visit notes',
    'View emergency contact info',
  ],
  insurance: [
    'Read insurance plan details',
    'Check coverage & benefits',
    'View copay & deductible info',
    'Access referral requirements',
  ],
  calendar: [
    'View available appointment slots',
    'Book appointments on your behalf',
    'Read your care team information',
  ],
  pharmacy: [
    'Read current prescriptions',
    'View medication dosages & frequency',
    'Check refill status & dates',
  ],
  email: [
    'Send appointment confirmations to your email',
    'Send health reminders on your behalf',
  ],
};

export function ServiceCard({ service, onConnect, onRevoke }: ServiceCardProps) {
  const [loading, setLoading] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const scopes = SERVICE_SCOPES[service.id] ?? [];

  function handleConnectClick() {
    setShowConsent(true);
  }

  function handleCancel() {
    setShowConsent(false);
  }

  async function handleAuthorize() {
    setLoading(true);
    await onConnect(service.id);
    setLoading(false);
    setShowConsent(false);
  }

  async function handleRevoke() {
    setLoading(true);
    await onRevoke(service.id);
    setLoading(false);
  }

  return (
    <div
      className={`rounded-xl border transition-all ${
        service.connected
          ? 'border-teal-200 bg-teal-50/50'
          : showConsent
          ? 'border-gray-300 bg-white'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {/* Service info row */}
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
              service.connected ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <ServiceIcon serviceId={service.id} className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{service.name}</span>
              {service.connected && (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  Connected
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-gray-500">{service.description}</p>
{service.connected && service.connectedAt && (
              <p className="mt-0.5 text-xs text-gray-400">
                Since {new Date(service.connectedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          {service.connected ? (
            <button
              onClick={handleRevoke}
              disabled={loading}
              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              {loading ? 'Revoking...' : 'Revoke'}
            </button>
          ) : (
            <button
              onClick={handleConnectClick}
              disabled={loading || showConsent}
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
            >
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Inline OAuth consent panel */}
      {showConsent && !service.connected && (
        <div className="mx-4 mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          {/* Panel header */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
              <ServiceIcon serviceId={service.id} className="h-4 w-4 text-gray-500" />
              {service.name} wants access to your account
            </h3>
            <span className="flex-shrink-0 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
              OAuth 2.0 Authorization
            </span>
          </div>

          {/* Scopes list */}
          {scopes.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {scopes.map((scope) => (
                <li key={scope} className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="mt-0.5 flex-shrink-0 font-bold text-teal-600">✓</span>
                  <span>{scope}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Footer note */}
          <p className="mt-3 rounded-md border border-gray-200 bg-white px-3 py-2 text-[11px] text-gray-500">
            🔒 Secured by Auth0 Token Vault — tokens are never stored in this app
          </p>

          {/* Action buttons */}
          <div className="mt-3 flex flex-col gap-2">
            <button
              onClick={handleAuthorize}
              disabled={loading}
              className="w-full rounded-lg bg-teal-600 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? 'Authorizing...' : 'Authorize Access'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="w-full py-1.5 text-xs text-gray-500 transition hover:text-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
