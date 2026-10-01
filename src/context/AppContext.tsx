import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'ar'

interface AppContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  isDark: boolean
  setIsDark: (v: boolean) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
  theme: ThemeColors
}

export interface ThemeColors {
  bg: string
  card: string
  cardBorder: string
  text: string
  textMuted: string
  primary: string
  primaryLight: string
  primaryDark: string
  primaryText: string
  danger: string
  dangerLight: string
  success: string
  successLight: string
  border: string
  inputBg: string
  overlay: string
}

const lightTheme: ThemeColors = {
  bg: '#EEF5FB',
  card: '#FFFFFF',
  cardBorder: '#D0E4F2',
  text: '#0A1628',
  textMuted: '#4A6280',
  primary: '#0077B6',
  primaryLight: '#E0F0F8',
  primaryDark: '#005f92',
  primaryText: '#FFFFFF',
  danger: '#DC2626',
  dangerLight: '#FEF2F2',
  success: '#0077B6',
  successLight: '#E0F0F8',
  border: '#D0E4F2',
  inputBg: '#F8FBFF',
  overlay: 'rgba(255,255,255,0.95)',
}

const darkTheme: ThemeColors = {
  bg: '#060F1E',
  card: '#0D1F35',
  cardBorder: '#1B3255',
  text: '#EEF5FF',
  textMuted: '#7FA8C8',
  primary: '#38BDF8',
  primaryLight: '#0C2A40',
  primaryDark: '#0EA5E9',
  primaryText: '#060F1E',
  danger: '#F87171',
  dangerLight: '#2D1010',
  success: '#38BDF8',
  successLight: '#0C2A40',
  border: '#1B3255',
  inputBg: '#0A1628',
  overlay: 'rgba(6,15,30,0.95)',
}

import { translations } from '../i18n/translations'

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const [isDark, setIsDark] = useState(false)

  const t = (key: string): string => {
    return translations[lang]?.[key] ?? translations['en']?.[key] ?? key
  }

  const theme = isDark ? darkTheme : lightTheme

  return (
    <AppContext.Provider value={{ lang, setLang, isDark, setIsDark, t, dir: lang === 'ar' ? 'rtl' : 'ltr', theme }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
