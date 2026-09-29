import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Header from './components/Header'
import { CartProvider } from './lib/cart'
import { CatalogProvider } from './lib/catalog'
import { useRoute } from './lib/router'
import AdminApp from './pages/admin/AdminApp'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Shop from './pages/Shop'

export default function App() {
  const route = useRoute()

  if (route.page === 'admin') return <AdminApp />

  return (
    <CatalogProvider>
      <CartProvider>
        <Header />
        {route.page === 'home' && <Home />}
        {route.page === 'collections' && (
          <Shop
            key={`${route.collection ?? ''}-${route.promo ?? ''}-${route.category ?? ''}`}
            collection={route.collection}
            promo={route.promo}
            category={route.category}
          />
        )}
        {route.page === 'product' && <ProductPage key={route.slug} slug={route.slug} />}
        <Footer />
        <CartDrawer />
      </CartProvider>
    </CatalogProvider>
  )
}
