import Link from "next/link";
import { cn } from "@/lib/cn";
import { navItems } from "./nav-items";

export function PlaygroundShell({
  current,
  children,
}: {
  current: string | "home";
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl gap-8 px-8 py-10">
      <aside className="sticky top-10 hidden h-fit w-48 shrink-0 flex-col gap-1 md:flex">
        <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
          Playground: Micro-interactions
        </div>
        <Link
          href="/"
          className={cn(
            "focus-ring mb-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm transition-colors",
            current === "home"
              ? "bg-surface-active font-medium text-foreground"
              : "text-foreground-secondary hover:bg-surface-hover hover:text-foreground"
          )}
        >
          Home
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.slug}
            href={item.built ? `/playground/${item.slug}` : "#"}
            aria-disabled={!item.built}
            className={cn(
              "focus-ring rounded-[var(--radius-sm)] px-2 py-1.5 text-sm transition-colors",
              item.slug === current
                ? "bg-surface-active font-medium text-foreground"
                : item.built
                  ? "text-foreground-secondary hover:bg-surface-hover hover:text-foreground"
                  : "pointer-events-none text-foreground-muted"
            )}
          >
            {item.name}
          </Link>
        ))}
      </aside>
      <main className="flex min-w-0 flex-1 flex-col gap-8">{children}</main>
    </div>
  );
}

export function DemoSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex min-h-[280px] items-center justify-center rounded-[var(--radius-md)] border border-border bg-background-secondary p-10">
      {children}
    </section>
  );
}

// Fixed width (not content-shrunk) so the knobs panel + spring preview are
// the same width on every playground page regardless of how wide their
// own contents happen to be.
export function KnobsColumn({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full flex-col gap-4 md:order-2 md:w-80 md:shrink-0">{children}</div>;
}
