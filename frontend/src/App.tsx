import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Header from './components/Header'
import { CartProvider } from './lib/cart'
import { useRoute } from './lib/router'
import Backoffice from './pages/Backoffice'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Shop from './pages/Shop'

const reviewLinks = [
  { href: '#', label: 'Accueil', page: 'home' },
  { href: '#collections', label: 'Boutique', page: 'collections' },
  { href: '#produit-grand-boubou-laterite', label: 'Produit', page: 'product' },
  { href: '#backoffice', label: 'Backoffice', page: 'backoffice' },
]

export default function App() {
  const route = useRoute()
  return (
    <CartProvider>
      {route.page === 'backoffice' ? (
        <Backoffice />
      ) : (
        <>
          <Header />
          {route.page === 'home' && <Home />}
          {route.page === 'collections' && <Shop key={route.collection ?? 'all'} collection={route.collection} />}
          {route.page === 'product' && <ProductPage key={route.slug} slug={route.slug} />}
          <Footer />
          <CartDrawer />
        </>
      )}
      {/* Barre de navigation de la maquette, retirée en production */}
      <nav className="review-bar" aria-label="Pages de la maquette">
        <span className="review-label">Maquette</span>
        {reviewLinks.map((l) => (
          <a key={l.label} href={l.href} aria-current={route.page === l.page ? 'page' : undefined}>
            {l.label}
          </a>
        ))}
      </nav>
    </CartProvider>
  )
}
