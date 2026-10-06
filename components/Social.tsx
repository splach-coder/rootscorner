import { SOCIAL } from "@/lib/site";

/**
 * The channels, as marks.
 *
 * Drawn rather than pulled from an icon set, at the same hairline weight as the
 * rules elsewhere on the page, so they sit in the type rather than on top of it.
 * Anything heavier read as a plugin dropped into the footer.
 *
 * Only channels the client actually runs appear here — lib/site.ts decides.
 */
const MARKS: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.1" cy="6.9" r="0.85" fill="currentColor" stroke="none" />
    </>
  ),
  // A speech bubble with its tail at the lower left and a handset inside — the
  // WhatsApp sign, drawn in the same hairline as the others rather than taken
  // from the brand's filled logo.
  whatsapp: (
    <>
      <path d="M4.6 19.4l1.1-3.6a8.4 8.4 0 1 1 3 2.6z" />
      <path d="M9.3 8.4c.3-.4.7-.4.9-.1l.8 1.6c.1.3 0 .5-.2.7l-.4.4c.6 1.2 1.5 2.1 2.7 2.7l.4-.4c.2-.2.5-.3.7-.2l1.6.8c.3.2.3.6-.1.9-.7.7-1.6.9-2.5.5a8 8 0 0 1-4.4-4.4c-.4-.9-.2-1.8.5-2.5z" />
    </>
  ),
  facebook: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
      <path d="M15.4 8.1h-1.3c-1 0-1.5.5-1.5 1.5V11h2.6l-.4 2.6h-2.2v6.9" />
      <path d="M10 11h2.6" />
    </>
  ),
  pinterest: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 20.4c.6-2.5 1.9-7.6 1.9-7.6a3 3 0 0 1-.3-1.3c0-1.3.7-2.2 1.7-2.2.8 0 1.2.6 1.2 1.3 0 .8-.5 2-.8 3.2-.2 1 .5 1.8 1.5 1.8 1.8 0 3-2.3 3-5 0-2.1-1.4-3.6-3.9-3.6a4.4 4.4 0 0 0-4.6 4.4c0 .8.3 1.4.7 1.9.1.2.2.3.1.5l-.2.9" />
    </>
  ),
  tiktok: <path d="M15.6 3v9.8a3.6 3.6 0 1 1-3-3.5M15.6 3c.4 2.3 1.9 3.9 4.2 4.1" />,
};

export default function Social({ className = "" }: { className?: string }) {
  if (SOCIAL.length === 0) return null;

  return (
    <ul className={`social ${className}`.trim()}>
      {SOCIAL.map((channel) => (
        <li key={channel.key}>
          <a
            href={channel.href}
            className="social-link"
            target="_blank"
            rel="noreferrer noopener"
            aria-label={channel.label}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              {MARKS[channel.key]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** One channel's mark alone — the same drawing as the footer's, for a label. */
export function ChannelMark({ channel, size = 18 }: { channel: "instagram" | "whatsapp"; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="channel-mark"
    >
      {MARKS[channel]}
    </svg>
  );
}
