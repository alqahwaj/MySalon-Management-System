import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import api from '../api/axios'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

function validate(email, password, t) {
  const errors = {}
  if (!email) errors.email = t('auth.errors.required')
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = t('auth.errors.invalidEmail')
  if (!password) errors.password = t('auth.errors.required')
  return errors
}

export default function Login() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const v = validate(form.email, form.password, t)
    if (Object.keys(v).length) { setErrors(v); return }

    setLoading(true)
    setApiError('')
    try {
      const res = await api.post('/Auth/login', form)
      
      login(res.data) 

      const userRole = res.data.role?.toLowerCase() || '';
      
      if (userRole === 'admin' || userRole === 'owner') {
        navigate('/settings') 
      } else {
        navigate('/dashboard')
      }

    } catch (err) {
      setApiError(err.response?.data?.message || t('auth.errors.loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      {/* Top-right controls */}
      <div className="fixed top-4 end-4 flex gap-2 z-10">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 transition-colors"
        >
          {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? t('theme.dark') : t('theme.light')}
        </button>
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 transition-colors"
        >
          🌐 {t('language.toggle')}
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl font-semibold text-zinc-900 dark:text-zinc-100">{t('brand')}</h1>
          <p className="text-sm text-zinc-400 mt-1">Premium Salon Experience</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/60 dark:shadow-zinc-950/60 border border-zinc-100 dark:border-zinc-800 p-8">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{t('auth.loginTitle')}</h2>
          <p className="text-sm text-zinc-500 mb-7">{t('auth.loginSub')}</p>

          {apiError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              {apiError}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Input
              id="email"
              name="email"
              type="email"
              label={t('auth.email')}
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              error={errors.email}
              autoComplete="email"
            />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('auth.password')}
                </label>
                <button type="button" className="text-xs text-primary hover:underline">
                  {t('auth.forgotPassword')}
                </button>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
                error={errors.password}
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full mt-2" size="lg" loading={loading}>
              {loading ? t('auth.loggingIn') : t('auth.signIn')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              {t('auth.createLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}