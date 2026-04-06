'use client';

import { useState, useEffect, useCallback } from 'react';
import { ServiceCard } from './service-card';
import type { ConnectedService, AuditLogEntry } from '@/types';

interface ConnectionsPanelProps {
  auditLog: AuditLogEntry[];
}

export function ConnectionsPanel({ auditLog }: ConnectionsPanelProps) {
  const [services, setServices] = useState<ConnectedService[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async () => {
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

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      {/* Header */}
      <div>
        <h2 className="font-semibold text-gray-900">Health Services</h2>
        <p className="mt-0.5 text-xs text-gray-500">
          {connectedCount}/{services.length} connected
        </p>
      </div>

      {/* Service Cards */}
      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
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

      {/* Security Note */}
      <div className="rounded-lg bg-blue-50 p-3">
        <p className="text-xs font-medium text-blue-800">🔒 Token Vault Security</p>
        <p className="mt-1 text-xs text-blue-600">
          Each service token is stored securely in Auth0 Token Vault. The agent can only
          access services you've authorized — revoke access anytime.
        </p>
      </div>

      {/* Audit Log */}
      {auditLog.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Audit Log
          </h3>
          <div className="flex flex-col gap-1">
            {auditLog.slice(-10).reverse().map((entry) => (
              <div
                key={entry.id}
                className={`rounded-lg p-2 ${
                  entry.success ? 'bg-gray-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{entry.action}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{entry.tokenPreview}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                    <span className={`text-xs font-semibold ${entry.success ? 'text-green-600' : 'text-red-500'}`}>
                      {entry.success ? '✓ OK' : '✗ Denied'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
