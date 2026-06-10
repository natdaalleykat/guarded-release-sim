/* =========================================================================
   Data for the three home-page directions explored in the jam:
   A) Lead with value   B) Guided roadmap   C) Adaptive by intent
   ========================================================================= */

export type Glyph =
  | 'shield' | 'beaker' | 'hub' | 'pulse' | 'venn' | 'fingerprint' | 'ruler' | 'plug' | 'flag' | 'mcp'
  | 'play' | 'playground' | 'sparkle' | 'users' | 'article'

export interface Capability {
  label: string
  blurb: string
  icon: Glyph
  color: string
}

/* The "we are not basic flags" strip */
export const CAPABILITIES: Capability[] = [
  { label: 'Guarded releases', blurb: 'Auto-rollback on regressions', icon: 'shield', color: 'rgb(66,94,255)' },
  { label: 'Experimentation', blurb: 'Measure every change', icon: 'beaker', color: 'rgb(214,122,0)' },
  { label: 'AI Configs', blurb: 'Ship models and prompts safely', icon: 'hub', color: 'rgb(135,23,205)' },
  { label: 'Observability', blurb: 'Errors, logs, traces, sessions', icon: 'pulse', color: 'rgb(0,131,68)' },
  { label: 'Targeting & segments', blurb: 'The right users, at the right time', icon: 'venn', color: 'rgb(8,150,180)' },
]

/* Direction B — the roadmap that teaches the mental model */
export interface RoadmapStep {
  key: string
  title: string
  blurb: string
  cta: string
  icon: Glyph
  value?: boolean
}

export const ROADMAP: RoadmapStep[] = [
  {
    key: 'sim',
    title: 'See a guarded release in action',
    blurb: 'Watch a rollout catch a bad deploy and heal itself. 90 seconds, no setup.',
    cta: 'Watch simulation',
    icon: 'shield',
    value: true,
  },
  {
    key: 'contexts',
    title: 'Decide who you target',
    blurb: 'Set up context kinds: users, accounts, organizations, devices. This is who you serve flags to.',
    cta: 'Add a context kind',
    icon: 'fingerprint',
  },
  {
    key: 'segments',
    title: 'Group them into segments',
    blurb: 'Build segments like risk tiers, plans, or beta cohorts so you can roll out to the right group.',
    cta: 'Create a segment',
    icon: 'venn',
  },
  {
    key: 'metrics',
    title: 'Choose what to measure',
    blurb: 'Define the metrics your guarded releases and experiments will watch.',
    cta: 'Add a metric',
    icon: 'ruler',
  },
  {
    key: 'connect',
    title: 'Connect your app',
    blurb: 'Drop in an SDK or your MCP server. It replaces the config file you read flags from today.',
    cta: 'Set up an SDK',
    icon: 'plug',
  },
  {
    key: 'ship',
    title: 'Ship your first guarded release',
    blurb: 'Put it together on a real flag and let LaunchDarkly watch your back.',
    cta: 'Create a flag',
    icon: 'flag',
  },
]

/* Direction C — intents the home adapts to */
export interface Intent {
  key: string
  label: string
  blurb: string
  icon: Glyph
  color: string
}

export const INTENTS: Intent[] = [
  { key: 'release', label: 'Release safely', blurb: 'Progressive and guarded rollouts', icon: 'shield', color: 'rgb(66,94,255)' },
  { key: 'experiment', label: 'Run experiments', blurb: 'Measure feature impact', icon: 'beaker', color: 'rgb(214,122,0)' },
  { key: 'ai', label: 'Manage AI', blurb: 'Models, prompts, agents', icon: 'hub', color: 'rgb(135,23,205)' },
  { key: 'observe', label: 'Observe', blurb: 'Errors, logs, traces, sessions', icon: 'pulse', color: 'rgb(0,131,68)' },
  { key: 'target', label: 'Target & segment', blurb: 'Users, accounts, cohorts', icon: 'venn', color: 'rgb(8,150,180)' },
]

/* Sample flags for the explore / sandbox surfaces */
export interface SampleFlag {
  name: string
  desc: string
  on: boolean
  tag?: string
  tagTone?: 'blue' | 'green' | 'purple' | 'orange'
}

