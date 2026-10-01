import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import {
  Header, PageShell, ScreenContainer, ScreenTitle,
  AnimatedEye, VerificationBadge, CountdownTimer,
  Card, BigButton, ProgressBar, DarkCanvas,
} from '../components/shared'

type EStep = 0 | 1 | 2 | 3 | 4

interface Props { onBack: () => void }

export default function EmergencyFlow({ onBack }: Props) {
  const { t } = useApp()
  const [step, setStep] = useState<EStep>(0)
  const next = () => setStep((s) => Math.min(s + 1, 4) as EStep)

  const screens: Record<EStep, React.ReactNode> = {
    0: <E1Start onNext={next} />,
    1: <E2Calibration onNext={next} />,
    2: <E3Permission onNext={next} />,
    3: <E4Signature onNext={next} />,
    4: <E5Complete onBack={onBack} />,
  }

  return (
    <PageShell>
      <Header mode="emergency" onBack={onBack} step={step} totalSteps={5} flowLabel="Emergency Eye Signature" />
      {screens[step]}
    </PageShell>
  )
}

// ─── E1: Start ────────────────────────────────────────────────────────────────
function E1Start({ onNext }: { onNext: () => void }) {
  const { t, theme } = useApp()

  return (
    <ScreenContainer>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', marginBottom: 22 }}>
          <div className="animate-pulse-ring-red" style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(220,38,38,0.07)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 36px rgba(220,38,38,0.4)', position: 'relative', zIndex: 1 }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <rect x="20" y="5" width="4" height="34" rx="2" fill="white" />
              <rect x="5" y="20" width="34" height="4" rx="2" fill="white" />
            </svg>
          </div>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: theme.dangerLight, border: '1px solid #FCA5A5', borderRadius: 20, padding: '5px 14px', marginBottom: 14 }}>
          <div className="animate-pulse-ring-red" style={{ width: 9, height: 9, borderRadius: '50%', background: theme.danger }} />
          <span style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 12, color: theme.danger, letterSpacing: '0.4px', textTransform: 'uppercase' as const }}>
            {t('header.emergency')}
          </span>
        </div>

        <h1 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 30, color: theme.text, marginBottom: 10 }}>
          {t('em.title')}
        </h1>
        <p style={{ fontFamily: 'Inter, Cairo', fontSize: 15, color: theme.textMuted, lineHeight: 1.6, maxWidth: 400, margin: '0 auto 22px' }}>
          {t('em.subtitle')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 28 }}>
          {[
            { icon: '⚡', label: t('common.fast'), sub: t('common.fast.sub') },
            { icon: '👁️', label: t('common.points'), sub: t('common.points.sub') },
            { icon: '🔒', label: t('common.secure'), sub: t('common.secure.sub') },
          ].map((item) => (
            <div key={item.label} style={{ background: theme.dangerLight, border: '1px solid #FECACA', borderRadius: 14, padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{item.icon}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 12, color: theme.danger }}>{item.label}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: theme.textMuted }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <BigButton onClick={onNext} variant="emergency" style={{ fontSize: 18, padding: '20px', borderRadius: 18 }}>
        {t('em.start')}
      </BigButton>
      <p style={{ textAlign: 'center', fontFamily: 'Inter, Cairo', fontSize: 12, color: theme.textMuted, marginTop: 12 }}>
        {t('em.logged')}
      </p>
    </ScreenContainer>
  )
}

