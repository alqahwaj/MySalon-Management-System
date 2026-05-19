import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import api from '../api/axios'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

// تعديل دالة التحقق لتشمل جميع الشروط
function validate(form, t) {
  const e = {}
  if (!form.firstName.trim()) e.firstName = t('auth.errors.required')
  if (!form.lastName.trim()) e.lastName = t('auth.errors.required')
  
  if (!form.email.trim()) e.email = t('auth.errors.required')
  else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = t('auth.errors.invalidEmail')
  
  if (!form.password) e.password = t('auth.errors.required')
  else {
    if (form.password.length < 6) e.password = t('auth.errors.passwordMin')
    if (!/[A-Z]/.test(form.password)) e.password = t('auth.errors.passwordUpper')
    if (!/[^a-zA-Z0-9]/.test(form.password)) e.password = t('auth.errors.passwordSpecial')
  }
  return e
}

export default function Register() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const navigate = useNavigate()

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const v = validate(form, t)
    if (Object.keys(v).length) { setErrors(v); return }

    setLoading(true)
    setApiError('')
    try {
      const res = await api.post('/Auth/register-customer', form)
      login(res.data)
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message || t('auth.errors.registerFailed'))
    } finally {
      setLoading(false)
    }
  }

  // مصفوفة الشروط التفاعلية
  const passwordRules = [
    { id: 'length', text: t('auth.rules.min', '6 أحرف على الأقل'), met: form.password.length >= 6 },
    { id: 'upper', text: t('auth.rules.upper', 'حرف كبير واحد على الأقل (A-Z)'), met: /[A-Z]/.test(form.password) },
    { id: 'special', text: t('auth.rules.special', 'رمز واحد على الأقل (مثل @, #, $)'), met: /[^a-zA-Z0-9]/.test(form.password) }
  ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 py-10">
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
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl font-semibold text-zinc-900 dark:text-zinc-100">{t('brand', 'Lumière')}</h1>
          <p className="text-sm text-zinc-400 mt-1">Premium Salon Experience</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/60 dark:shadow-zinc-950/60 border border-zinc-100 dark:border-zinc-800 p-8">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{t('auth.registerTitle')}</h2>
          <p className="text-sm text-zinc-500 mb-7">{t('auth.registerSub')}</p>

          {apiError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              {apiError}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <Input id="firstName" name="firstName" label={t('auth.firstName')}
                placeholder="Jane" value={form.firstName} onChange={onChange} error={errors.firstName} />
              <Input id="lastName" name="lastName" label={t('auth.lastName')}
                placeholder="Doe" value={form.lastName} onChange={onChange} error={errors.lastName} />
            </div>
            
            <Input id="email" name="email" type="email" label={t('auth.email')}
              placeholder="jane@example.com" value={form.email} onChange={onChange} error={errors.email} autoComplete="email" />
            
            <Input id="phone" name="phone" type="tel" label={t('auth.phone')}
              placeholder="+1 555 000 0000" value={form.phone} onChange={onChange} />
            
            <div>
              <Input id="password" name="password" type="password" label={t('auth.password')}
                placeholder="********" value={form.password} onChange={onChange} error={errors.password} autoComplete="new-password" />
              
              {/* 🌟 قائمة شروط كلمة السر التفاعلية 🌟 */}
              <div className="mt-3 space-y-1.5 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                {passwordRules.map((rule) => (
                  <div key={rule.id} className="flex items-center gap-2 text-xs">
                    <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center border ${rule.met ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-300 dark:border-zinc-600 text-transparent'}`}>
                      {rule.met && '✓'}
                    </span>
                    <span className={`${rule.met ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-500 dark:text-zinc-500'}`}>
                      {rule.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full mt-2" size="lg" loading={loading}>
              {loading ? t('auth.registering') : t('auth.createAccount')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              {t('auth.signInLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}