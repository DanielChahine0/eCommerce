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
  phoneNumber: ''
})
  const { login } = useAuth()
  const nav = useNavigate()
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState(null)

  async function submit(event) {
    event.preventDefault()
    try {
      setError('')
      setValidationErrors(null)
      
      // Build the request payload
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        roleId: form.roleId,
        phoneNumber: form.phoneNumber
      }
      
      // Only include address if all required fields are filled with non-empty values
      if (form.street?.trim() && form.province?.trim() && form.zip?.trim() && form.country?.trim()) {
        payload.address = {
          street: form.street.trim(),
          province: form.province.trim(),
          zip: form.zip.trim(),
          country: form.country.trim()
        }
      }
      
      console.log('Submitting registration with payload:', payload)
      
      const res = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      login(res)
      nav('/')
    } catch (e) {
      const errorMessage = e.message || 'Registration failed. Please try again.'
      setError(errorMessage)
      if (e.validationErrors) {
        setValidationErrors(e.validationErrors)
      }
      console.error('Registration error:', e)
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

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            <div className="font-medium">{error}</div>
            {validationErrors && (
              <ul className="mt-2 list-disc list-inside text-xs">
                {Object.entries(validationErrors).map(([field, message]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
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
    onChange={e => setForm({ ...form, street: e.target.value })}
  />
</div>

<div>
  <label className="block text-sm font-medium text-slate-700">Province</label>
  <input
    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
    onChange={e => setForm({ ...form, province: e.target.value })}
  />
</div>

<div>
  <label className="block text-sm font-medium text-slate-700">ZIP</label>
  <input
    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
    onChange={e => setForm({ ...form, zip: e.target.value })}
  />
</div>

<div>
  <label className="block text-sm font-medium text-slate-700">Country</label>
  <input
    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
    onChange={e => setForm({ ...form, country: e.target.value })}
  />
</div>

          </div>

          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}
