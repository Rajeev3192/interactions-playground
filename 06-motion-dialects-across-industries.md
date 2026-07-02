# Motion Dialects Across Industries

This system (Interactions v1) is built in one specific motion dialect: restrained, B2B/dashboard-grade, Linear-inspired. That's a deliberate choice, not a universal one. This doc exists so that's explicit — and as a map for anyone (including future-you) who wants to deliberately build in a different dialect later.

## The core idea: motion is a dialect, not a universal language

Every system in `02-motion-principles.md` — no overshoot, high damping, restrained duration, one accent color — encodes an assumption: *the user is busy, skilled, and using this tool frequently; motion's job is to reduce friction and orient them, not to entertain them.* That assumption is correct for dense B2B software. It is actively wrong for several other categories. Below is a breakdown of how the dialect changes by industry, and why.

## Quiet UI (what this library is) — B2B SaaS, dashboards, dev tools

**Philosophy:** motion should be felt more than seen. Get out of the way.
**Examples:** Linear, Geist/Vercel, Stripe Dashboard, Notion, most enterprise tools.
**Defining traits:** single accent color, no bounce/overshoot, high spring damping (30-40+), border-first elevation over shadows, durations mostly under 250ms, motion exists to communicate state change (this moved here, this is now loading) not to delight.
**Why:** these are tools used for hours a day by professionals. Motion that demands attention is a tax paid every single interaction, thousands of times a day. Restraint compounds into trust and speed.

## Gaming — "juice"

**Philosophy:** the opposite end of the spectrum. Motion (and sound) should give the player *far more feedback than their input technically deserves* — game designer Petri Purho's original definition of "juice," from his influential 2012 GDC talk "Juice It or Lose It."

**Defining traits:**
- Squash and stretch — borrowed directly from Disney's classic animation principles — makes objects feel like they have weight and elasticity; a character stretches on takeoff and squashes on landing, visually communicating force. This is the literal opposite of this library's "no overshoot" rule.
- Sound is treated as equally important as visual motion — clicks, zaps, and confirmation tones are layered onto nearly every interaction, including menu navigation.
- Exaggeration and over-the-top effects are intentional — subtlety has its place, but exaggeration is what elevates an ordinary action into something memorable.
- Reward escalation is deliberate: games are designed to reward skillful play with increasingly dramatic feedback as a player's mastery grows — the opposite of this library's flat, consistent feedback regardless of context.
- One sharp distinction worth internalizing: game developers intentionally juice the mundane, moment-to-moment, frequently-repeated actions rather than the rare ones — because onboarding happens once, but jumping or selecting an item happens constantly, so that's where polish has outsized impact. This is actually a principle this library agrees with in spirit (Toggle and Button, the most-used components, get real attention) — gaming just applies far more intensity to that same idea.

**Why it works there and wouldn't here:** a game has no competing-attention problem — entertainment and engagement *are* the product. A dashboard used 6 hours a day cannot afford that same intensity per click without becoming exhausting.

## Consumer / social apps (TikTok, Instagram-adjacent, BeReal-type products)

**Philosophy:** motion as brand personality and emotional texture, not just function.
**Defining traits:** more expressive, sometimes irregular easing; bigger, more saturated color use; motion tied to identity and mood rather than restraint; celebratory moments (likes, streaks, milestones) are common and intentionally larger than this library would ever allow.
**Why:** these products compete on feeling, not efficiency. A user opening the app isn't trying to get a task done fast — the emotional experience of using it *is* the value being delivered. Quiet-UI restraint would read as cold or lifeless here, the opposite of premium.

## Consumer fintech (Cash App, Robinhood-era apps)

