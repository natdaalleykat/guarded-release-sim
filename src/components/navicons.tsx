interface P {
  size?: number
  className?: string
  style?: React.CSSProperties
}
const base = (size: number) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const })

export const IcHome = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="M4 11 12 4l8 7M6 9.5V20h12V9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const IcFlag = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><rect x="3" y="6.5" width="18" height="11" rx="5.5" stroke="currentColor" strokeWidth="1.7" /><circle cx="15.5" cy="12" r="3" fill="currentColor" /></svg>
)
export const IcVenn = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><circle cx="9" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.6" /><circle cx="15" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.6" /></svg>
)
export const IcFingerprint = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="M12 11c0 3.5-.6 6-1.6 7.6M8.4 6.7A6 6 0 0 1 18 11.5c0 1 0 2-.2 3M5.7 14.6c.4-1 .6-2.1.6-3.1a5.7 5.7 0 0 1 .5-2.3M12 11c0 5-1 7.5-1 7.5M15.3 11.5c0 4-.7 6.2-.7 6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
)
export const IcHub = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="4.5" r="1.8" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="19.5" r="1.8" stroke="currentColor" strokeWidth="1.6" /><circle cx="5.5" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.6" /><circle cx="18.5" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.6" /><path d="M12 6.3v3.3M10 10.7 6.8 9M14 10.7 17.2 9M12 14.4v3.3" stroke="currentColor" strokeWidth="1.4" /></svg>
)
export const IcPlayground = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><rect x="3.5" y="5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M3.5 9h17" stroke="currentColor" strokeWidth="1.6" /><circle cx="6.2" cy="7" r="0.7" fill="currentColor" /></svg>
)
export const IcBeaker = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="M9.5 3.5v5L5 17a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 17l-4.5-8.5v-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M8.5 3.5h7M7.5 13.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
)
export const IcRuler = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" transform="rotate(0 12 12)" /><path d="M7 7v3M11 7v4M15 7v3M19 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
)
export const IcPlay = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" /><path d="M10.5 9.5l4 2.5-4 2.5z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" /></svg>
)
export const IcWarning = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="M12 4 2.8 19.5h18.4L12 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M12 10v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><circle cx="12" cy="16.6" r="1" fill="currentColor" /></svg>
)
export const IcArticle = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M8 9h8M8 12.5h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
)
export const IcTrace = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><circle cx="6" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.6" /><circle cx="18" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.6" /><circle cx="7" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.6" /><path d="M8 7.2c4 1 7 2.4 8 4M16.2 13.4c-3 1.6-6 2.6-7.4 3.1" stroke="currentColor" strokeWidth="1.4" /></svg>
)
export const IcGear = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
)
export const IcHelp = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" /><path d="M9.7 9.4a2.3 2.3 0 0 1 4.4.8c0 1.6-2.1 2-2.1 3.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><circle cx="12" cy="16.4" r="1" fill="currentColor" /></svg>
)
export const IcSearch = ({ size = 16, ...r }: P) => (
  <svg {...base(size)} {...r}><circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.7" /><path d="m15 15 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
)
export const IcPlus = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>
)
export const IcPlug = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="M9 3v4M15 3v4M7 7h10v3a5 5 0 0 1-10 0V7ZM12 15v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const IcSparkle = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="M12 3.5c.6 3.4 2.1 4.9 5.5 5.5-3.4.6-4.9 2.1-5.5 5.5-.6-3.4-2.1-4.9-5.5-5.5 3.4-.6 4.9-2.1 5.5-5.5Z" fill="currentColor" /><path d="M18.5 14c.3 1.6 1 2.3 2.5 2.5-1.5.3-2.2 1-2.5 2.5-.3-1.5-1-2.2-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5Z" fill="currentColor" /></svg>
)
export const IcPulse = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="M2.5 12h4l2-6 4 12 2.5-7h6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const IcMcp = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="m7.5 10 2.2 2.2-2.2 2.2M12 14.6h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const IcChevron = ({ size = 16, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const IcChevronDown = ({ size = 16, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const IcX = ({ size = 18, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>
)
export const IcArrowUp = ({ size = 14, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const IcUsers = ({ size = 16, ...r }: P) => (
  <svg {...base(size)} {...r}><circle cx="9" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M16 6.2a3 3 0 0 1 0 5.6M17.5 19a5.5 5.5 0 0 0-2.6-4.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
)
export const IcBook = ({ size = 16, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="M5 4.5h9a2.5 2.5 0 0 1 2.5 2.5v12.5H7A2 2 0 0 1 5 19.5V4.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M16.5 17H7a2 2 0 0 0-2 2" stroke="currentColor" strokeWidth="1.6" /></svg>
)
