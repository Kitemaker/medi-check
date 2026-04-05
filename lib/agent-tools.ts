import { tool } from 'ai';
import { z } from 'zod';
import { getServiceToken } from './token-vault';
import { lookupDrug } from './services/open-fda';
import { sendAppointmentConfirmation } from './services/resend';
import type { ServiceId } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

function notAuthorized(service: string, serviceId: ServiceId) {
  return {
    error: 'NOT_AUTHORIZED' as const,
    service,
    serviceId,
    message: `You haven't connected your ${service} service yet. The agent needs your authorization to access it.`,
    connectUrl: `/dashboard/connections`,
  };
}

async function fetchMockService(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
}

export function createAgentTools(userId: string, userEmail?: string, userName?: string) {
  return {
    getPatientHistory: tool({
      description:
        "Retrieve the patient's medical history, recent visits, conditions, allergies, and primary care information from their Electronic Health Record (EHR).",
      inputSchema: z.object({}),
      execute: async () => {
        const token = await getServiceToken(userId, 'ehr');
        if (!token) return notAuthorized('EHR Records', 'ehr');

        const res = await fetchMockService('/api/mock/ehr', token);
        if (!res.ok) return notAuthorized('EHR Records', 'ehr');
        return res.json();
      },
    }),

    checkInsuranceCoverage: tool({
      description:
        "Check if a medical procedure, specialist visit, or treatment is covered by the patient's insurance plan. Returns coverage percentage, copay, and whether a referral is needed.",
      inputSchema: z.object({
        procedureType: z.string().describe('Type of medical procedure (e.g., "knee surgery", "MRI scan")'),
        specialistType: z
          .string()
          .optional()
          .describe('Type of specialist (e.g., "orthopedics", "cardiology", "physical therapy")'),
      }),
      execute: async (input) => {
        const { procedureType, specialistType } = input;
        const token = await getServiceToken(userId, 'insurance');
        if (!token) return notAuthorized('Insurance', 'insurance');

        const params = new URLSearchParams({ procedure: procedureType });
        if (specialistType) params.set('specialist', specialistType);

        const res = await fetchMockService(`/api/mock/insurance?${params}`, token);
        if (!res.ok) return notAuthorized('Insurance', 'insurance');

        const coverage = await res.json();
        return { ...coverage, insurancePlan: 'BlueCross PPO Gold', memberId: 'BCX-2024-88471' };
      },
    }),

    getAvailableAppointments: tool({
      description:
        'Find available appointment slots with doctors. Can filter by specialty (e.g., "orthopedics", "primary care").',
      inputSchema: z.object({
        specialty: z
          .string()
          .optional()
          .describe('Medical specialty to filter by (e.g., "orthopedics", "primary care", "endocrinology")'),
      }),
      execute: async (input) => {
        const { specialty } = input;
        const token = await getServiceToken(userId, 'calendar');
        if (!token) return notAuthorized('Appointments Calendar', 'calendar');

        const params = specialty ? `?specialty=${encodeURIComponent(specialty)}` : '';
        const res = await fetchMockService(`/api/mock/appointments${params}`, token);
        if (!res.ok) return notAuthorized('Appointments Calendar', 'calendar');
        return res.json();
      },
    }),

    bookAppointment: tool({
      description:
        'Book an appointment for the patient. Requires knowing the slot index from getAvailableAppointments.',
      inputSchema: z.object({
        slotIndex: z.number().describe('Index of the slot from getAvailableAppointments (0-based)'),
        reason: z.string().describe('Reason for the visit (e.g., "Knee pain evaluation")'),
        sendConfirmationEmail: z
          .boolean()
          .optional()
          .default(true)
          .describe('Whether to send a confirmation email to the patient'),
      }),
      execute: async (input) => {
        const { slotIndex, reason, sendConfirmationEmail } = input;
        const token = await getServiceToken(userId, 'calendar');
        if (!token) return notAuthorized('Appointments Calendar', 'calendar');

        const res = await fetchMockService('/api/mock/appointments', token, {
          method: 'POST',
          body: JSON.stringify({ slotIndex, reason }),
        });

        if (!res.ok) return notAuthorized('Appointments Calendar', 'calendar');
        const { appointment } = await res.json();

        let emailResult = null;
        if (sendConfirmationEmail) {
          const emailToken = await getServiceToken(userId, 'email');
          if (emailToken) {
            emailResult = await sendAppointmentConfirmation(
              userEmail ?? 'alex.rivera@example.com',
              userName ?? 'Patient',
              appointment
            );
          }
        }

        return {
          appointment,
          emailSent: emailResult?.success ?? false,
          message: `Appointment successfully booked with ${appointment.doctor} on ${appointment.date} at ${appointment.time}.`,
        };
      },
    }),

    getCurrentMedications: tool({
      description: "Retrieve the patient's current prescription medications from the pharmacy system.",
      inputSchema: z.object({}),
      execute: async () => {
        const token = await getServiceToken(userId, 'pharmacy');
        if (!token) return notAuthorized('Pharmacy', 'pharmacy');

        const res = await fetchMockService('/api/mock/pharmacy', token);
        if (!res.ok) return notAuthorized('Pharmacy', 'pharmacy');
        return res.json();
      },
    }),

    lookupMedication: tool({
      description:
        'Look up detailed information about a medication including purpose, warnings, dosage instructions, side effects, and drug interactions. Uses public FDA drug database.',
      inputSchema: z.object({
        drugName: z.string().describe('Name of the drug (brand or generic, e.g., "Metformin", "Lisinopril")'),
      }),
      execute: async (input) => {
        const { drugName } = input;
        const info = await lookupDrug(drugName);
        return info ?? { error: 'Drug not found', drugName };
      },
    }),

    sendHealthReminder: tool({
      description:
        'Send a health reminder or notification to the patient via email (e.g., medication reminder, follow-up reminder).',
      inputSchema: z.object({
        subject: z.string().describe('Subject of the reminder'),
        message: z.string().describe('Content of the reminder message'),
      }),
      execute: async (input) => {
        const { subject, message } = input;
        const token = await getServiceToken(userId, 'email');
        if (!token) return notAuthorized('Email Reminders', 'email');

        return {
          success: true,
          message: `Reminder sent to ${userEmail ?? 'alex.rivera@example.com'}: "${subject}"`,
          note: message,
        };
      },
    }),
  };
}
