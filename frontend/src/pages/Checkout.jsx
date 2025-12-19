import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../redux/orders/orderActions'
import { clearLocalBasket } from '../redux/basket/basketActions'
import { CLEAR_BASKET_SUCCESS } from '../redux/basket/basketActionTypes'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../api/api'

export default function Checkout() {
  const { user } = useAuth()
  const nav = useNavigate()
  const dispatch = useDispatch()
  const basketItems = useSelector((state) => state.basket.items)
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
    console.group('🛒 Starting Checkout Process');
    console.log('User:', user ? `Authenticated (${user.username})` : 'Guest');
    console.log('Basket Items:', basketItems);
    console.groupEnd();
    
    try {
      setLoading(true)
      setError("")
      
      // Validate basket has items
      if (!basketItems || basketItems.length === 0) {
        console.warn('⚠️ Checkout attempted with empty basket');
        setError("Your basket is empty. Please add items before checkout.")
        setLoading(false)
        return
      }
      
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
        // Backend will automatically get items from user's basket
        const orderData = {
          userId: user.id,
          addressId: updatedUser.address.id
        }
        
        const order = await dispatch(createOrder(orderData))
        
        // After successful order, basket is cleared by backend
        // Refresh basket to reflect the empty state
        dispatch({ type: CLEAR_BASKET_SUCCESS })
        
        // Navigate to thank you page with order details
        nav('/thank-you', { 
          state: { 
            orderDetails: { 
              orderId: order?.id,
              guestEmail: user.email 
            } 
          } 
        })
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
        
        const order = await dispatch(createOrder(orderData))
        
        // After successful order, clear basket
        dispatch({ type: CLEAR_BASKET_SUCCESS })
        
        // Navigate to thank you page with order details
        nav('/thank-you', { 
          state: { 
            orderDetails: { 
              orderId: order?.id,
              guestEmail: guestEmail 
            } 
          } 
        })
      }
      
      console.group('✅ Checkout Successful');
      console.log('Navigating to thank you page');
      console.groupEnd();
    } catch (err) {
      console.group('❌ Checkout Failed');
      console.error('Error Type:', err.constructor.name);
      console.error('Error Message:', err.message);
      console.error('Error Stack:', err.stack);
      console.error('Full Error Object:', err);
      console.error('---');
      console.error('Troubleshooting Steps:');
      console.error('1. Check if backend server is running on http://localhost:8080');
      console.error('2. Check browser console for CORS errors');
      console.error('3. Verify network tab for request details');
      console.error('4. Check backend logs for errors');
      console.groupEnd();
      
      setError(err.response?.data?.message || err.message || "Checkout failed. Please try again.")
      setLoading(false)
    }
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