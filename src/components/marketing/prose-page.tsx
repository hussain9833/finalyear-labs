import { Breadcrumbs } from "@/components/seo/breadcrumbs";

/** Layout for long-form trust/legal pages. Content is structured data, not raw HTML. */
export type ProseBlock = { heading?: string; paragraphs?: string[]; list?: string[] };

export function ProsePage({
  title,
  path,
  intro,
  updated,
  blocks,
  children,
}: {
  title: string;
  path: string;
  intro?: string;
  updated?: string;
  blocks: ProseBlock[];
  children?: React.ReactNode;
}) {
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={[{ name: title, path }]} />
      <article className="mx-auto mt-8 max-w-3xl">
        <header className="border-b border-border pb-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          {intro && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{intro}</p>}
          {updated && <p className="mt-4 text-sm text-muted-foreground">Last updated: {updated}</p>}
        </header>
        <div className="mt-8 grid gap-10">
          {blocks.map((b, i) => (
            <section key={b.heading ?? i}>
              {b.heading && <h2 className="text-xl font-semibold">{b.heading}</h2>}
              {b.paragraphs?.map((p, j) => (
                <p key={j} className="mt-3 leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
              {b.list && (
                <ul className="mt-3 grid list-disc gap-2 pl-5 leading-relaxed text-muted-foreground marker:text-primary">
                  {b.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        {children && <div className="mt-12">{children}</div>}
      </article>
    </div>
  );
}
