import { useApp } from '../context/AppContext'
import { AnimatedEye, Header, PageShell } from '../components/shared'

interface Props {
  onEmergency: () => void
  onClinical: () => void
  onDashboard: () => void
}

export default function WelcomeScreen({ onEmergency, onClinical, onDashboard }: Props) {
  const { t, theme, isDark,dir } = useApp()
const isRTL = dir === 'rtl'
  const featureCheck = (label: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: theme.primaryLight, border: `1.5px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke={theme.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span style={{ fontFamily: 'Inter, Cairo', fontSize: 13, color: theme.textMuted }}>{label}</span>
    </div>
  )

  const emergencyChecks = (label: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: theme.dangerLight, border: `1.5px solid #FCA5A5`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke={theme.danger} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span style={{ fontFamily: 'Inter, Cairo', fontSize: 13, color: theme.textMuted }}>{label}</span>
    </div>
  )

  return (
    <PageShell>
      <Header />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>

        {/* Hero */}
        <div className="animate-float-in" style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <AnimatedEye size={80} color={theme.primary} />
          </div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 32, color: theme.text, lineHeight: 1.15, marginBottom: 10 }}>
            {t('welcome.title')}
          </h1>
          <p style={{ fontFamily: 'Inter, Cairo', fontSize: 16, color: theme.textMuted, lineHeight: 1.6, maxWidth: 460, margin: '0 auto' }}>
            {t('welcome.subtitle')}
          </p>
        </div>

        {/* Journey cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

          {/* Emergency */}
          <button
            onClick={onEmergency}
            className="card-hover"
            style={{
              background: theme.card,
              borderRadius: 26,
              border: `2.5px solid #FCA5A5`,
              padding: 30,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.25s ease',
              boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 20px rgba(220,38,38,0.08)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = theme.danger
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(220,38,38,0.2)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = '#FCA5A5'
              ;(e.currentTarget as HTMLElement).style.boxShadow = isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 20px rgba(220,38,38,0.08)'
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: '0 6px 18px rgba(220,38,38,0.35)' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="14" y="4" width="4" height="24" rx="2" fill="white" />
                <rect x="4" y="14" width="24" height="4" rx="2" fill="white" />
              </svg>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: theme.dangerLight, border: '1px solid #FECACA', borderRadius: 20, padding: '3px 10px', marginBottom: 12 }}>
              <div className="animate-pulse-ring-red" style={{ width: 7, height: 7, borderRadius: '50%', background: theme.danger }} />
              <span style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 11, color: theme.danger, letterSpacing: '0.5px', textTransform: 'uppercase' as const }}>
                {t('welcome.emergency.badge')}
              </span>
            </div>

            <h2 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 20, color: theme.text, marginBottom: 8 }}>
              {t('welcome.emergency.title')}
            </h2>
            <p style={{ fontFamily: 'Inter, Cairo', fontSize: 13, color: theme.textMuted, lineHeight: 1.5, marginBottom: 16 }}>
              {t('welcome.emergency.desc')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
              {emergencyChecks(t('welcome.emergency.feat1'))}
              {emergencyChecks(t('welcome.emergency.feat2'))}
              {emergencyChecks(t('welcome.emergency.feat3'))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 13, color: theme.danger }}>
                {t('welcome.emergency.cta')}
              </span>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: theme.danger, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7h9M8 3.5L11.5 7L8 10.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </button>

          {/* Clinical */}
          <button
            onClick={onClinical}
            className="card-hover"
            style={{
              background: theme.card,
              borderRadius: 26,
              border: `2.5px solid ${theme.border}`,
              padding: 30,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.25s ease',
              boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,119,182,0.06)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = theme.primary
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,119,182,0.18)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = theme.border
              ;(e.currentTarget as HTMLElement).style.boxShadow = isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,119,182,0.06)'
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #0077B6 0%, #005f92 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: '0 6px 18px rgba(0,119,182,0.35)' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="11" r="6" stroke="white" strokeWidth="2" />
                <path d="M5 28c0-6.1 4.9-10 11-10s11 3.9 11 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <rect x="20" y="5" width="10" height="12" rx="2" fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="1.5" />
                <path d="M23 9.5h4M23 12h3" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: theme.primaryLight, border: `1px solid ${theme.border}`, borderRadius: 20, padding: '3px 10px', marginBottom: 12 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: theme.primary }} />
              <span style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 11, color: theme.primary, letterSpacing: '0.5px', textTransform: 'uppercase' as const }}>
                {t('welcome.clinical.badge')}
              </span>
            </div>

            <h2 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 20, color: theme.text, marginBottom: 8 }}>
              {t('welcome.clinical.title')}
            </h2>
            <p style={{ fontFamily: 'Inter, Cairo', fontSize: 13, color: theme.textMuted, lineHeight: 1.5, marginBottom: 16 }}>
              {t('welcome.clinical.desc')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
              {featureCheck(t('welcome.clinical.feat1'))}
              {featureCheck(t('welcome.clinical.feat2'))}
              {featureCheck(t('welcome.clinical.feat3'))}
              {featureCheck(t('welcome.clinical.feat4'))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 13, color: theme.primary }}>
                {t('welcome.clinical.cta')}
              </span>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7h9M8 3.5L11.5 7L8 10.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Doctor Dashboard */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onDashboard}
            style={{
              background: theme.card,
              border: `1.5px solid ${theme.border}`,
              borderRadius: 16,
              padding: '14px 28px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.25)' : '0 2px 10px rgba(0,119,182,0.07)',
              transition: 'all 0.2s',
              flexDirection: isRTL ? 'row-reverse' : 'row',
            }}
            onMouseEnter={(e) => { ;(e.currentTarget as HTMLElement).style.borderColor = theme.primary }}
            onMouseLeave={(e) => { ;(e.currentTarget as HTMLElement).style.borderColor = theme.border }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0077B6, #005f92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="13" width="4" height="5" rx="1" fill="white" />
                <rect x="8" y="9" width="4" height="9" rx="1" fill="white" />
                <rect x="14" y="5" width="4" height="13" rx="1" fill="white" />
                <path d="M3 7l4-4 5 3 5-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 13, color: theme.primary }}>
                {t('welcome.dashboard.title')}
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: theme.textMuted }}>
                {t('welcome.dashboard.sub')}
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 4 }}>
              <path d="M5 3.5L8.5 7L5 10.5" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 11, color: theme.textMuted }}>
            🔒 {t('welcome.footer')}
          </span>
        </div>
      </div>
    </PageShell>
  )
}
