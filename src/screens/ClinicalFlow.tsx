import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import {
  Header, PageShell, ScreenContainer, ScreenTitle,
  AnimatedEye, VerificationBadge, CountdownTimer,
  Card, BigButton, ProgressBar, DarkCanvas, InputField,
} from '../components/shared'

// Clinical flow steps:
// 0: Patient Identification
// 1: Face Verification (Register or Verify)
// 2: Procedure Selection
// 3: Eye Signature Permission (1st)
// 4: Medical Consent Form
// 5: Eye Signature Creation
// 6: Final Signature Confirmation (2nd permission)
// 7: Medical Record Documentation

type CStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

interface Props { onBack: () => void }
export default function ClinicalFlow({ onBack }: Props) {
  const { t } = useApp()
  const [step, setStep] = useState<CStep>(0)
  const [procedure, setProcedure] = useState('')

  const next = () => setStep((s) => Math.min(s + 1, 6) as CStep)

  const screens: Record<number, React.ReactNode> = {
    0: <C1PatientId onNext={next} />,

    // Face Verification is temporarily skipped.
    1: (
      <C4Permission
        onNext={next}
        onDecline={onBack}
        instance="pre-sign"
      />
    ),

    2: (
      <C5ConsentForm
        onNext={next}
        procedure={procedure || 'Endoscopy'}
      />
    ),

    3: <C6Signature onNext={next} />,

    4: (
      <C7FinalConfirmation
        onNext={next}
        procedure={procedure || 'Endoscopy'}
      />
    ),

    5: (
      <C8Record
        onBack={onBack}
        procedure={procedure || 'Endoscopy'}
      />
    ),
  }

  return (
    <PageShell>
      <Header
        mode="clinical"
        onBack={onBack}
        step={step}
        totalSteps={6}
        flowLabel="Clinical Mode"
      />
      {screens[step]}
    </PageShell>
  )
}
// ─── C1: Patient Identification ────────────────────────────────────────────────
function C1PatientId({ onNext }: { onNext: () => void }) {
  const { t, theme } = useApp()
  const [nationalId, setNationalId] = useState('')
  const [mrn, setMrn] = useState('')
  const [dob, setDob] = useState('')
  const [searching, setSearching] = useState(false)
  const [found, setFound] = useState(false)

  const handleSearch = () => {
    if (!nationalId || !mrn || !dob) return
    setSearching(true)
    setTimeout(() => { setSearching(false); setFound(true) }, 1600)
  }

  const patientData = [
    [t('pid.name'), 'Mohammed Al-Rashidi'],
    [t('pid.id'), nationalId || '1234567890'],
    [t('pid.mrn'), mrn || 'MRN-2026-45821'],
    [t('pid.dob'), dob || '14/03/1975'],
    [t('pid.dept'), 'Gastroenterology'],
    [t('pid.blood'), 'O+'],
  ]

  const PersonIcon = (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="6" r="4" stroke={theme.primary} strokeWidth="1.5" />
      <path d="M2 16c0-4 3-6.5 7-6.5s7 2.5 7 6.5" stroke={theme.primary} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
  const DocIcon = (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="2" width="12" height="14" rx="2" stroke={theme.primary} strokeWidth="1.5" />
      <path d="M6 7h6M6 10h4" stroke={theme.primary} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
  const CalIcon = (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="4" width="14" height="12" rx="2" stroke={theme.primary} strokeWidth="1.5" />
      <path d="M6 2v4M12 2v4M2 9h14" stroke={theme.primary} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )

  return (
    <ScreenContainer>
      <ScreenTitle
        title={t('pid.title')}
        subtitle={t('pid.subtitle')}
        icon={
          <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 20px ${theme.primary}44` }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="11" r="7" stroke="white" strokeWidth="2" />
              <path d="M4 30c0-7 5.5-11 12-11s12 4 12 11" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        }
      />

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <InputField value={nationalId} onChange={setNationalId} placeholder={t('pid.field.nationalId.placeholder')} label={t('pid.field.nationalId')} icon={PersonIcon} />
          <InputField value={mrn} onChange={setMrn} placeholder={t('pid.field.mrn.placeholder')} label={t('pid.field.mrn')} icon={DocIcon} />
          <InputField value={dob} onChange={setDob} placeholder={t('pid.field.dob.placeholder')} label={t('pid.field.dob')} icon={CalIcon} />

          <BigButton onClick={handleSearch} variant="primary" disabled={!nationalId || !mrn || !dob}>
            {searching
              ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <path d="M9 2a7 7 0 017 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {t('pid.searching')}
                </span>
              : t('pid.search')}
          </BigButton>

          {found && (
            <div className="animate-float-in" style={{ background: '#F0FDF4', border: '2px solid #16a34a', borderRadius: 16, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: '#15803d' }}>{t('pid.found')}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {patientData.map(([k, v]) => (
                  <div key={k} style={{ background: 'white', borderRadius: 10, padding: '8px 12px' }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 10, color: '#888', marginBottom: 2 }}>{k}</div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 600, fontSize: 13, color: '#111' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <BigButton onClick={onNext} variant="primary" disabled={!found}>{t('pid.confirm')}</BigButton>
    </ScreenContainer>
  )
}

// ─── C2: Face Verification (two scenarios) ────────────────────────────────────
function C2FaceVerification({
  onNext, hasFaceImage, setHasFaceImage,
}: {
  onNext: () => void
  hasFaceImage: boolean | null
  setHasFaceImage: (v: boolean) => void
}) {
  const { t, theme } = useApp()

  // Scenario selection
  if (hasFaceImage === null) {
    return (
      <ScreenContainer>
        <ScreenTitle
          title="Face Verification Setup"
          subtitle="Does this patient have a registered face image in the system?"
          icon={
            <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 20px ${theme.primary}44` }}>
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <rect x="4" y="4" width="26" height="26" rx="6" stroke="white" strokeWidth="2" />
                <circle cx="17" cy="15" r="5" stroke="white" strokeWidth="1.8" />
                <path d="M8 28c0-5 4-8 9-8s9 3 9 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          }
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <button
            onClick={() => setHasFaceImage(false)}
            className="card-hover"
            style={{ background: theme.card, border: `2px solid ${theme.border}`, borderRadius: 20, padding: '24px 18px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { ;(e.currentTarget as HTMLElement).style.borderColor = theme.primary }}
            onMouseLeave={(e) => { ;(e.currentTarget as HTMLElement).style.borderColor = theme.border }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📤</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 15, color: theme.text, marginBottom: 6 }}>No Image Registered</div>
            <div style={{ fontFamily: 'Inter, Cairo', fontSize: 12, color: theme.textMuted, lineHeight: 1.5 }}>Upload a new face photo for this patient</div>
          </button>
          <button
            onClick={() => setHasFaceImage(true)}
            className="card-hover"
            style={{ background: theme.card, border: `2px solid ${theme.border}`, borderRadius: 20, padding: '24px 18px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { ;(e.currentTarget as HTMLElement).style.borderColor = theme.primary }}
            onMouseLeave={(e) => { ;(e.currentTarget as HTMLElement).style.borderColor = theme.border }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 15, color: theme.text, marginBottom: 6 }}>Image Available</div>
            <div style={{ fontFamily: 'Inter, Cairo', fontSize: 12, color: theme.textMuted, lineHeight: 1.5 }}>Patient has a registered face in the system</div>
          </button>
        </div>
      
      </ScreenContainer>
    )
  }

  if (hasFaceImage === false) {
    return <RegisterFaceScreen onNext={onNext} />
  }

  return <VerifyFaceScreen onNext={onNext} />
}

// ─── Register Face (no image available) ──────────────────────────────────────
function RegisterFaceScreen({ onNext }: { onNext: () => void }) {
  const { t, theme } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const requirements = [
    t('face.req.1'), t('face.req.2'), t('face.req.3'), t('face.req.4'),
    t('face.req.5'), t('face.req.6'), t('face.req.7'), t('face.req.8'),
  ]

  return (
    <ScreenContainer>
      <ScreenTitle
        title={t('face.register.title')}
        subtitle={t('face.register.subtitle')}
        icon={
          <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 20px ${theme.primary}44` }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4v16M8 12l8-8 8 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="4" y="24" width="24" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
            </svg>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
        {/* Requirements */}
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 14 }}>
            📋 {t('face.req.title')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {requirements.map((req, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: theme.primaryLight, border: `1.5px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3 5.5L6.5 2" stroke={theme.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontFamily: 'Inter, Cairo', fontSize: 12, color: theme.textMuted, lineHeight: 1.5 }}>{req}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upload area */}
        <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 4 }}>
            📸 {t('face.upload')}
          </h3>

          {/* Upload drop zone */}
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${previewUrl ? theme.primary : theme.border}`,
              borderRadius: 16,
              background: previewUrl ? theme.primaryLight : theme.card,
              cursor: 'pointer',
              overflow: 'hidden',
              aspectRatio: '3/4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 8,
              transition: 'all 0.2s',
              maxHeight: 200,
              position: 'relative',
            }}
          >
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Face preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} />
                <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', borderRadius: 20, padding: '3px 10px' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'white' }}>Click to change</span>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 36 }}>📷</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 600, fontSize: 13, color: theme.textMuted }}>Click to upload</div>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: theme.textMuted }}>JPG, PNG, HEIC</div>
              </>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

          {/* Simulated upload if no real file */}
          {!previewUrl && (
            <button
              onClick={() => {
                setPreviewUrl('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDIwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyNTAiIGZpbGw9IiNGMEY2RkIiLz48ZWxsaXBzZSBjeD0iMTAwIiBjeT0iOTAiIHJ4PSI0NSIgcnk9IjUyIiBmaWxsPSIjQkZEOEYwIi8+PHBhdGggZD0iTTMwIDIyMGMwLTQwIDMwLTY1IDcwLTY1czcwIDI1IDcwIDY1IiBmaWxsPSIjQkZEOEYwIi8+PC9zdmc+')
              }}
              style={{ background: theme.primaryLight, border: `1px solid ${theme.border}`, borderRadius: 10, padding: '8px', cursor: 'pointer', fontFamily: 'Inter, Cairo', fontSize: 12, color: theme.primary, fontWeight: 600 }}
            >
              Use Sample Patient Photo
            </button>
          )}
        </Card>
      </div>

      {previewUrl && (
        <Card style={{ marginBottom: 20, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="checkbox"
              id="confirm-photo"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: theme.primary }}
            />
            <label htmlFor="confirm-photo" style={{ fontFamily: 'Inter, Cairo', fontSize: 14, color: theme.text, cursor: 'pointer' }}>
              I confirm that the uploaded photo clearly shows the patient's face and meets the required criteria.
            </label>
          </div>
        </Card>
      )}

      <BigButton onClick={onNext} variant="primary" disabled={!previewUrl || !confirmed}>
        {t('face.confirm')}
      </BigButton>
    </ScreenContainer>
  )
}

// ─── Verify Face (image available) ───────────────────────────────────────────
function VerifyFaceScreen({ onNext }: { onNext: () => void }) {
  const { t, theme } = useApp()
  const [phase, setPhase] = useState<'scanning' | 'matching' | 'done'>('scanning')
  const [progress, setProgress] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
const streamRef = useRef<MediaStream | null>(null)
const [cameraReady, setCameraReady] = useState(false)
const [cameraError, setCameraError] = useState('')
const [similarity, setSimilarity] = useState<number | null>(null)

  useEffect(() => {
  let active = true

  const startCamera = async () => {
    try {
      setCameraError('')

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })

      if (!active) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setCameraReady(true)
    } catch (error) {
      console.error('Camera error:', error)
      setCameraError('Could not access the camera.')
      setCameraReady(false)
    }
  }

  startCamera()

  return () => {
    active = false

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }
}, [])
const verifyFace = async () => {
  if (!videoRef.current || !cameraReady) {
    console.log('Camera is not ready yet.')
    return
  }

  try {
    setPhase('scanning')
    setProgress(20)

    const video = videoRef.current

    // نأخذ صورة من الفيديو الحالي
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Could not create canvas context.')
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    )

    setPhase('matching')
    setProgress(60)

    // نحول الصورة إلى ملف JPEG
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result)
          } else {
            reject(new Error('Could not capture image.'))
          }
        },
        'image/jpeg',
        0.95
      )
    })

    const formData = new FormData()
    formData.append('file', blob, 'live-face.jpg')

    // إرسال الصورة إلى Python
    const response = await fetch(
  'https://healthcare-ai-face-api.onrender.com/verify-face',
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`)
    }

    const result = await response.json()

console.log('Face verification result:', result)

if (typeof result.similarity === 'number') {
  setSimilarity(result.similarity)
}

setProgress(100)

    if (result.verified) {
  setPhase('done')
} else {
  setPhase('scanning')
  setProgress(0)

  console.log(
    `Face not matched. Similarity: ${result.similarity ?? 0}%. Retrying...`
  )

  setTimeout(() => {
    verifyFace()
  }, 1500)
}
  } catch (error) {
    console.error('Face verification error:', error)

    setPhase('scanning')
    setProgress(0)

    alert('Face verification failed. Check the Python API.')
  }
}
useEffect(() => {
  if (!cameraReady) return

  const timer = setTimeout(() => {
    verifyFace()
  }, 2500)

  return () => clearTimeout(timer)
}, [cameraReady])
  const phaseLabel = phase === 'scanning' ? t('face.verify.scanning') : phase === 'matching' ? t('face.verify.matching') : t('face.verify.done')

  return (
    <ScreenContainer>
      <ScreenTitle title={t('face.verify.title')} subtitle={t('face.verify.subtitle')} />

      <Card style={{ marginBottom: 20 }}>
        {/* Camera simulation */}
        <div style={{ background: '#050510', borderRadius: 18, overflow: 'hidden', position: 'relative', height: 260, marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  onLoadedMetadata={() => setCameraReady(true)}
  style={{
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scaleX(-1)',
  }}
/>

{cameraError && (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Inter',
      fontSize: 13,
      zIndex: 20,
      background: '#050510',
    }}
  >
    {cameraError}
  </div>
)}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,119,182,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,119,182,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="animate-scan" style={{ position: 'absolute', left: 0, right: 0, height: 2, background: `rgba(0,119,182,0.6)`, top: 0, zIndex: 5 }} />

          {/* Face detection frame */}
          <div
            className="animate-face-ring"
            style={{
              width: 160, height: 195, border: `2.5px solid ${theme.primary}`, borderRadius: 80,
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {/* Corner markers */}
            {[
              { top: -2, left: -2, borderTop: `4px solid ${theme.primary}`, borderLeft: `4px solid ${theme.primary}`, borderRadius: '8px 0 0 0' },
              { top: -2, right: -2, borderTop: `4px solid ${theme.primary}`, borderRight: `4px solid ${theme.primary}`, borderRadius: '0 8px 0 0' },
              { bottom: -2, left: -2, borderBottom: `4px solid ${theme.primary}`, borderLeft: `4px solid ${theme.primary}`, borderRadius: '0 0 0 8px' },
              { bottom: -2, right: -2, borderBottom: `4px solid ${theme.primary}`, borderRight: `4px solid ${theme.primary}`, borderRadius: '0 0 8px 0' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...s }} />
            ))}

            {/* Face silhouette */}
            <svg width="70" height="90" viewBox="0 0 70 90" fill="none" opacity="0.45">
              <ellipse cx="35" cy="34" rx="24" ry="28" fill={`${theme.primary}30`} stroke={`${theme.primary}55`} strokeWidth="1.5" />
              <path d="M15 68c0-10 8.5-17 20-17s20 7 20 17" stroke={`${theme.primary}55`} strokeWidth="1.5" strokeLinecap="round" />
              <ellipse cx="26" cy="32" rx="4" ry="2.5" fill={`${theme.primary}40`} />
              <ellipse cx="44" cy="32" rx="4" ry="2.5" fill={`${theme.primary}40`} />
            </svg>
          </div>

          {/* Status chip */}
          <div style={{ position: 'absolute', top: 14, right: 14, background: phase === 'done' ? 'rgba(22,163,74,0.9)' : 'rgba(0,0,0,0.75)', borderRadius: 20, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            {phase !== 'done' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: theme.primary }} className="animate-pulse-ring" />}
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 11, color: 'white' }}>
              {phase === 'done' ? '✓ VERIFIED' : phase.toUpperCase()}
            </span>
          </div>

          {/* Bottom label */}
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.55)', padding: '4px 12px', borderRadius: 20 }}>
              {phaseLabel}
            </span>
          </div>
        </div>
      

        {/* Progress */}
        <div style={{ marginBottom: 16 }}>
          <ProgressBar progress={progress} color={theme.primary} label={t('face.verify.title')} done={phase === 'done'} doneLabel={t('face.verified')} />
        </div>

                {phase === 'done' && (
          <div
            className="animate-float-in"
            style={{
              background: '#F0FDF4',
              border: '1.5px solid #86EFAC',
              borderRadius: 14,
              padding: '14px 16px',
            }}
          >
            <div
              style={{
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16 }}>✅</span>

              <span
                style={{
                  fontFamily: 'Plus Jakarta Sans, Cairo',
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#15803d',
                }}
              >
                {t('face.matched')}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
              }}
            >
              {[
                [t('pid.name'), 'Mohammed Al-Rashidi'],
                [t('pid.mrn'), 'MRN-2026-45821'],
                [t('pid.dob'), '14 March 1975'],
                [t('face.match.score'), similarity !== null ? `${similarity.toFixed(2)}%` : '—'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    background: 'white',
                    borderRadius: 9,
                    padding: '7px 10px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter',
                      fontSize: 10,
                      color: '#888',
                      marginBottom: 1,
                    }}
                  >
                    {k}
                  </div>

                  <div
                    style={{
                      fontFamily: 'Plus Jakarta Sans, Cairo',
                      fontWeight: 600,
                      fontSize: 13,
                      color: '#111',
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
</Card>



<BigButton
  onClick={onNext}
  variant="primary"
  disabled={phase !== 'done'}
>
  {t('face.continue')}
</BigButton>
    </ScreenContainer>
  )
}

// ─── C3: Procedure Selection ───────────────────────────────────────────────────
function C3Procedure({ onNext, procedure, setProcedure }: { onNext: () => void; procedure: string; setProcedure: (p: string) => void }) {
  const { t, theme } = useApp()
  const [other, setOther] = useState('')

  const procs = [
    { key: 'operation', icon: '🔬', label: t('proc.operation') },
    { key: 'endoscopy', icon: '🩺', label: t('proc.endoscopy') },
    { key: 'medtest', icon: '🧪', label: t('proc.medtest') },
  ]

  return (
    <ScreenContainer>
      <ScreenTitle
        title={t('proc.title')}
        subtitle={t('proc.subtitle')}
        icon={
          <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 20px ${theme.primary}44` }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="5" y="3" width="22" height="26" rx="4" stroke="white" strokeWidth="2" />
              <path d="M10 11h12M10 16h8M10 21h6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="24" cy="25" r="5" fill={theme.primary} stroke="white" strokeWidth="1.5" />
              <path d="M24 23v4M22 25h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        }
      />

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
          {procs.map((p) => (
            <button
              key={p.key}
              onClick={() => setProcedure(p.label)}
              style={{
                background: procedure === p.label ? theme.primary : theme.card,
                border: `2px solid ${procedure === p.label ? theme.primary : theme.border}`,
                borderRadius: 16, padding: '18px 10px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 8 }}>{p.icon}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 13, color: procedure === p.label ? 'white' : theme.text }}>{p.label}</div>
            </button>
          ))}
        </div>

        {/* Other */}
        <button
          onClick={() => setProcedure('Other')}
          style={{
            width: '100%', background: procedure === 'Other' ? theme.primaryLight : theme.card,
            border: `2px solid ${procedure === 'Other' ? theme.primary : theme.border}`,
            borderRadius: 14, padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: procedure === 'Other' ? 12 : 0, transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: 22 }}>✏️</span>
          <span style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: procedure === 'Other' ? theme.primary : theme.text }}>
            {t('proc.other')}
          </span>
        </button>

        {procedure === 'Other' && (
          <div className="animate-float-in">
            <input
              value={other}
              onChange={(e) => setOther(e.target.value)}
              placeholder={t('proc.other.input')}
              style={{ width: '100%', padding: '13px 14px', border: `2px solid ${theme.primary}`, borderRadius: 12, fontFamily: 'Inter, Cairo', fontSize: 14, color: theme.text, background: theme.inputBg, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}
      </Card>
      <BigButton
        onClick={() => { if (procedure === 'other' && other) setProcedure(other); onNext() }}
        variant="primary"
        disabled={!procedure || (procedure === 'Other' && !other)}
      >
        {t('proc.confirm')}
      </BigButton>
    </ScreenContainer>
  )
}

// ─── C4: Eye Signature Permission ─────────────────────────────────────────────
// ─── C4: Eye Signature Permission ─────────────────────────────────────────────
function C4Permission({
  onNext,
  onDecline,
  instance,
}: {
  onNext: () => void
  onDecline: () => void
  instance: 'pre-sign' | 'pre-submit'
}) {
  const { t, theme } = useApp()

  const [choice, setChoice] = useState<'yes' | 'no' | null>(null)
  const [counting, setCounting] = useState<'yes' | 'no' | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const eyeCloseStartRef = useRef<number | null>(null)
  const lastBeepSecondRef = useRef(0)
  const processingRef = useRef(false)

  const beep = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext
        }).webkitAudioContext

      if (!AudioContextClass) return

      const audioContext = new AudioContextClass()
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gain.gain.setValueAtTime(0.15, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.12
      )

      oscillator.connect(gain)
      gain.connect(audioContext.destination)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.12)
    } catch {
      // Ignore audio errors
    }
  }

  useEffect(() => {
    let active = true

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
          },
          audio: false,
        })

        if (!active) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error('C4 camera error:', error)
      }
    }

    startCamera()

    return () => {
      active = false

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const sendFrame = async () => {
      const video = videoRef.current

      if (
        !video ||
        video.videoWidth === 0 ||
        video.videoHeight === 0 ||
        processingRef.current
      ) {
        return
      }

      processingRef.current = true

      try {
        const canvas = document.createElement('canvas')

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const context = canvas.getContext('2d')

        if (!context) return

        context.drawImage(
          video,
          0,
          0,
          canvas.width,
          canvas.height
        )

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(
            resolve,
            'image/jpeg',
            0.8
          )
        })

        if (!blob) return

        const formData = new FormData()
        formData.append(
          'file',
          blob,
          'permission-frame.jpg'
        )

        const response = await fetch(
          '/eye-api/process-frame',
          {
            method: 'POST',
            body: formData,
          }
        )

        if (!response.ok) return

        const data = await response.json()

        console.log(
          'C4 BLINK DATA:',
          data.blink,
          data
        )

        const now = performance.now()

        if (data.blink === true) {
          if (eyeCloseStartRef.current === null) {
            eyeCloseStartRef.current = now
            lastBeepSecondRef.current = 0
          }

          const duration =
            (now - eyeCloseStartRef.current) / 1000

          if (
            duration >= 1 &&
            lastBeepSecondRef.current < 1
          ) {
            beep()
            lastBeepSecondRef.current = 1
          }

          if (
            duration >= 2 &&
            lastBeepSecondRef.current < 2
          ) {
            beep()
            lastBeepSecondRef.current = 2
          }

          if (
            duration >= 3 &&
            lastBeepSecondRef.current < 3
          ) {
            beep()
            lastBeepSecondRef.current = 3
          }
        } else {
          if (eyeCloseStartRef.current !== null) {
            const duration =
              (now - eyeCloseStartRef.current) / 1000

            if (duration >= 2 && duration < 3) {
              setChoice('yes')
              setCounting('yes')

              setTimeout(() => {
                onNext()
              }, 300)
            }

            if (duration >= 3) {
              setChoice('no')
              setCounting('no')

              setTimeout(() => {
                onDecline()
              }, 300)
            }
          }

          eyeCloseStartRef.current = null
          lastBeepSecondRef.current = 0
        }
      } catch (error) {
        console.error(
          'C4 frame error:',
          error
        )
      } finally {
        processingRef.current = false
      }
    }

    const interval = setInterval(
      sendFrame,
      100
    )

    return () => {
      clearInterval(interval)
    }
  }, [onNext, onDecline])

  return (
    <ScreenContainer>
      <ScreenTitle
        title={
          instance === 'pre-sign'
            ? t('perm.title')
            : t('perm.final.title')
        }
        subtitle={
          instance === 'pre-sign'
            ? t('perm.subtitle')
            : t('perm.final.subtitle')
        }
      />

      <Card style={{ marginBottom: 20 }}>
        <div
          style={{
            textAlign: 'center',
            padding: '10px 0 20px',
          }}
        >
          <AnimatedEye />

          <h3
            style={{
              fontFamily:
                'Plus Jakarta Sans, Cairo',
              fontWeight: 800,
              fontSize: 18,
              color: theme.text,
              margin: '14px 0 8px',
            }}
          >
            {t('perm.question')}
          </h3>

          <p
            style={{
              fontFamily:
                'Inter, Cairo',
              fontSize: 13,
              color: theme.textMuted,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {t('perm.instruction')}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 220,
              height: 165,
              borderRadius: 16,
              overflow: 'hidden',
              position: 'relative',
              background: '#050510',
              border:
                `2px solid ${theme.border}`,
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)',
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1fr 1fr',
            gap: 14,
          }}
        >
          <button
            onClick={() => {
              setChoice('yes')
              setCounting('yes')

              setTimeout(() => {
                onNext()
              }, 300)
            }}
            style={{
              background:
                choice === 'yes'
                  ? '#F0FDF4'
                  : theme.card,
              border:
                `2.5px solid ${
                  choice === 'yes'
                    ? '#16a34a'
                    : theme.border
                }`,
              borderRadius: 16,
              padding: '20px 14px',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 30,
                marginBottom: 6,
              }}
            >
              ✅
            </div>

            <div
              style={{
                fontFamily:
                  'Plus Jakarta Sans, Cairo',
                fontWeight: 800,
                fontSize: 18,
                color: '#16a34a',
              }}
            >
              {t('perm.yes')}
            </div>

            <div
              style={{
                fontFamily:
                  'Inter, Cairo',
                fontSize: 11,
                color: theme.textMuted,
                marginTop: 4,
              }}
            >
              {t('perm.yes.instruction')}
            </div>
          </button>

          <button
            onClick={() => {
              setChoice('no')
              setCounting('no')

              setTimeout(() => {
                onDecline()
              }, 300)
            }}
            style={{
              background:
                choice === 'no'
                  ? theme.dangerLight
                  : theme.card,
              border:
                `2.5px solid ${
                  choice === 'no'
                    ? theme.danger
                    : theme.border
                }`,
              borderRadius: 16,
              padding: '20px 14px',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 30,
                marginBottom: 6,
              }}
            >
              ❌
            </div>

            <div
              style={{
                fontFamily:
                  'Plus Jakarta Sans, Cairo',
                fontWeight: 800,
                fontSize: 18,
                color: theme.danger,
              }}
            >
              {t('perm.no')}
            </div>

            <div
              style={{
                fontFamily:
                  'Inter, Cairo',
                fontSize: 11,
                color: theme.textMuted,
                marginTop: 4,
              }}
            >
              {t('perm.no.instruction')}
            </div>
          </button>
        </div>

        {counting && (
          <div
            className="animate-float-in"
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: 18,
              marginTop: 14,
              background:
                counting === 'yes'
                  ? '#F0FDF4'
                  : theme.dangerLight,
              borderRadius: 14,
              border:
                `1px solid ${
                  counting === 'yes'
                    ? '#86EFAC'
                    : '#FECACA'
                }`,
            }}
          >
            <CountdownTimer
              seconds={
                counting === 'yes'
                  ? 3
                  : 5
              }
              label={
                counting === 'yes'
                  ? t('perm.yes.counting')
                  : t('perm.no.counting')
              }
              color={
                counting === 'yes'
                  ? '#16a34a'
                  : theme.danger
              }
            />
          </div>
        )}
      </Card>
    </ScreenContainer>
  )
}

// ─── C5: Medical Consent Form ──────────────────────────────────────────────────
function C5ConsentForm({ onNext, procedure }: { onNext: () => void; procedure: string }) {
  const { t, theme, lang } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [audio, setAudio] = useState(false)

  const consentTextEn = `I, the undersigned patient or authorized representative, hereby provide informed consent for the performance of the ${procedure} procedure at King Saud University Medical City (KSUMC).

PURPOSE: The medical team has explained the nature, purpose, and expected outcomes of the procedure. I understand this procedure is being performed to diagnose, monitor, or treat my medical condition.

RISKS AND BENEFITS: I understand that all medical procedures carry certain risks. The potential risks and complications, including discomfort, allergic reactions, infection, or unforeseen complications, have been clearly explained to me.

ALTERNATIVES: My physician has discussed alternative treatment options. I have had the opportunity to ask questions regarding all alternatives.

DIGITAL SIGNATURE: By completing the eye-controlled digital signature on EyeCare Sign by KSUMC, I confirm that my eye signature constitutes a legally binding consent under the Saudi Electronic Transactions Law, equivalent to a handwritten signature.

I voluntarily consent to the performance of the ${procedure} procedure.`

  const consentTextAr = `أنا، المريض الموقّع أدناه أو ممثله المرخّص، أُقرّ بموجب هذا بموافقتي المستنيرة على إجراء ${procedure} في مدينة الملك سعود الطبية.

الغرض: شرح لي الفريق الطبي طبيعة الإجراء والغرض منه والنتائج المتوقعة منه. أفهم أن هذا الإجراء يُجرى لتشخيص حالتي الطبية أو مراقبتها أو علاجها.

المخاطر والفوائد: أفهم أن جميع الإجراءات الطبية تنطوي على مخاطر معينة. وقد أُوضحت لي المخاطر المحتملة والمضاعفات بما فيها الانزعاج وردود الفعل التحسسية والعدوى.

البدائل: ناقش معي طبيبي خيارات العلاج البديلة، وأتيحت لي الفرصة لطرح الأسئلة.

التوقيع الرقمي: من خلال إتمام التوقيع الرقمي بالتحكم العيني، أؤكد أن توقيعي العيني يُعدّ موافقة ملزمة قانونياً.

أوافق طوعاً على إجراء ${procedure}.`

  return (
    <ScreenContainer>
      <ScreenTitle title={t('consent.title')} subtitle={`${t('proc.title')}: ${procedure}`} />

      <Card style={{ marginBottom: 20 }}>
        {/* Header */}
        <div style={{ borderBottom: `1.5px solid ${theme.border}`, paddingBottom: 14, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 14, color: theme.primary }}>{t('header.title')}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: theme.textMuted }}>Medical Consent — Form MC-{procedure.substring(0, 2).toUpperCase()}-2026</div>
            </div>
            <button
              onClick={() => setAudio(!audio)}
              style={{ background: audio ? theme.primaryLight : theme.card, border: `1.5px solid ${audio ? theme.primary : theme.border}`, borderRadius: 20, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'Inter, Cairo', fontWeight: 600, fontSize: 12, color: audio ? theme.primary : theme.textMuted, transition: 'all 0.2s' }}
            >
              🔊 {audio ? t('consent.stop') : t('consent.read')}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[[t('pid.name'), 'Mohammed Al-Rashidi'], [t('proc.title').split(' ')[1] || 'Procedure', procedure], ['Date', '24 Sep 2026']].map(([k, v]) => (
              <div key={k} style={{ background: theme.primaryLight, borderRadius: 8, padding: '7px 10px' }}>
                <div style={{ fontFamily: 'Inter', fontSize: 10, color: theme.textMuted }}>{k}</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 600, fontSize: 12, color: theme.text }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable text */}
        <div
          style={{ maxHeight: 200, overflowY: 'auto', paddingRight: 6 }}
          onScroll={(e) => {
            const el = e.currentTarget
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) setScrolled(true)
          }}
        >
          <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 10 }}>
            {lang === 'ar' ? `نموذج الموافقة على إجراء ${procedure}` : `Consent for ${procedure}`}
          </h3>
          <p style={{ fontFamily: 'Inter, Cairo', fontSize: 13, color: theme.textMuted, lineHeight: 1.75, whiteSpace: 'pre-line' }}>
            {lang === 'ar' ? consentTextAr : consentTextEn}
          </p>
        </div>

        {!scrolled
          ? <div style={{ marginTop: 10, padding: '8px', background: '#FFFBEB', borderRadius: 8, border: '1px solid #FDE68A', textAlign: 'center' }}>
              <span style={{ fontFamily: 'Inter, Cairo', fontSize: 11, color: '#92400E' }}>{t('consent.scroll')}</span>
            </div>
          : <div className="animate-float-in" style={{ marginTop: 10, padding: '9px 14px', background: '#F0FDF4', borderRadius: 10, border: '1px solid #86EFAC', textAlign: 'center' }}>
              <span style={{ fontFamily: 'Inter, Cairo', fontSize: 12, color: '#15803d', fontWeight: 500 }}>{t('consent.read.done')}</span>
            </div>
        }
      </Card>

      <BigButton onClick={onNext} variant="primary" disabled={!scrolled}>{t('consent.continue')}</BigButton>
    </ScreenContainer>
  )
}

// ─── C6: Eye Signature ─────────────────────────────────────────────────────────
function C6Signature({ onNext }: { onNext: () => void }) {
  const { t, theme } = useApp()
const [progress, setProgress] = useState(0)
const [done, setDone] = useState(false)

const [verificationCode, setVerificationCode] = useState<number[]>([])
const [confirmedPoints, setConfirmedPoints] = useState<number[]>([])
const [nextExpected, setNextExpected] = useState<number | null>(null)
const [eyeConnected, setEyeConnected] = useState(false)
const [currentPoint, setCurrentPoint] = useState<number | null>(null)
const [calibrationPoint, setCalibrationPoint] = useState(1)
const [calibrationSamples, setCalibrationSamples] = useState<
  { yaw: number; pitch: number }[]
>([])
const [calibrationStarted, setCalibrationStarted] = useState(true)
const [calibrationResults, setCalibrationResults] = useState<
  Record<number, { yaw: number; pitch: number }>
>({})
const [detectedPoint, setDetectedPoint] = useState<number | null>(null)
const candidatePointRef = useRef<number | null>(null)
const candidateCountRef = useRef(0)
const lastCalibrationSampleTimeRef = useRef(0)
const calibrationPointStartTimeRef = useRef(Date.now())

const videoRef = useRef<HTMLVideoElement>(null)
const streamRef = useRef<MediaStream | null>(null)
const [cameraReady, setCameraReady] = useState(false)
const [cameraError, setCameraError] = useState('')
const [eyeDebug, setEyeDebug] = useState('waiting')

  useEffect(() => {
  let active = true

  const startCamera = async () => {
    try {
      setCameraError('')

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
        },
        audio: false,
      })

      if (!active) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setCameraReady(true)

    } catch (error) {
      console.error('Eye camera error:', error)
      setCameraError('Could not access the camera.')
      setCameraReady(false)
    }
  }

  startCamera()

  return () => {
    active = false

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }
}, [])
useEffect(() => {
 if (!cameraReady) return

 const sendFrame = async () => {
  const video = videoRef.current

  setEyeDebug(
    `ready=${cameraReady} | video=${!!video} | size=${video?.videoWidth ?? 0}x${video?.videoHeight ?? 0}`
  )

  if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
    return
  }

    try {
      const canvas = document.createElement('canvas')

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvas.getContext('2d')

      if (!context) return

      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      )

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          resolve,
          'image/jpeg',
          0.8
        )
      })

      if (!blob) return
setEyeDebug(`BLOB OK | size=${blob.size}`)
      const formData = new FormData()
      formData.append('file', blob, 'eye-frame.jpg')

      const response = await fetch(
  '/eye-api/process-frame',
  {
    method: 'POST',
          body: formData,
        }
      )
setEyeDebug(`FETCH DONE | status=${response.status}`)
      if (!response.ok) return

      const data = await response.json()
      setEyeDebug(
  `face=${data.face_detected} | spheres=${data.eye_spheres_calibrated} | samples=${calibrationSamples.length} | blink=${data.blink}`
)

      console.log('Web Eye:', data)
//       if (
//   calibrationStarted &&
//   data.face_detected === true &&
//   data.eye_spheres_calibrated === true &&
//   data.blink === false &&
//   typeof data.raw_yaw === 'number' &&
//   typeof data.raw_pitch === 'number'
// ) {
//   if (
//   Date.now() - calibrationPointStartTimeRef.current < 1500
// ) {
//   return
// }
//   const now = Date.now()

// if (now - lastCalibrationSampleTimeRef.current < 150) {
//   return
// }

// lastCalibrationSampleTimeRef.current = now
//   setCalibrationSamples((previousSamples) => {
//     const newSamples = [
//       ...previousSamples,
//       {
//         yaw: data.raw_yaw,
//         pitch: data.raw_pitch,
//       },
//     ]

//     return newSamples
//   })
// }
// if (
//   !calibrationStarted &&
//   data.face_detected === true &&
//   data.eye_spheres_calibrated === true &&
//   typeof data.raw_yaw === 'number' &&
//   typeof data.raw_pitch === 'number' &&
//   Object.keys(calibrationResults).length === 4
// ) {
//   const distances = Object.entries(calibrationResults).map(
//     ([pointNumber, position]) => {
//       const yawDifference =
//         data.raw_yaw - position.yaw

//       const pitchDifference =
//         data.raw_pitch - position.pitch

//       const distance = Math.sqrt(
//         yawDifference * yawDifference +
//         pitchDifference * pitchDifference
//       )

//       return {
//         point: Number(pointNumber),
//         distance,
//       }
//     }
//   )

//   distances.sort((a, b) => a.distance - b.distance)

// const best = distances[0]
// const second = distances[1]

// let closestPoint: number | null = null

// if (best && second && second.distance > 0) {
//   const confidenceRatio =
//     best.distance / second.distance

//   // كلما كانت القيمة أصغر،
//   // كانت النقطة الأولى أوضح من الثانية
//   if (confidenceRatio <= 0.75) {
//     closestPoint = best.point
//   }
// }

// if (closestPoint !== null) {

//   if (candidatePointRef.current === closestPoint) {
//     candidateCountRef.current += 1
//   } else {
//     candidatePointRef.current = closestPoint
//     candidateCountRef.current = 1
//   }

//   // لازم نفس النقطة تظهر 5 قراءات متتالية
//   // قبل ما نعتمدها
//   if (candidateCountRef.current >= 5) {
//     setDetectedPoint(closestPoint)

//     console.log(
//       'STABLE POINT:',
//       closestPoint
//     )
//   }
// }
// }

    } catch (error) {
      console.error('Web Eye frame error:', error)
    }
  }

  const interval = setInterval(sendFrame, 100)

  return () => clearInterval(interval)
}, [cameraReady, calibrationStarted, calibrationResults])
// useEffect(() => {
//   if (!calibrationStarted) return
//   console.log(
//   'CALIBRATION SAMPLES:',
//   calibrationPoint,
//   calibrationSamples.length
// )


//   if (calibrationSamples.length < 40) return

//   const yawValues = calibrationSamples.map(
//     (sample) => sample.yaw
//   )

//   const pitchValues = calibrationSamples.map(
//     (sample) => sample.pitch
//   )

//   const sortedYaw = [...yawValues].sort((a, b) => a - b)
//   const sortedPitch = [...pitchValues].sort((a, b) => a - b)

//   const middle = Math.floor(sortedYaw.length / 2)

//   const medianYaw = sortedYaw[middle]
//   const medianPitch = sortedPitch[middle]

//   console.log(
//     `CALIBRATION POINT ${calibrationPoint}:`,
//     {
//       yaw: medianYaw,
//       pitch: medianPitch,
//     }
//   )

//   setCalibrationResults((previous) => ({
//     ...previous,
//     [calibrationPoint]: {
//       yaw: medianYaw,
//       pitch: medianPitch,
//     },
//   }))

//   setCalibrationSamples([])

//   if (calibrationPoint < 4) {
//     calibrationPointStartTimeRef.current = Date.now()
//     lastCalibrationSampleTimeRef.current = 0
//     setCalibrationPoint((previous) => previous + 1)
//   } else {
//     setCalibrationStarted(false)

//     console.log('CALIBRATION COMPLETE')
//   }
// }, [
//   calibrationSamples,
//   calibrationPoint,
//   calibrationStarted,
// ])
  useEffect(() => {
  const fetchEyeState = async () => {
    try {
      const response = await fetch('/eye-api/gaze-state')

      if (!response.ok) {
        throw new Error(`Eye API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.success === false) {
        setEyeConnected(false)
        return
      }

      setEyeConnected(true)
      setCalibrationStarted(data.phase === 'calibration')
      setCalibrationPoint(data.current_point ?? 1)
      setVerificationCode(data.verification_code || [])
      setConfirmedPoints(data.confirmed_points || [])
      setNextExpected(data.next_expected ?? null)
      setCurrentPoint(data.current_point ?? null)
      setDone(data.verified === true)

      const totalPoints = data.verification_code?.length || 4
      const completedPoints = data.confirmed_points?.length || 0

      setProgress((completedPoints / totalPoints) * 100)

    } catch (error) {
      console.error('Eye API connection error:', error)
      setEyeConnected(false)
    }
  }

  fetchEyeState()

  const interval = setInterval(fetchEyeState, 200)

  return () => clearInterval(interval)
}, [])
const pointPositions: Record<number, { x: number; y: number }> = {
  1: { x: 40, y: 45 },
  2: { x: 440, y: 45 },
  3: { x: 40, y: 475 },
  4: { x: 440, y: 475 },
}

