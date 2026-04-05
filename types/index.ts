export type ServiceId = 'ehr' | 'insurance' | 'calendar' | 'pharmacy' | 'email';

export interface HealthService {
  id: ServiceId;
  name: string;
  description: string;
  icon: string;
  connection: string; // Auth0 connection name
  scopes?: string[];
}

export interface ConnectedService extends HealthService {
  connected: boolean;
  connectedAt?: string;
  tokenPreview?: string; // masked token like tok_****1a2b
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  service: ServiceId;
  action: string;
  tokenPreview: string;
  success: boolean;
}

export interface DemoPatient {
  id: string;
  name: string;
  dob: string;
  conditions: string[];
  medications: string[];
  insurance: {
    provider: string;
    plan: string;
    memberId: string;
    deductible: number;
    deductibleMet: number;
    copay: { primary: number; specialist: number };
  };
  primaryCare: string;
  lastVisit: string;
  upcomingAppointments: Appointment[];
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  location: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface InsuranceCoverage {
  covered: boolean;
  coveragePercent: number;
  copay: number;
  requiresReferral: boolean;
  notes: string;
}

export interface Medication {
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  refillsRemaining: number;
  nextRefillDate: string;
}
