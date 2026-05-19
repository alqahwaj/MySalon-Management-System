import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import { useTranslation } from 'react-i18next'

function NavItem({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
        ${isActive
          ? 'bg-primary/10 text-primary dark:bg-primary/20'
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      {label}
    </NavLink>
  )
}

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()

  const role = user?.role?.toLowerCase()

  const navByRole = {
    admin: [
      { to: '/dashboard',    icon: '📊', label: t('nav.dashboard') },
      { to: '/admin-bookings', icon: '📋', label: t('nav.adminBookings') }, 
      { to: '/settings', icon: '⚙️', label: t('nav.settings') },    ],
    stylist: [
      { to: '/dashboard',    icon: '📊', label: t('nav.dashboard') },
      { to: '/my-schedule', icon: '🗓️', label: t('nav.schedule') },
    ],
    customer: [
      { to: '/dashboard',    icon: '🏠', label: t('nav.dashboard') },
      { to: '/book',         icon: '✂️',  label: t('nav.book') },
      { to: '/appointments', icon: '📅', label: t('nav.appointments') },
    ],
  }

  const navItems = navByRole[role] || navByRole['customer']
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()

  return (
    <aside className="h-full flex flex-col bg-white dark:bg-zinc-900 border-e border-zinc-100 dark:border-zinc-800">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
        <span className="font-display text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">
          {t('brand')}
        </span>
        <p className="text-xs text-zinc-400 mt-0.5 capitalize">{role || 'Customer'} Portal</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={onClose} />
        ))}
      </nav>

      {/* Bottom controls */}
      <div className="px-4 pb-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
        {/* Theme + Language row */}
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            {theme === 'light' ? '🌙' : '☀️'}
            <span>{theme === 'light' ? t('theme.dark') : t('theme.light')}</span>
          </button>
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
          >
            🌐 {t('language.toggle')}
          </button>
        </div>

        {/* User info + Logout */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold shrink-0">
            {initials || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-zinc-400 capitalize">{role || 'customer'}</p>
          </div>
          <button
            onClick={logout}
            title={t('nav.signOut')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}