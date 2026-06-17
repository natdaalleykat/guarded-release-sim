import { USER } from '../data/product'
import { IcSearch, IcPlus, IcPlug, IcHelp } from '../components/navicons'

export function TopBar() {
  return (
    <header className="topbar">
      <div className="crumbs">
        <span className="cur">Home</span>
      </div>
      <div className="topbar-right">
        <div className="tb-search">
          <IcSearch size={15} />
          Search
          <span className="kbd">⌘K</span>
        </div>
        <button className="btn sm" style={{ height: 32 }}>
          <IcPlus size={15} /> Create
        </button>
        <button className="tb-icon-btn" title="Install SDK"><IcPlug size={17} /></button>
        <button className="tb-icon-btn" title="Help"><IcHelp size={17} /></button>
        <span className="avatar" title={USER.name}>{USER.initial}</span>
      </div>
    </header>
  )
}
