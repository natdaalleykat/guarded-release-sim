import { NAV, PROJECT, USER, type IconKey } from '../data/product'
import { ShieldHeart } from '../components/icons'
import {
  IcHome, IcFlag, IcVenn, IcFingerprint, IcHub, IcPlayground, IcBeaker, IcRuler,
  IcPlay, IcWarning, IcArticle, IcTrace, IcGear, IcHelp, IcChevronDown,
} from '../components/navicons'

function NavIcon({ icon }: { icon: IconKey }) {
  const s = 17
  switch (icon) {
    case 'home': return <IcHome size={s} />
    case 'flag': return <IcFlag size={s} />
    case 'shield': return <ShieldHeart size={s} />
    case 'venn': return <IcVenn size={s} />
    case 'fingerprint': return <IcFingerprint size={s} />
    case 'hub': return <IcHub size={s} />
    case 'playground': return <IcPlayground size={s} />
    case 'beaker': return <IcBeaker size={s} />
    case 'ruler': return <IcRuler size={s} />
    case 'play': return <IcPlay size={s} />
    case 'warning': return <IcWarning size={s} />
    case 'article': return <IcArticle size={s} />
    case 'trace': return <IcTrace size={s} />
  }
}

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sb-head">
        <div className="proj-switch">
          <div className="proj-logo"><ShieldHeart size={16} /></div>
          <div className="proj-meta">
            <div className="proj-name">{PROJECT.name}</div>
            <div className="proj-env">{PROJECT.env}</div>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--text-3)' }}><IcChevronDown size={15} /></span>
        </div>
      </div>

      <nav className="sb-scroll">
        {NAV.map((section, i) => (
          <div key={i}>
            {section.label && <div className="sb-section-label">{section.label}</div>}
            {section.items.map((item) => (
              <div key={item.label} className={`nav-item ${item.active ? 'active' : ''}`}>
                <span className="nav-ic"><NavIcon icon={item.icon} /></span>
                {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="sb-foot">
        <div className="nav-item"><span className="nav-ic"><IcGear size={17} /></span>Settings</div>
        <div className="nav-item"><span className="nav-ic"><IcHelp size={17} /></span>Help & docs</div>
        <div className="nav-item">
          <span className="avatar" style={{ width: 24, height: 24, fontSize: 11 }}>{USER.initial}</span>
          {USER.name}
        </div>
      </div>
    </aside>
  )
}
