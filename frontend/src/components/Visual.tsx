import { useId } from 'react'
import type { Category, Motif, Tone } from '../data/catalog'

// Emplacement photo de la maquette : un croquis à plat du vêtement, rempli du motif
// de son tissu. Il sera remplacé par les photos réelles envoyées depuis le backoffice.

type Shape = 'ample' | 'robe' | 'veste' | 'sac' | 'none'

const shapeFor = (category?: Category): Shape => {
  switch (category) {
    case 'Boubous':
    case 'Kaftans':
    case 'Ensembles':
      return 'ample'
    case 'Robes':
      return 'robe'
    case 'Vestes':
      return 'veste'
    case 'Accessoires':
      return 'sac'
    default:
      return 'none'
  }
}

const paths: Record<Exclude<Shape, 'none'>, string> = {
  ample:
    'M128 52 Q150 74 172 52 L268 82 L296 226 L238 238 L250 388 L50 388 L62 238 L4 226 L32 82 Z',
  robe: 'M126 50 Q150 70 174 50 L200 60 L206 120 L188 150 L262 388 L38 388 L112 150 L94 120 L100 60 Z',
  veste:
    'M120 56 L150 150 L180 56 L250 80 L286 300 L244 306 L236 200 L234 360 L66 360 L64 200 L56 306 L14 300 L50 80 Z',
  sac: 'M95 150 Q95 70 150 70 Q205 70 205 150 L190 150 Q190 88 150 88 Q110 88 110 150 Z M60 150 L240 150 L256 330 Q256 346 240 346 L60 346 Q44 346 44 330 Z',
}

function Pattern({ id, motif }: { id: string; motif: Motif }) {
  switch (motif) {
    case 'bogolan':
      return (
        <pattern id={id} width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M18 6 V30 M6 18 H30" stroke="var(--pat)" strokeWidth="3" />
          <circle cx="3" cy="3" r="2" fill="var(--pat)" />
          <circle cx="33" cy="33" r="2" fill="var(--pat)" />
          <path d="M0 34 L6 28 L12 34" stroke="var(--pat)" strokeWidth="1.5" fill="none" />
        </pattern>
      )
    case 'indigo':
      return (
        <pattern id={id} width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="24" stroke="var(--pat)" strokeWidth="1.5" fill="none" />
          <circle cx="30" cy="30" r="15" stroke="var(--pat)" strokeWidth="1.5" fill="none" />
          <circle cx="30" cy="30" r="6" fill="var(--pat)" />
        </pattern>
      )
    case 'wax':
      return (
        <pattern id={id} width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M0 24 A24 24 0 0 1 48 24" stroke="var(--pat)" strokeWidth="6" fill="none" />
          <path d="M12 48 A12 12 0 0 1 36 48" fill="var(--pat)" />
        </pattern>
      )
    case 'tissage':
      return (
        <pattern id={id} width="40" height="10" patternUnits="userSpaceOnUse">
          <rect x="0" width="4" height="10" fill="var(--pat)" />
          <rect x="10" width="1.5" height="10" fill="var(--pat)" />
          <rect x="24" width="8" height="10" fill="var(--pat)" opacity="0.6" />
        </pattern>
      )
    case 'bazin':
    default:
      return (
        <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M14 0 L28 14 L14 28 L0 14 Z" stroke="var(--pat)" strokeWidth="1" fill="none" />
          <path d="M14 8 L20 14 L14 20 L8 14 Z" fill="var(--pat)" />
        </pattern>
      )
  }
}

interface VisualProps {
  motif: Motif
  tone: Tone
  category?: Category
  label?: string
  ratio?: string
  className?: string
}

export default function Visual({ motif, tone, category, label, ratio = '4 / 5', className = '' }: VisualProps) {
  const pid = `m${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const shape = shapeFor(category)
  return (
    <figure className={`visual tone-${tone} ${className}`} style={{ aspectRatio: ratio }}>
      <svg className="visual-cloth" aria-hidden="true">
        <defs>
          <Pattern id={pid} motif={motif} />
        </defs>
        <rect width="100%" height="100%" fill={shape === 'none' ? `url(#${pid})` : 'transparent'} />
      </svg>
      {shape !== 'none' && (
        <svg className="visual-shape" viewBox="0 0 300 400" aria-hidden="true">
          <defs>
            <Pattern id={`${pid}s`} motif={motif} />
          </defs>
          <path d={paths[shape]} className="visual-shape-base" fillRule="evenodd" />
          <path d={paths[shape]} fill={`url(#${pid}s)`} fillRule="evenodd" />
        </svg>
      )}
      {label && <figcaption className="visual-label">{label}</figcaption>}
    </figure>
  )
}
