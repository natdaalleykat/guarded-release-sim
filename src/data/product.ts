/* =========================================================================
   Product-home data: nav, SDK setup, widgets, variations, wizard copy.
   Empty-state strings mirror the real LaunchDarkly product.
   ========================================================================= */

export const FLAG_KEY = 'release-new-checkout'
export const PROJECT = { name: 'launchdarkly-com', env: 'Production' }
export const USER = { name: 'Natalie', initial: 'N' }

export const TREATMENT = { name: 'Checkout v2', color: 'rgb(66,94,255)' }
export const CONTROL = { name: 'Checkout v1', color: 'rgb(137,142,148)' }

/* How fast the rollback reaches every SDK once the guardrail trips, and the
   blast-radius story for the results screen. */
export const ROLLBACK_MS = 11
export const BLAST = { exposed: 10, protected: 90 }

/* Live, global "what LaunchDarkly is doing right now" counters.
   Headline anchored to LaunchDarkly's public figure of 40T+ flag
   evaluations per day. base = today's running total; rate = per second. */
export interface GlobalStat {
  key: string
  label: string
  sub: string
  base: number
  rate: number
  icon: 'flag' | 'users' | 'bolt'
  color: string
}

export const GLOBAL_STATS: GlobalStat[] = [
  {
    key: 'decisions',
    label: 'Flag decisions made',
    sub: 'evaluations served to apps',
    base: 38_412_660_000_000,
    rate: 463_000_000,
    icon: 'flag',
    color: 'rgb(66,94,255)',
  },
  {
    key: 'served',
    label: 'Client-side users served',
    sub: 'people given a treatment',
    base: 2_148_900_000,
    rate: 24_880,
    icon: 'users',
    color: 'rgb(135,23,205)',
  },
  {
    key: 'changes',
    label: 'Changes delivered',
    sub: 'flag + targeting updates shipped',
    base: 4_821_500,
    rate: 55.8,
    icon: 'bolt',
    color: 'rgb(214,122,0)',
  },
]

export type IconKey =
  | 'home' | 'flag' | 'shield' | 'venn' | 'fingerprint' | 'hub' | 'playground'
  | 'beaker' | 'ruler' | 'play' | 'warning' | 'article' | 'trace'

export interface NavItem {
  label: string
  icon: IconKey
  badge?: string
  active?: boolean
}
export interface NavSection {
  label?: string
  items: NavItem[]
}

export const NAV: NavSection[] = [
  { items: [{ label: 'Home', icon: 'home', active: true }] },
  {
    label: 'Release',
    items: [
      { label: 'Flags', icon: 'flag' },
      { label: 'Guarded rollouts', icon: 'shield' },
      { label: 'Segments', icon: 'venn' },
      { label: 'Contexts', icon: 'fingerprint' },
    ],
  },
  {
    label: 'AI',
    items: [
      { label: 'Configs', icon: 'hub' },
      { label: 'Playgrounds', icon: 'playground' },
    ],
  },
  {
    label: 'Experiment',
    items: [
      { label: 'Experiments', icon: 'beaker' },
      { label: 'Metrics', icon: 'ruler' },
    ],
  },
  {
    label: 'Observability',
    items: [
      { label: 'Sessions', icon: 'play' },
      { label: 'Errors', icon: 'warning' },
      { label: 'Logs', icon: 'article' },
      { label: 'Traces', icon: 'trace' },
    ],
  },
]

export interface SetupItem {
  title: string
  desc: string
  icon: 'plug' | 'hub' | 'pulse' | 'mcp'
  color: string
  cta: string
}

export const SETUP: SetupItem[] = [
  {
    title: 'Set up the feature management SDK',
    desc: 'Install a server or client SDK to start evaluating flags in your app.',
    icon: 'plug',
    color: 'rgb(66,94,255)',
    cta: 'Set up SDK',
  },
  {
    title: 'Set up the AI Configs SDK',
    desc: 'Manage models, prompts, and agent behavior in real time, without redeploying.',
    icon: 'hub',
    color: 'rgb(135,23,205)',
    cta: 'Set up SDK',
  },
  {
    title: 'Instrument observability',
    desc: 'See errors, logs, traces, and sessions tied to each flag variation.',
    icon: 'pulse',
    color: 'rgb(0,131,68)',
    cta: 'Instrument',
  },
  {
    title: 'Connect the MCP server',
    desc: 'Operate and manage LaunchDarkly straight from your AI coding agent.',
    icon: 'mcp',
    color: 'rgb(214,122,0)',
    cta: 'Connect',
  },
]

export interface ProductWidget {
  key: 'flags' | 'experiments' | 'aiconfigs' | 'guarded'
  title: string
  icon: 'flag' | 'beaker' | 'hub' | 'shield'
  iconColor: string
  iconBg: string
  emptyTitle: string
  emptyBody: string
  cta: string
  hero?: boolean
}

export const WIDGETS: ProductWidget[] = [
  {
    key: 'flags',
    title: 'Flags',
    icon: 'flag',
    iconColor: 'rgb(66,94,255)',
    iconBg: 'rgb(239,242,255)',
    emptyTitle: "No flags yet",
    emptyBody: 'Use flags to release new features to your customers.',
    cta: 'Create flag',
  },
  {
    key: 'experiments',
    title: 'Experiments',
    icon: 'beaker',
    iconColor: 'rgb(214,122,0)',
    iconBg: 'rgb(255,244,230)',
    emptyTitle: 'No experiments yet',
    emptyBody: 'Measure and understand the impact of every feature you release.',
    cta: 'Create experiment',
  },
  {
    key: 'aiconfigs',
    title: 'AI Configs',
    icon: 'hub',
    iconColor: 'rgb(135,23,205)',
    iconBg: 'rgb(246,236,252)',
    emptyTitle: 'No AI Configs yet',
    emptyBody: 'Iterate on prompts and model settings safely. Your first one is free.',
    cta: 'Create config',
  },
  {
    key: 'guarded',
    title: 'Guarded releases',
    icon: 'shield',
    iconColor: 'rgb(66,94,255)',
    iconBg: 'rgb(239,242,255)',
    emptyTitle: 'See it before you set it up',
    emptyBody: 'Watch a release roll out, break, and roll itself back. 90 seconds, no setup required.',
    cta: 'Watch simulation',
    hero: true,
  },
]

/* ---- wizard copy -------------------------------------------------------- */

export const WIZARD = {
  steps: ['Configure', 'Run', 'Results'],
  configure: {
    title: 'Guarded release simulation',
    lede: 'You are about to ship a rewrite of your checkout behind a flag. Instead of flipping it on for everyone, a guarded release rolls it out a bit at a time while LaunchDarkly watches a metric you choose. If that metric breaks, it rolls back on its own.',
    metricQ: 'Pick the metric to protect',
    contextQ: 'Pick who gets it first',
    go: 'Start guarded rollout',
  },
}
