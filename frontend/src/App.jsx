import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import { useReduxInitializer } from './redux/reduxInitializer'
import CacheStatus from './components/CacheStatus'

const Catalog = lazy(() => import('./pages/Catalog'))
const SearchProduct = lazy(() => import('./pages/SearchProduct.jsx'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const ThankYou = lazy(() => import('./pages/ThankYou.jsx'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Admin = lazy(() => import('./pages/Admin'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Orders = lazy(() => import('./pages/Orders.jsx'))

import Footer from './components/Footer'

export default function App() {
  useReduxInitializer();
  const showCacheStatus = import.meta.env.DEV;

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        <Navbar />
        {showCacheStatus ? <CacheStatus /> : null}

        <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8 mx-auto pb-12 w-full">
          <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/search/:product_name" element={<SearchProduct />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}
