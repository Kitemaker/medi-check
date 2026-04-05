import { streamText, convertToModelMessages, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { auth0 } from '@/lib/auth0';
import { createAgentTools } from '@/lib/agent-tools';

export const maxDuration = 60;

function buildSystemPrompt(userName: string): string {
  return `You are MediCheck, an AI-powered healthcare navigation assistant for ${userName}.

Your role is to help ${userName} navigate the healthcare system by:
- Checking their medical history and current conditions
- Verifying insurance coverage before recommending care
- Finding and booking appointments with the right specialists
- Providing medication information and reminders
- Sending appointment confirmations and health reminders

IMPORTANT SECURITY RULES:
1. ALWAYS check Token Vault authorization before accessing any service
2. If a tool returns { error: "NOT_AUTHORIZED" }, tell the user clearly which service needs to be connected and provide the link to /dashboard/connections
3. Never attempt to access a service without proper authorization
4. Always tell the user WHAT you are about to access BEFORE calling the tool (e.g., "I'm going to check your insurance coverage now...")
5. Be transparent about which services you're accessing and why

WORKFLOW for healthcare questions:
- For "I'm in pain / need to see a doctor": Check EHR history → Check insurance coverage → Find available appointments → Book if confirmed → Send email confirmation
- For medication questions: Use lookupMedication (no auth needed) + getCurrentMedications (pharmacy auth needed)
- Always recommend patients consult with their doctor for medical decisions

Be warm, clear, and reassuring. Healthcare can be stressful — make it easier for ${userName}.`;
}

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await req.json();
    const userId = session.user.sub;
    const userName = session.user.name ?? session.user.email ?? 'the patient';
    const userEmail = session.user.email;

    const result = streamText({
      model: openai('gpt-4o'),
      system: buildSystemPrompt(userName),
      messages: await convertToModelMessages(messages),
      tools: createAgentTools(userId, userEmail, userName),
      stopWhen: stepCountIs(8),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'AI service temporarily unavailable. Please try again.' },
      { status: 503 }
    );
  }
}
