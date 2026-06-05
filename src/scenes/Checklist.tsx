import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CHECKLIST } from '../data/content'
import { Check, ShieldHeart, ArrowRight, Replay } from '../components/icons'

const block = {
  hide: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export function Checklist({ onReplay }: { onReplay: () => void }) {
  const [checked, setChecked] = useState<boolean[]>(CHECKLIST.steps.map(() => false))
  const toggle = (i: number) => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))
  const doneCount = checked.filter(Boolean).length

  return (
    <div className="scene" style={{ padding: '34px 0 130px' }}>
      <motion.div
        initial="hide"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.09 } } }}
        style={{ maxWidth: 760, margin: '0 auto' }}
      >
        <motion.div variants={block} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              display: 'grid',
              placeItems: 'center',
              background: 'rgba(110,139,255,0.14)',
              border: '1px solid rgba(110,139,255,0.34)',
              color: 'var(--brand-bright)',
            }}
          >
            <ShieldHeart size={24} />
          </div>
          <div className="chip brand">
            <span className="mono">{doneCount}</span> / {CHECKLIST.steps.length} done
          </div>
        </motion.div>

        <motion.h2 variants={block} className="h-lead" style={{ marginBottom: 10 }}>
          {CHECKLIST.title}
        </motion.h2>
        <motion.p variants={block} className="lede" style={{ marginBottom: 30 }}>
          {CHECKLIST.subtitle}
        </motion.p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {CHECKLIST.steps.map((step, i) => (
            <motion.div key={i} variants={block} className="panel" style={{ padding: '20px 22px' }}>
              <div className="check-row">
                <button
                  className={`check-box ${checked[i] ? 'on' : ''}`}
                  onClick={() => toggle(i)}
                  aria-label="toggle step"
                >
                  {checked[i] && <Check size={15} />}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span className="mono" style={{ color: 'var(--brand-bright)', fontSize: 13, fontWeight: 600 }}>
                      Step {i + 1}
                    </span>
                    <h3 style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: '-0.02em' }}>{step.title}</h3>
                  </div>
                  <p className="muted" style={{ fontSize: 14.5, marginTop: 8, lineHeight: 1.5 }}>
                    {step.body}
                  </p>
                  {step.code && <CodeBlock lines={step.code.lines} />}
                  {step.link && (
                    <a className="linkrow" href={step.link.href} target="_blank" rel="noreferrer" style={{ marginTop: 12 }}>
                      {step.link.label}
                      <ArrowRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* footer CTAs */}
        <motion.div
          variants={block}
          className="glass"
          style={{ padding: '22px 24px', marginTop: 26, textAlign: 'center' }}
        >
          <h3 style={{ fontSize: 19, fontWeight: 750, letterSpacing: '-0.02em' }}>
            That was 90 seconds. The real thing is about fifteen minutes.
          </h3>
          <p className="muted" style={{ fontSize: 14.5, marginTop: 8, maxWidth: 520, marginInline: 'auto' }}>
            Everything you just watched runs on your own flags and metrics. Start with one flag on the change you are
            most nervous about.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' }}>
            <a className="btn" href={CHECKLIST.appHref} target="_blank" rel="noreferrer">
              <span className="shine" />
              Open LaunchDarkly
              <ArrowRight size={16} />
            </a>
            <a className="btn btn-ghost" href={CHECKLIST.docsHref} target="_blank" rel="noreferrer">
              Read the guarded rollout docs
            </a>
            <button className="btn btn-ghost" onClick={onReplay}>
              <Replay size={15} />
              Replay the simulation
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

function CodeBlock({ lines }: { lines: string[] }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }
  return (
    <div className="code" style={{ marginTop: 13 }}>
      <button className="copy-btn" onClick={copy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
      {lines.map((ln, i) => (
        <div key={i} style={{ whiteSpace: 'pre' }}>
          {ln === '' ? ' ' : hl(ln)}
        </div>
      ))}
    </div>
  )
}

function hl(line: string): ReactNode[] {
  const out: ReactNode[] = []
  const regex = /(\/\/[^\n]*|#[^\n]*)|('[^']*'|"[^"]*"|`[^`]*`)|\b(const|let|return|await|import|from|new|function)\b/g
  let last = 0
  let key = 0
  let mt: RegExpExecArray | null
  while ((mt = regex.exec(line)) !== null) {
    if (mt.index > last) out.push(line.slice(last, mt.index))
    if (mt[1]) out.push(<span className="cm" key={key++}>{mt[1]}</span>)
    else if (mt[2]) out.push(<span className="str" key={key++}>{mt[2]}</span>)
    else if (mt[3]) out.push(<span className="kw" key={key++}>{mt[3]}</span>)
    last = mt.index + mt[0].length
  }
  if (last < line.length) out.push(line.slice(last))
  return out
}
