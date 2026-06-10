import { ProductWidgetCard, GlobalStatsWidget, WIDGETS } from './Widgets'
import { RoadmapChecklist, WelcomeRow } from './blocks'

export function HomeRoadmap({ onWatch }: { onWatch: () => void }) {
  const ordered = [...WIDGETS].sort((a, b) => (a.key === 'guarded' ? -1 : b.key === 'guarded' ? 1 : 0))
  return (
    <div className="content-inner">
      <WelcomeRow title="Welcome, Natalie" subtitle="Here is the path most teams take. Each step shows its payoff." />

      <div className="cols" style={{ gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)', gap: 20, alignItems: 'start' }}>
        <RoadmapChecklist onWatch={onWatch} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <GlobalStatsWidget />
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Jump in anywhere</h2>
            <div className="cols grid-2" style={{ gap: 14 }}>
              {ordered.map((w) => (
                <ProductWidgetCard key={w.key} widget={w} onWatch={w.key === 'guarded' ? onWatch : undefined} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
