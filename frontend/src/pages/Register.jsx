import { useState } from 'react'
import { api } from '../api/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
const [form, setForm] = useState({
  username: '',
  email: '',
  password: '',
  roleId: 1, // REQUIRED — backend will reject without this
  phoneNumber: '',
  address: {
    zip: '',
    country: '',
    street: '',
    province: ''
  }
})
  const { login } = useAuth()
  const nav = useNavigate()
  const [error, setError] = useState('')

  async function submit() {
    try {
      setError('')
      const res = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(form)
      })
      login(res)
      nav('/')
    } catch (e) {
      setError('Registration failed. Please try again.')
      console.log(e)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-display font-bold text-slate-900">Create your account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                onChange={e => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone Number</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
              />
            </div>
            <div>
  <label className="block text-sm font-medium text-slate-700">Street</label>
  <input
    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
    onChange={e =>
      setForm({
        ...form,
        address: { ...form.address, street: e.target.value }
      })
    }
  />
</div>

<div>
  <label className="block text-sm font-medium text-slate-700">Province</label>
  <input
    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
    onChange={e =>
      setForm({
        ...form,
        address: { ...form.address, province: e.target.value }
      })
    }
  />
</div>

<div>
  <label className="block text-sm font-medium text-slate-700">ZIP</label>
  <input
    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
    onChange={e =>
      setForm({
        ...form,
        address: { ...form.address, zip: e.target.value }
      })
    }
  />
</div>

<div>
  <label className="block text-sm font-medium text-slate-700">Country</label>
  <input
    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
    onChange={e =>
      setForm({
        ...form,
        address: { ...form.address, country: e.target.value }
      })
    }
  />
</div>

          </div>

          <button
            onClick={submit}
            className="group relative flex w-full justify-center rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  )
}