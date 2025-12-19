import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { api } from '../api/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { mergeLocalBasketWithServer } from '../redux/basket/basketActions'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const dispatch = useDispatch()
  const nav = useNavigate()
  const [error, setError] = useState('')

  async function submit() {
    try {
      setError('')
      const res = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      login(res)
      
      // Merge local basket with server basket after login
      try {
        await dispatch(mergeLocalBasketWithServer(res.user.id))
      } catch (mergeError) {
        console.error('Failed to merge cart:', mergeError)
        // Continue with login even if merge fails
      }
      
      nav('/')
    } catch (e) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-display font-bold text-slate-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Or{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={submit}
            className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}