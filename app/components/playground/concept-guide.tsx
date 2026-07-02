export interface ConceptEntry {
  term: string;
  body: string;
}

export function ConceptGuide({
  title,
  intro,
  entries,
}: {
  title: string;
  intro: string;
  entries: ConceptEntry[];
}) {
  return (
    <section className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-border bg-surface p-6">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="text-sm leading-6 text-foreground-secondary">{intro}</p>
      <dl className="flex flex-col gap-4">
        {entries.map((entry) => (
          <div key={entry.term} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
            <dt className="text-sm font-medium text-foreground">{entry.term}</dt>
            <dd className="mt-1 text-sm leading-6 text-foreground-secondary">{entry.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
