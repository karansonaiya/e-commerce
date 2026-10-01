import { ANNOUNCEMENTS } from "@/lib/constants";

export function AnnouncementBar() {
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];
  return (
    <div className="w-full overflow-hidden bg-[var(--color-brand)] py-2.5 text-[var(--color-ink)]">
      <div className="animate-marquee flex w-max gap-16 whitespace-nowrap text-xs font-medium tracking-wide">
        {items.map((text, i) => (
          <span key={i} className="flex items-center gap-16">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
