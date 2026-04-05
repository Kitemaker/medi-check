/**
 * MediCheck brand assets — logo mark, wordmark, avatar, and service icons.
 * Medical cross + ECG pulse line mark on teal gradient.
 */

interface SvgProps {
  className?: string;
}

/** Full nav logo: branded SVG mark + wordmark */
export function MediCheckLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim  = size === 'sm' ? 32 : size === 'lg' ? 44 : 36;
  const text = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';

  return (
    <div className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/medicheck-mark.svg"
        width={dim}
        height={dim}
        alt="MediCheck"
        className="flex-shrink-0"
        style={{ boxShadow: '0 2px 8px rgba(0,150,137,0.35)' }}
      />
      <span className={`font-bold tracking-tight text-gray-900 ${text}`}>MediCheck</span>
    </div>
  );
}

/** Small circular avatar for chat bubbles */
export function MediCheckAvatar({ size = 24 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/medicheck-mark.svg"
      width={size}
      height={size}
      alt="MediCheck"
      className="flex-shrink-0"
      style={{ boxShadow: '0 1px 4px rgba(0,150,137,0.3)' }}
    />
  );
}

/* ─── Service SVG icons ─── */

export function IconEHR({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12h6M12 9v6" />
      <path d="M4.5 12a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Z" />
      <path d="M4.5 12H2M22 12h-2.5M12 4.5V2M12 22v-2.5" />
    </svg>
  );
}

export function IconInsurance({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6L12 2Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconCalendar({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  );
}

export function IconPharmacy({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}

export function IconEmail({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function IconFDA({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20h14.56l-5.069-10.577A2 2 0 0 1 14 8.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16h10" />
    </svg>
  );
}

/** Routes serviceId → SVG icon */
export function ServiceIcon({ serviceId, className }: { serviceId: string; className?: string }) {
  switch (serviceId) {
    case 'ehr':       return <IconEHR className={className} />;
    case 'insurance': return <IconInsurance className={className} />;
    case 'calendar':  return <IconCalendar className={className} />;
    case 'pharmacy':  return <IconPharmacy className={className} />;
    case 'email':     return <IconEmail className={className} />;
    default:          return <IconFDA className={className} />;
  }
}
