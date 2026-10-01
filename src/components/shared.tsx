import { type ReactNode } from 'react'
import { useApp, type ThemeColors } from '../context/AppContext'

// ─── KSUMC Header ─────────────────────────────────────────────────────────────
export function Header({
  mode = 'normal',
  onBack,
  step,
  totalSteps,
  flowLabel,
}: {
  mode?: 'normal' | 'emergency' | 'clinical'
  onBack?: () => void
  step?: number
  totalSteps?: number
  flowLabel?: string
}) {
  const { lang, setLang, isDark, setIsDark, t, theme, dir } = useApp()
  const isRTL = dir === 'rtl'
  const accentColor = mode === 'emergency' ? theme.danger : theme.primary

  return (
    <header
      style={{
        background: theme.card,
        borderBottom: `3px solid ${accentColor}`,
        boxShadow: isDark ? '0 2px 20px rgba(0,0,0,0.4)' : '0 2px 16px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '14px 24px' }}>
        {/* Main row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {/* KSUMC Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <KSUMCLogo isDark={isDark} />
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 14, color: theme.primary, letterSpacing: '-0.2px' }}>
                {t('header.title')}
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: 10, color: theme.textMuted, letterSpacing: '0.3px' }}>
                {t('header.subtitle')}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Language switcher */}
            <div style={{ display: 'flex', alignItems: 'center', background: theme.primaryLight, borderRadius: 20, border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
              <button
                onClick={() => setLang('ar')}
                style={{
                  padding: '5px 12px',
                  border: 'none',
                  background: lang === 'ar' ? theme.primary : 'transparent',
                  color: lang === 'ar' ? '#fff' : theme.primary,
                  fontFamily: 'Cairo, Inter',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                العربية
              </button>
              <div style={{ width: 1, height: 20, background: theme.border }} />
              <button
                onClick={() => setLang('en')}
                style={{
                  padding: '5px 12px',
                  border: 'none',
                  background: lang === 'en' ? theme.primary : 'transparent',
                  color: lang === 'en' ? '#fff' : theme.primary,
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                English
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                background: theme.primaryLight,
                border: `1px solid ${theme.border}`,
                borderRadius: 20,
                padding: '5px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: 12,
                color: theme.primary,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {isDark ? '☀ Light' : '☾ Dark'}
            </button>
          </div>
        </div>

        {/* Mode indicator + progress */}
        {mode !== 'normal' && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  background: mode === 'emergency' ? theme.dangerLight : theme.primaryLight,
                  color: mode === 'emergency' ? theme.danger : theme.primary,
                  border: `1px solid ${mode === 'emergency' ? '#FECACA' : theme.border}`,
                  borderRadius: 20,
                  padding: '3px 12px',
                  fontFamily: isRTL ? 'Cairo' : 'Plus Jakarta Sans',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase' as const,
                }}
              >
                {mode === 'emergency' ? t('header.emergency') : t('header.clinical')}
              </span>
              {flowLabel && (
                <span style={{ fontSize: 11, color: theme.textMuted }}>— {flowLabel}</span>
              )}
            </div>
            {step !== undefined && totalSteps !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: i <= step ? 20 : 6,
                        height: 5,
                        borderRadius: 3,
                        background:
                          i < step
                            ? mode === 'emergency' ? theme.danger : theme.primary
                            : i === step
                            ? mode === 'emergency' ? `${theme.danger}60` : `${theme.primary}60`
                            : theme.border,
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: theme.textMuted }}>
                  {step + 1}/{totalSteps}
                </span>
              </div>
            )}
          </div>
        )}

        {onBack && (
          <button
            onClick={onBack}
            style={{
              marginTop: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: theme.textMuted,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 0',
            }}
          >
            {t('header.back')}
          </button>
        )}
      </div>
    </header>
  )
}

// ─── KSUMC Logo ───────────────────────────────────────────────────────────────
export function KSUMCLogo({ isDark }: { isDark: boolean }) {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 13,
        background: 'linear-gradient(135deg, #0077B6 60%, #005f92 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 14px rgba(0,119,182,0.35)',
      }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" stroke="white" strokeWidth="1.5" fill="none" />
        <path d="M8 14h12M14 8v12" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="14" r="3" fill="white" />
      </svg>
    </div>
  )
}

