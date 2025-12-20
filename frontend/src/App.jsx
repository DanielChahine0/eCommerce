import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Catalog from './pages/Catalog'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import { AuthProvider } from './context/AuthContext'
import Profile from './pages/Profile.jsx'
import Orders from './pages/Orders.jsx'
import SearchProduct from './pages/SearchProduct.jsx'
import ThankYou from './pages/ThankYou.jsx'
import { useReduxInitializer } from './redux/reduxInitializer'
import AdminRoute from './components/AdminRoute.jsx'
import UserRoute from './components/UserRoute.jsx'

import Footer from './components/Footer'

export default function App() {
  useReduxInitializer();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        <Navbar />

        <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8 mx-auto pb-12 w-full">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/search/:name" element={<SearchProduct />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
            <Route element={<UserRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}