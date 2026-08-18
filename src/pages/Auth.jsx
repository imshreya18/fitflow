import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Leaf,
  Mail,
  Phone,
  ChevronLeft,
} from 'lucide-react'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

import {
  login,
  signup,
  sendPhoneOtp,
  verifyPhoneOtp,
  getGoogleAuthUrl,
} from '../lib/api'


export default function Auth() {
  const [mode, setMode] = useState('signup')
  const [method, setMethod] = useState(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+91')

  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()


  // ==================================================
  // CLEAR MESSAGES
  // ==================================================

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }


  // ==================================================
  // EMAIL AUTH
  // ==================================================

  const handleEmailAuth = async () => {
    clearMessages()

    if (mode === 'signup' && !name.trim()) {
      setError('Enter your name.')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }

    if (!password) {
      setError(
        mode === 'signup'
          ? 'Create a password.'
          : 'Enter your password.'
      )
      return
    }

    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      let data

      if (mode === 'signup') {
        data = await signup(
          name.trim(),
          email,
          password
        )

        console.log('Signup successful:', data)

        if (data?.requires_confirmation) {
          setSuccess(
            'Account created successfully. Please verify your email, then log in.'
          )

          setMode('login')
          setPassword('')

          return
        }

        navigate('/onboarding')
      } else {
        data = await login(
          email,
          password
        )

        console.log('Login successful:', data)

        navigate('/app/home')
      }

    } catch (err) {
      console.error('Email authentication error:', err)

      setError(
        err?.message ||
        'Unable to complete authentication.'
      )
    } finally {
      setLoading(false)
    }
  }


  // ==================================================
  // PHONE OTP
  // ==================================================

  const fullPhoneNumber = () => {
    const digits = phone.replace(/\D/g, '')

    if (!digits) {
      return ''
    }

    return `${countryCode}${digits}`
  }


  const handleSendPhoneOtp = async () => {
    clearMessages()

    const digits = phone.replace(/\D/g, '')

    if (mode === 'signup' && !name.trim()) {
      setError('Enter your name.')
      return
    }

    if (digits.length < 7) {
      setError('Enter a valid phone number.')
      return
    }

    setLoading(true)

    try {
      const fullPhone = fullPhoneNumber()

      const data = await sendPhoneOtp(fullPhone)

      console.log('Phone OTP sent:', data)

      setOtpSent(true)

      setSuccess(
        'OTP sent successfully. Check your phone.'
      )

    } catch (err) {
      console.error('Phone OTP error:', err)

      setError(
        err?.message ||
        'Unable to send OTP.'
      )
    } finally {
      setLoading(false)
    }
  }


  const handleVerifyPhoneOtp = async () => {
    clearMessages()

    if (!otp || otp.length < 4) {
      setError('Enter the OTP you received.')
      return
    }

    setLoading(true)

    try {
      const fullPhone = fullPhoneNumber()

      const data = await verifyPhoneOtp(
        fullPhone,
        otp,
        mode === 'signup'
          ? name
          : ''
      )

      console.log(
        'Phone authentication successful:',
        data
      )

      navigate(
        mode === 'signup'
          ? '/onboarding'
          : '/app/home'
      )

    } catch (err) {
      console.error(
        'Phone verification error:',
        err
      )

      setError(
        err?.message ||
        'Invalid or expired OTP.'
      )
    } finally {
      setLoading(false)
    }
  }


  // ==================================================
  // GOOGLE AUTH
  // ==================================================

  const handleGoogleAuth = async () => {
    clearMessages()

    setLoading(true)

    try {
      const data = await getGoogleAuthUrl()

      if (!data?.url) {
        throw new Error(
          'Google authentication URL was not returned.'
        )
      }

      window.location.href = data.url

    } catch (err) {
      console.error(
        'Google authentication error:',
        err
      )

      setError(
        err?.message ||
        'Unable to start Google authentication.'
      )

      setLoading(false)
    }
  }


  // ==================================================
  // MAIN CONTINUE HANDLER
  // ==================================================

  const handleContinue = async (e) => {
    e.preventDefault()

    if (method === 'email') {
      await handleEmailAuth()
      return
    }

    if (method === 'phone') {
      if (!otpSent) {
        await handleSendPhoneOtp()
      } else {
        await handleVerifyPhoneOtp()
      }

      return
    }
  }


  // ==================================================
  // SWITCH LOGIN / SIGNUP
  // ==================================================

  const switchMode = () => {
    setMode(
      mode === 'signup'
        ? 'login'
        : 'signup'
    )

    setMethod(null)

    setName('')
    setPassword('')

    setPhone('')
    setOtp('')
    setOtpSent(false)

    clearMessages()
  }


  // ==================================================
  // BACK
  // ==================================================

  const goBack = () => {
    setMethod(null)
    setOtp('')
    setOtpSent(false)
    clearMessages()
  }


  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-10"
      style={{
        background: 'var(--bg)',
      }}
    >
      <div className="w-full max-w-sm">


        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8"
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center">
            <Leaf
              size={18}
              className="text-[var(--primary-fg)]"
            />
          </div>

          <span className="font-display font-bold text-lg">
            FitFlow
          </span>
        </Link>


        {/* ==================================================
            TITLE
        ================================================== */}

        <h1 className="font-display text-2xl font-bold mb-1.5">
          {mode === 'signup'
            ? 'Create your account'
            : 'Welcome back'}
        </h1>

        <p className="text-[var(--text-soft)] mb-8">
          {mode === 'signup'
            ? 'Start your FitFlow journey today.'
            : 'Log in to keep your streak alive.'}
        </p>


        {/* ==================================================
            AUTH METHOD SELECTION
        ================================================== */}

        {!method && (
          <div className="flex flex-col gap-3">


            {/* EMAIL */}

            <Button
              variant="outline"
              size="lg"
              className="justify-start"
              onClick={() => {
                setMethod('email')
                clearMessages()
              }}
              disabled={loading}
            >
              <Mail size={18} />

              {mode === 'signup'
                ? 'Continue with Email'
                : 'Log in with Email'}
            </Button>


            {/* PHONE */}

            <Button
              variant="outline"
              size="lg"
              className="justify-start"
              onClick={() => {
                setMethod('phone')
                setOtpSent(false)
                clearMessages()
              }}
              disabled={loading}
            >
              <Phone size={18} />

              {mode === 'signup'
                ? 'Continue with Phone'
                : 'Log in with Phone'}
            </Button>


            {/* GOOGLE */}

            <Button
              variant="outline"
              size="lg"
              className="justify-start"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <span className="font-bold text-blue-500">
                G
              </span>

              {mode === 'signup'
                ? 'Continue with Google'
                : 'Log in with Google'}
            </Button>


            {/* ERROR */}

            {error && (
              <p className="text-xs text-red-500 mt-2">
                {error}
              </p>
            )}


            {/* SUCCESS */}

            {success && (
              <p className="text-xs text-green-600 mt-2">
                {success}
              </p>
            )}

          </div>
        )}


        {/* ==================================================
            EMAIL FORM
        ================================================== */}

        {method === 'email' && (
          <form
            onSubmit={handleContinue}
            className="flex flex-col gap-4"
          >


            {/* BACK */}

            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1 text-sm text-[var(--text-soft)] -ml-1 mb-1"
            >
              <ChevronLeft size={16} />

              Back
            </button>


            {/* NAME */}

            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Your name
                </label>

                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    clearMessages()
                  }}
                  error={!!error}
                  autoFocus
                />
              </div>
            )}


            {/* EMAIL */}

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Email address
              </label>

              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  clearMessages()
                }}
                error={!!error}
                autoFocus={mode === 'login'}
              />
            </div>


            {/* PASSWORD */}

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Password
              </label>

              <Input
                type="password"
                placeholder={
                  mode === 'signup'
                    ? 'Create a password'
                    : 'Enter your password'
                }
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  clearMessages()
                }}
                error={!!error}
              />

              {mode === 'signup' && (
                <p className="text-xs text-[var(--text-soft)] mt-1.5">
                  Password must be at least 6 characters.
                </p>
              )}
            </div>


            {/* ERROR */}

            {error && (
              <p className="text-xs text-red-500">
                {error}
              </p>
            )}


            {/* SUCCESS */}

            {success && (
              <p className="text-xs text-green-600">
                {success}
              </p>
            )}


            {/* SUBMIT */}

            <Button
              type="submit"
              size="lg"
              disabled={loading}
            >
              {loading
                ? mode === 'signup'
                  ? 'Creating account...'
                  : 'Logging in...'
                : mode === 'signup'
                  ? 'Create Account'
                  : 'Log In'}
            </Button>

          </form>
        )}


        {/* ==================================================
            PHONE FORM
        ================================================== */}

        {method === 'phone' && (
          <form
            onSubmit={handleContinue}
            className="flex flex-col gap-4"
          >


            {/* BACK */}

            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1 text-sm text-[var(--text-soft)] -ml-1 mb-1"
            >
              <ChevronLeft size={16} />

              Back
            </button>


            {/* NAME */}

            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Your name
                </label>

                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    clearMessages()
                  }}
                  error={!!error}
                  autoFocus
                />
              </div>
            )}


            {/* PHONE */}

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Phone number
              </label>

              <div className="flex gap-2">

                <select
                  value={countryCode}
                  onChange={(e) => {
                    setCountryCode(e.target.value)
                    clearMessages()
                  }}
                  className="px-3 py-3 rounded-xl bg-[var(--surface-2)] border border-transparent text-sm outline-none focus:border-[var(--primary)]"
                  disabled={otpSent}
                >
                  <option value="+91">
                    +91
                  </option>

                  <option value="+1">
                    +1
                  </option>

                  <option value="+44">
                    +44
                  </option>

                  <option value="+61">
                    +61
                  </option>
                </select>


                <Input
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    clearMessages()
                  }}
                  error={!!error}
                  className="flex-1"
                  autoFocus={mode === 'login'}
                  disabled={otpSent}
                />

              </div>
            </div>


            {/* OTP */}

            {otpSent && (
              <div>

                <label className="text-sm font-medium mb-1.5 block">
                  Verification code
                </label>

                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => {
                    setOtp(
                      e.target.value.replace(
                        /\D/g,
                        ''
                      )
                    )

                    clearMessages()
                  }}
                  error={!!error}
                  autoFocus
                />

                <button
                  type="button"
                  onClick={handleSendPhoneOtp}
                  className="text-xs font-semibold text-[var(--primary)] mt-2"
                  disabled={loading}
                >
                  Resend OTP
                </button>

              </div>
            )}


            {/* ERROR */}

            {error && (
              <p className="text-xs text-red-500">
                {error}
              </p>
            )}


            {/* SUCCESS */}

            {success && (
              <p className="text-xs text-green-600">
                {success}
              </p>
            )}


            {/* BUTTON */}

            <Button
              type="submit"
              size="lg"
              disabled={loading}
            >
              {loading
                ? otpSent
                  ? 'Verifying...'
                  : 'Sending OTP...'
                : otpSent
                  ? 'Verify OTP'
                  : 'Send OTP'}
            </Button>

          </form>
        )}


        {/* ==================================================
            SWITCH LOGIN / SIGNUP
        ================================================== */}

        <p className="text-center text-sm text-[var(--text-soft)] mt-8">

          {mode === 'signup'
            ? 'Already have an account?'
            : "Don't have an account?"}

          {' '}

          <button
            type="button"
            className="font-semibold text-[var(--primary)]"
            onClick={switchMode}
          >
            {mode === 'signup'
              ? 'Log In'
              : 'Sign Up'}
          </button>

        </p>

      </div>
    </div>
  )
}