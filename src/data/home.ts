/* =========================================================================
   Data for the home-page directions. Roadmaps are grounded in the real
   product (gonfalon) + launchdarkly.com/docs — each step verified against
   the actual shortest required setup path.
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

/* The "we are not basic flags" strip (legacy direction A) */
export const CAPABILITIES: Capability[] = [
  { label: 'Guarded releases', blurb: 'Auto-rollback on regressions', icon: 'shield', color: 'rgb(66,94,255)' },
  { label: 'Experimentation', blurb: 'Measure every change', icon: 'beaker', color: 'rgb(214,122,0)' },
  { label: 'AI Configs', blurb: 'Ship models and prompts safely', icon: 'hub', color: 'rgb(135,23,205)' },
  { label: 'Observability', blurb: 'Errors, logs, traces, sessions', icon: 'pulse', color: 'rgb(0,131,68)' },
  { label: 'Targeting & segments', blurb: 'The right users, at the right time', icon: 'venn', color: 'rgb(8,150,180)' },
]

/* Legacy direction B roadmap */
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
    blurb: 'Watch a rollout catch a bad deploy and heal itself. 30 seconds, no setup.',
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

/* Legacy direction C intents */
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

export const SEGMENT_EXAMPLES = ['Beta cohort', 'Enterprise plan', 'EU users', 'Risk tier 1', 'Internal team']
export const CONTEXT_KIND_EXAMPLES = ['user', 'account', 'organization', 'device']

/* =========================================================================
   v2 directions (D single pane, E split pane)
   ========================================================================= */

export type ProductKey = 'guarded' | 'flags' | 'experiments' | 'aiconfigs' | 'observability'

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
  { key: 'aiconfigs', label: 'AI Configs', blurb: 'Models and prompts, live', icon: 'hub', color: 'rgb(135,23,205)' },
  { key: 'observability', label: 'Observability', blurb: 'Session replay, errors, logs, traces', icon: 'pulse', color: 'rgb(0,131,68)' },
]

/* The "regardless of where you start" rail */
export interface OnHandItem {
  label: string
  blurb: string
  icon: Glyph
}

export const ON_HAND: OnHandItem[] = [
  { label: 'Invite your teammates', blurb: 'Everything here lands faster with the whole team in.', icon: 'users' },
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
  optional?: boolean
  learn: { what: string; ideas: string[] }
}

/* Each roadmap is the verified shortest required path, then "nice to have"
   optional steps. Sources: gonfalon + launchdarkly.com/docs. */