export const SAMPLE_FLAGS: SampleFlag[] = [
  { name: 'release-new-checkout', desc: 'Boolean · 10% guarded rollout', on: true, tag: 'Guarded', tagTone: 'blue' },
  { name: 'enable-dark-mode', desc: 'Boolean · targeted to Beta segment', on: true, tag: 'Targeted', tagTone: 'purple' },
  { name: 'search-ranking-v2', desc: 'Experiment · measuring conversion', on: true, tag: 'Experiment', tagTone: 'orange' },
  { name: 'checkout-copy-test', desc: 'Multivariate · 3 variations', on: false },
  { name: 'ai-support-agent', desc: 'AI Config · model + prompt', on: true, tag: 'AI Config', tagTone: 'green' },
]

/* Segment examples used in the roadmap detail */
export const SEGMENT_EXAMPLES = ['Beta cohort', 'Enterprise plan', 'EU users', 'Risk tier 1', 'Internal team']
export const CONTEXT_KIND_EXAMPLES = ['user', 'account', 'organization', 'device']

/* =========================================================================
   v2 directions (D single pane, E split pane): product picker + per-product
   roadmaps. Each step carries education content for the split-pane view.
   ========================================================================= */

export type ProductKey = 'guarded' | 'flags' | 'experiments' | 'observability' | 'aiconfigs'

export interface ProductDef {
  key: ProductKey
  label: string
  blurb: string
  icon: Glyph
  color: string
}

export const PRODUCTS: ProductDef[] = [
  { key: 'guarded', label: 'Guarded releases', blurb: 'Ship safely, auto-rollback', icon: 'shield', color: 'rgb(66,94,255)' },
  { key: 'flags', label: 'Feature flags', blurb: 'Control what ships, to whom', icon: 'flag', color: 'rgb(8,150,180)' },
  { key: 'experiments', label: 'Experimentation', blurb: 'Measure what works', icon: 'beaker', color: 'rgb(214,122,0)' },
  { key: 'observability', label: 'Observability', blurb: 'Errors, logs, traces, sessions', icon: 'pulse', color: 'rgb(0,131,68)' },
  { key: 'aiconfigs', label: 'AI Configs', blurb: 'Models and prompts, live', icon: 'hub', color: 'rgb(135,23,205)' },
]

/* The "regardless of where you start" rail */
export interface OnHandItem {
  label: string
  blurb: string
  icon: Glyph
}

export const ON_HAND: OnHandItem[] = [
  { label: 'Install the MCP server', blurb: 'Operate LaunchDarkly straight from your coding agent.', icon: 'mcp' },
  { label: 'Browse the agent skills', blurb: 'Like the flag cleanup skill. Your agent does the chores.', icon: 'sparkle' },
  { label: 'Explore the sandbox', blurb: 'Sample flags and rollouts to poke at. Zero risk.', icon: 'playground' },
  { label: 'Hook up the sample app', blurb: 'A ready-made app for trying real SDK calls.', icon: 'plug' },
  { label: 'See pricing & packaging', blurb: 'Plans, limits, and what upgrading unlocks.', icon: 'article' },
  { label: 'Talk to sales', blurb: 'Pricing or packaging questions, answered by humans.', icon: 'users' },
]

export interface RoadmapStepV2 {
  key: string
  title: string
  blurb: string
  cta: string
  icon: Glyph
  sim?: boolean
  learn: { what: string; ideas: string[] }
}

