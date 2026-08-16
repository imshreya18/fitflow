import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Mail, Phone, ChevronLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function Auth() {
  const [mode, setMode] = useState('signup') // signup | login
  const [method, setMethod] = useState(null) // email | phone
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleContinue = (e) => {
    e.preventDefault()
    if (method === 'email' && !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    if (method === 'phone' && phone.replace(/\D/g, '').length < 7) {
      setError('Enter a valid phone number.')
      return
    }
    setError('')
    navigate(mode === 'signup' ? '/onboarding' : '/app/home')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center">
            <Leaf size={18} className="text-[var(--primary-fg)]" />
          </div>
          <span className="font-display font-bold text-lg">FitFlow</span>
        </Link>

        <h1 className="font-display text-2xl font-bold mb-1.5">
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-[var(--text-soft)] mb-8">
          {mode === 'signup' ? 'Start your FitFlow journey today.' : 'Log in to keep your streak alive.'}
        </p>

        {!method && (
          <div className="flex flex-col gap-3">
            <Button variant="outline" size="lg" className="justify-start" onClick={() => setMethod('email')}>
              <Mail size={18} /> Continue with Email
            </Button>
            <Button variant="outline" size="lg" className="justify-start" onClick={() => setMethod('phone')}>
              <Phone size={18} /> Continue with Phone
            </Button>
            <Button variant="outline" size="lg" className="justify-start" onClick={() => navigate(mode === 'signup' ? '/onboarding' : '/app/home')}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </Button>
          </div>
        )}

        {method === 'email' && (
          <form onSubmit={handleContinue} className="flex flex-col gap-4">
            <button type="button" onClick={() => { setMethod(null); setError('') }} className="flex items-center gap-1 text-sm text-[var(--text-soft)] -ml-1 mb-1">
              <ChevronLeft size={16} /> Back
            </button>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email address</label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={!!error} autoFocus />
              {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
            </div>
            <Button type="submit" size="lg">Continue</Button>
          </form>
        )}

        {method === 'phone' && (
          <form onSubmit={handleContinue} className="flex flex-col gap-4">
            <button type="button" onClick={() => { setMethod(null); setError('') }} className="flex items-center gap-1 text-sm text-[var(--text-soft)] -ml-1 mb-1">
              <ChevronLeft size={16} /> Back
            </button>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Phone number</label>
              <div className="flex gap-2">
                <select className="px-3 py-3 rounded-xl bg-[var(--surface-2)] border border-transparent text-sm outline-none focus:border-[var(--primary)]">
                  <option>+1</option>
                  <option>+44</option>
                  <option>+91</option>
                  <option>+61</option>
                </select>
                <Input type="tel" placeholder="(555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} error={!!error} className="flex-1" autoFocus />
              </div>
              {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
            </div>
            <Button type="submit" size="lg">Continue</Button>
          </form>
        )}

        <p className="text-center text-sm text-[var(--text-soft)] mt-8">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="font-semibold text-[var(--primary)]"
            onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setMethod(null); setError('') }}
          >
            {mode === 'signup' ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}
