export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]/70">Last updated: {updated}</p>
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-[var(--color-ink-soft)] [&_h2]:font-display [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--color-ink)]">
          {children}
        </div>
      </div>
    </div>
  );
}
