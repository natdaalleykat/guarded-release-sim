/* =========================================================================
   Content + data model for the Guarded Release Simulator
   All copy lives here so the narrative is easy to tune.
   ========================================================================= */

export type MetricKey = 'error_rate' | 'latency' | 'conversion' | 'crash_free'
export type ContextKey = 'user' | 'account' | 'device' | 'organization'
export type PaceKey = 'cautious' | 'balanced' | 'fast'

export interface MetricOption {
  key: MetricKey
  label: string
  short: string
  unit: string
  blurb: string
  /** which direction is good */
  betterDirection: 'lower' | 'higher'
  baseline: number
  threshold: number
  regressed: number
  noise: number
  decimals: number
  yMin: number
  yMax: number
  /** plain-language phrasing of what the threshold means */
  guardrailPhrase: string
}

export const METRICS: MetricOption[] = [
  {
    key: 'error_rate',
    label: 'Checkout error rate',
    short: 'error rate',
    unit: '%',
    blurb: 'The share of checkouts that fail. When this climbs, people cannot give you money.',
    betterDirection: 'lower',
    baseline: 0.21,
    threshold: 1.0,
    regressed: 3.7,
    noise: 0.05,
    decimals: 2,
    yMin: 0,
    yMax: 4.4,
    guardrailPhrase: 'stays under 1.00%',
  },
  {
    key: 'latency',
    label: 'Checkout latency (p95)',
    short: 'p95 latency',
    unit: 'ms',
    blurb: 'How long the slowest 5% of checkouts take. Slow checkouts get abandoned.',
    betterDirection: 'lower',
    baseline: 184,
    threshold: 400,
    regressed: 920,
    noise: 11,
    decimals: 0,
    yMin: 0,
    yMax: 1020,
    guardrailPhrase: 'stays under 400 ms',
  },
  {
    key: 'conversion',
    label: 'Checkout conversion',
    short: 'conversion rate',
    unit: '%',
    blurb: 'The share of shoppers who finish buying. This is the number the business actually cares about.',
    betterDirection: 'higher',
    baseline: 3.42,
    threshold: 2.9,
    regressed: 1.95,
    noise: 0.07,
    decimals: 2,
    yMin: 1.4,
    yMax: 4.0,
    guardrailPhrase: 'stays above 2.90%',
  },
  {
    key: 'crash_free',
    label: 'Crash-free sessions',
    short: 'crash-free rate',
    unit: '%',
    blurb: 'The share of sessions with no crash. A rewrite that crashes is worse than the old slow page.',
    betterDirection: 'higher',
    baseline: 99.86,
    threshold: 99.5,
    regressed: 97.1,
    noise: 0.03,
    decimals: 2,
    yMin: 96.5,
    yMax: 100,
    guardrailPhrase: 'stays above 99.50%',
  },
]

export interface ContextOption {
  key: ContextKey
  label: string
  singular: string
  plural: string
  blurb: string
  population: number
}

export const CONTEXTS: ContextOption[] = [
  {
    key: 'user',
    label: 'Users',
    singular: 'user',
    plural: 'users',
    blurb: 'Each individual person using your app. The most common place to start.',
    population: 2_000_000,
  },
  {
    key: 'account',
    label: 'Accounts',
    singular: 'account',
    plural: 'accounts',
    blurb: 'Companies or teams. Everyone in an account stays on one version together.',
    population: 18_500,
  },
  {
    key: 'device',
    label: 'Devices',
    singular: 'device',
    plural: 'devices',
    blurb: 'Phones, browsers, set-top boxes. Good for client-side rollouts.',
    population: 845_000,
  },
  {
    key: 'organization',
    label: 'Organizations',
    singular: 'organization',
    plural: 'organizations',
    blurb: 'Tenants in a multi-tenant platform. Keeps each tenant consistent.',
    population: 6_400,
  },
]

export interface PaceOption {
  key: PaceKey
  label: string
  perStep: string
  blurb: string
}

export const PACES: PaceOption[] = [
  {
    key: 'cautious',
    label: 'Cautious',
    perStep: '1% → 5% → 10%',
    blurb: 'Small steps. The most traffic protected while you watch.',
  },
  {
    key: 'balanced',
    label: 'Balanced',
    perStep: '5% → 25% → 50%',
    blurb: 'A middle path. The usual choice.',
  },
  {
    key: 'fast',
    label: 'Fast',
    perStep: '25% → 50% → 100%',
    blurb: 'Big jumps. For low-risk changes you want out quickly.',
  },
]

/** Rollout ladder, in percent. The regression strikes at the 50% step. */
export const STAGES = [1, 5, 10, 25, 50, 100]

export const DEFAULTS = {
  metric: 'error_rate' as MetricKey,
  context: 'user' as ContextKey,
  pace: 'balanced' as PaceKey,
}

/* ---- Cold open --------------------------------------------------------- */

export const COLD_OPEN_LINES = [
  'You ship features with a config file and a deploy.',
  'When something breaks, your users find out first.',
  "Tonight you are shipping the scary one. The checkout rewrite.",
  'This time, something has your back.',
]

/* ---- Briefing ---------------------------------------------------------- */