// ─── Animated Eye ─────────────────────────────────────────────────────────────
export function AnimatedEye({ size = 120, color = '#0077B6', ringColor }: { size?: number; color?: string; ringColor?: string }) {
  const rc = ringColor || color
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size * 1.6, height: size }}>
      <div className="absolute animate-pulse-ring rounded-full" style={{ width: size * 1.4, height: size * 0.85, borderRadius: '50%', border: `2px solid ${rc}`, opacity: 0.35, position: 'absolute' }} />
      <svg width={size * 1.5} height={size * 0.9} viewBox="0 0 120 72" fill="none" className="animate-eye-blink" style={{ transformOrigin: 'center' }}>
        <ellipse cx="60" cy="36" rx="58" ry="34" fill="white" stroke={color} strokeWidth="2.5" />
        <circle cx="60" cy="36" r="20" fill={color} className="animate-pupil" style={{ transformOrigin: '60px 36px' }} />
        <circle cx="60" cy="36" r="11" fill="#001a33" className="animate-pupil" style={{ transformOrigin: '60px 36px' }} />
        <circle cx="52" cy="29" r="5" fill="white" opacity="0.85" className="animate-pupil" style={{ transformOrigin: '60px 36px' }} />
        <circle cx="60" cy="36" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" className="animate-pupil" style={{ transformOrigin: '60px 36px' }} />
      </svg>
    </div>
  )
}

// ─── Verification Badge ───────────────────────────────────────────────────────
export function VerificationBadge({ label, delay = 0, color }: { label: string; delay?: number; color?: string }) {
  const { theme } = useApp()
  const c = color || theme.primary
  return (
    <div className="animate-float-in" style={{ display: 'flex', alignItems: 'center', gap: 12, animationDelay: `${delay}ms`, opacity: 0 }}>
      <div
        className="animate-badge-pop"
        style={{
          width: 32, height: 32, borderRadius: '50%',
          background: c === theme.danger ? theme.dangerLight : theme.primaryLight,
          border: `2px solid ${c}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          animationDelay: `${delay + 200}ms`,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7L5.5 10L11.5 4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="80" className="animate-checkmark" style={{ animationDelay: `${delay + 400}ms` }} />
        </svg>
      </div>
      <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: theme.text }}>{label}</span>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style = {}, className = '' }: { children: ReactNode; style?: React.CSSProperties; className?: string }) {
  const { theme } = useApp()
  return (
    <div
      className={className}
      style={{
        background: theme.card,
        border: `1.5px solid ${theme.cardBorder}`,
        borderRadius: 24,
        padding: 28,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── BigButton ────────────────────────────────────────────────────────────────
export function BigButton({
  onClick, children, variant = 'primary', fullWidth = true, disabled = false, style = {},
}: {
  onClick: () => void; children: ReactNode; variant?: 'primary' | 'emergency' | 'ghost'; fullWidth?: boolean; disabled?: boolean; style?: React.CSSProperties;
}) {
  const { theme } = useApp()
  const bg = variant === 'emergency' ? theme.danger : theme.primary
  const textColor = variant === 'primary' || variant === 'emergency' ? '#fff' : theme.primary

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : undefined,
        background: variant === 'ghost' ? 'transparent' : bg,
        color: textColor,
        border: variant === 'ghost' ? `2px solid ${theme.primary}` : 'none',
        borderRadius: 16,
        padding: '18px 28px',
        fontFamily: 'Plus Jakarta Sans, Cairo',
        fontWeight: 700,
        fontSize: 17,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        boxShadow: variant === 'ghost' ? 'none' : `0 4px 16px ${bg}44`,
        transition: 'all 0.2s',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return
        ;(e.currentTarget as HTMLElement).style.opacity = '0.9'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.opacity = '1'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
    >
      {children}
    </button>
  )
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────
export function CountdownTimer({ seconds, label, color }: { seconds: 3 | 5; label: string; color?: string }) {
  const { theme } = useApp()
  const c = color || theme.primary
  const circumference = 2 * Math.PI * 45
  const animClass = seconds === 3 ? 'animate-countdown-3s' : 'animate-countdown-5s'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: 110, height: 110 }}>
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="45" fill="none" stroke={`${c}22`} strokeWidth="6" />
          <circle cx="55" cy="55" r="45" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset="0" transform="rotate(-90 55 55)" className={animClass} style={{ animationFillMode: 'forwards' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 26, color: c }}>{seconds}s</span>
        </div>
      </div>
      <span style={{ fontFamily: 'Inter', fontSize: 13, color: theme.textMuted, textAlign: 'center' }}>{label}</span>
    </div>
  )
}

// ─── Page Shell ───────────────────────────────────────────────────────────────
export function PageShell({ children }: { children: ReactNode }) {
  const { theme, isDark } = useApp()
  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDark
          ? `linear-gradient(160deg, ${theme.bg} 0%, #060F1E 100%)`
          : 'linear-gradient(160deg, #EEF5FB 0%, #E8F2FF 100%)',
        paddingBottom: 48,
      }}
    >
      {children}
    </div>
  )
}

// ─── Screen Container ─────────────────────────────────────────────────────────
export function ScreenContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`animate-float-in ${className}`} style={{ maxWidth: 660, margin: '0 auto', padding: '32px 24px' }}>
      {children}
    </div>
  )
}

