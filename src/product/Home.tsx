import { USER } from '../data/product'
import { GetStartedCard, GlobalStatsWidget, ProductWidgetCard, WIDGETS } from './Widgets'
import { IcFingerprint, IcArrowUp } from '../components/navicons'
import { Bolt } from '../components/icons'

export function Home({ onWatch }: { onWatch: () => void }) {
  return (
    <div className="content-inner">
      {/* welcome header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 22 }}>
        <div>
          <h1 className="page-title">Welcome, {USER.name}</h1>
          <p className="muted" style={{ fontSize: 15, marginTop: 6 }}>
            You are on a 14-day trial. Connect your app, or see what a guarded release feels like first.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
          <span className="badge orange" style={{ height: 30, padding: '0 12px' }}>Trial · 14 days left</span>
          <button className="btn default" style={{ height: 34 }}><Bolt size={14} /> Upgrade</button>
        </div>
      </div>

      {/* top band */}
      <div className="cols grid-top">
        <GetStartedCard />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <GlobalStatsWidget />
          <div className="card card-pad" style={{ flex: 1 }}>
            <div className="muted" style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Recently seen contexts</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px 0 4px' }}>
              <span style={{ color: 'var(--text-3)', marginBottom: 8 }}><IcFingerprint size={26} /></span>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>No contexts yet</div>
              <div className="faint" style={{ fontSize: 12.5, marginTop: 3, lineHeight: 1.4 }}>
                Connect an SDK to see who is evaluating your flags.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* products */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '30px 0 14px' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>Start building</h2>
        <span className="muted" style={{ fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <IcArrowUp size={12} style={{ color: 'var(--blue)' }} /> the guarded release sim needs no setup
        </span>
      </div>
      <div className="cols grid-products">
        {[...WIDGETS]
          .sort((a, b) => (a.key === 'guarded' ? -1 : b.key === 'guarded' ? 1 : 0))
          .map((w) => (
            <ProductWidgetCard key={w.key} widget={w} onWatch={w.key === 'guarded' ? onWatch : undefined} />
          ))}
      </div>
    </div>
  )
}
