'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ConnectionsPanel } from '@/components/connections/connections-panel';
import { MediCheckLogo } from '@/components/ui/logo';
import type { AuditLogEntry } from '@/types';

const TOOL_LABELS: Record<string, { icon: string; service: string; action: string }> = {
  getPatientHistory:       { icon: '🏥', service: 'EHR Records',   action: 'Fetched medical history' },
  checkInsuranceCoverage:  { icon: '🛡️', service: 'Insurance',     action: 'Checked insurance coverage' },
  getAvailableAppointments:{ icon: '📅', service: 'Calendar',       action: 'Fetched available appointments' },
  bookAppointment:         { icon: '📅', service: 'Calendar',       action: 'Booked appointment' },
  getCurrentMedications:   { icon: '💊', service: 'Pharmacy',       action: 'Fetched medications' },
  lookupMedication:        { icon: '🔬', service: 'FDA Database',   action: 'Looked up medication' },
  sendHealthReminder:      { icon: '📧', service: 'Email',          action: 'Sent health reminder' },
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
  const [logOpen, setLogOpen] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (logRef.current && !logRef.current.contains(e.target as Node)) {
        setLogOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToolCall = useCallback((toolName: string, success: boolean) => {
    const label = TOOL_LABELS[toolName];
    setAuditLog((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        service: toolName as AuditLogEntry['service'],
        action: label?.action ?? toolName,
        tokenPreview: label ? `${label.icon} ${label.service}` : toolName,
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

          {/* Audit Log dropdown */}
          <div className="relative hidden sm:block" ref={logRef}>
            <button
              onClick={() => setLogOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              Activity Log
              {auditLog.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                  {auditLog.length > 9 ? '9+' : auditLog.length}
                </span>
              )}
            </button>

            {logOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-xl border border-gray-200 bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
                  <span className="text-xs font-semibold text-gray-700">Agent Activity Log</span>
                  {auditLog.length > 0 && (
                    <span className="text-[10px] text-gray-400">{auditLog.length} action{auditLog.length !== 1 ? 's' : ''}</span>
                  )}
                </div>
                {auditLog.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs text-gray-400 italic">
                    No activity yet — logs appear here as the agent runs tools.
                  </p>
                ) : (
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {auditLog.slice().reverse().map((entry) => (
                      <div key={entry.id} className="flex items-start justify-between gap-3 px-4 py-2.5">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-800">{entry.action}</p>
                          <p className="mt-0.5 text-[11px] text-gray-400">{entry.tokenPreview}</p>
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
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

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
