import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-center p-8">
      <div>
        <p className="text-8xl mb-6">🌸</p>
        <h1 className="font-display text-5xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">404</h1>
        <p className="text-zinc-500 mb-6">{t('notFound')}</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
          ← {t('goHome')}
        </Link>
      </div>
    </div>
  )
}
