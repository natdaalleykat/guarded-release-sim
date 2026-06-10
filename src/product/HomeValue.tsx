import { GetStartedCard, GlobalStatsWidget } from './Widgets'
import { SimHero, CapabilityStrip, WelcomeRow } from './blocks'

export function HomeValue({ onWatch }: { onWatch: () => void }) {
  return (
    <div className="content-inner">
      <WelcomeRow title="Welcome, Natalie" subtitle="Start with the part that makes LaunchDarkly click. Setup can wait." />

      <SimHero onWatch={onWatch} />

      <div style={{ marginTop: 30 }}>
        <CapabilityStrip />
      </div>

      <div style={{ marginTop: 30 }}>
        <div
          className="gr-section-label"
          style={{ marginBottom: 12, color: 'var(--text-3)' }}
        >
          When you are ready to connect
        </div>
        <div className="cols grid-top">
          <GetStartedCard />
          <GlobalStatsWidget />
        </div>
      </div>
    </div>
  )
}