// ─── Screen Title ─────────────────────────────────────────────────────────────
export function ScreenTitle({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: ReactNode }) {
  const { theme } = useApp()
  return (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      {icon && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>{icon}</div>}
      <h1 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 26, color: theme.text, lineHeight: 1.2, marginBottom: 8 }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontFamily: 'Inter, Cairo', fontSize: 15, color: theme.textMuted, lineHeight: 1.5, maxWidth: 460, margin: '0 auto' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ─── Input Field ──────────────────────────────────────────────────────────────
export function InputField({
  value, onChange, placeholder, icon, label,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; icon?: ReactNode; label: string;
}) {
  const { theme } = useApp()
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 600, fontSize: 13, color: theme.textMuted, marginBottom: 7 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: icon ? '15px 15px 15px 46px' : '15px',
            border: `2px solid ${theme.border}`,
            borderRadius: 13,
            fontFamily: 'Inter, Cairo',
            fontSize: 15,
            color: theme.text,
            background: theme.inputBg,
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = theme.primary }}
          onBlur={(e) => { e.currentTarget.style.borderColor = theme.border }}
        />
        {icon && (
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: theme.primary }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({ progress, color, label, done, doneLabel }: { progress: number; color?: string; label?: string; done?: boolean; doneLabel?: string }) {
  const { theme } = useApp()
  const c = color || theme.primary
  return (
    <div>
      {(label || doneLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 13, color: theme.textMuted }}>{label}</span>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 13, color: done ? '#22c55e' : c }}>
            {done ? (doneLabel || 'Complete ✓') : `${Math.round(progress)}%`}
          </span>
        </div>
      )}
      <div style={{ height: 7, background: `${c}22`, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: done ? '#22c55e' : `linear-gradient(90deg, ${c}, ${c}bb)`, borderRadius: 4, transition: 'width 0.06s' }} />
      </div>
    </div>
  )
}

// ─── Dark Canvas (for eye tracking area) ─────────────────────────────────────
export function DarkCanvas({ children, height = 200 }: { children: ReactNode; height?: number }) {
  return (
    <div style={{ background: '#050510', borderRadius: 18, overflow: 'hidden', position: 'relative', height }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,119,182,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,119,182,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="animate-scan" style={{ position: 'absolute', left: 0, right: 0, height: 1.5, background: 'rgba(0,119,182,0.5)', top: 0, zIndex: 2 }} />
      {children}
    </div>
  )
}
