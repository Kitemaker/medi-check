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
    </div>
  );
}