const signaturePath = confirmedPoints
  .map((point) => pointPositions[point])
  .filter(Boolean)
  .map((point) => `${point.x},${point.y}`)
  .join(' ')

  return (
    <ScreenContainer>
      <ScreenTitle title={t('sig.title')} subtitle={t('sig.subtitle')} />

      <Card style={{ marginBottom: 20 }}>
        <div
  style={{
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Plus Jakarta Sans, Cairo',
    fontWeight: 700,
    fontSize: 16,
    color: theme.primary,
  }}
>
  Verification Code:{' '}
  {verificationCode.length > 0
    ? verificationCode.join(' → ')
    : 'Waiting...'}
</div>
        <DarkCanvas height={520}>
          <video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  onLoadedMetadata={() => setCameraReady(true)}
  style={{
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scaleX(-1)',
    borderRadius: 18,
  }}
  />
  <div
  style={{
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 999,
    background: 'black',
    color: 'lime',
    padding: '6px 8px',
    fontSize: 11,
    borderRadius: 6,
  }}
>
  {eyeDebug}
</div>
   {calibrationStarted && (
  <>
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'white',
        fontWeight: 700,
        fontSize: 16,
        zIndex: 30,
        textShadow: '0 1px 5px rgba(0,0,0,0.8)',
      }}
    >
      Look at Point {calibrationPoint}
    </div>

    <div
      style={{
        position: 'absolute',

        left:
          calibrationPoint === 1 || calibrationPoint === 3
            ? `${(90 / 480) * 100}%`
            : `${(390 / 480) * 100}%`,

        top:
          calibrationPoint === 1 || calibrationPoint === 2
            ? `${(60 / 210) * 100}%`
            : `${(155 / 210) * 100}%`,

        width: 30,
        height: 30,
        borderRadius: '50%',
        background: theme.primary,
        border: '4px solid white',
        boxShadow: `0 0 22px ${theme.primary}`,
        transform: 'translate(-50%, -50%)',
        zIndex: 30,
      }}
    />
  </>
)}
{!calibrationStarted && detectedPoint !== null && (
  <div
    style={{
      position: 'absolute',
      top: 12,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'white',
      fontWeight: 700,
      fontSize: 16,
      zIndex: 30,
      textShadow: '0 1px 5px rgba(0,0,0,0.8)',
    }}
  >
    Detected Point: {detectedPoint}
  </div>
)}

          <svg width="100%" height="100%" viewBox="0 0 480 520"style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
           {[
  { cx: 40, cy: 45 },
  { cx: 440, cy: 45 },
  { cx: 40, cy: 475 },
  { cx: 440, cy: 475 }
].map((d, i) => (
              <g key={i}>
  <circle
    cx={d.cx}
    cy={d.cy}
    r={confirmedPoints.includes(i + 1) ? 11 : 7}
    fill={confirmedPoints.includes(i + 1) ? `${theme.primary}55` : `${theme.primary}25`}
    stroke={confirmedPoints.includes(i + 1) ? theme.primary : `${theme.primary}60`}
    strokeWidth={confirmedPoints.includes(i + 1) ? 3 : 1.5}
  />

  <circle
    cx={d.cx}
    cy={d.cy}
    r="2.5"
    fill={theme.primary}
  />

  <text
    x={d.cx}
    y={d.cy + 19}
    textAnchor="middle"
    fill={confirmedPoints.includes(i + 1) ? theme.primary : `${theme.primary}55`}
    fontSize="10"
    fontFamily="Inter"
  >
    {i + 1}
  </text>
</g>
            ))}
          {confirmedPoints.length >= 2 && (
  <polyline
    points={signaturePath}
    fill="none"
    stroke={theme.primary}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      filter: `drop-shadow(0 0 8px ${theme.primary}88)`
    }}
  />
)}
          </svg>
          {currentPoint && pointPositions[currentPoint] && (
  <div
    style={{
      position: 'absolute',
      left: `${(pointPositions[currentPoint].x / 480) * 100}%`,
      top: `${(pointPositions[currentPoint].y / 520) * 100}%`,
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: `${theme.primary}ee`,
      border: '2.5px solid white',
      boxShadow: `0 0 18px ${theme.primary}cc`,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 10,
      transition: 'left 0.15s ease, top 0.15s ease',
    }}
  />
)}
          {done && (
            <div className="animate-float-in" style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,16,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 18 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 50, marginBottom: 8 }}>✍️</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 20, color: theme.primary }}>{t('sig.done.msg')}</div>
              </div>
            </div>
          )}
        </DarkCanvas>

        <div style={{ marginTop: 16 }}>
          <ProgressBar progress={progress} color={theme.primary} label={t('sig.progress')} done={done} doneLabel={t('sig.captured')} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 14 }}>
          {[
            { label: t('sig.eye.cursor'), value: 'Active', color: theme.primary },
            { label: t('sig.tracking'), value: 'Stable', color: '#8B5CF6' },
            { label: t('sig.accuracy'), value: `${Math.min(Math.round(progress), 100)}%`, color: '#22c55e' },
            {
              label: t('sig.points'),
              value: `${confirmedPoints.length}/${verificationCode.length || 4}`,
              color: '#D97706'
            },
          ].map((m) => (
            <div key={m.label} style={{ background: theme.primaryLight, borderRadius: 10, padding: '8px 6px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 13, color: m.color }}>{m.value}</div>
              <div style={{ fontFamily: 'Inter, Cairo', fontSize: 10, color: theme.textMuted }}>{m.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <BigButton onClick={onNext} variant="primary" disabled={!done}>{t('sig.submit')}</BigButton>
    </ScreenContainer>
  )
}

// ─── C7: Final Signature Confirmation (2nd permission) ────────────────────────
// ─── C7: Final Signature Confirmation (2nd permission) ───────────────────────
function C7FinalConfirmation({
  onNext,
  procedure,
}: {
  onNext: () => void
  procedure: string
}) {
  const { t, theme } = useApp()

  const [choice, setChoice] = useState<
    'yes' | 'no' | null
  >(null)

  const [counting, setCounting] = useState<
    'yes' | 'no' | null
  >(null)

  // Camera
  const videoRef =
    useRef<HTMLVideoElement>(null)

  const streamRef =
    useRef<MediaStream | null>(null)

  const [cameraReady, setCameraReady] =
    useState(false)

  const [faceDetected, setFaceDetected] =
    useState<boolean | null>(null)

  // Blink
  const blinkStartRef =
    useRef<number | null>(null)

  const lastBlinkValueRef =
    useRef(false)

  const beepedSecondsRef =
    useRef<number[]>([])

  const completedRef =
    useRef(false)

  const processingRef =
    useRef(false)

  const playBeep = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext
        }).webkitAudioContext

      if (!AudioContextClass) return

      const audioContext =
        new AudioContextClass()

      const oscillator =
        audioContext.createOscillator()

      const gain =
        audioContext.createGain()

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gain.gain.setValueAtTime(
        0.15,
        audioContext.currentTime
      )

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.15
      )

      oscillator.connect(gain)
      gain.connect(
        audioContext.destination
      )

      oscillator.start()

      oscillator.stop(
        audioContext.currentTime + 0.15
      )
    } catch {
      // Ignore audio errors
    }
  }

  // ─────────────────────────────────────
  // Start camera
  // ─────────────────────────────────────
  useEffect(() => {
    let active = true

    const startCamera = async () => {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: {
                facingMode: 'user',
              },
              audio: false,
            }
          )

        if (!active) {
          stream
            .getTracks()
            .forEach((track) =>
              track.stop()
            )

          return
        }

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject =
            stream
        }

        setCameraReady(true)
      } catch (error) {
        console.error(
          'C7 camera error:',
          error
        )

        setCameraReady(false)
        setFaceDetected(false)
      }
    }

    startCamera()

    return () => {
      active = false

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          )

        streamRef.current = null
      }
    }
  }, [])

  // ─────────────────────────────────────
  // Face detection
  // ─────────────────────────────────────
  useEffect(() => {
    if (!cameraReady) return

    let active = true

    const checkFace = async () => {
      if (
        !videoRef.current ||
        processingRef.current
      ) {
        return
      }

      const video =
        videoRef.current

      if (
        video.videoWidth === 0 ||
        video.videoHeight === 0
      ) {
        return
      }

      processingRef.current = true

      try {
        const canvas =
          document.createElement(
            'canvas'
          )

        canvas.width =
          video.videoWidth

        canvas.height =
          video.videoHeight

        const context =
          canvas.getContext('2d')

        if (!context) return

        context.drawImage(
          video,
          0,
          0,
          canvas.width,
          canvas.height
        )

        const blob =
          await new Promise<Blob | null>(
            (resolve) => {
              canvas.toBlob(
                resolve,
                'image/jpeg',
                0.8
              )
            }
          )

        if (!blob || !active) return

        const formData =
          new FormData()

        formData.append(
          'file',
          blob,
          'c7-face-check.jpg'
        )

        const response =
          await fetch(
            '/eye-api/process-frame',
            {
              method: 'POST',
              body: formData,
            }
          )

        if (!response.ok) return

        const data =
          await response.json()

        if (
          typeof data.face_detected ===
          'boolean'
        ) {
          setFaceDetected(
            data.face_detected
          )
        }
      } catch (error) {
        console.error(
          'C7 face detection error:',
          error
        )
      } finally {
        processingRef.current = false
      }
    }

    const interval =
      setInterval(
        checkFace,
        500
      )

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [cameraReady])

  // ─────────────────────────────────────
  // Blink detection
  // ─────────────────────────────────────
  useEffect(() => {
    const checkBlink = async () => {
      try {
        const response =
          await fetch(
            '/eye-api/gaze-state'
          )

        if (!response.ok) return

        const data =
          await response.json()

        const blink =
          data.blink === true

        const now =
          performance.now()

        // بدأ إغلاق العين
        if (
          blink &&
          !lastBlinkValueRef.current
        ) {
          blinkStartRef.current =
            now

          beepedSecondsRef.current =
            []

          setCounting(null)

          console.log(
            'C7: BLINK START'
          )
        }

        // العين ما زالت مغلقة
        if (
          blink &&
          blinkStartRef.current !== null &&
          !completedRef.current
        ) {
          const elapsed =
            (now -
              blinkStartRef.current) /
            1000

          for (
            const second of [1, 2, 3]
          ) {
            if (
              elapsed >= second &&
              !beepedSecondsRef.current.includes(
                second
              )
            ) {
              beepedSecondsRef.current.push(
                second
              )

              playBeep()

              console.log(
                `C7: ${second} SECOND`
              )

              if (second === 2) {
                setCounting('yes')
              }

              if (second === 3) {
                setCounting('no')
              }
            }
          }
        }

        // العين انفتحت
        if (
          !blink &&
          lastBlinkValueRef.current
        ) {
          if (
            blinkStartRef.current !==
              null &&
            !completedRef.current
          ) {
            const duration =
              (now -
                blinkStartRef.current) /
              1000

            console.log(
              'C7: BLINK END',
              duration
            )

            if (
              duration >= 2 &&
              duration < 3
            ) {
              completedRef.current =
                true

              setChoice('yes')
              setCounting(null)

              console.log(
                'C7: YES'
              )

              setTimeout(
                onNext,
                300
              )
            } else if (
              duration >= 3
            ) {
              completedRef.current =
                true

              setChoice('no')
              setCounting(null)

              console.log(
                'C7: NO'
              )
            }
          }

          blinkStartRef.current =
            null

          beepedSecondsRef.current =
            []
        }

        lastBlinkValueRef.current =
          blink
      } catch (error) {
        console.error(
          'C7 blink state error:',
          error
        )
      }
    }

    const interval =
      setInterval(
        checkBlink,
        100
      )

    return () => {
      clearInterval(interval)
    }
  }, [onNext])

  const summary = [
    [
      t('final.patient'),
      'Mohammed Al-Rashidi',
    ],
    [
      t('pid.mrn'),
      'MRN-2026-45821',
    ],
    [
      t('final.procedure'),
      procedure,
    ],
    [
      t('final.signature'),
      'Eye Signature — Completed',
    ],
    [
      t('final.datetime'),
      '24 Sep 2026 · 19:56',
    ],
    [
      t('final.type'),
      'Digital Eye Signature — KSUMC',
    ],
  ]

  return (
    <ScreenContainer>
      <ScreenTitle
        title={t('final.title')}
        subtitle={t('final.subtitle')}
      />

      {/* Camera preview */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 220,
            height: 165,
            borderRadius: 16,
            overflow: 'hidden',
            position: 'relative',
            background: '#050510',
            border:
              `2px solid ${
                faceDetected === true
                  ? '#16a34a'
                  : faceDetected === false
                    ? '#EF4444'
                    : theme.border
              }`,
            boxShadow:
              '0 4px 16px rgba(0,0,0,0.15)',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)',
            }}
          />

          {!cameraReady && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 12,
                fontFamily:
                  'Inter, Cairo',
              }}
            >
              Starting camera...
            </div>
          )}
        </div>

        {/* Face status */}
        <div
          style={{
            marginTop: 8,
            fontFamily:
              'Plus Jakarta Sans, Cairo',
            fontWeight: 700,
            fontSize: 13,
            color:
              faceDetected === true
                ? '#15803d'
                : faceDetected === false
                  ? '#B91C1C'
                  : theme.textMuted,
          }}
        >
          {faceDetected === true
            ? '🟢 Face detected'
            : faceDetected === false
              ? '🔴 No face detected'
              : '⚪ Detecting face...'}
        </div>
      </div>

      {/* Signature summary */}
      <Card
        style={{
          marginBottom: 20,
        }}
      >
        <h3
          style={{
            fontFamily:
              'Plus Jakarta Sans, Cairo',
            fontWeight: 700,
            fontSize: 14,
            color: theme.text,
            marginBottom: 14,
          }}
        >
          {t('final.summary')}
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginBottom: 20,
          }}
        >
          {summary.map(
            ([k, v]) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding:
                    '9px 12px',
                  background:
                    theme.primaryLight,
                  borderRadius: 10,
                }}
              >
                <span
                  style={{
                    fontFamily:
                      'Inter',
                    fontSize: 12,
                    color:
                      theme.textMuted,
                    minWidth: 110,
                  }}
                >
                  {k}
                </span>

                <span
                  style={{
                    fontFamily:
                      'Plus Jakarta Sans, Cairo',
                    fontWeight: 600,
                    fontSize: 13,
                    color:
                      theme.text,
                    flex: 1,
                  }}
                >
                  {v}
                </span>
              </div>
            )
          )}
        </div>

        <div
          style={{
            height: 1,
            background: theme.border,
            marginBottom: 18,
          }}
        />

        <h3
          style={{
            fontFamily:
              'Plus Jakarta Sans, Cairo',
            fontWeight: 700,
            fontSize: 15,
            color: theme.text,
            marginBottom: 14,
          }}
        >
          {t('perm.final.question')}
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1fr 1fr',
            gap: 14,
            marginBottom: 14,
          }}
        >
          <button
            onClick={() => {
              setChoice('yes')
              setCounting('yes')

              setTimeout(
                onNext,
                300
              )
            }}
            style={{
              background:
                choice === 'yes'
                  ? '#F0FDF4'
                  : theme.card,
              border:
                `2.5px solid ${
                  choice === 'yes'
                    ? '#16a34a'
                    : theme.border
                }`,
              borderRadius: 16,
              padding:
                '20px 14px',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 30,
                marginBottom: 6,
              }}
            >
              ✅
            </div>

            <div
              style={{
                fontFamily:
                  'Plus Jakarta Sans, Cairo',
                fontWeight: 800,
                fontSize: 18,
                color: '#16a34a',
              }}
            >
              {t('perm.yes')}
            </div>

            <div
              style={{
                fontFamily:
                  'Inter, Cairo',
                fontSize: 11,
                color:
                  theme.textMuted,
                marginTop: 4,
              }}
            >
              {t(
                'perm.yes.instruction'
              )}
            </div>
          </button>

          <button
            onClick={() => {
              setChoice('no')
              setCounting('no')
            }}
            style={{
              background:
                choice === 'no'
                  ? theme.dangerLight
                  : theme.card,
              border:
                `2.5px solid ${
                  choice === 'no'
                    ? theme.danger
                    : theme.border
                }`,
              borderRadius: 16,
              padding:
                '20px 14px',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 30,
                marginBottom: 6,
              }}
            >
              ❌
            </div>

            <div
              style={{
                fontFamily:
                  'Plus Jakarta Sans, Cairo',
                fontWeight: 800,
                fontSize: 18,
                color:
                  theme.danger,
              }}
            >
              {t('perm.no')}
            </div>

            <div
              style={{
                fontFamily:
                  'Inter, Cairo',
                fontSize: 11,
                color:
                  theme.textMuted,
                marginTop: 4,
              }}
            >
              {t(
                'perm.no.instruction'
              )}
            </div>
          </button>
        </div>

        {counting && (
          <div
            className="animate-float-in"
            style={{
              display: 'flex',
              justifyContent:
                'center',
              padding: '18px',
              background:
                counting === 'yes'
                  ? '#F0FDF4'
                  : theme.dangerLight,
              borderRadius: 14,
              border:
                `1px solid ${
                  counting === 'yes'
                    ? '#86EFAC'
                    : '#FECACA'
                }`,
            }}
          >
            <CountdownTimer
              seconds={
                counting === 'yes'
                  ? 3
                  : 5
              }
              label={
                counting === 'yes'
                  ? t(
                      'perm.yes.counting'
                    )
                  : t(
                      'perm.no.counting'
                    )
              }
              color={
                counting === 'yes'
                  ? '#16a34a'
                  : theme.danger
              }
            />
          </div>
        )}
      </Card>
    </ScreenContainer>
  )
}

