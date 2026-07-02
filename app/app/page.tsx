import { PlaygroundShell } from "@/components/playground/playground-shell";

const otherDialects = [
  {
    name: "Healthcare / medical",
    line: "\"Calm with reserved alarm\" — even stricter restraint than B2B, with urgency color/motion locked exclusively to genuine emergencies so it never cries wolf.",
  },
  {
    name: "B2B fintech / enterprise",
    line: "Essentially this library's dialect, almost unmodified — dense data, frequent professional use, trust signaled through precision.",
  },
  {
    name: "AI / conversational",
    line: "Less about confirming a discrete action, more about communicating an uncertain ongoing process over an unpredictable duration.",
  },
  {
    name: "Consumer fintech",
    line: "Quiet-UI precision for anything touching money, but with rationed celebratory exceptions (confetti on first trade) at rare, meaningful moments.",
  },
  {
    name: "Gaming — \"juice\"",
    line: "Motion gives far more feedback than the input deserves — squash/stretch, sound on everything, overshoot is the point, not a bug.",
  },
  {
    name: "Consumer / social",
    line: "Motion as brand personality and emotional texture. Bigger, more expressive, celebratory by default — restraint would read as cold here.",
  },
  {
    name: "Creative / pro tools",
    line: "Close to quiet UI, but optimized for direct manipulation — drag, resize, scrub need to feel exact and 1:1, not just calm.",
  },
  {
    name: "E-commerce",
    line: "Restrained on data (prices, stock) but allows deliberate delight on conversion moments — add-to-cart, purchase confirmation.",
  },
  {
    name: "Accessibility-first / government",
    line: "Not its own look so much as a strict constraint layer — near-zero non-essential motion, conservative ceilings, WCAG as a hard floor.",
  },
];

export default function Home() {
  return (
    <PlaygroundShell current="home">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-16 py-6">
      <section className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold text-foreground">Playground: Micro-interactions</h1>
        <p className="max-w-lg text-sm leading-6 text-foreground-secondary">
          A component library focused entirely on micro-interactions — 15 components, each built
          and tuned by hand to teach one distinct interaction principle.
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-border bg-surface p-8">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
          This library's dialect
        </span>
        <h2 className="text-xl font-semibold text-foreground">Quiet UI</h2>
        <p className="text-sm leading-6 text-foreground-secondary">
          Every component here is built in one specific motion dialect — restrained,
          B2B/dashboard-grade, Linear-inspired. The underlying assumption: the user is busy,
          skilled, and using this software for hours a day, so motion's job is to reduce friction
          and orient them, not entertain them.
        </p>
        <ul className="grid gap-2 text-sm leading-6 text-foreground-secondary sm:grid-cols-2">
          <li>• Single accent color, used sparingly</li>
          <li>• No bounce/overshoot on routine actions</li>
          <li>• High spring damping (30–40+)</li>
          <li>• Border-first elevation over shadows</li>
          <li>• Durations mostly under 250ms</li>
          <li>• Motion communicates state change, not delight</li>
        </ul>
      </section>

      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Other dialects exist</h2>
          <p className="mt-1 text-sm leading-6 text-foreground-secondary">
            Quiet UI is correct for dense B2B software — and actively wrong for several other
            categories. A quick map of how the same motion principles flex by industry:
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {otherDialects.map((d) => (
            <div
              key={d.name}
              className="flex flex-col gap-1.5 rounded-[var(--radius-sm)] border border-border bg-surface p-4"
            >
              <span className="text-sm font-medium text-foreground">{d.name}</span>
              <span className="text-xs leading-5 text-foreground-secondary">{d.line}</span>
            </div>
          ))}
        </div>
      </section>
      </div>
    </PlaygroundShell>
  );
}
