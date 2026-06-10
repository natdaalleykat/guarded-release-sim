/* =========================================================================
   Data for the three home-page directions explored in the jam:
   A) Lead with value   B) Guided roadmap   C) Adaptive by intent
   ========================================================================= */

export type Glyph =
  | 'shield' | 'beaker' | 'hub' | 'pulse' | 'venn' | 'fingerprint' | 'ruler' | 'plug' | 'flag' | 'mcp'

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