export const BRIEFING = {
  eyebrow: 'The situation',
  title: 'The checkout rewrite is ready to ship',
  body: [
    'It is faster than the old one and it won every test you ran. It is also a full rewrite of the single most important page you own. If it breaks, you lose orders, and you lose them quietly.',
    'The old move is to flip it on for everyone, then sit and watch the dashboards for three hours hoping nothing turns red.',
    'Tonight you are doing a guarded release instead.',
  ],
  defCard: {
    title: 'What is a guarded release?',
    body: 'It rolls your change out a little at a time and keeps watch on one metric you care about. If that metric goes bad, LaunchDarkly rolls the change back on its own, usually before a human would even notice.',
    foot: 'You pick the metric. You pick who sees it first. Then you hit go and watch.',
  },
  cta: 'Set up the release',
}

/* ---- Configure --------------------------------------------------------- */

export const CONFIGURE = {
  eyebrow: 'Set up the guarded release',
  metricQ: 'What should we protect?',
  metricHelp: 'This is your primary metric. It is the number LaunchDarkly watches the whole time your change is rolling out.',
  contextQ: 'Who gets it first?',
  contextHelpA: 'In LaunchDarkly these are called context kinds. They are the things you deliver flags to.',
  contextHelpB: (plural: string) => `We will roll out one ${plural.replace(/s$/, '')} at a time and keep each ${plural.replace(/s$/, '')} on a single version so the comparison stays clean.`,
  paceQ: 'How fast should it ramp?',
  paceHelp: 'LaunchDarkly watches your metric at each step before it opens the gate to the next one.',
  rollbackLabel: 'Automatically roll back if a regression is detected',
  rollbackNote: 'On by default. This is the whole point, so we are leaving it on.',
  go: 'Start guarded release',
}

/* ---- Debrief ----------------------------------------------------------- */

export const DEBRIEF = {
  eyebrow: 'What just happened',
  title: 'That is a guarded release',
  withoutTitle: 'Config file and a prayer',
  without: [
    'You flip it on for everyone at once.',
    'The bug hits 100% of traffic.',
    'You hear about it from support tickets and angry posts.',
    'Someone gets paged. You scramble to revert by hand.',
  ],
  withTitle: 'Guarded release',
  with: [
    'LaunchDarkly ramps it up a step at a time.',
    'It watches your metric on every context, around the clock.',
    'The second the metric breaks its guardrail, it rolls back on its own.',
    'No page. No incident. You were getting coffee.',
  ],
  kicker:
    'You still move fast. The blast radius just gets small enough that shipping stops being scary.',
}

/* ---- Checklist --------------------------------------------------------- */

export interface ChecklistStep {
  title: string
  body: string
  code?: { lang: string; lines: string[] }
  link?: { label: string; href: string }
}

export const CHECKLIST: { title: string; subtitle: string; steps: ChecklistStep[]; docsHref: string; appHref: string } = {
  title: 'Set up your first guarded release',
  subtitle: 'Here is how to do this for real in your own app. About fifteen minutes, start to finish.',
  docsHref: 'https://launchdarkly.com/docs/home/releases/guarded-rollouts',
  appHref: 'https://app.launchdarkly.com',
  steps: [
    {
      title: 'Install the SDK and connect your app',
      body: 'Drop the LaunchDarkly SDK into the service that owns your change. This is what replaces the config file you read flags from today.',
      code: {
        lang: 'bash',
        lines: ['npm install @launchdarkly/node-server-sdk'],
      },
      link: { label: 'SDK quickstart', href: 'https://launchdarkly.com/docs/sdk' },
    },
    {
      title: 'Wrap the change in a flag',
      body: 'Put your new checkout behind a boolean flag. Same idea as your config switch, except now you can change it without a deploy.',
      code: {
        lang: 'js',
        lines: [
          "const useNewCheckout = await client.variation(",
          "  'release-new-checkout', context, false,",
          ')',
          '',
          'return useNewCheckout ? newCheckout() : oldCheckout()',
        ],
      },
      link: { label: 'Creating flags', href: 'https://launchdarkly.com/docs/home/flags/new' },
    },
    {
      title: 'Give it a metric to watch',
      body: 'A guarded release watches one metric. Click and page-view metrics need no code, and error or latency metrics can come from the Observability SDK. For a checkout error rate, the most direct path is a custom event you send with track():',
      code: {
        lang: 'js',
        lines: [
          '// when a checkout fails',
          "client.track('checkout-error', context)",
        ],
      },
      link: { label: 'Creating metrics', href: 'https://launchdarkly.com/docs/home/metrics/create-metrics' },
    },
    {
      title: 'Turn on the guarded rollout',
      body: 'Open your flag, go to the Targeting tab, and from the Serve menu pick Guarded rollout. Choose your metric, leave Automatic rollback checked, and ship. LaunchDarkly takes it from there.',
      link: { label: 'Creating guarded rollouts', href: 'https://launchdarkly.com/docs/home/releases/creating-guarded-rollouts' },
    },
  ],
}

/* ---- formatting helpers ------------------------------------------------ */

export function fmtPop(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + 'M'
  if (n >= 1_000) return Math.round(n / 1000) + 'K'
  return String(n)
}

export function fmtMetric(m: MetricOption, v: number): string {
  if (m.unit === 'ms') return `${Math.round(v)} ms`
  return `${v.toFixed(m.decimals)}%`
}

export function getMetric(key: MetricKey): MetricOption {
  return METRICS.find((m) => m.key === key)!
}
export function getContext(key: ContextKey): ContextOption {
  return CONTEXTS.find((c) => c.key === key)!
}
export function getPace(key: PaceKey): PaceOption {
  return PACES.find((p) => p.key === key)!
}
