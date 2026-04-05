'use client';

import { useState, useCallback } from 'react';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ConnectionsPanel } from '@/components/connections/connections-panel';
import { MediCheckLogo } from '@/components/ui/logo';
import type { AuditLogEntry } from '@/types';

const SERVICE_NAMES: Record<string, string> = {
  getPatientHistory: 'EHR Records',
  checkInsuranceCoverage: 'Insurance',
  getAvailableAppointments: 'Calendar',
  bookAppointment: 'Calendar',
  getCurrentMedications: 'Pharmacy',
  lookupMedication: 'FDA Database',
  sendHealthReminder: 'Email',
};

const SERVICE_TOKENS: Record<string, string> = {
  getPatientHistory: 'demo_ehr****abc123',
  checkInsuranceCoverage: 'demo_ins****def456',
  getAvailableAppointments: 'demo_cal****ghi789',
  bookAppointment: 'demo_cal****ghi789',
  getCurrentMedications: 'demo_pha****jkl012',
  lookupMedication: 'public_api',
  sendHealthReminder: 'demo_eml****mno345',
};

interface User {
  name?: string;
  email?: string;
  picture?: string;
  [key: string]: unknown;
}

export function DashboardClient({ user }: { user: User }) {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToolCall = useCallback((toolName: string, success: boolean) => {
    setAuditLog((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        service: toolName as AuditLogEntry['service'],
        action: SERVICE_NAMES[toolName] ?? toolName,
        tokenPreview: SERVICE_TOKENS[toolName] ?? 'unknown',
        success,
      },
    ]);
  }, []);

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Top nav */}
      <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <MediCheckLogo size="sm" />
          <span className="hidden rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 sm:block">
            Auth0 Token Vault
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/dashboard/connections"
            className="hidden rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 sm:block"
          >
            Connections
          </a>
          <a
            href="/dashboard/help"
            className="hidden rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 sm:block"
          >
            Help
          </a>
          <div className="hidden items-center gap-2 sm:flex">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name ?? 'User'}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-xs font-medium text-teal-700">
                {initials}
              </div>
            )}
            <div className="flex flex-col leading-tight">
              {user.name && <span className="text-sm font-medium text-gray-800">{user.name}</span>}
              {user.email && <span className="text-xs text-gray-500">{user.email}</span>}
            </div>
          </div>
          <a
            href="/auth/logout"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
          >
            Logout
          </a>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-72 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
            <ConnectionsPanel auditLog={auditLog} />
          </aside>
        )}

        {/* Chat */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <ChatInterface onToolCall={handleToolCall} userName={user.name ?? user.email} />
        </main>
      </div>
    </div>
  );
}
