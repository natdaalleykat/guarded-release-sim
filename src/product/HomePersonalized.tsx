import { useState } from 'react'
import { GetStartedCard } from './Widgets'
import { IntentChips, SampleFlagsCard, WelcomeRow, GlyphIcon } from './blocks'
import { INTENTS, type Glyph } from '../data/home'
import { ShieldHeart, ArrowRight } from '../components/icons'

interface Rec {
  title: string
  blurb: string
  cta: string
  icon: Glyph
  color: string
  primary?: boolean
}

const REC: Record<string, Rec> = {
  release: {
    title: 'Watch a guarded release',
    blurb: 'See a rollout catch a regression and roll back automatically. 90 seconds, no setup.',
    cta: 'Watch simulation',
    icon: 'shield',
    color: 'rgb(66,94,255)',
    primary: true,
  },
  experiment: {
    title: 'Run your first experiment',
    blurb: 'Measure the real impact of a change on a metric you choose.',
    cta: 'Create experiment',
    icon: 'beaker',
    color: 'rgb(214,122,0)',
  },
  ai: {
    title: 'Create an AI Config',
    blurb: 'Manage models, prompts, and agents in real time, without redeploying.',
    cta: 'Create config',
    icon: 'hub',
    color: 'rgb(135,23,205)',
  },
  observe: {
    title: 'Turn on observability',
    blurb: 'See errors, logs, traces, and sessions tied to each flag variation.',
    cta: 'Instrument observability',
    icon: 'pulse',
    color: 'rgb(0,131,68)',
  },
  target: {
    title: 'Model who you target',
    blurb: 'Set up context kinds and segments: users, accounts, risk tiers, plans.',
    cta: 'Set up targeting',
    icon: 'venn',
    color: 'rgb(8,150,180)',
  },
}

export function HomePersonalized({ onWatch }: { onWatch: () => void }) {
  const [sel, setSel] = useState<Record<string, boolean>>({ release: true, experiment: true })
  const toggle = (k: string) => setSel((s) => ({ ...s, [k]: !s[k] }))
  const chosen = INTENTS.filter((it) => sel[it.key])

  return (
    <div className="content-inner">
      <WelcomeRow title="Welcome, Natalie" subtitle="Tell us what you came for. Your home adapts to it." />

      <div className="card card-pad">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 15.5, fontWeight: 700 }}>What do you want to do first?</h2>
          <span className="faint" style={{ fontSize: 12.5 }}>pick any, change anytime</span>
        </div>
        <IntentChips selected={sel} onToggle={toggle} />
      </div>

      {chosen.length > 0 ? (
        <div style={{ marginTop: 26 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Recommended for you</h2>
          <div className="cols grid-2" style={{ gap: 14 }}>
            {chosen.map((it) => {
              const r = REC[it.key]
              return (
                <div
                  key={it.key}
                  className="card card-pad"
                  style={
                    r.primary
                      ? { borderColor: 'var(--blue)', boxShadow: '0 0 0 1px var(--blue)', background: 'linear-gradient(180deg, var(--blue-tint), var(--bg) 70%)' }
                      : {}
                  }
                >
                  <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                    <span className="setup-ic" style={{ background: r.color }}>
                      <GlyphIcon icon={r.icon} size={19} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{r.title}</div>
                      <div className="muted" style={{ fontSize: 13, marginTop: 4, lineHeight: 1.45 }}>{r.blurb}</div>
                      <button
                        className={r.primary ? 'btn sm' : 'btn default sm'}
                        style={{ marginTop: 12 }}
                        onClick={r.primary ? onWatch : undefined}
                      >
                        {r.primary && <ShieldHeart size={14} />}
                        {r.cta}
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="card card-pad" style={{ marginTop: 26, textAlign: 'center', color: 'var(--text-2)' }}>
          Pick at least one above to see your recommended next steps.
        </div>
      )}

      <div className="cols grid-top" style={{ marginTop: 26 }}>
        <SampleFlagsCard />
        <GetStartedCard />
      </div>
    </div>
  )
}