export const ROADMAPS: Record<ProductKey, RoadmapStepV2[]> = {
  guarded: [
    {
      key: 'sdk',
      title: 'Install the SDK and connect your app',
      blurb: 'One init call with your environment key.',
      cta: 'Set up an SDK',
      icon: 'plug',
      learn: {
        what: 'Drop the SDK into the service that owns the change. Server SDKs initialize with the SDK key; browser apps use the client-side ID. Wherever you read a config value today, you ask LaunchDarkly instead — or let your coding agent wire it through the MCP server.',
        ideas: ['Node', 'Python', 'Go', 'iOS', 'MCP server'],
      },
    },
    {
      key: 'flag',
      title: 'Wrap the change in a flag',
      blurb: 'Evaluate it with a context, same as any flag.',
      cta: 'Create a flag',
      icon: 'flag',
      learn: {
        what: 'Create a boolean flag and call variation() with a context — who is asking. Define your contexts in the SDK, the same as a regular flag. The kinds show up in LaunchDarkly automatically as the flag is evaluated, so there is no separate setup in the UI.',
        ideas: ['release-new-checkout', 'Kill switch', 'Contexts in the SDK'],
      },
    },
    {
      key: 'metric',
      title: 'Give it a metric to watch',
      blurb: 'Clicks and page views need no code.',
      cta: 'Create a metric',
      icon: 'ruler',
      learn: {
        what: 'A guarded release needs one LaunchDarkly metric receiving events. Click and page-view metrics need no code. Already have observability or Datadog data? Convert an OTEL metric into a LaunchDarkly metric. Anything custom is a single track() call, sent with the same context kind your flag evaluates. Set the metric up before you start — it is the step teams most often forget.',
        ideas: ['Checkout error rate', 'p95 latency', 'Conversion rate', "One track() call"],
      },
    },
    {
      key: 'rollout',
      title: 'Start the guarded rollout',
      blurb: 'Targeting tab → Serve → Guarded rollout.',
      cta: 'Start guarded rollout',
      icon: 'shield',
      learn: {
        what: 'On the flag’s Targeting tab, pick Guarded rollout from the Serve menu. Choose your metric and a monitoring window (1 hour to 1 week, 24 hours is the default). Automatic rollback is on by default; you can switch to notify-only and decide case by case, since a metric can move for reasons unrelated to your change. Built-in health checks confirm the flag is evaluating and your metric has events before you launch.',
        ideas: ['Health checks first', '24-hour window', 'Auto-rollback or notify'],
      },
    },
    {
      key: 'o11y',
      title: 'Add observability guardrails',
      blurb: 'Guard on error rate or latency from telemetry.',
      cta: 'Add the plugins',
      icon: 'pulse',
      optional: true,
      learn: {
        what: 'Install the observability plugins (or dual-send your existing Datadog / OTEL data), then convert an OTEL metric into a LaunchDarkly metric to guard releases on error rate or latency. No track() calls to write.',
        ideas: ['Error-rate guardrail', 'p95 guardrail', 'Reuse Datadog/OTEL'],
      },
    },
    {
      key: 'alerts',
      title: 'Wire up Slack alerts',
      blurb: 'Hear it the moment a release rolls back.',
      cta: 'Connect Slack',
      icon: 'sparkle',
      optional: true,
      learn: {
        what: 'Connect Slack or a webhook so the team knows the moment a regression is detected or rolled back, without anyone watching a dashboard. Approvals and scheduled rollouts slot in here too.',
        ideas: ['Slack', 'Webhooks', 'Approvals'],
      },
    },
  ],
  flags: [
    {
      key: 'create',
      title: 'Create your first flag',
      blurb: 'A remote if-statement. Two minutes.',
      cta: 'Create flag',
      icon: 'flag',
      learn: {
        what: 'Create a boolean flag in the UI. You do not need context kinds, segments, or targeting set up first — start with a kill switch on something risky.',
        ideas: ['Kill switch', 'Feature gate', 'Config value'],
      },
    },
    {
      key: 'sdk',
      title: 'Install an SDK and initialize',
      blurb: 'Use the right key for your platform.',
      cta: 'Set up an SDK',
      icon: 'plug',
      learn: {
        what: 'Server SDKs use the SDK key, browser SDKs use the client-side ID, and mobile SDKs use the mobile key — all three live in your environment settings. Evaluations happen locally in microseconds, not per-request network calls.',
        ideas: ['Node', 'React', 'Go', 'Mobile'],
      },
    },
    {
      key: 'evaluate',
      title: 'Evaluate with a context',
      blurb: 'variation() plus who is asking.',
      cta: 'See the code',
      icon: 'fingerprint',
      learn: {
        what: 'Call variation() with a context, usually a user with a key. Define your contexts in the SDK, the same as any flag; LaunchDarkly registers the kinds automatically as flags are evaluated, with no separate UI step. This is the moment your config file becomes a live control.',
        ideas: ['user', 'organization', 'device'],
      },
    },
    {
      key: 'target',
      title: 'Target who sees it',
      blurb: 'Individuals, rules, percentages.',
      cta: 'Open targeting',
      icon: 'venn',
      learn: {
        what: 'Toggle the flag on and target: individual contexts, attribute rules, or a percentage rollout. Build a segment when you want the same audience on more than one flag — beta cohort, enterprise plan, EU users.',
        ideas: ['Internal first', 'Beta cohort', '10% canary'],
      },
    },
    {
      key: 'guard',
      title: 'Graduate to guarded rollouts',
      blurb: 'Let releases protect themselves.',
      cta: 'Try a guarded rollout',
      icon: 'shield',
      optional: true,
      learn: {
        what: 'Once a flag matters, stop flipping it for everyone at once: a guarded rollout ramps progressively, watches a metric, and rolls back automatically when something breaks.',
        ideas: ['Guarded rollout', 'Auto-rollback'],
      },
    },
    {
      key: 'coderefs',
      title: 'Connect GitHub and Slack',
      blurb: 'Find every flag in code; hear every change.',
      cta: 'Browse integrations',
      icon: 'mcp',
      optional: true,
      learn: {
        what: 'Code references index where each flag lives in your repos, which makes cleanup safe. Slack notifications keep the team on top of flag changes without checking the dashboard.',
        ideas: ['Code references', 'Slack updates', 'Flag triggers'],
      },
    },
  ],
  experiments: [
    {
      key: 'metric',
      title: 'Create the metric that decides',
      blurb: 'The number the team argues about.',
      cta: 'Create a metric',
      icon: 'ruler',
      learn: {
        what: 'Pick the number decision-makers actually watch. Click and page-view metrics need no code; conversion and numeric metrics are one track() call when the outcome happens.',
        ideas: ['Conversion', 'Revenue per visitor', 'Activation rate'],
      },
    },
    {
      key: 'flag',
      title: 'Pick a flag with two variations',
      blurb: 'Variations become the treatments.',
      cta: 'Create a flag',
      icon: 'flag',
      learn: {
        what: 'Any flag can power an experiment — its variations become the treatments. Create one for the change you want to measure if it does not exist yet.',
        ideas: ['A/B the checkout', 'Copy test', 'Algorithm v2'],
      },
    },
    {
      key: 'design',
      title: 'Build the experiment',
      blurb: 'Hypothesis, audience, control. Stats are preset.',
      cta: 'Create experiment',
      icon: 'beaker',
      learn: {
        what: 'Name it, write the hypothesis, choose the randomization unit (user for UX, account for B2B), attach your metrics, pick the flag rule to run on, and designate the control. The statistics are pre-configured — Bayesian with sensible defaults — so there is nothing to tune.',
        ideas: ['Randomize by user', '50% audience', 'Stats preset'],
      },
    },
    {
      key: 'events',
      title: 'Start it and send events',
      blurb: 'Same context kind, or it will not attribute.',
      cta: 'Start iteration',
      icon: 'plug',
      learn: {
        what: 'Start the iteration, then make sure events flow: track() must use the same context kind you randomized by, or conversions will not attribute. Click and page-view events flow automatically from the JS SDK.',
        ideas: ["track('purchase')", 'Match the unit', 'Watch live events'],
      },
    },
    {
      key: 'holdout',
      title: 'Add a holdout or layer',
      blurb: 'Long-term impact; no collisions.',
      cta: 'Explore holdouts',
      icon: 'venn',
      optional: true,
      learn: {
        what: 'Holdouts keep a slice of traffic out of all experiments so you can measure long-term impact. Layers make experiments mutually exclusive so they do not contaminate each other.',
        ideas: ['Holdout', 'Layers'],
      },
    },
    {
      key: 'funnel',
      title: 'Group metrics into a funnel',
      blurb: 'Measure the journey, not one step.',
      cta: 'Create metric group',
      icon: 'ruler',
      optional: true,
      learn: {
        what: 'Metric groups let one experiment read a whole funnel — view, add to cart, purchase — instead of a single conversion step.',
        ideas: ['Funnel group', 'Standard group'],
      },
    },
  ],
  aiconfigs: [
    {
      key: 'config',
      title: 'Create an AI Config',
      blurb: 'Model + messages as a variation.',
      cta: 'Create AI Config',
      icon: 'hub',
      learn: {
        what: 'Create a completion-mode AI Config with one variation: the model plus your system and user messages. It is targeted like a flag, so you can change models and prompts at runtime without a deploy.',
        ideas: ['GPT vs Claude', 'Prompt v2', 'Runtime swap'],
      },
    },
    {
      key: 'playground',
      title: 'Try it in the playground',
      blurb: 'No code. Bring your provider key.',
      cta: 'Open playground',
      icon: 'playground',
      learn: {
        what: 'The playground runs your variation against real prompts with zero code — the fastest proof it works. You bring your own OpenAI or Anthropic API key; LaunchDarkly does not proxy or manage provider keys.',
        ideas: ['Side-by-side outputs', 'Token counts', 'Your own key'],
      },
    },
    {
      key: 'sdk',
      title: 'Install the AI SDK',
      blurb: 'Same SDK key as flags. Your provider client.',
      cta: 'Install AI SDK',
      icon: 'plug',
      learn: {
        what: 'Add the AI package on top of the server SDK (same SDK key as flags — there is no separate AI key). Your code fetches the config, then calls your own provider client with it: LaunchDarkly delivers the config, the model call stays yours.',
        ideas: ['server-sdk-ai', 'Your provider client', 'No separate key'],
      },
    },
    {
      key: 'track',
      title: 'Track what the model does',
      blurb: 'Tokens, latency, satisfaction per variation.',
      cta: 'Enable tracking',
      icon: 'ruler',
      learn: {
        what: 'The AI SDK’s tracking helpers record token usage, latency, and satisfaction per variation, so you can compare prompts and models on production traffic.',
        ideas: ['Tokens', 'Latency', 'Thumbs-up rate'],
      },
    },
    {
      key: 'target',
      title: 'Vary by audience',
      blurb: 'Frontier model for some, fast for the rest.',
      cta: 'Add targeting',
      icon: 'venn',
      optional: true,
      learn: {
        what: 'Serve the expensive model to enterprise accounts and the fast one to the free tier — same code path, different config. Reuses the exact targeting you know from flags.',
        ideas: ['Enterprise → frontier', 'Free tier → fast', 'Internal → beta prompt'],
      },
    },
    {
      key: 'exp',
      title: 'Experiment on prompts',
      blurb: 'Let the metric pick the prompt.',
      cta: 'Create experiment',
      icon: 'beaker',
      optional: true,
      learn: {
        what: 'When two prompts disagree, run an experiment on the AI Config and let your metric decide — same experimentation engine, pointed at models.',
        ideas: ['Prompt A/B', 'Cost vs quality'],
      },
    },
  ],
  observability: [
    {
      key: 'plugins',
      title: 'Add the observability plugins',
      blurb: 'Session replay + monitoring on your SDK init.',
      cta: 'Add the plugins',
      icon: 'plug',
      learn: {
        what: 'In the browser, pass the session-replay and observability plugins to the JS SDK init with your client-side ID. On the server, add the observability plugin to the Node or Python SDK. No separate agent to deploy.',
        ideas: ['2 plugins client-side', 'Node + Python server', 'Same SDK init'],
      },
    },
    {
      key: 'sessions',
      title: 'Watch session replays',
      blurb: 'See exactly what your users saw.',
      cta: 'Open session replay',
      icon: 'play',
      learn: {
        what: 'Session replay is why most teams start here: replay exactly what a user saw, with the console and network right beside it. Errors flow in automatically too. Replay defaults to strict privacy, so text and images are masked until you choose to loosen it.',
        ideas: ['Session replay', 'Console + network', 'Strict privacy default'],
      },
    },
    {
      key: 'traces',
      title: 'Add logs and traces',
      blurb: 'One-line calls, or your existing OTel.',
      cta: 'See the snippets',
      icon: 'article',
      learn: {
        what: 'Logs and traces need one-line calls (record a log, start a span) or your existing OpenTelemetry instrumentation. Everything arrives tagged with the flag variations active at the time, so "did our release cause this?" is one click.',
        ideas: ['start_span', 'OTel compatible', 'Variation-tagged'],
      },
    },
    {
      key: 'connect',
      title: 'Connect your existing provider',
      blurb: 'Already on Datadog or OTel? Reuse it.',
      cta: 'Browse integrations',
      icon: 'mcp',
      optional: true,
      learn: {
        what: 'Already invested in Datadog or an OpenTelemetry tool? Dual-send your observability data to LaunchDarkly too — no re-instrumentation. New Relic OTEL is supported, with fuller New Relic support coming.',
        ideas: ['Datadog dual-send', 'Open-source OTEL', 'New Relic OTEL'],
      },
    },
    {
      key: 'guard',
      title: 'Turn telemetry into guardrails',
      blurb: 'Guard releases on error rate or latency.',
      cta: 'Create a guarded metric',
      icon: 'shield',
      learn: {
        what: 'Convert an OTEL or observability metric into a LaunchDarkly metric, then use it to guard rollouts and experiments on error rate or latency — no track() calls to write.',
        ideas: ['Error-rate guardrail', 'p95 guardrail', 'OTEL → LD metric'],
      },
    },
    {
      key: 'alerts',
      title: 'Set up alerts',
      blurb: 'Error spikes and latency, to Slack.',
      cta: 'Create an alert',
      icon: 'sparkle',
      optional: true,
      learn: {
        what: 'Alert on error spikes, session anomalies, or latency thresholds, delivered to Slack or webhooks — so the dashboard checks you.',
        ideas: ['Error spike', 'Latency threshold', 'Slack'],
      },
    },
    {
      key: 'privacy',
      title: 'Tune privacy and sampling',
      blurb: 'Masking levels, excluded users, volume.',
      cta: 'Open settings',
      icon: 'venn',
      optional: true,
      learn: {
        what: 'Privacy starts strict (everything masked). Tune masking, exclude specific users from replay, and set sampling so you keep the sessions that matter at a volume you want to pay for.',
        ideas: ['Masking levels', 'Sampling', 'Excluded users'],
      },
    },
  ],
}

