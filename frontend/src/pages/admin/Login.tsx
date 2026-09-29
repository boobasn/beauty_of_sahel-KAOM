import { useState } from 'react'
import { api, ApiError, DEMO } from '../../api/client'
import type { Session } from '../../api/types'
import Wordmark from '../../components/Wordmark'

export default function Login({ onLogin }: { onLogin: (s: Session) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  return (
    <main className="login">
      <form
        className="login-card"
        onSubmit={(e) => {
          e.preventDefault()
          setSending(true)
          setError(null)
          api
            .login(email, password)
            .then(onLogin)
            .catch((err) => setError(err instanceof ApiError ? err.message : 'Connexion impossible'))
            .finally(() => setSending(false))
        }}
      >
        <Wordmark />
        <h1 className="h2">Espace créatrice</h1>
        <p className="muted">Connectez-vous pour gérer les articles, les collections et les demandes.</p>
        {DEMO && <p className="form-note">Version de démonstration : n’importe quel e-mail et un mot de passe de 4 caractères suffisent.</p>}
        <label className="field">
          <span>E-mail</span>
          <input id="login-email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          <span>Mot de passe</span>
          <input id="login-password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && (
          <p className="form-note form-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-dark btn-block" type="submit" disabled={sending}>
          {sending ? 'Connexion…' : 'Se connecter'}
        </button>
        <a className="link-underline" href="#">
          Retour au site
        </a>
      </form>
    </main>
  )
}