// ─── C8: Medical Record ────────────────────────────────────────────────────────
function C8Record({ onBack, procedure }: { onBack: () => void; procedure: string }) {
  const { t, theme } = useApp()

  return (
    <ScreenContainer>
      <div style={{ textAlign: 'center', marginBottom: 26 }}>
        <div className="animate-badge-pop" style={{ width: 100, height: 100, borderRadius: '50%', background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: `0 10px 36px ${theme.primary}44` }}>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <path d="M10 25L20 35L40 15" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="80" className="animate-checkmark" />
          </svg>
        </div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 26, color: theme.text, marginBottom: 6 }}>{t('record.title')}</h1>
        <p style={{ fontFamily: 'Inter, Cairo', fontSize: 14, color: theme.textMuted }}>{t('record.subtitle')}</p>
      </div>

      <Card style={{ marginBottom: 18 }}>
        {/* Record header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, paddingBottom: 14, borderBottom: `1.5px solid ${theme.border}` }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="2" width="16" height="18" rx="3" stroke="white" strokeWidth="1.8" />
              <path d="M7 8h8M7 11.5h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 14, color: theme.primary }}>{t('header.title')}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, color: theme.textMuted }}>Digital Medical Consent Record</div>
          </div>
          <div style={{ marginLeft: 'auto', background: theme.primaryLight, border: `1px solid ${theme.border}`, borderRadius: 20, padding: '3px 10px' }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 10, color: theme.primary }}>{t('common.signed')}</span>
          </div>
        </div>

        {/* Patient info */}
        <p style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 10, color: theme.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('record.section.patient')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
          {[['Mohammed Al-Rashidi', t('pid.name')], ['MRN-2026-45821', t('pid.mrn')], ['14 March 1975', t('pid.dob')], ['Gastroenterology', t('pid.dept')]].map(([v, k]) => (
            <div key={k} style={{ background: theme.primaryLight, borderRadius: 10, padding: '8px 12px' }}>
              <div style={{ fontFamily: 'Inter', fontSize: 10, color: theme.textMuted, marginBottom: 1 }}>{k}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 600, fontSize: 13, color: theme.text }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Procedure */}
        <p style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 10, color: theme.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('record.section.procedure')}</p>
        <div style={{ background: theme.primaryLight, border: `1.5px solid ${theme.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[[procedure, 'Procedure'], ['Eye Signature', 'Type'], ['24 Sep 2026', 'Date'], ['19:56:33 AST', 'Time']].map(([v, k]) => (
              <div key={k}>
                <div style={{ fontFamily: 'Inter', fontSize: 10, color: theme.textMuted, marginBottom: 1 }}>{k}</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 13, color: theme.primary }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification */}
        <p style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 10, color: theme.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('record.section.security')}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <VerificationBadge label={t('record.badge.sig')} delay={0} />
          <VerificationBadge label={t('record.badge.face')} delay={100} />
          <VerificationBadge label={t('record.badge.id')} delay={200} />
          <VerificationBadge label={t('record.badge.time')} delay={300} />
          <VerificationBadge label={t('record.badge.device')} delay={400} />
        </div>

        {/* Secure storage bar */}
        <div style={{ background: '#0A1628', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="5" y="13" width="18" height="12" rx="3" fill={theme.primary} opacity="0.8" />
            <path d="M9 13V9a5 5 0 0110 0v4" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="14" cy="19" r="2" fill="white" />
          </svg>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 12, color: 'white' }}>{t('record.stored')}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#888' }}>{t('record.compliance')} · Ref: KSUMC-CL-2026-09-45821</div>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <button style={{ background: theme.primaryLight, border: `2px solid ${theme.border}`, borderRadius: 12, padding: '12px', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 13, color: theme.primary }}>{t('record.print')}</button>
        <button style={{ background: theme.primaryLight, border: `2px solid ${theme.primary}`, borderRadius: 12, padding: '12px', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 13, color: theme.primary }}>{t('record.share')}</button>
      </div>

      <BigButton onClick={onBack} variant="primary">{t('record.home')}</BigButton>
    </ScreenContainer>
  )
}

