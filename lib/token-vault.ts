/**
 * Token Vault — manages per-service OAuth tokens for the AI agent
 *
 * Uses Auth0 Management API to store and retrieve third-party service tokens.
 * Each connected service has its own token that the agent must present when
 * calling that service. Users can revoke tokens at any time.
 *
 * Architecture:
 * - Mock services (EHR, insurance, pharmacy) use demo tokens stored in Auth0 user metadata
 * - Google Calendar uses real OAuth via Auth0 social connection
 * - All tokens are fetched at agent tool execution time — never stored client-side
 */

import { ServiceId, ConnectedService, HealthService } from '@/types';

export const HEALTH_SERVICES: HealthService[] = [
  {
    id: 'ehr',
    name: 'EHR Records',
    description: 'Access your medical history, diagnoses, and clinical notes',
    icon: '🏥',
    connection: 'mock-ehr',
  },
  {
    id: 'insurance',
    name: 'Insurance',
    description: 'Check coverage, benefits, and claim status',
    icon: '🛡️',
    connection: 'mock-insurance',
  },
  {
    id: 'calendar',
    name: 'Appointments',
    description: 'View and book appointments with your care team',
    icon: '📅',
    connection: 'mock-calendar',
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    description: 'View prescriptions and request refills',
    icon: '💊',
    connection: 'mock-pharmacy',
  },
  {
    id: 'email',
    name: 'Email Reminders',
    description: 'Receive appointment reminders and health updates',
    icon: '📧',
    connection: 'mock-email',
  },
];

/**
 * Demo token map — in production these would come from Auth0 Token Vault.
 * Stored in user metadata: app_metadata.token_vault.{ serviceId: token }
 */
const DEMO_TOKENS: Record<ServiceId, string> = {
  ehr: process.env.DEMO_EHR_TOKEN ?? 'demo_ehr_tok_abc123',
  insurance: process.env.DEMO_INSURANCE_TOKEN ?? 'demo_insurance_tok_def456',
  calendar: process.env.DEMO_CALENDAR_TOKEN ?? 'demo_calendar_tok_ghi789',
  pharmacy: process.env.DEMO_PHARMACY_TOKEN ?? 'demo_pharmacy_tok_jkl012',
  email: process.env.DEMO_EMAIL_TOKEN ?? 'demo_email_tok_mno345',
};

async function getMgmtApiToken(): Promise<string> {
  const domain = process.env.AUTH0_DOMAIN;
  const res = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_MGMT_CLIENT_ID,
      client_secret: process.env.AUTH0_MGMT_CLIENT_SECRET,
      audience: `https://${domain}/api/v2/`,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Failed to get Management API token: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function getUserMetadata(userId: string): Promise<Record<string, unknown>> {
  const mgmtToken = await getMgmtApiToken();
  const res = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`,
    { headers: { Authorization: `Bearer ${mgmtToken}` } }
  );
  const user = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to get user metadata: ${JSON.stringify(user)}`);
  }
  return (user.app_metadata ?? {}) as Record<string, unknown>;
}

async function updateUserMetadata(userId: string, metadata: Record<string, unknown>): Promise<void> {
  const mgmtToken = await getMgmtApiToken();
  const res = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${mgmtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ app_metadata: metadata }),
    }
  );
  if (!res.ok) {
    const body = await res.json();
    throw new Error(`Failed to update user metadata: ${JSON.stringify(body)}`);
  }
}

/**
 * Fetch a stored token for a user's connected service.
 * Returns null if the service is not connected.
 */
export async function getServiceToken(userId: string, serviceId: ServiceId): Promise<string | null> {
  const metadata = await getUserMetadata(userId);
  const vault = (metadata.token_vault ?? {}) as Record<string, { token: string; connectedAt: string }>;
  return vault[serviceId]?.token ?? null;
}

/**
 * List all connected services for a user with their connection status.
 */
export async function getConnectedServices(userId: string): Promise<ConnectedService[]> {
  const metadata = await getUserMetadata(userId);
  const vault = (metadata.token_vault ?? {}) as Record<string, { token: string; connectedAt: string }>;

  return HEALTH_SERVICES.map((service) => {
    const entry = vault[service.id];
    return {
      ...service,
      connected: !!entry,
      connectedAt: entry?.connectedAt,
      tokenPreview: entry ? maskToken(entry.token) : undefined,
    };
  });
}

/**
 * Connect a service — stores the demo token in the user's Token Vault.
 * In production, this would complete an OAuth flow for real service tokens.
 */
export async function connectService(userId: string, serviceId: ServiceId): Promise<void> {
  const metadata = await getUserMetadata(userId);
  const vault = ((metadata.token_vault ?? {}) as Record<string, unknown>);

  vault[serviceId] = {
    token: DEMO_TOKENS[serviceId],
    connectedAt: new Date().toISOString(),
  };

  await updateUserMetadata(userId, { ...metadata, token_vault: vault });
}

/**
 * Revoke a service connection — removes the token from Token Vault.
 * The agent immediately loses access to that service.
 */
export async function revokeService(userId: string, serviceId: ServiceId): Promise<void> {
  const metadata = await getUserMetadata(userId);
  const vault = ((metadata.token_vault ?? {}) as Record<string, unknown>);
  delete vault[serviceId];
  await updateUserMetadata(userId, { ...metadata, token_vault: vault });
}

function maskToken(token: string): string {
  if (token.length <= 8) return '****';
  return `${token.slice(0, 8)}****${token.slice(-4)}`;
}
