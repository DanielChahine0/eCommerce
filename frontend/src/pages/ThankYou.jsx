import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ThankYou() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [countdown, setCountdown] = useState(10)
  
  // Get order details from location state (if passed from checkout)
  const orderDetails = location.state?.orderDetails

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Redirect based on user status
          navigate(user ? '/orders' : '/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate, user])

  const handleContinueShopping = () => {
    navigate('/')
  }

  const handleViewOrders = () => {
    navigate('/orders')
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-12 text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="h-24 w-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Thank You Message */}
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
          Thank You!
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Your order has been successfully placed.
        </p>

        {/* Order Confirmation Details */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-slate-700">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">
                A confirmation email has been sent to{' '}
                <span className="font-semibold">
                  {user ? user.email : orderDetails?.guestEmail || 'your email'}
                </span>
              </p>
            </div>
            
            {orderDetails?.orderId && (
              <div className="pt-3 border-t border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Order Number</p>
                <p className="text-lg font-bold text-indigo-600">#{orderDetails.orderId}</p>
              </div>
            )}
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-indigo-50 rounded-2xl p-6 mb-8 border border-indigo-100">
          <h2 className="font-bold text-slate-900 mb-3 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            What's Next?
          </h2>
          <ul className="text-sm text-slate-700 space-y-2 text-left max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>We'll send you shipping updates via email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Your order will be processed within 1-2 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Expected delivery: 5-7 business days</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleContinueShopping}
            className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
          >
            Continue Shopping
          </button>
          {user && (
            <button
              onClick={handleViewOrders}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-200"
            >
              View Orders
            </button>
          )}
        </div>

        {/* Auto-redirect Notice */}
        <p className="text-sm text-slate-500">
          Automatically redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
        </p>
      </div>
    </div>
  )
}
