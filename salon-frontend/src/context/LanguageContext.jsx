import { createContext, useContext, useEffect, useState } from 'react'
import i18n from '../i18n'

const LanguageContext = createContext({ language: 'en', setLanguage: () => {}, isRTL: false })

export function LanguageProvider({ children }) {
  const [language, setLang] = useState(
    () => localStorage.getItem('salon_lang') || 'en'
  )
  const isRTL = language === 'ar'

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', language)
    i18n.changeLanguage(language)
    localStorage.setItem('salon_lang', language)
  }, [language, isRTL])

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
