import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../redux/orders/orderActions'
import { clearBasket, clearLocalBasket } from '../redux/basket/basketActions'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../api/api'

export default function Checkout() {
  const { user } = useAuth()
  const nav = useNavigate()
  const dispatch = useDispatch()
  const basketItems = useSelector((state) => state.basket.items)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [guestEmail, setGuestEmail] = useState('')
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    province: '',
    zip: '',
    country: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')

  useEffect(() => {
    // Load user's existing address if available (for authenticated users)
    if (user && user.address) {
      setShippingAddress({
        street: user.address.street || '',
        province: user.address.province || '',
        zip: user.address.zip || '',
        country: user.address.country || ''
      })
    }
  }, [user])

  async function submit() {
    try {
      setLoading(true)
      setError("")
      
      if (user) {
        // Authenticated user checkout
        // First, update user's address
        const updateUserData = {
          username: user.username,
          email: user.email,
          roleId: user.role.id,
          phoneNumber: user.phoneNumber || '',
          address: shippingAddress
        }
        
        const updatedUser = await api(`/api/users/${user.id}`, {
          method: 'PUT',
          body: JSON.stringify(updateUserData)
        })
        
        // Create order with userId and addressId
        const orderData = {
          userId: user.id,
          addressId: updatedUser.address.id
        }
        
        await dispatch(createOrder(orderData))
      } else {
        // Guest checkout
        if (!guestEmail || !guestEmail.trim()) {
          setError("Email is required for checkout")
          setLoading(false)
          return
        }
        
        const orderData = {
          guestEmail: guestEmail,
          guestAddress: shippingAddress,
          items: basketItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
        
        await dispatch(createOrder(orderData))
        
        // Clear local basket for guest users
        dispatch(clearLocalBasket())
      }
      
      setSuccess(true)
      setTimeout(() => nav(user ? '/orders' : '/'), 3000)
    } catch (err) {
      setError(err.message || "Failed to create order. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
           <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
        <p className="text-slate-600">Thank you for your purchase. Redirecting to your orders...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100 mt-8">
      <div className="mb-8 border-b border-slate-100 pb-8">
         <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Checkout</h1>
         <p className="text-slate-600">Complete your purchase securely.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6 mb-8">
        {!user && (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-4">Contact Information</h2>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
            />
            <p className="text-xs text-slate-500 mt-2">We'll send your order confirmation to this email</p>
          </div>
        )}
        
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h2 className="font-bold text-slate-900 mb-4">Shipping Details</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Street Address"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              value={shippingAddress.street}
              onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Province/State"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                value={shippingAddress.province}
                onChange={(e) => setShippingAddress({...shippingAddress, province: e.target.value})}
              />
              <input
                type="text"
                placeholder="ZIP Code"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                value={shippingAddress.zip}
                onChange={(e) => setShippingAddress({...shippingAddress, zip: e.target.value})}
              />
            </div>
            <input
              type="text"
              placeholder="Country"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
            />
          </div>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
           <h2 className="font-bold text-slate-900 mb-2">Payment Method</h2>
           <select
             className="w-full px-4 py-2 border border-slate-300 rounded-lg"
             value={paymentMethod}
             onChange={(e) => setPaymentMethod(e.target.value)}
           >
             <option value="CREDIT_CARD">Credit Card</option>
             <option value="PAYPAL">PayPal</option>
             <option value="DEBIT_CARD">Debit Card</option>
           </select>
        </div>
      </div>

      <button 
        onClick={submit} 
        disabled={loading || !shippingAddress.street || !shippingAddress.province || !shippingAddress.zip || !shippingAddress.country || (!user && !guestEmail)}
        className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Confirm Order"}
      </button>
      <p className="text-center text-xs text-slate-400 mt-4">
        By placing this order, you agree to our Terms of Service.
      </p>
    </div>
  )
}