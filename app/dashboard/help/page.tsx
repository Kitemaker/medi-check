export default function HelpPage() {
  return (
    <div className="min-h-full overflow-y-auto bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">How to use MediCheck</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your AI-powered healthcare navigator — here&apos;s everything you need to get started.
          </p>
        </div>

        {/* Steps */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Getting started</h2>

          {[
            {
              num: '01',
              title: 'Connect your health services',
              body: 'Open the left sidebar and click Connect next to each service you want MediCheck to access. Each service gets its own secure token stored in Auth0 Token Vault — the agent can only use services you have explicitly authorised.',
              tip: 'You can revoke any service at any time. MediCheck immediately loses access.',
            },
            {
              num: '02',
              title: 'Ask in plain English',
              body: 'Type your question or request in the chat box at the bottom. MediCheck understands natural language — no special commands needed.',
              tip: null,
            },
            {
              num: '03',
              title: 'Review what the agent does',
              body: 'Every tool call MediCheck makes is recorded in the Audit Log at the bottom of the sidebar. You can see which service was accessed, which token was used, and whether it succeeded.',
              tip: null,
            },
          ].map((step) => (
            <div key={step.num} className="flex gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 font-mono text-sm font-bold text-white">
                {step.num}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{step.body}</p>
                {step.tip && (
                  <p className="mt-2 text-xs text-teal-600">💡 {step.tip}</p>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Services */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Available services</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { icon: '🏥', name: 'EHR Records', desc: 'Medical history, conditions, allergies, and recent visits.' },
              { icon: '🛡️', name: 'Insurance', desc: 'Coverage check, copay, and referral requirements for any procedure.' },
              { icon: '📅', name: 'Appointments', desc: 'Browse available slots and book with the right specialist.' },
              { icon: '💊', name: 'Pharmacy', desc: 'Current prescriptions, dosage, and refill status.' },
              { icon: '📧', name: 'Email Reminders', desc: 'Appointment confirmations and health reminders sent to your inbox.' },
            ].map((s) => (
              <div key={s.name} className="flex gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Example prompts */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Example questions to ask</h2>
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 divide-y divide-gray-100">
            {[
              { prompt: 'I have knee pain — can I see a specialist?', note: 'Checks EHR → verifies insurance coverage → finds appointments' },
              { prompt: 'What medications am I currently taking?', note: 'Reads your pharmacy record' },
              { prompt: 'Is physical therapy covered by my insurance?', note: 'Checks your plan coverage and copay' },
              { prompt: 'Book me an appointment with an orthopedic specialist', note: 'Finds available slots and books — sends email confirmation' },
              { prompt: 'Show me my recent medical history', note: 'Reads your EHR records' },
              { prompt: 'Send me a reminder about my Metformin', note: 'Sends an email reminder via the Email service' },
            ].map((item) => (
              <div key={item.prompt} className="px-5 py-3.5">
                <p className="text-sm font-medium text-gray-800">&ldquo;{item.prompt}&rdquo;</p>
                <p className="mt-0.5 text-xs text-gray-400">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture diagram */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">System architecture</h2>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 overflow-x-auto">

            {/* Layer grid */}
            <div className="min-w-[560px] space-y-2 text-xs">

              {/* Browser */}
              <div className="flex items-center gap-2">
                <div className="w-24 shrink-0 text-right font-medium text-gray-400">Browser</div>
                <div className="flex flex-1 gap-2">
                  <div className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-center font-medium text-gray-700">
                    👤 Patient
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2">
                <div className="w-24 shrink-0" />
                <div className="flex flex-1 items-center justify-center gap-8 text-gray-400">
                  <span>↓ login / chat / connect</span>
                </div>
              </div>

              {/* Next.js App */}
              <div className="flex items-start gap-2">
                <div className="w-24 shrink-0 pt-3 text-right font-medium text-gray-400">Vercel</div>
                <div className="flex flex-1 gap-2 rounded-xl border border-blue-100 bg-blue-50 p-2">
                  <div className="flex flex-1 flex-col gap-2">
                    <p className="px-1 text-xs font-semibold text-blue-700">Next.js 16 App</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-white px-2 py-2 text-center text-gray-600 shadow-sm ring-1 ring-blue-100">
                        proxy.ts<br /><span className="text-gray-400">Auth middleware</span>
                      </div>
                      <div className="rounded-lg bg-white px-2 py-2 text-center text-gray-600 shadow-sm ring-1 ring-blue-100">
                        /api/chat<br /><span className="text-gray-400">AI streaming</span>
                      </div>
                      <div className="rounded-lg bg-white px-2 py-2 text-center text-gray-600 shadow-sm ring-1 ring-blue-100">
                        /api/connections<br /><span className="text-gray-400">Token Vault API</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-2">
                        <p className="font-semibold text-blue-700">agent-tools.ts</p>
                        <p className="mt-0.5 text-gray-500">getPatientHistory · checkInsuranceCoverage · bookAppointment · getCurrentMedications · lookupMedication · sendHealthReminder</p>
                      </div>
                      <div className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-2">
                        <p className="font-semibold text-blue-700">Mock Service APIs</p>
                        <p className="mt-0.5 text-gray-500">/api/mock/ehr · /api/mock/insurance · /api/mock/appointments · /api/mock/pharmacy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrows to external */}
              <div className="flex items-center gap-2">
                <div className="w-24 shrink-0" />
                <div className="grid flex-1 grid-cols-3 gap-2 text-center text-gray-400">
                  <span>↕ auth + session</span>
                  <span>↕ tool calls</span>
                  <span>↕ email / drugs</span>
                </div>
              </div>

              {/* External services */}
              <div className="flex items-start gap-2">
                <div className="w-24 shrink-0 pt-3 text-right font-medium text-gray-400">External</div>
                <div className="grid flex-1 grid-cols-3 gap-2">
                  <div className="rounded-xl border border-purple-100 bg-purple-50 p-2 text-center">
                    <p className="font-semibold text-purple-700">Auth0</p>
                    <p className="mt-0.5 text-gray-500">Universal Login<br />Token Vault<br />Management API</p>
                  </div>
                  <div className="rounded-xl border border-orange-100 bg-orange-50 p-2 text-center">
                    <p className="font-semibold text-orange-700">OpenAI GPT-4o</p>
                    <p className="mt-0.5 text-gray-500">AI reasoning<br />tool selection<br />response generation</p>
                  </div>
                  <div className="rounded-xl border border-green-100 bg-green-50 p-2 text-center">
                    <p className="font-semibold text-green-700">Resend + OpenFDA</p>
                    <p className="mt-0.5 text-gray-500">Email confirmations<br />Drug information<br />(public APIs)</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Token Vault callout */}
            <div className="mt-4 rounded-lg bg-teal-50 px-4 py-3 text-xs text-teal-800 ring-1 ring-teal-100">
              <strong>Token Vault flow:</strong> When the agent calls a tool → fetches token from Auth0 <code className="rounded bg-teal-100 px-1">app_metadata.token_vault</code> via Management API → token present: calls service with <code className="rounded bg-teal-100 px-1">Authorization: Bearer &lt;token&gt;</code> → token absent: returns <code className="rounded bg-teal-100 px-1">NOT_AUTHORIZED</code>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="rounded-xl bg-teal-50 p-5 ring-1 ring-teal-100">
          <h2 className="font-semibold text-teal-900">🔒 How your data stays secure</h2>
          <ul className="mt-3 space-y-2 text-sm text-teal-800">
            <li>• Service tokens are stored in <strong>Auth0 Token Vault</strong> — never in the app or the browser.</li>
            <li>• The agent fetches a token only at the moment it needs to call a service.</li>
            <li>• Revoking a service removes its token instantly — the agent cannot access it again until you reconnect.</li>
            <li>• Every action is logged in the Audit Log so you always know what was accessed.</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