export const ROADMAPS: Record<ProductKey, RoadmapStepV2[]> = {
  /* Mirrors the "set up your first guarded release" checklist that used to
     close the simulation — the roadmap IS the post-sim setup path. */
  guarded: [
    {
      key: 'sdk',
      title: 'Install the SDK and connect your app',
      blurb: 'Replaces the config file you read flags from today.',
      cta: 'Set up an SDK',
      icon: 'plug',
      learn: {
        what: 'Drop the LaunchDarkly SDK into the service that owns your change. Wherever you read a config value today, you ask LaunchDarkly instead. There are 25+ SDKs, or let your coding agent wire it up through the MCP server.',
        ideas: ['Node', 'Python', 'Go', 'iOS', 'MCP server'],
      },
    },
    {
      key: 'flag',
      title: 'Wrap the change in a flag',
      blurb: 'Same as your config switch, no deploy needed.',
      cta: 'Create a flag',
      icon: 'flag',
      learn: {
        what: 'Put the risky change behind a boolean flag. Same idea as your config switch, except now you can change it in production without a deploy.',
        ideas: ['release-new-checkout', 'Kill switch', 'Boolean first'],
      },
    },
    {
      key: 'metric',
      title: 'Give it a metric to watch',
      blurb: 'The number that hurts when it breaks.',
      cta: 'Create a metric',
      icon: 'ruler',
      learn: {
        what: 'A guarded release watches one metric. Click and page-view metrics need no code, error and latency metrics can come from the Observability SDK, and anything else is a single track() call.',
        ideas: ['Checkout error rate', 'p95 latency', 'Conversion rate', 'Crash-free sessions'],
      },
    },
    {
      key: 'rollout',
      title: 'Turn on the guarded rollout',
      blurb: 'Targeting tab → Serve → Guarded rollout.',
      cta: 'Start guarded rollout',
      icon: 'shield',
      learn: {
        what: 'Open your flag, go to the Targeting tab, and from the Serve menu pick Guarded rollout. Choose your metric, leave automatic rollback checked, and ship. LaunchDarkly takes it from there.',
        ideas: ['Start at 1%', '24-hour window', 'Auto-rollback stays on'],
      },
    },
  ],
  flags: [
    {
      key: 'create',
      title: 'Create your first flag',
      blurb: 'A remote if-statement for production.',
      cta: 'Create flag',
      icon: 'flag',
      learn: {
        what: 'A flag changes behavior in production without a deploy. Start with a kill switch on something risky. The first one takes about two minutes.',
        ideas: ['Kill switch', 'New feature gate', 'Pricing config'],
      },
    },
    {
      key: 'sdk',
      title: 'Connect an SDK',
      blurb: 'Evaluations are local and instant.',
      cta: 'Install an SDK',
      icon: 'plug',
      learn: {
        what: 'Install the SDK where the flagged code runs. Flag evaluations happen locally in microseconds, with no network call per check.',
        ideas: ['Node', 'Python', 'Go', 'React', 'Mobile'],
      },
    },
    {
      key: 'contexts',
      title: 'Model who you target',
      blurb: 'Users, accounts, organizations, devices.',
      cta: 'Set up context kinds',
      icon: 'fingerprint',
      learn: {
        what: 'Flags are evaluated for a context. Define the kinds that match how your business works so targeting reads the way your team talks.',
        ideas: ['user', 'account', 'organization', 'device'],
      },
    },
    {
      key: 'segments',
      title: 'Build reusable segments',
      blurb: 'Cohorts you target again and again.',
      cta: 'Create a segment',
      icon: 'venn',
      learn: {
        what: 'Segments are saved audiences: your beta cohort, the enterprise plan, EU users. Build them once and reuse them on every flag.',
        ideas: ['Beta cohort', 'Enterprise plan', 'EU users', 'Risk tier 1', 'Internal team'],
      },
    },
    {
      key: 'rollout',
      title: 'Graduate to safer rollouts',
      blurb: 'Percentages first, then guarded.',
      cta: 'Try a percentage rollout',
      icon: 'shield',
      learn: {
        what: 'Once a flag works, stop flipping it for everyone at once. Percentage rollouts split traffic, and guarded rollouts watch a metric and roll back for you.',
        ideas: ['10% canary', '50/50 split', 'Guarded rollout'],
      },
    },
  ],
  experiments: [
    {
      key: 'metric',
      title: 'Define success',
      blurb: 'The metric your team argues about.',
      cta: 'Create a metric',
      icon: 'ruler',
      learn: {
        what: 'An experiment is only as good as its metric. Pick the number decision-makers actually watch: conversion, activation, latency.',
        ideas: ['Conversion', 'Activation rate', 'Revenue per visitor', 'p95 latency'],
      },
    },
    {
      key: 'experiment',
      title: 'Create an experiment',
      blurb: 'Attach it to any flag.',
      cta: 'Create experiment',
      icon: 'beaker',
      learn: {
        what: 'Any flag can become an experiment. Variations become treatments, and LaunchDarkly handles assignment and the statistics.',
        ideas: ['A/B the checkout', 'Copy test', 'Algorithm shootout'],
      },
    },
    {
      key: 'audience',
      title: 'Pick your randomization unit',
      blurb: 'User? Account? Session?',
      cta: 'Choose a unit',
      icon: 'fingerprint',
      learn: {
        what: 'Randomize by the unit that matches the decision: users for UX changes, accounts for B2B pricing so one customer never sees two prices.',
        ideas: ['user', 'account', 'session'],
      },
    },
    {
      key: 'events',
      title: 'Send events',
      blurb: 'One track() call per outcome.',
      cta: 'Instrument events',
      icon: 'plug',
      learn: {
        what: 'Conversion metrics need an event from your app: a single track() call when the outcome happens. Click and page-view metrics need none.',
        ideas: ["track('purchase')", 'Click metric', 'Page-view metric'],
      },
    },
    {
      key: 'launch',
      title: 'Launch and decide',
      blurb: 'Readouts you can defend.',
      cta: 'Start iteration',
      icon: 'flag',
      learn: {
        what: 'Start the iteration, let it reach sample size, and get a readout you can defend in a planning meeting.',
        ideas: ['Sample size guidance', 'Probability to beat control', 'Ship the winner'],
      },
    },
  ],
  observability: [
    {
      key: 'instrument',
      title: 'Instrument your app',
      blurb: 'One snippet for errors, logs, traces.',
      cta: 'Instrument observability',
      icon: 'plug',
      learn: {
        what: 'Drop in the observability SDK and you get sessions, errors, logs, and traces without wiring five tools together.',
        ideas: ['Web sessions', 'Server traces', 'Error tracking'],
      },
    },
    {
      key: 'sessions',
      title: 'Replay what users saw',
      blurb: 'Sessions with console and network.',
      cta: 'Open sessions',
      icon: 'play',
      learn: {
        what: 'Watch real sessions with the console and network alongside, and stop guessing what "it’s broken" means.',
        ideas: ['Session replay', 'Error groups', 'Live logs'],
      },
    },
    {
      key: 'flagslink',
      title: 'Tie telemetry to flags',
      blurb: 'Every error knows its variation.',
      cta: 'View flag context',
      icon: 'flag',
      learn: {
        what: 'Telemetry is tagged with the flag variations active at the time, so you can answer "did our release cause this?" in one click.',
        ideas: ['Errors by variation', 'Latency by variation'],
      },
    },
    {
      key: 'guard',
      title: 'Feed metrics into Guardian',
      blurb: 'Observability powers auto-rollback.',
      cta: 'Create a guarded metric',
      icon: 'shield',
      learn: {
        what: 'Error and latency metrics from observability can guard your releases directly, with no extra instrumentation.',
        ideas: ['Error-rate guardrail', 'p95 guardrail'],
      },
    },
  ],
  aiconfigs: [
    {
      key: 'config',
      title: 'Create an AI Config',
      blurb: 'Models + prompts, runtime-managed.',
      cta: 'Create AI Config',
      icon: 'hub',
      learn: {
        what: 'An AI Config holds your model choice, parameters, and prompt as variations you can change at runtime. No redeploy when a new model ships.',
        ideas: ['GPT vs Claude', 'Prompt v2', 'Temperature tweak'],
      },
    },
    {
      key: 'playground',
      title: 'Test in the playground',
      blurb: 'Compare variations side by side.',
      cta: 'Open playground',
      icon: 'playground',
      learn: {
        what: 'Run variations against real prompts side by side before anything ships. Your first playground is free.',
        ideas: ['Side-by-side outputs', 'Cost preview', 'Latency compare'],
      },
    },
    {
      key: 'sdk',
      title: 'Connect the AI SDK',
      blurb: 'Serve configs to your app.',
      cta: 'Install the AI SDK',
      icon: 'plug',
      learn: {
        what: 'The AI SDK fetches the right variation per context and records token usage, latency, and satisfaction automatically.',
        ideas: ['Node', 'Python', 'LangChain'],
      },
    },
    {
      key: 'target',
      title: 'Vary by audience',
      blurb: 'Different models for different tiers.',
      cta: 'Add targeting',
      icon: 'venn',
      learn: {
        what: 'Serve the expensive model to enterprise accounts and the fast one to the free tier. Same code path, different config.',
        ideas: ['Enterprise → frontier model', 'Free tier → fast model', 'Internal → beta prompt'],
      },
    },
    {
      key: 'measure',
      title: 'Measure and iterate',
      blurb: 'Quality and cost per variation.',
      cta: 'View metrics',
      icon: 'ruler',
      learn: {
        what: 'Track cost, latency, and feedback per variation, then run an experiment when two prompts disagree.',
        ideas: ['Cost per conversation', 'Thumbs-up rate', 'A/B prompts'],
      },
    },
  ],
}
