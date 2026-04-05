import { Resend } from 'resend';
import type { Appointment } from '@/types';

export async function sendAppointmentConfirmation(
  toEmail: string,
  patientName: string,
  appointment: Appointment
): Promise<{ success: boolean; messageId?: string }> {
  if (!process.env.RESEND_API_KEY) {
    // Demo mode: simulate success
    return { success: true, messageId: `demo_${Date.now()}` };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: 'MediCheck <onboarding@resend.dev>',
      to: toEmail,
      subject: `Appointment Confirmed: ${appointment.doctor} on ${appointment.date}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f766e;">Appointment Confirmed ✓</h2>
          <p>Hi ${patientName},</p>
          <p>Your appointment has been successfully booked:</p>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; font-weight: bold;">Doctor</td><td style="padding: 8px;">${appointment.doctor}</td></tr>
            <tr style="background: #f0fdf4;"><td style="padding: 8px; font-weight: bold;">Specialty</td><td style="padding: 8px;">${appointment.specialty}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Date</td><td style="padding: 8px;">${appointment.date}</td></tr>
            <tr style="background: #f0fdf4;"><td style="padding: 8px; font-weight: bold;">Time</td><td style="padding: 8px;">${appointment.time}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Location</td><td style="padding: 8px;">${appointment.location}</td></tr>
            <tr style="background: #f0fdf4;"><td style="padding: 8px; font-weight: bold;">Reason</td><td style="padding: 8px;">${appointment.reason}</td></tr>
          </table>
          <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
            This email was sent by MediCheck on your behalf using your authorized email connection.
          </p>
        </div>
      `,
    });

    if (error) return { success: false };
    return { success: true, messageId: data?.id };
  } catch {
    return { success: false };
  }
}
