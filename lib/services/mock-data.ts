import patientData from '@/data/demo-patient.json';
import type { InsuranceCoverage, Appointment, Medication } from '@/types';

const DEMO_TOKENS = new Set([
  process.env.DEMO_EHR_TOKEN ?? 'demo_ehr_token_abc123',
  process.env.DEMO_INSURANCE_TOKEN ?? 'demo_insurance_token_def456',
  process.env.DEMO_CALENDAR_TOKEN ?? 'demo_calendar_token_jkl012',
  process.env.DEMO_PHARMACY_TOKEN ?? 'demo_pharmacy_token_ghi789',
  process.env.DEMO_EMAIL_TOKEN ?? 'demo_email_token_mno345',
]);

export function validateToken(token: string | undefined | null): boolean {
  if (!token) return false;
  return DEMO_TOKENS.has(token);
}

export function getEhrData() {
  return {
    patient: {
      name: patientData.name,
      dob: patientData.dob,
      conditions: patientData.conditions,
      allergies: patientData.ehrRecords.allergies,
      bloodType: patientData.ehrRecords.bloodType,
      primaryCare: patientData.primaryCare,
      clinic: patientData.clinic,
      lastVisit: patientData.lastVisit,
      emergencyContact: patientData.ehrRecords.emergencyContact,
    },
    recentVisits: patientData.ehrRecords.recentVisits,
  };
}

export function getInsuranceCoverage(procedureType: string, specialistType?: string): InsuranceCoverage {
  const { insurance } = patientData;
  const deductibleRemaining = insurance.deductible - insurance.deductibleMet;

  const specialistCoverage: Record<string, InsuranceCoverage> = {
    orthopedics: {
      covered: true,
      coveragePercent: 80,
      copay: insurance.copay.specialist,
      requiresReferral: true,
      notes: `Covered at 80% after deductible. $${deductibleRemaining} remaining on deductible. Requires referral from primary care.`,
    },
    endocrinology: {
      covered: true,
      coveragePercent: 80,
      copay: insurance.copay.specialist,
      requiresReferral: true,
      notes: `Covered at 80% after deductible. Diabetes management visits fully covered under chronic care benefit.`,
    },
    'primary care': {
      covered: true,
      coveragePercent: 100,
      copay: insurance.copay.primary,
      requiresReferral: false,
      notes: `Primary care visits fully covered. $${insurance.copay.primary} copay only.`,
    },
    'physical therapy': {
      covered: true,
      coveragePercent: 70,
      copay: 40,
      requiresReferral: true,
      notes: `Covered at 70% after deductible. Up to 30 visits per year. Requires prior authorization.`,
    },
    cardiology: {
      covered: true,
      coveragePercent: 80,
      copay: insurance.copay.specialist,
      requiresReferral: true,
      notes: `Covered at 80% after deductible. ECG and stress tests covered under diagnostic benefit.`,
    },
  };

  const key = (specialistType ?? procedureType).toLowerCase();
  return specialistCoverage[key] ?? {
    covered: true,
    coveragePercent: 80,
    copay: insurance.copay.specialist,
    requiresReferral: true,
    notes: `Generally covered at 80% under your ${insurance.plan} plan. Contact BlueCross for specific procedure coverage details.`,
  };
}

export function getAvailableSlots(specialty?: string) {
  const slots = patientData.availableSlots;
  if (specialty) {
    const filtered = slots.filter((s) =>
      s.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
    return filtered.length > 0 ? filtered : slots;
  }
  return slots;
}

export function bookAppointment(slotIndex: number, reason: string): Appointment {
  const slot = patientData.availableSlots[slotIndex] ?? patientData.availableSlots[0];
  return {
    id: `appt_${Date.now()}`,
    date: slot.date,
    time: slot.time,
    doctor: slot.doctor,
    specialty: slot.specialty,
    location: slot.location,
    reason,
    status: 'scheduled',
  };
}

export function getPharmacyData(): Medication[] {
  return [
    {
      name: 'Metformin',
      genericName: 'Metformin Hydrochloride',
      dosage: '500mg',
      frequency: 'Twice daily with meals',
      prescribedBy: 'Dr. Sarah Chen',
      refillsRemaining: 3,
      nextRefillDate: '2026-04-15',
    },
    {
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      prescribedBy: 'Dr. Sarah Chen',
      refillsRemaining: 5,
      nextRefillDate: '2026-05-01',
    },
  ];
}
