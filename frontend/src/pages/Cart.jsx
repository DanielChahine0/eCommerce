import { useEffect, useState } from 'react'
import { api } from '../api/api'
import { Link } from 'react-router-dom'

export default function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Persist to Session: Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shopping_cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))

    api('/cart')
    .then(setCart)
    .finally(() => setLoading(false))
    } else {
      // If no local data, fallback to mock (or API)
      setCart([
        { id: 1, productId: 'p1', name: "Premium Wireless Headphones", price: 299, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
        { id: 2, productId: 'p2', name: "Minimalist Mechanical Keyboard", price: 150, quantity: 2, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200&h=200&fit=crop" }
      ])
    }
    setLoading(false)
  }, [])

  // 2. Persist to Session: Update localStorage whenever cart changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('shopping_cart', JSON.stringify(cart))
    }
  }, [cart, loading])

  // 3. Edit Quantity: Amount due updates immediately because 'total' is derived from state
  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  // 4. Remove Item
  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-xl" />

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
        <Link to="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Shopping Cart</h1>
        {/* 5. Go back to continue shopping */}
        <Link to="/" className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-2">
          ← Continue Shopping
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <ul className="divide-y divide-slate-100 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {cart.map(i => (
              <li key={i.id} className="p-6 flex items-center">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                  <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                </div>
                
                <div className="ml-6 flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium text-slate-900">{i.name}</h3>
                    <button 
                      onClick={() => removeItem(i.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {/* 6. Edit Controls */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(i.id, -1)}
                        className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border-r border-slate-200"
                      >-</button>
                      <span className="px-4 py-1 text-slate-900 font-medium">{i.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(i.id, 1)}
                        className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border-l border-slate-200"
                      >+</button>
                    </div>
                    <p className="text-lg font-bold text-slate-900">${(i.price * i.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h2 className="text-lg font-medium text-slate-900 mb-6">Order Summary</h2>
            <div className="py-4 flex items-center justify-between border-t border-slate-100">
              <dt className="text-base font-bold text-slate-900">Order Total</dt>
              {/* Amount due updates immediately because it depends on the 'cart' state */}
              <dd className="text-xl font-bold text-indigo-600">${total.toLocaleString()}</dd>
            </div>
            <Link to="/checkout" className="mt-6 w-full flex justify-center items-center px-6 py-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-all shadow-lg shadow-indigo-100">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}