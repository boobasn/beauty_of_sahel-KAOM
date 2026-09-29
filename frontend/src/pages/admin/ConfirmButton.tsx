import { useState } from 'react'

/** Bouton de suppression en deux temps (la boîte confirm() du navigateur n'est pas utilisée). */
export default function ConfirmButton({ label, confirmLabel, onConfirm }: { label: string; confirmLabel: string; onConfirm: () => void }) {
  const [armed, setArmed] = useState(false)
  if (!armed) {
    return (
      <button type="button" className="btn btn-outline btn-sm btn-danger" onClick={() => setArmed(true)}>
        {label}
      </button>
    )
  }
  return (
    <span className="confirm">
      <button type="button" className="btn btn-sm btn-danger-solid" onClick={onConfirm}>
        {confirmLabel}
      </button>
      <button type="button" className="btn btn-outline btn-sm" onClick={() => setArmed(false)}>
        Annuler
      </button>
    </span>
  )
}
