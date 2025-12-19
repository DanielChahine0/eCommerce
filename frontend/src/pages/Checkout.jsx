import { api } from '../api/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Checkout() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [success, setSuccess] = useState(false)

  async function submit() {
    // await api('/api/orders', {
    //   method: 'POST',
    //   body: JSON.stringify({ userId: user.id })
    // })

    setSuccess(true)
    setTimeout(() => nav('/'), 4000)
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
           <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
        <p className="text-slate-600">Thank you for your purchase. Redirecting you home...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100 mt-8">
      <div className="mb-8 border-b border-slate-100 pb-8">
         <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Checkout</h1>
         <p className="text-slate-600">Complete your purchase securely.</p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h2 className="font-bold text-slate-900 mb-2">Shipping Details</h2>
          <p className="text-slate-600">{user?.username || 'Guest User'}</p>
          <p className="text-slate-500 text-sm mt-1">Shipping address will be collected here in a real app.</p>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
           <h2 className="font-bold text-slate-900 mb-2">Payment Method</h2>
           <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-6 bg-slate-200 rounded"></div>
              <span>Ending in 4242</span>
           </div>
        </div>
      </div>

      <button 
        onClick={submit} 
        className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-200"
      >
        Confirm Order
      </button>
      <p className="text-center text-xs text-slate-400 mt-4">
        By placing this order, you agree to our Terms of Service.
      </p>
    </div>
  )
}