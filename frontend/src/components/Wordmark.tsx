// Mot-symbole KAOM : le A sans barre (Λ) reprend le dessin du logo.
export default function Wordmark({ size = 'md' }: { size?: 'md' | 'xl' }) {
  return (
    <span className={`wordmark wordmark-${size}`} aria-label="KAOM">
      K<span className="wordmark-a">Λ</span>OM
    </span>
  )
}
