'use client';

import { useState, useEffect, useCallback } from 'react';
import { ServiceCard } from '@/components/connections/service-card';
import type { ConnectedService } from '@/types';
import Link from 'next/link';

export default function ConnectionsPage() {
  const [services, setServices] = useState<ConnectedService[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/connections');
    if (res.ok) {
      const data = await res.json();
      setServices(data.services);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  async function handleConnect(serviceId: string) {
    await fetch('/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId }),
    });
    await fetchServices();
  }

  async function handleRevoke(serviceId: string) {
    await fetch('/api/connections', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId }),
    });
    await fetchServices();
  }

  const connectedCount = services.filter((s) => s.connected).length;
  const connectedServices = services.filter((s) => s.connected);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-teal-600 hover:underline">
              ← Back to Chat
            </Link>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Connected Services</h1>
          <p className="mt-1 text-sm text-gray-500">
            Control which health services MediCheck can access on your behalf.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-green-700">{loading ? '—' : connectedCount}</p>
            <p className="mt-0.5 text-xs font-medium text-green-600">Connected</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center">
            <p className="text-2xl font-bold text-gray-700">{loading ? '—' : services.length}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">Available</p>
          </div>
          <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-teal-700">{loading ? '—' : connectedCount}</p>
            <p className="mt-0.5 text-xs font-medium text-teal-600">Vault Entries</p>
            <p className="text-[10px] text-teal-500 leading-tight">tokens in Auth0 Token Vault</p>
          </div>
        </div>

        {/* Token Vault callout — compact */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
          <div className="flex items-start gap-2.5">
            <span className="text-lg leading-none mt-0.5">🔒</span>
            <div>
              <p className="text-sm font-semibold text-blue-900">Auth0 Token Vault</p>
              <p className="mt-0.5 text-xs text-blue-700">
                Your credentials are stored securely in Auth0 Token Vault — never in the app
                database. Tokens are retrieved at runtime only for services you&apos;ve authorized.
              </p>
            </div>
          </div>
        </div>

        {/* Service list */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Your Health Services
          </h2>
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
                ))}
              </div>
            ) : (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onConnect={handleConnect}
                  onRevoke={handleRevoke}
                />
              ))
            )}
          </div>
        </div>

        {/* Connected services summary */}
        {!loading && connectedServices.length > 0 && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            The AI agent can access{' '}
            <span className="font-medium">
              {connectedServices.map((s) => s.name).join(', ')}
            </span>{' '}
            on your behalf. Revoke any service above to remove access immediately.
          </div>
        )}
      </main>
    </div>
  );
}
