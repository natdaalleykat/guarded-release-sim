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
  { key: 'aiconfigs', label: 'AgentControl', blurb: 'Build and run agents in production', icon: 'hub', color: 'rgb(135,23,205)' },
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
  /* short effort/time hint shown next to the CTA */
  est?: string
  /* inline "learn more" links to the real docs */
  docs?: { label: string; href: string }[]
  learn: { what: string; ideas: string[] }
}

/* Each roadmap is the verified shortest required path for a user starting
   from zero, then "nice to have" optional steps. Required vs optional and the
   ordering were audited against gonfalon (the real onboarding/quickstart code)
   plus launchdarkly.com/docs. Notes that drove the structure:
   - Context kinds are never a setup step. The SDK registers them automatically
     the first time it evaluates a flag with a context. The built-in user kind
     works out of the box.
   - Almost nothing works without a live SDK, so Experimentation and
     Observability lead with the SDK install (it was previously missing).
   - Auto-rollback is opt-in per metric (notify is always on), so copy says
     "rolls back automatically or just alerts you" rather than claiming a default.
   - MCP is only an alternative install method (a chip on the SDK step), never
     its own step. GitHub code references live only in the flags path. Slack
     appears only where there is something to be notified about.
   - In the split concept, flags and guarded releases are separate products, so
     the flags path keeps the whole guarded journey (metric, ship guarded,
     integrations) as nice-to-have. The unified concept keeps "ship as a guarded
     release" required, because that is its entire thesis. */