// ─── E2: Quick Calibration ────────────────────────────────────────────────────
function E2Calibration({ onNext }: { onNext: () => void }) {
  const { t, theme } = useApp()
  const [progress, setProgress] = useState(0)
  const [calibrated, setCalibrated] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setCalibrated(true); return 100 }
        return p + 2
      })
    }, 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <ScreenContainer>
      <ScreenTitle title={t('em.calibrate.title')} subtitle={t('em.calibrate.subtitle')} icon={<AnimatedEye size={70} color={theme.danger} ringColor={theme.danger} />} />

      <Card style={{ marginBottom: 20 }}>
        <DarkCanvas height={160}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '40px 40px', height: '100%', boxSizing: 'border-box', position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div className="em-dot-1" style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(220,38,38,0.2)', border: '2px solid rgba(220,38,38,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: theme.danger }} />
              </div>
              <span style={{ fontFamily: 'Inter', fontSize: 10, color: '#555' }}>1</span>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <div style={{ height: 1, flex: 1, background: 'rgba(220,38,38,0.2)' }} />
              <span style={{ color: theme.danger, fontSize: 16, opacity: 0.5 }}>👁️</span>
              <div style={{ height: 1, flex: 1, background: 'rgba(220,38,38,0.2)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div className="em-dot-2" style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(220,38,38,0.2)', border: '2px solid rgba(220,38,38,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: theme.danger }} />
              </div>
              <span style={{ fontFamily: 'Inter', fontSize: 10, color: '#555' }}>2</span>
            </div>

            <div className="animate-cursor-em" style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: 'rgba(220,38,38,0.9)', border: '2px solid white', boxShadow: '0 0 12px rgba(220,38,38,0.8)', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
          </div>
        </DarkCanvas>

        <div style={{ marginTop: 16 }}>
          <ProgressBar progress={progress} color={theme.danger} label={t('em.calibrate.progress')} done={calibrated} doneLabel={t('em.calibrate.complete')} />
        </div>

        <div style={{ marginTop: 14, padding: '12px 14px', background: calibrated ? '#F0FDF4' : theme.dangerLight, borderRadius: 12, border: `1px solid ${calibrated ? '#86EFAC' : '#FECACA'}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{calibrated ? '✓' : '👁'}</span>
          <span style={{ fontFamily: 'Inter, Cairo', fontSize: 13, color: calibrated ? '#15803d' : theme.danger }}>
            {calibrated ? t('em.calibrate.ok') : t('em.calibrate.look')}
          </span>
        </div>
      </Card>

      <BigButton onClick={onNext} variant="emergency" disabled={!calibrated}>
        {t('em.calibrate.continue')}
      </BigButton>
    </ScreenContainer>
  )
}

// ─── E3: Permission (appears once in emergency) ───────────────────────────────
function E3Permission({ onNext }: { onNext: () => void }) {
  const { t, theme } = useApp()
  const [choice, setChoice] = useState<'yes' | 'no' | null>(null)
  const [counting, setCounting] = useState<'yes' | 'no' | null>(null)

  const handleChoice = (c: 'yes' | 'no') => {
    setChoice(c)
    setCounting(c)
    if (c === 'yes') setTimeout(onNext, 3200)
  }

  return (
    <ScreenContainer>
      <ScreenTitle
        title={t('perm.title')}
        subtitle={t('perm.question')}
        icon={
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${theme.danger} 0%, #991B1B 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 22px rgba(220,38,38,0.35)' }}>
            <svg width="36" height="22" viewBox="0 0 36 22" fill="none">
              <ellipse cx="18" cy="11" rx="17" ry="10" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5" />
              <circle cx="18" cy="11" r="5" fill="white" opacity="0.9" />
              <circle cx="18" cy="11" r="2.5" fill={theme.danger} />
            </svg>
          </div>
        }
      />

      <Card style={{ marginBottom: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 18, color: theme.text, marginBottom: 6 }}>
            Emergency Medical Consent
          </h2>
          <p style={{ fontFamily: 'Inter, Cairo', fontSize: 14, color: theme.textMuted, lineHeight: 1.5 }}>
            By completing the eye signature, you confirm consent for the emergency medical procedure.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <button onClick={() => handleChoice('yes')} style={{ background: choice === 'yes' ? '#F0FDF4' : theme.card, border: `2.5px solid ${choice === 'yes' ? '#16a34a' : theme.border}`, borderRadius: 18, padding: '22px 14px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 20, color: '#16a34a', marginBottom: 4 }}>{t('perm.yes')}</div>
            <div style={{ fontFamily: 'Inter, Cairo', fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>{t('perm.yes.sub')}</div>
            <div style={{ background: '#E6F2EC', borderRadius: 20, padding: '4px 10px', display: 'inline-block', fontFamily: 'Inter, Cairo', fontSize: 11, color: '#006633', fontWeight: 600 }}>
              {t('perm.yes.instruction')}
            </div>
          </button>

          <button onClick={() => handleChoice('no')} style={{ background: choice === 'no' ? theme.dangerLight : theme.card, border: `2.5px solid ${choice === 'no' ? theme.danger : theme.border}`, borderRadius: 18, padding: '22px 14px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>❌</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 20, color: theme.danger, marginBottom: 4 }}>{t('perm.no')}</div>
            <div style={{ fontFamily: 'Inter, Cairo', fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>{t('perm.no.sub')}</div>
            <div style={{ background: theme.dangerLight, borderRadius: 20, padding: '4px 10px', display: 'inline-block', fontFamily: 'Inter, Cairo', fontSize: 11, color: theme.danger, fontWeight: 600 }}>
              {t('perm.no.instruction')}
            </div>
          </button>
        </div>

        {counting && (
          <div className="animate-float-in" style={{ display: 'flex', justifyContent: 'center', padding: '18px', background: counting === 'yes' ? '#F0FDF4' : theme.dangerLight, borderRadius: 14, border: `1px solid ${counting === 'yes' ? '#86EFAC' : '#FECACA'}` }}>
            <CountdownTimer seconds={counting === 'yes' ? 3 : 5} label={counting === 'yes' ? t('perm.yes.counting') : t('perm.no.counting')} color={counting === 'yes' ? '#16a34a' : theme.danger} />
          </div>
        )}

        {!counting && (
          <div style={{ padding: '12px 14px', background: '#FFFBEB', borderRadius: 10, border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>💡</span>
            <span style={{ fontFamily: 'Inter, Cairo', fontSize: 12, color: '#92400E' }}>{t('perm.simulate')}</span>
          </div>
        )}
      </Card>

      {choice === 'no' && (
        <div style={{ textAlign: 'center', padding: '16px', background: theme.dangerLight, borderRadius: 14, border: '1px solid #FECACA' }}>
          <p style={{ fontFamily: 'Inter, Cairo', fontSize: 14, color: theme.danger, marginBottom: 12 }}>{t('perm.declined')}</p>
          <BigButton onClick={() => setChoice(null)} variant="ghost">{t('record.home')}</BigButton>
        </div>
      )}
    </ScreenContainer>
  )
}

// ─── E4: Eye Signature ─────────────────────────────────────────────────────────
function E4Signature({ onNext }: { onNext: () => void }) {
  const { t, theme } = useApp()
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setDone(true); return 100 }
        return p + 1
      })
    }, 40)
    return () => clearInterval(interval)
  }, [])

  return (
    <ScreenContainer>
      <ScreenTitle title={t('sig.title')} subtitle={t('sig.subtitle')} />

      <Card style={{ marginBottom: 20 }}>
        <DarkCanvas height={180}>
          <svg width="100%" height="100%" viewBox="0 0 400 180" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            {[{ cx: 40, cy: 90 }, { cx: 120, cy: 50 }, { cx: 200, cy: 120 }, { cx: 290, cy: 60 }].map((d, i) => (
              <g key={i}>
                <circle cx={d.cx} cy={d.cy} r="6" fill="rgba(220,38,38,0.25)" stroke="rgba(220,38,38,0.6)" strokeWidth="1.5" />
                <circle cx={d.cx} cy={d.cy} r="2" fill={theme.danger} />
                <text x={d.cx} y={d.cy + 16} textAnchor="middle" fill="rgba(220,38,38,0.5)" fontSize="10" fontFamily="Inter">{i + 1}</text>
              </g>
            ))}
            <path d="M40,90 C65,75 95,52 120,50 C145,48 170,110 200,120 C225,130 258,65 290,60 C310,57 345,75 370,82" fill="none" stroke={theme.danger} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="900" className="stroke-dash-path animate-draw-path" style={{ filter: 'drop-shadow(0 0 6px rgba(220,38,38,0.5))' }} />
          </svg>
          <div className="animate-cursor-em" style={{ position: 'absolute', width: 20, height: 20, borderRadius: '50%', background: 'rgba(220,38,38,0.9)', border: '2.5px solid white', boxShadow: '0 0 14px rgba(220,38,38,0.9)', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 10 }} />
          {done && (
            <div className="animate-float-in" style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,16,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 18 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 44, marginBottom: 6 }}>✍️</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 18, color: theme.danger }}>{t('sig.done.msg')}</div>
              </div>
            </div>
          )}
        </DarkCanvas>

        <div style={{ marginTop: 16 }}>
          <ProgressBar progress={progress} color={theme.danger} label={t('sig.progress')} done={done} doneLabel={t('sig.captured')} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
          {[
            { label: t('sig.eye.cursor'), value: 'Active', color: theme.danger },
            { label: t('sig.tracking'), value: 'Stable', color: theme.primary },
            { label: t('sig.accuracy'), value: `${Math.min(progress, 100)}%`, color: '#22c55e' },
          ].map((m) => (
            <div key={m.label} style={{ background: theme.primaryLight, borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 13, color: m.color }}>{m.value}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: theme.textMuted }}>{m.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <BigButton onClick={onNext} variant="emergency" disabled={!done}>{t('sig.submit')}</BigButton>
    </ScreenContainer>
  )
}

// ─── E5: Complete ─────────────────────────────────────────────────────────────
function E5Complete({ onBack }: { onBack: () => void }) {
  const { t, theme } = useApp()

  return (
    <ScreenContainer>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div className="animate-badge-pop" style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #0077B6 0%, #005f92 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 36px rgba(0,119,182,0.4)' }}>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <path d="M10 25L20 35L40 15" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="80" className="animate-checkmark" />
          </svg>
        </div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 26, color: theme.text, marginBottom: 6 }}>{t('complete.title')}</h1>
        <p style={{ fontFamily: 'Inter, Cairo', fontSize: 14, color: theme.textMuted }}>{t('complete.subtitle')}</p>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 15, color: theme.text, marginBottom: 16 }}>{t('complete.summary')}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <VerificationBadge label={t('complete.sig')} delay={0} />
          <VerificationBadge label={t('complete.video')} delay={120} />
          <VerificationBadge label={t('complete.time')} delay={240} />
          <VerificationBadge label={t('complete.device')} delay={360} />
          <VerificationBadge label={t('complete.emr')} delay={480} />
        </div>

        <div style={{ marginTop: 20, padding: '14px 18px', background: theme.primaryLight, borderRadius: 14, border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <rect x="4" y="4" width="22" height="22" rx="6" fill={theme.primary} opacity="0.15" />
            <path d="M9 15l4 4 8-8" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 13, color: theme.primary }}>{t('complete.stored')}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, color: theme.textMuted }}>{t('complete.compliance')}</div>
          </div>
        </div>
      </Card>

      <div style={{ background: '#0A1628', borderRadius: 14, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'Inter', fontSize: 10, color: '#888', marginBottom: 4, letterSpacing: '0.5px', textTransform: 'uppercase' as const }}>{t('complete.ref')}</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 15, color: 'white', letterSpacing: '0.8px' }}>KSUMC-EM-2026-09-8821</div>
        </div>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="3" width="16" height="16" rx="4" stroke={theme.primary} strokeWidth="1.5" />
          <path d="M7 11l3 3 5-5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <BigButton onClick={onBack} variant="primary">{t('complete.home')}</BigButton>
    </ScreenContainer>
  )
}
