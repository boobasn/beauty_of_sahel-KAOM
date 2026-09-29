// Icônes au trait, 24 px, couleur héritée.
const paths = {
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Zm5-1.5L20 20',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c.8-3.4 3.6-5.5 7-5.5s6.2 2.1 7 5.5',
  heart: 'M12 20C4 14 3 10 3 8a4.5 4.5 0 0 1 9-2 4.5 4.5 0 0 1 9 2c0 2-1 6-9 12Z',
  bag: 'M5 8h14l-1 12H6L5 8Zm4 0V6.5a3 3 0 0 1 6 0V8',
  truck: 'M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  wallet: 'M3 7h16v12H3zM3 7l12-3v3M15 13h2',
  refresh: 'M4 12a8 8 0 0 1 14-5.3M20 4v4h-4M20 12a8 8 0 0 1-14 5.3M4 20v-4h4',
  scissors: 'M6 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8 7l12 10M8 17 20 7',
  chevronL: 'M15 5l-7 7 7 7',
  chevronR: 'M9 5l7 7-7 7',
  close: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  menu: 'M4 7h16M4 12h16M4 17h16',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  whatsapp: 'M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20Zm5-11c0 3 3 6 6 6l1.5-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2L9.5 9',
} as const

export type IconName = keyof typeof paths

export default function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="icon">
      <path d={paths[name]} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
