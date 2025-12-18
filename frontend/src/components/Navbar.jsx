import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, User, Menu, X, LayoutDashboard, LogOut } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const [cartCount, setCartCount] = useState(0)
  const [cart, setCart] = useState([])

  useEffect(() => {
    const shoppingCart = localStorage.getItem('shopping_cart')
    if (shoppingCart) {
      setCart(JSON.parse(shoppingCart))
      setCartCount(JSON.parse(shoppingCart).length)
    }
  }, [])

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { name: 'Shop', path: '/' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-3 transition-transform">
              <span className="font-bold text-xl">E</span>
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              Commerce<span className="text-indigo-600">Store</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path) ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-5">
              <Link to="/cart" className="relative group p-2">
                <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                <span className="absolute top-0 right-0 h-4 w-4 bg-indigo-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                  {/*  can eventually use /user/{userId}/count or get cart item count from session storage*/}
                  {cartCount}
                </span>
              </Link>

              {user ? (
                <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" title="Admin Dashboard">
                      <LayoutDashboard className="w-5 h-5 text-slate-500 hover:text-indigo-600" />
                    </Link>
                  )}
                  <button onClick={logout} title="Sign Out">
                    <LogOut className="w-5 h-5 text-slate-500 hover:text-red-600" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-indigo-50 shadow-sm">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Auth Actions */}
<div className="flex items-center gap-3">
  <Link 
    to="/login" 
    className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
  >
    Sign in
  </Link>
  
  <Link 
    to="/register" 
    className="inline-flex items-center justify-center bg-slate-900 px-5 py-2.5 rounded-full text-sm font-bold text-white hover:bg-slate-800 active:scale-95 transition-all shadow-sm hover:shadow-md"
  >
    Get Started
  </Link>
</div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/cart" className="block px-3 py-2 text-base font-medium text-slate-700">Cart</Link>
            <hr className="my-2 border-slate-100" />
            {!user ? (
              <div className="grid grid-cols-2 gap-3 p-2">
                <Link to="/login" className="text-center py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg">Login</Link>
                <Link to="/register" className="text-center py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg">Sign Up</Link>
              </div>
            ) : (
              <button onClick={logout} className="w-full text-left px-3 py-2 text-base font-medium text-red-600">Logout</button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}