export const ROADMAPS: Record<ProductKey, RoadmapStepV2[]> = {
  guarded: [
    {
      key: 'sdk',
      title: 'Install the SDK and connect your app',
      blurb: 'One init call with your environment key.',
      cta: 'Set up an SDK',
      icon: 'plug',
      est: '~5 min',
      learn: {
        what: 'Drop the SDK into the service that owns the change. Server SDKs initialize with the SDK key; browser apps use the client-side ID. Wherever you read a config value today, you ask LaunchDarkly instead, or let your coding agent wire it through the MCP server. The same SDK powers a guarded rollout, so there is nothing extra to install for safety.',
        ideas: ['Node', 'Python', 'Go', 'iOS', 'MCP server'],
      },
    },
    {
      key: 'flag',
      title: 'Wrap the change in a flag',
      blurb: 'Evaluate it with a context, same as any flag.',
      cta: 'Create a flag',
      icon: 'flag',
      est: '~2 min',
      learn: {
        what: 'Create a boolean flag and call variation() with a context, which is who is asking. You pass the context object in code; LaunchDarkly registers the context kind on its own the first time the flag is evaluated, so there is no separate setup in the UI. The built-in user kind works out of the box.',
        ideas: ['release-new-checkout', 'Kill switch', 'Context in code'],
      },
    },
    {
      key: 'metric',
      title: 'Give it a metric to watch',
      blurb: 'Clicks and page views need no code.',
      cta: 'Create a metric',
      icon: 'ruler',
      est: 'No-code option',
      docs: [{ label: 'Creating metrics', href: 'https://launchdarkly.com/docs/home/metrics/create-metrics' }],
      learn: {
        what: 'A guarded rollout needs at least one LaunchDarkly metric, and it has to share the context kind your flag evaluates. Click and page-view metrics need no code. Already sending observability or OTEL data? Those metrics are generated for you. Anything custom is one track() call. Set the metric up before you start, since it is the step teams most often forget.',
        ideas: ['Checkout error rate', 'p95 latency', 'Conversion rate', 'One track() call'],
      },
    },
    {
      key: 'rollout',
      title: 'Start the guarded rollout',
      blurb: 'Targeting tab, Serve, Guarded rollout.',
      cta: 'Start guarded rollout',
      icon: 'shield',
      est: '~3 min',
      docs: [
        { label: 'Create a guarded rollout', href: 'https://launchdarkly.com/docs/home/releases/creating-guarded-rollouts' },
        { label: 'Health checks', href: 'https://launchdarkly.com/docs/home/releases/guarded-health-checks' },
      ],
      learn: {
        what: 'On the flag’s Targeting tab, pick Guarded rollout from the Serve menu, choose your metric, and set a monitoring window (1 hour to 1 week; 24 hours is the default). Per metric, decide whether a regression rolls back automatically or just alerts you. Health checks confirm the flag is evaluating and the metric is receiving events before launch, and a rollout needs a minimum number of contexts per stage to measure (about 30 by default).',
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
      est: '~10 min',
      docs: [{ label: 'Guardrails from telemetry', href: 'https://launchdarkly.com/docs/home/metrics/autogen-metrics' }],
      learn: {
        what: 'Add the observability plugins, or dual-send your existing Datadog or OTEL data. LaunchDarkly generates error-rate and latency metrics from that telemetry, so you can guard releases on them with no track() calls to write.',
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
      est: 'One-time',
      learn: {
        what: 'In-app and email notifications are built in. Connect Slack or a webhook so the team hears the moment a regression is detected or a release rolls back, without anyone watching a dashboard. Approvals and scheduled rollouts slot in here too.',
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
      est: '~2 min',
      learn: {
        what: 'Create a boolean flag in the UI. You do not need context kinds, segments, or targeting set up first. Start with a kill switch on something risky.',
        ideas: ['Kill switch', 'Feature gate', 'Config value'],
      },
    },
    {
      key: 'sdk',
      title: 'Install an SDK and evaluate the flag',
      blurb: 'One install. The snippet evaluates it too.',
      cta: 'Set up an SDK',
      icon: 'plug',
      est: '~5 min',
      learn: {
        what: 'Install the SDK and initialize it with the right key: server SDKs use the SDK key, browser SDKs use the client-side ID, mobile SDKs use the mobile key. The install snippet already calls variation() with a context, so install and first evaluation are one step. Context kinds register automatically from that call, with no separate UI step. Evaluations run locally in microseconds.',
        ideas: ['Node', 'React', 'Go', 'Mobile', 'MCP server'],
      },
    },
    {
      key: 'enable',
      title: 'Toggle it on and watch it change',
      blurb: 'Flip the flag, see your app react live.',
      cta: 'Open the flag',
      icon: 'play',
      est: 'Instant',
      learn: {
        what: 'Turn the flag on and watch your running app pick up the change with no redeploy. This is the moment your config file becomes a live control you can flip in seconds, for everyone or no one.',
        ideas: ['Serve true', 'Instant kill switch', 'No redeploy'],
      },
    },
    {
      key: 'target',
      title: 'Target who sees it',
      blurb: 'Individuals, rules, segments, cohorts.',
      cta: 'Open targeting',
      icon: 'venn',
      optional: true,
      est: '~3 min',
      docs: [{ label: 'Targeting and segments', href: 'https://launchdarkly.com/docs/home/flags/target' }],
      learn: {
        what: 'Go past on and off: target individual contexts, attribute rules, or a percentage rollout. Build a reusable segment when you want the same audience across more than one flag, like a beta cohort, enterprise plan, EU users, or a risk tier. No segment is required to start.',
        ideas: ['Internal first', 'Beta cohort', 'Risk tier', '10% canary'],
      },
    },
    {
      key: 'guard',
      title: 'Graduate to guarded rollouts',
      blurb: 'Let releases protect themselves.',
      cta: 'Try a guarded rollout',
      icon: 'shield',
      optional: true,
      est: '~3 min',
      docs: [{ label: 'Guarded rollouts', href: 'https://launchdarkly.com/docs/home/releases/guarded-rollouts' }],
      learn: {
        what: 'Once a flag matters, stop flipping it for everyone at once. A guarded rollout ramps progressively, watches a metric, and rolls back automatically when something breaks. The Guarded releases path walks the full setup; it builds on the flag and SDK you already have.',
        ideas: ['Guarded rollout', 'Auto-rollback', 'Add a metric'],
      },
    },
    {
      key: 'coderefs',
      title: 'Connect GitHub and Slack',
      blurb: 'Find every flag in code; hear every change.',
      cta: 'Browse integrations',
      icon: 'mcp',
      optional: true,
      est: 'One-time',
      learn: {
        what: 'Code references index where each flag lives in your repos, which makes cleanup safe later. Slack notifications keep the team on top of flag changes without checking the dashboard.',
        ideas: ['Code references', 'Slack updates', 'Flag triggers'],
      },
    },
  ],
  experiments: [
    {
      key: 'sdk',
      title: 'Install an SDK and connect your app',
      blurb: 'Needed to serve variations and send events.',
      cta: 'Set up an SDK',
      icon: 'plug',
      est: '~5 min',
      learn: {
        what: 'An experiment cannot start until a live SDK is sending data; the Start button stays disabled until LaunchDarkly sees traffic. Use a browser SDK (JavaScript, React) if you want the no-code click and page-view metrics. The context you evaluate with becomes the unit you can randomize by.',
        ideas: ['JavaScript', 'React', 'Node', 'Mobile'],
      },
    },
    {
      key: 'flag',
      title: 'Pick a flag with two variations',
      blurb: 'Variations become the treatments.',
      cta: 'Create a flag',
      icon: 'flag',
      est: '~2 min',
      learn: {
        what: 'Any flag can power an experiment; its variations become control and treatment. Create one for the change you want to measure if it does not exist yet. You can scaffold the flag inline while building the experiment.',
        ideas: ['A/B the checkout', 'Copy test', 'Algorithm v2'],
      },
    },
    {
      key: 'metric',
      title: 'Create the metric that decides',
      blurb: 'The number the team argues about.',
      cta: 'Create a metric',
      icon: 'ruler',
      est: 'No-code option',
      docs: [{ label: 'Creating metrics', href: 'https://launchdarkly.com/docs/home/metrics/create-metrics' }],
      learn: {
        what: 'Pick the number decision-makers actually watch. Click and page-view metrics need no track() call, but they do need a browser SDK on the page. Conversion and numeric metrics are one track() call when the outcome happens. You can also create the metric inline during setup.',
        ideas: ['Conversion', 'Revenue per visitor', 'Activation rate'],
      },
    },
    {
      key: 'design',
      title: 'Build the experiment',
      blurb: 'Hypothesis, audience, control.',
      cta: 'Create experiment',
      icon: 'beaker',
      est: '~5 min',
      docs: [{ label: 'Creating experiments', href: 'https://launchdarkly.com/docs/home/experimentation/create' }],
      learn: {
        what: 'Name it, write the hypothesis, choose the randomization unit (user for UX, account for B2B), attach your metric, pick the flag rule to run on, and designate the control. Statistics default to Bayesian and are configurable, so there is little to tune. A custom randomization unit has to be turned on for experiments first; the user kind is ready by default.',
        ideas: ['Randomize by user', '50% audience', 'Bayesian default'],
      },
    },
    {
      key: 'events',
      title: 'Turn the flag on and start it',
      blurb: 'Same context kind, or it will not attribute.',
      cta: 'Start iteration',
      icon: 'play',
      est: '~2 min',
      learn: {
        what: 'Toggle the flag on, then start the iteration. Make sure events flow: track() must use the same context kind you randomized by, or conversions will not attribute. Click and page-view events flow on their own from the browser SDK.',
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
      est: '~3 min',
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
      est: '~3 min',
      learn: {
        what: 'Metric groups let one experiment read a whole funnel, from view to add-to-cart to purchase, instead of a single conversion step.',
        ideas: ['Funnel group', 'Standard group'],
      },
    },
  ],
  aiconfigs: [
    {
      key: 'playground',
      title: 'Try it in the playground',
      blurb: 'Compare prompts and models. No code.',
      cta: 'Open the playground',
      icon: 'playground',
      est: 'No code',
      learn: {
        what: 'The fastest way to feel the value, with zero setup: compare models and prompts side by side right in LaunchDarkly, no SDK and no code. During the trial we cover the LLM cost, so you do not even need your own provider key to start. Whatever you settle on is saved as an AI Config you can take to your app next.',
        ideas: ['Compare models', 'Compare prompts', 'Trial covers the LLM cost'],
      },
    },
    {
      key: 'sdk',
      title: 'Bring it into your app',
      blurb: 'Install the AI SDK and serve your config.',
      cta: 'Install AI SDK',
      icon: 'plug',
      est: '~10 min',
      docs: [{ label: 'AI Configs quickstart', href: 'https://launchdarkly.com/docs/home/ai-configs/quickstart' }],
      learn: {
        what: 'When you are ready for production, add the AI package on top of the server SDK; it uses the same SDK key as flags, with no separate AI key. Fetch the AI Config you built with a context and a fallback, then call your own provider client with what it returns. LaunchDarkly delivers the config; the model call stays yours.',
        ideas: ['server-sdk-ai', 'Your provider client', 'Context + fallback'],
      },
    },
    {
      key: 'track',
      title: 'Track what the model does',
      blurb: 'Tokens, latency, satisfaction per variation.',
      cta: 'Enable tracking',
      icon: 'ruler',
      optional: true,
      est: '~5 min',
      learn: {
        what: 'A config serves fine without it, but the tracking helpers are what fill the Monitoring tab and power experiments. They record token usage, latency, and satisfaction per variation, so you can compare prompts and models on real traffic. Recommended.',
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
      est: '~3 min',
      learn: {
        what: 'Serve the expensive model to enterprise accounts and the fast one to the free tier, same code path, different config. Reuses the exact targeting you know from flags.',
        ideas: ['Enterprise to frontier', 'Free tier to fast', 'Internal to beta prompt'],
      },
    },
    {
      key: 'exp',
      title: 'Experiment on prompts',
      blurb: 'Let the metric pick the prompt.',
      cta: 'Create experiment',
      icon: 'beaker',
      optional: true,
      est: '~5 min',
      learn: {
        what: 'When two prompts disagree, run an experiment on the AI Config and let your metric decide, the same experimentation engine pointed at models. A natural next step once traffic is flowing.',
        ideas: ['Prompt A/B', 'Cost vs quality'],
      },
    },
  ],
  observability: [
    {
      key: 'plugins',
      title: 'Install the SDK and add the plugins',
      blurb: 'Observability layers on the LaunchDarkly SDK.',
      cta: 'Add the plugins',
      icon: 'plug',
      est: '~5 min',
      docs: [{ label: 'Observability SDK setup', href: 'https://launchdarkly.com/docs/sdk/observability/javascript' }],
      learn: {
        what: 'Observability is not a separate agent; it is a plugin on the LaunchDarkly SDK. In the browser, initialize the JS SDK with your client-side ID and pass the session-replay and observability plugins. On the server, add the observability plugin to the Node or Python SDK. That single install starts capturing replays, errors, console, network, and performance automatically.',
        ideas: ['JS SDK + 2 plugins', 'Node / Python server', 'One init'],
      },
    },
    {
      key: 'sessions',
      title: 'Watch your first session replay',
      blurb: 'See exactly what your users saw.',
      cta: 'Open session replay',
      icon: 'play',
      est: 'Instant',
      learn: {
        what: 'This is the payoff of the install, and why most teams start here: replay exactly what a user saw, with the console and network right beside it, and errors already captured. Replays are tied to the flag variations that were active at the time. Privacy is strict by default, so text and images are masked until you loosen it.',
        ideas: ['Session replay', 'Console + network', 'Strict privacy default'],
      },
    },
    {
      key: 'traces',
      title: 'Add custom logs and traces',
      blurb: 'Auto-captured already; enrich in one line.',
      cta: 'See the snippets',
      icon: 'article',
      optional: true,
      est: '~5 min',
      learn: {
        what: 'Browser errors, logs, and traces are captured by the plugin on their own. Add one-line calls (record a log, start a span) or wire up your existing OpenTelemetry only when you want deeper coverage on the server or around specific code. Everything stays tagged with the active flag variations.',
        ideas: ['start_span', 'OTel compatible', 'Variation-tagged'],
      },
    },
    {
      key: 'guard',
      title: 'Turn telemetry into guardrails',
      blurb: 'Guard releases on error rate or latency.',
      cta: 'Create a guarded metric',
      icon: 'shield',
      optional: true,
      est: 'No-code option',
      docs: [{ label: 'Guardrails from telemetry', href: 'https://launchdarkly.com/docs/home/metrics/autogen-metrics' }],
      learn: {
        what: 'The signature payoff: LaunchDarkly generates error-rate and latency metrics from your observability and OTEL data, ready to guard rollouts and experiments with no track() calls. This is what ties observability back to safe releases.',
        ideas: ['Error-rate guardrail', 'p95 guardrail', 'Autogenerated metrics'],
      },
    },
    {
      key: 'connect',
      title: 'Connect your existing provider',
      blurb: 'Already on Datadog or OTel? Reuse it.',
      cta: 'Browse integrations',
      icon: 'venn',
      optional: true,
      est: '~10 min',
      learn: {
        what: 'Already invested in Datadog or an OpenTelemetry tool? Dual-send that data to LaunchDarkly too, with no re-instrumentation. New Relic over OTEL is supported, with fuller support coming.',
        ideas: ['Datadog dual-send', 'Open-source OTEL', 'New Relic OTEL'],
      },
    },
    {
      key: 'alerts',
      title: 'Set up alerts',
      blurb: 'Error spikes and latency, to Slack.',
      cta: 'Create an alert',
      icon: 'sparkle',
      optional: true,
      est: 'One-time',
      learn: {
        what: 'Alert on error spikes, session anomalies, or latency thresholds, delivered to Slack or a webhook, so the dashboard checks you instead of the other way around.',
        ideas: ['Error spike', 'Latency threshold', 'Slack'],
      },
    },
    {
      key: 'privacy',
      title: 'Tune privacy and sampling',
      blurb: 'Masking levels, excluded users, volume.',
      cta: 'Open settings',
      icon: 'fingerprint',
      optional: true,
      est: '~3 min',
      learn: {
        what: 'Privacy starts strict, with everything masked. Loosen masking where you need detail, exclude specific users from replay, and set sampling so you keep the sessions that matter at a volume you want to pay for.',
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
  { key: 'aiconfigs', label: 'AgentControl', blurb: 'Build and run agents in production', icon: 'hub', color: 'rgb(135,23,205)' },
  { key: 'observability', label: 'Observability', blurb: 'Session replay, errors, logs, traces', icon: 'pulse', color: 'rgb(0,131,68)' },
]

const FLAGS_UNIFIED: RoadmapStepV2[] = [
  /* Unified: flags and guarded releases are one product. The need-to-haves are
     basic flags; the nice-to-haves extend into a guarded release (and its one
     prerequisite, a metric) plus integrations. */
  {
    key: 'create',
    title: 'Create your first flag',
    blurb: 'A remote if-statement. Two minutes.',
    cta: 'Create flag',
    icon: 'flag',
    est: '~2 min',
    learn: {
      what: 'Create a boolean flag in the UI. You do not need context kinds, segments, or targeting set up first. Start with a kill switch on something risky.',
      ideas: ['Kill switch', 'Feature gate', 'Config value'],
    },
  },
  {
    key: 'sdk',
    title: 'Install an SDK and evaluate the flag',
    blurb: 'One install. The snippet evaluates it too.',
    cta: 'Set up an SDK',
    icon: 'plug',
    est: '~5 min',
    learn: {
      what: 'Install the SDK and initialize it with the right key: server SDKs use the SDK key, browser SDKs use the client-side ID, mobile SDKs use the mobile key. The install snippet already calls variation() with a context, so install and first evaluation are one step. The same SDK powers plain flags and guarded rollouts, so there is nothing separate to install for safety.',
      ideas: ['Node', 'React', 'Go', 'Mobile', 'MCP server'],
    },
  },
  {
    key: 'enable',
    title: 'Toggle it on and watch it change',
    blurb: 'Flip the flag, see your app react live.',
    cta: 'Open the flag',
    icon: 'play',
    est: 'Instant',
    learn: {
      what: 'Turn the flag on and watch your running app pick up the change with no redeploy. This is the moment your config file becomes a live control you can flip in seconds, for everyone or no one.',
      ideas: ['Serve true', 'Instant kill switch', 'No redeploy'],
    },
  },
  {
    key: 'target',
    title: 'Target who sees it',
    blurb: 'Individuals, rules, segments, cohorts.',
    cta: 'Open targeting',
    icon: 'venn',
    est: '~3 min',
    docs: [{ label: 'Targeting and segments', href: 'https://launchdarkly.com/docs/home/flags/target' }],
    learn: {
      what: 'Go past on and off: target individual contexts, attribute rules, or a percentage rollout. Build a reusable segment when you want the same audience across more than one flag, like a beta cohort, enterprise plan, EU users, or a risk tier. No segment is required to start.',
      ideas: ['Internal first', 'Beta cohort', 'Risk tier', '10% canary'],
    },
  },
  {
    key: 'metric',
    title: 'Give it a metric to guard itself',
    blurb: 'The number a rollout watches for regressions.',
    cta: 'Create a metric',
    icon: 'ruler',
    optional: true,
    est: 'No-code option',
    docs: [
      { label: 'Creating metrics', href: 'https://launchdarkly.com/docs/home/metrics/create-metrics' },
      { label: 'Guardrails from telemetry', href: 'https://launchdarkly.com/docs/home/metrics/autogen-metrics' },
    ],
    learn: {
      what: 'When a flag matters, give it a metric so the release can watch itself. Click and page-view metrics need no code. Error-rate and latency guardrails come straight from the observability plugins or your existing Datadog and OTEL data, with no track() calls. Anything custom is one track() call. This is the one prerequisite a guarded release needs.',
      ideas: ['Checkout error rate', 'p95 latency', 'No-code clicks'],
    },
  },
  {
    key: 'ship',
    title: 'Ship it as a guarded release',
    blurb: 'Ramp progressively; roll back on a regression.',
    cta: 'Start guarded rollout',
    icon: 'shield',
    optional: true,
    est: '~3 min',
    docs: [
      { label: 'Guarded rollouts', href: 'https://launchdarkly.com/docs/home/releases/guarded-rollouts' },
      { label: 'Set one up', href: 'https://launchdarkly.com/docs/home/releases/creating-guarded-rollouts' },
    ],
    learn: {
      what: 'Instead of flipping a risky flag for everyone, ship it as a guarded release: it ramps progressively, watches your metric, and rolls back automatically (or just alerts you, your call per metric) the moment something regresses. This is the safest way to release a flag, and the heart of the simulation up top.',
      ideas: ['Progressive ramp', 'Auto-rollback or notify', '24-hour window'],
    },
  },
  {
    key: 'integrations',
    title: 'Connect GitHub and Slack',
    blurb: 'Find flags in code; hear every change.',
    cta: 'Browse integrations',
    icon: 'mcp',
    optional: true,
    est: 'One-time',
    learn: {
      what: 'Code references index where each flag lives in your repos so cleanup is safe later. Slack keeps the team on top of changes and rollbacks without watching a dashboard.',
      ideas: ['Code references', 'Slack updates', 'Flag triggers'],
    },
  },
]

export const ROADMAPS_UNIFIED: Record<ProductKey, RoadmapStepV2[]> = {
  ...ROADMAPS,
  flags: FLAGS_UNIFIED,
}
