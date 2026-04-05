import { MediCheckLogo, IconEHR, IconInsurance, IconCalendar, IconPharmacy, IconEmail, IconFDA } from '@/components/ui/logo';

const features = [
  {
    icon: <IconEHR className="h-6 w-6" />,
    iconBg: '#f0fdfa', iconColor: '#0f766e',
    title: 'Medical History Access',
    description: 'Securely access your EHR records. The agent reads your history to make informed recommendations.',
    service: 'EHR Records',
  },
  {
    icon: <IconInsurance className="h-6 w-6" />,
    iconBg: '#eff6ff', iconColor: '#1d4ed8',
    title: 'Insurance Verification',
    description: 'Check coverage before booking. Know your copay, deductible, and if a referral is needed.',
    service: 'Insurance',
  },
  {
    icon: <IconCalendar className="h-6 w-6" />,
    iconBg: '#fdf4ff', iconColor: '#7e22ce',
    title: 'Appointment Booking',
    description: 'Find available slots and book with the right specialist — all in one conversation.',
    service: 'Calendar',
  },
  {
    icon: <IconPharmacy className="h-6 w-6" />,
    iconBg: '#fff7ed', iconColor: '#c2410c',
    title: 'Medication Management',
    description: 'Review prescriptions, get drug information, and set refill reminders.',
    service: 'Pharmacy',
  },
  {
    icon: <IconEmail className="h-6 w-6" />,
    iconBg: '#fdf2f8', iconColor: '#9333ea',
    title: 'Email Confirmations',
    description: 'Receive appointment confirmations and health reminders directly in your inbox.',
    service: 'Email',
  },
  {
    icon: <IconFDA className="h-6 w-6" />,
    iconBg: '#ecfdf5', iconColor: '#059669',
    title: 'You Stay In Control',
    description: 'Connect and revoke service access anytime. Auth0 Token Vault keeps your credentials secure.',
    service: 'Token Vault',
  },
];

const steps = [
  { num: '01', title: 'Login with Auth0', desc: 'Secure authentication — your identity is verified before anything else.' },
  { num: '02', title: 'Connect Your Services', desc: 'Choose which health services the agent can access. Each gets its own secure token.' },
  { num: '03', title: 'Ask in Plain English', desc: '"I have knee pain, can I see a specialist?" — the agent handles the rest.' },
  { num: '04', title: 'Stay in Control', desc: 'Review every action in the audit log. Revoke access to any service instantly.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <MediCheckLogo size="md" />
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 sm:block">
              Powered by Auth0 Token Vault
            </span>
            <a
              href="/auth/login"
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm text-teal-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />
            Auth0 for AI Agents — Hackathon Project
          </div>
          <h1 className="mt-4 text-5xl font-bold tracking-tight text-gray-900">
            Your AI healthcare{' '}
            <span className="text-teal-600">navigator</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500">
            MediCheck acts on your behalf to navigate the healthcare system — booking appointments,
            checking insurance, managing medications — while you stay in complete control of what
            it can access.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/auth/login"
              className="rounded-xl bg-teal-600 px-6 py-3 font-medium text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700"
            >
              Try the Demo →
            </a>
          </div>
        </div>
      </section>

      {/* Security Callout */}
      <section className="bg-gray-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-400">Security First</p>
          <h2 className="mt-3 text-3xl font-bold">The agent only does what you authorize</h2>
          <p className="mt-4 text-gray-400">
            Built on Auth0 Token Vault — your service credentials are never stored in the app.
            The agent fetches tokens at runtime, only for services you have connected, only when
            it needs them. Revoke any service with one click.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: '🔑', title: 'Per-Service Tokens', desc: 'Each health service gets its own isolated token stored in Auth0 Token Vault' },
              { icon: '👁️', title: 'Full Transparency', desc: 'Every agent action is logged — see exactly which token was used and when' },
              { icon: '⚡', title: 'Instant Revocation', desc: 'Disconnect any service immediately. The agent loses access in real time' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-gray-800 p-6">
                <div className="mb-3 text-3xl">{item.icon}</div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">What MediCheck can do for you</h2>
            <p className="mt-2 text-gray-500">Connect the services you want, skip the rest</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-gray-200 p-5 transition hover:border-teal-200 hover:shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: f.iconBg, color: f.iconColor }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500">{f.description}</p>
                <span className="mt-3 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {f.service}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 font-mono text-sm font-bold text-white">
                  {step.num}
                </div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-lg">
          <h2 className="text-3xl font-bold text-gray-900">Ready to try it?</h2>
          <p className="mt-3 text-gray-500">
            Demo patient: Alex Rivera · BlueCross PPO Gold · City Medical Group
          </p>
          <a
            href="/auth/login"
            className="mt-6 inline-block rounded-xl bg-teal-600 px-8 py-3 font-medium text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700"
          >
            Launch MediCheck →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
        <p>
          Built for the{' '}
          <a href="https://authorizedtoact.devpost.com/" className="text-teal-600 hover:underline">
            Auth0 Authorized to Act Hackathon
          </a>{' '}
          · Powered by Auth0 Token Vault + Claude AI + Next.js
        </p>
      </footer>
    </div>
  );
}