**Philosophy:** a genuine hybrid — needs the trustworthiness/precision of quiet UI for anything representing real money, but more warmth and occasional celebration than B2B tools, especially around milestones (first trade, goal reached).
**Defining traits:** numbers and balances animate with restraint (similar to this library's Stat Card philosophy — precision matters, springs are used carefully, not bouncily) but onboarding, achievements, and rare positive moments get deliberately bigger, sometimes confetti-level celebratory treatment. Robinhood's confetti-on-first-trade is the textbook example — a single, rare exception precisely because it's rare.
**Why it's close to this library, but not identical:** this library's Input Field brief already encodes the idea that celebratory motion should be reserved for rare, meaningful moments (the validation shake is the one place in the whole system that breaks the "no exaggerated motion" rule). Consumer fintech extends that same idea — restraint as the default, with intentional, sparing exceptions — but allows itself a few more of those exceptions than B2B software would.

## B2B fintech / enterprise (Stripe Dashboard, Brex, Ramp, Mercury)

**Philosophy:** essentially this library's philosophy, almost unmodified.
**Why:** this is the category most directly shaped by Linear's aesthetic influence over the past several years — dense data, frequent professional use, trust signaled through precision rather than warmth. This is also Rajeev's target market for the freelance practice and job search, which is why building the system in this dialect first was the right call, not just a stylistic default.

## Healthcare / medical — "calm with reserved alarm"

**Philosophy:** not just restraint like quiet UI, but restraint with one strict extra rule layered on top: nothing routine is allowed to look like an emergency, so that emergencies still register as emergencies.

**Defining traits:**
- Even tighter duration budgets than B2B SaaS — motion that communicates state change or signals urgency earns its place, but anything that delays information or forces a clinician to wait through a transition fails the moment a clinical decision needs to happen.
- Guiding principles are responsiveness, orientation, and contextual awareness, with duration scaled to element size — smaller elements get shorter durations, larger elements longer ones, similar in spirit to this library's own duration scale but with less headroom at the top end.
- No bounce, no elastic easing, nothing playful — it reads as unprofessional in a context where patient data and trust are on the line.
- The defining rule, and the reason this is a genuinely separate dialect rather than just "quiet UI but calmer": red, motion, and urgency-coded visual treatment are reserved exclusively for genuine clinical emergencies, abnormal vitals, or medication interaction warnings. Using that same visual urgency for non-critical UI desensitizes clinical staff to real emergency states — widely flagged as one of the most dangerous interface failure modes in this category.
- Loading states get specific treatment too — skeleton loaders and gentle pulsing are preferred over generic spinners, since wait-time motion should feel calm rather than urgent, even while data is uncertain.

**Why it's distinct from quiet UI, not just a stricter version of it:** this library's "no overshoot, stay restrained" rule is a taste/efficiency choice. Healthcare's restraint is a safety mechanism — the entire point is to never cry wolf, so that on the rare occasion something must visually shout, it still can. That's an asymmetric design goal (maximal flatness everywhere, except a tightly reserved exception) rather than a uniformly toned-down version of B2B restraint.

## A few more, briefer notes

**Creative / pro tools** (Figma, video editors, DAWs) — close to quiet UI in restraint, but optimized for direct manipulation rather than discrete clicks: drag, resize, zoom, scrub. Motion has to feel exact and 1:1 responsive rather than just calm, since these tools are used for hours of precise hands-on work, not just navigation.

**E-commerce** — a blend of consumer fintech and consumer/social logic: restrained on data-driven elements (prices, cart counts, stock status — these should feel accurate, not playful) but allows itself deliberate delight moments on conversion actions (add-to-cart, purchase confirmation), the same "ration your exceptions" logic as fintech's milestone celebrations, just applied to commerce moments instead of financial ones.

**AI / conversational interfaces** (chat UIs, including this one) — a newer and less codified dialect. The dominant motion problem isn't confirming a discrete action, it's communicating an ongoing, uncertain process ("thinking," "generating") over an unpredictable duration — closer to healthcare's loading-state calm-pulsing approach than to a button's instant press feedback, since the system can't promise a fixed duration the way a 200ms dropdown can.

**Accessibility-first / government** — not really its own aesthetic so much as a strict constraint layer that can sit on top of any other dialect: near-zero non-essential motion, very conservative duration ceilings, and rigorous WCAG compliance treated as a hard floor rather than a nice-to-have. Worth noting this library already builds toward this layer by default (prefers-reduced-motion fallbacks specified on every component) rather than treating it as a separate mode to bolt on later.

## A useful general framework: frequency vs. stakes

A rough way to predict which dialect fits a given interaction, regardless of industry:

- **High frequency + routine** (every click, every hover) → restraint always wins, regardless of industry. Even games juice routine actions carefully rather than maximally — see the Mario 64 moment-to-moment vs. boss-battle distinction above. Constant over-the-top motion on routine actions becomes fatigue, not delight, in any context.
- **Low frequency + high stakes/emotional weight** (level complete, trade executed, milestone hit, error that needs real attention) → this is where exaggeration earns its place, even in otherwise-restrained systems. This library's validation shake is this library's one instance of that rule.
- The skill isn't "be playful" or "be restrained" as a fixed identity — it's correctly classifying which bucket each specific interaction falls into, for the specific product and audience in front of you.

## Practical exercise (optional, for craft-building specifically)

A useful follow-up exercise: take 2-3 components already built in this library (Button, Toast, and Stat Card are good candidates — one simple, one mid-complexity, one number-driven) and rebuild them in the "gaming/consumer" dialect described above — lower spring damping (allow visible overshoot), bigger duration scale, squash-and-stretch on press states, celebratory exceptions used more liberally. Feeling the same component under two opposing philosophies, side by side, teaches the underlying principle ("why does this choice exist") far more concretely than reading about it does — and gives a second portfolio narrative: not just "I can execute restraint," but "I understand restraint because I've also deliberately built its opposite, and I know when to reach for each."

## Sources referenced
- Petri Purho, "Juice It or Lose It," GDC 2012 — origin of the "juice" concept in game design
- Disney's 12 Principles of Animation (squash and stretch, anticipation, follow-through) — the animation theory underlying both gaming "juice" and, in more restrained form, this library's own spring-physics reasoning
- Rauno Freiberg, Linear, Emil Kowalski — already the primary references for this library's quiet-UI dialect, included here for contrast
