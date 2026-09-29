import { useEffect, useState } from 'react'
import { DEMO, resetDemo, setToken, setUnauthorizedHandler } from '../../api/client'
import type { Session } from '../../api/types'
import Wordmark from '../../components/Wordmark'
import Collections from './Collections'
import Dashboard from './Dashboard'
import Login from './Login'
import Products from './Products'
import Requests from './Requests'
import { loadSession, saveSession } from './session'
import Subscribers from './Subscribers'

type Section = 'dashboard' | 'products' | 'collections' | 'requests' | 'subscribers'

const menu: { key: Section; label: string }[] = [
  { key: 'dashboard', label: 'Tableau de bord' },
  { key: 'products', label: 'Articles' },
  { key: 'collections', label: 'Collections' },
  { key: 'requests', label: 'Demandes' },
  { key: 'subscribers', label: 'Newsletter' },
]

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(() => {
    const s = loadSession()
    setToken(s?.token ?? null)
    return s
  })
  const [section, setSection] = useState<Section>('dashboard')

  const logout = () => {
    saveSession(null)
    setToken(null)
    setSession(null)
  }

  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [])

  if (!session) {
    return (
      <Login
        onLogin={(s) => {
          saveSession(s)
          setToken(s.token)
          setSession(s)
        }}
      />
    )
  }

  return (
    <div className="bo">
      <aside className="bo-side">
        <div className="bo-brand">
          <Wordmark />
          <span>Espace créatrice{DEMO ? ' · démo' : ''}</span>
        </div>
        <nav className="bo-nav" aria-label="Backoffice">
          {menu.map((m) => (
            <button key={m.key} aria-current={section === m.key ? 'page' : undefined} onClick={() => setSection(m.key)}>
              {m.label}
            </button>
          ))}
        </nav>
        <div className="bo-side-foot">
          <a className="bo-back" href="#" target="_blank" rel="noreferrer">
            Voir le site
          </a>
          {DEMO && (
            <button
              className="bo-back"
              onClick={() => {
                resetDemo()
                setSection('dashboard')
                window.location.reload()
              }}
            >
              Réinitialiser la démo
            </button>
          )}
          <button className="bo-back" onClick={logout}>
            Se déconnecter
          </button>
        </div>
      </aside>

      <main className="bo-main">
        <header className="bo-top">
          <div>
            <p className="eyebrow">{session.name ?? session.email}</p>
            <h1 className="h2">{menu.find((m) => m.key === section)?.label}</h1>
          </div>
        </header>
        {section === 'dashboard' && <Dashboard go={setSection} />}
        {section === 'products' && <Products />}
        {section === 'collections' && <Collections />}
        {section === 'requests' && <Requests />}
        {section === 'subscribers' && <Subscribers />}
      </main>
    </div>
  )
}