/* =========================================================================
   Option 4 (unified): flags and guarded releases as ONE product. No separate
   "Guarded releases" tile; a guarded rollout is just how you ship a flag.
   ========================================================================= */

export const PRODUCTS_UNIFIED: ProductDef[] = [
  { key: 'flags', label: 'Feature flags', blurb: 'Targeting + guarded rollouts', icon: 'flag', color: 'rgb(66,94,255)' },
  { key: 'experiments', label: 'Experimentation', blurb: 'Measure what works', icon: 'beaker', color: 'rgb(214,122,0)' },
  { key: 'aiconfigs', label: 'AI Configs', blurb: 'Models and prompts, live', icon: 'hub', color: 'rgb(135,23,205)' },
  { key: 'observability', label: 'Observability', blurb: 'Session replay, errors, logs, traces', icon: 'pulse', color: 'rgb(0,131,68)' },
]

const FLAGS_UNIFIED: RoadmapStepV2[] = [
  {
    key: 'sdk',
    title: 'Install the SDK and connect your app',
    blurb: 'One init call. Powers flags and guarded rollouts.',
    cta: 'Set up an SDK',
    icon: 'plug',
    learn: {
      what: 'Drop the SDK into the service that owns the change. Server SDKs use the SDK key, browser apps use the client-side ID. The same SDK powers plain flags and guarded rollouts — there is nothing separate to install for safety.',
      ideas: ['Node', 'Python', 'Go', 'iOS', 'MCP server'],
    },
  },
  {
    key: 'flag',
    title: 'Wrap the change in a flag',
    blurb: 'Evaluate it with a context, same as any flag.',
    cta: 'Create a flag',
    icon: 'flag',
    learn: {
      what: 'Create a boolean flag and call variation() with a context — who is asking. Define your contexts in the SDK, the same as a regular flag. The kinds show up in LaunchDarkly automatically as the flag is evaluated, with no separate UI setup.',
      ideas: ['release-new-checkout', 'Kill switch', 'Contexts in the SDK'],
    },
  },
  {
    key: 'metric',
    title: 'Give it a metric to watch',
    blurb: 'So the rollout can guard itself.',
    cta: 'Create a metric',
    icon: 'ruler',
    learn: {
      what: 'Create a LaunchDarkly metric for the number that hurts when it breaks. Click and page-view metrics need no code, error and latency metrics can come from observability (convert the OTEL metric to a LaunchDarkly metric), and anything custom is one track() call. Set it up before you ship.',
      ideas: ['Checkout error rate', 'p95 latency', 'Conversion rate', 'One track() call'],
    },
  },
  {
    key: 'ship',
    title: 'Ship it as a guarded rollout',
    blurb: 'The safe default way to release a flag.',
    cta: 'Start guarded rollout',
    icon: 'shield',
    learn: {
      what: 'This is just how you ship a flag safely: roll out progressively, watch your metric, and roll back automatically before bad code reaches the rest of your customers. Auto-rollback is on by default; switch to notify-only when you want to decide case by case.',
      ideas: ['Progressive rollout', 'Auto-rollback or notify', '24-hour window'],
    },
  },
  {
    key: 'target',
    title: 'Target segments and cohorts',
    blurb: 'Beta, risk tiers, plans, regions.',
    cta: 'Create a segment',
    icon: 'venn',
    optional: true,
    learn: {
      what: 'Build reusable segments — beta cohort, enterprise plan, EU users, risk tier 1 — so you roll out to the right audience and reuse it across flags.',
      ideas: ['Beta cohort', 'Enterprise plan', 'EU users'],
    },
  },
  {
    key: 'o11y',
    title: 'Add observability guardrails',
    blurb: 'Guard on error rate or latency.',
    cta: 'Add the plugins',
    icon: 'pulse',
    optional: true,
    learn: {
      what: 'Install the observability plugins (or dual-send your existing Datadog / OTEL data), then convert an OTEL metric into a LaunchDarkly metric to guard releases on error rate or latency. No track() calls to write.',
      ideas: ['Error-rate guardrail', 'p95 guardrail', 'Reuse Datadog/OTEL'],
    },
  },
  {
    key: 'integrations',
    title: 'Connect GitHub and Slack',
    blurb: 'Find flags in code; hear every change.',
    cta: 'Browse integrations',
    icon: 'mcp',
    optional: true,
    learn: {
      what: 'Code references index where each flag lives in your repos so cleanup is safe. Slack keeps the team on top of changes and rollbacks without watching a dashboard.',
      ideas: ['Code references', 'Slack updates', 'Flag triggers'],
    },
  },
]

export const ROADMAPS_UNIFIED: Record<ProductKey, RoadmapStepV2[]> = {
  ...ROADMAPS,
  flags: FLAGS_UNIFIED,
}
