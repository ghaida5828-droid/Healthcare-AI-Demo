import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Header, PageShell, Card, BigButton } from '../components/shared'

interface Props { onBack: () => void }

export default function DoctorDashboard({ onBack }: Props) {
  const { t, theme, isDark } = useApp()
  const [activeTab, setActiveTab] = useState<'overview' | 'fixation' | 'saccades' | 'smooth' | 'drawing'>('overview')

  const tabs: [typeof activeTab, string][] = [
    ['overview', t('dash.tab.overview')],
    ['fixation', t('dash.tab.fixation')],
    ['saccades', t('dash.tab.saccades')],
    ['smooth', t('dash.tab.smooth')],
    ['drawing', t('dash.tab.drawing')],
  ]

  return (
    <PageShell>
      <Header mode="clinical" onBack={onBack} flowLabel={t('dash.title')} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px' }}>
        {/* Header row */}
        <div className="animate-float-in" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${theme.primary}44` }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="14" width="4" height="8" rx="1" fill="white" />
                  <rect x="10" y="9" width="4" height="13" rx="1" fill="white" />
                  <rect x="18" y="5" width="4" height="17" rx="1" fill="white" />
                  <path d="M3 8l5-4 5 3 5-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h1 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 800, fontSize: 20, color: theme.text }}>{t('dash.title')}</h1>
                <p style={{ fontFamily: 'Inter', fontSize: 12, color: theme.textMuted }}>{t('dash.subtitle')}</p>
              </div>
            </div>
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 20, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13 }}>🔬</span>
              <span style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 11, color: '#92400E' }}>{t('dash.preview')}</span>
            </div>
          </div>

          {/* Patient card */}
          <div style={{ background: theme.card, borderRadius: 14, border: `1.5px solid ${theme.border}`, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 15, color: 'white' }}>MA</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text }}>{t('dash.patient')}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: theme.textMuted }}>{t('dash.mrn')}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <span style={{ background: theme.primaryLight, borderRadius: 20, padding: '3px 10px', fontFamily: 'Inter', fontWeight: 600, fontSize: 11, color: theme.primary }}>{t('dash.sessions')}</span>
              <span style={{ background: '#F0FDF4', borderRadius: 20, padding: '3px 10px', fontFamily: 'Inter', fontWeight: 600, fontSize: 11, color: '#16a34a' }}>{t('common.active')}</span>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
          {[
            { label: t('dash.overall'), value: '87%', sub: '+4% from last', icon: '🎯', color: theme.primary, bg: theme.primaryLight },
            { label: t('dash.fixation'), value: '92%', sub: 'Excellent stability', icon: '🔴', color: '#8B5CF6', bg: '#F3F0FF' },
            { label: t('dash.saccades'), value: '78%', sub: 'Good accuracy', icon: '⚡', color: '#D97706', bg: '#FEF3C7' },
            { label: t('dash.smooth'), value: '88%', sub: 'Above average', icon: '〰️', color: '#16a34a', bg: '#F0FDF4' },
          ].map((kpi) => (
            <div key={kpi.label} className="animate-float-in" style={{ background: theme.card, borderRadius: 16, padding: '16px 14px', border: `1.5px solid ${theme.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{kpi.icon}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 24, color: kpi.color, marginBottom: 1 }}>{kpi.value}</div>
              <div style={{ fontFamily: 'Inter, Cairo', fontWeight: 500, fontSize: 12, color: theme.text, marginBottom: 2 }}>{kpi.label}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 10, color: theme.textMuted }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 18, background: theme.card, padding: '5px', borderRadius: 14, border: `1.5px solid ${theme.border}`, width: 'fit-content', flexWrap: 'wrap' }}>
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                background: activeTab === key ? theme.primary : 'transparent',
                color: activeTab === key ? '#fff' : theme.textMuted,
                border: 'none', borderRadius: 10, padding: '7px 14px',
                fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 600, fontSize: 12,
                cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'fixation' && <FixationTab />}
        {activeTab === 'saccades' && <SaccadesTab />}
        {activeTab === 'smooth' && <SmoothPursuitTab />}
        {activeTab === 'drawing' && <EyeDrawingTab />}
      </div>
    </PageShell>
  )
}

function OverviewTab() {
  const { t, theme } = useApp()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <Card>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 14 }}>{t('dash.progress')}</h3>
        <TimelineChart />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
          {[['S1', '72%', '10 Sep'], ['S2', '83%', '17 Sep'], ['S3', '87%', '24 Sep']].map(([s, v, d]) => (
            <div key={s} style={{ background: theme.primaryLight, borderRadius: 10, padding: '8px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: theme.primary }}>{v}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 10, color: theme.textMuted }}>{s} · {d}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 14 }}>{t('dash.profile')}</h3>
        <RadarChart />
      </Card>

      <Card style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 14 }}>{t('dash.assessment')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { metric: t('dash.fixation'), score: 92, desc: 'Gaze stability within 1.2° radius', color: '#8B5CF6' },
            { metric: t('dash.saccades'), score: 78, desc: 'Latency 180ms avg, accuracy 94%', color: '#D97706' },
            { metric: t('dash.smooth'), score: 88, desc: 'Gain 0.92, velocity match 89%', color: '#16a34a' },
            { metric: 'Response Time', score: 82, desc: 'Below 200ms threshold — normal', color: theme.primary },
          ].map((m) => (
            <div key={m.metric} style={{ background: theme.primaryLight, borderRadius: 12, padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 13, color: theme.text }}>{m.metric}</span>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 13, color: m.color }}>{m.score}%</span>
              </div>
              <div style={{ height: 4, background: `${m.color}22`, borderRadius: 2, marginBottom: 6 }}>
                <div style={{ height: '100%', width: `${m.score}%`, background: m.color, borderRadius: 2 }} />
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: 10, color: theme.textMuted, lineHeight: 1.4 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function FixationTab() {
  const { t, theme } = useApp()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <Card>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 14 }}>Fixation Stability Map</h3>
        <FixationMap />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
          {[['92%', 'Stability Score', '#8B5CF6'], ['1.2°', 'Mean Deviation', theme.primary], ['4.2/s', 'Microsaccades', '#D97706'], ['1250ms', 'Duration avg', '#16a34a']].map(([v, k, c]) => (
            <div key={k} style={{ background: theme.primaryLight, borderRadius: 10, padding: '8px 12px' }}>
              <div style={{ fontFamily: 'Inter', fontSize: 10, color: theme.textMuted }}>{k}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 16, color: c as string }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 14 }}>Fixation Over Time</h3>
        <LineChart color={theme.primary} data={[65, 72, 78, 80, 85, 88, 92, 90, 92]} />
      </Card>
    </div>
  )
}

function SaccadesTab() {
  const { t, theme } = useApp()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <Card>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 14 }}>Saccade Accuracy by Target</h3>
        <BarChart color="#D97706" data={[85, 78, 82, 76, 80, 88, 74, 82]} labels={['L1','L2','L3','L4','R1','R2','R3','R4']} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
          {[['78%', 'Accuracy', '#D97706'], ['180ms', 'Latency', theme.primary], ['340°/s', 'Peak Vel.', '#16a34a']].map(([v, k, c]) => (
            <div key={k} style={{ background: theme.primaryLight, borderRadius: 10, padding: '8px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 18, color: c as string }}>{v}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 10, color: theme.textMuted }}>{k}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 14 }}>Progression Over Sessions</h3>
        <LineChart color="#D97706" data={[60, 68, 70, 74, 76, 78, 78]} />
      </Card>
    </div>
  )
}

function SmoothPursuitTab() {
  const { t, theme } = useApp()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <Card>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 14 }}>Smooth Pursuit Gain</h3>
        <SmoothPursuitViz />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
          {[['0.92', 'Gain', '#16a34a'], ['89%', 'Velocity Match', theme.primary], ['3.1/s', 'Catch-up Sacc.', '#D97706'], ['88%', 'Smoothness', '#8B5CF6']].map(([v, k, c]) => (
            <div key={k} style={{ background: theme.primaryLight, borderRadius: 10, padding: '8px 12px' }}>
              <div style={{ fontFamily: 'Inter', fontSize: 10, color: theme.textMuted }}>{k}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 16, color: c as string }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 14 }}>Gain Over Sessions</h3>
        <LineChart color="#16a34a" data={[75, 80, 84, 86, 88, 90, 92]} />
      </Card>
    </div>
  )
}

function EyeDrawingTab() {
  const { t, theme } = useApp()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <Card>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 14 }}>Eye Signature Drawing Analysis</h3>
        <div style={{ background: '#050510', borderRadius: 14, overflow: 'hidden', height: 170, position: 'relative', marginBottom: 14 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${theme.primary}08 1px, transparent 1px), linear-gradient(90deg, ${theme.primary}08 1px, transparent 1px)`, backgroundSize: '26px 26px' }} />
          <svg width="100%" height="100%" viewBox="0 0 360 170" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <path d="M36,85 C58,70 82,48 108,44 C134,40 158,122 178,130 C198,138 222,54 248,50 C274,46 298,106 326,104" fill="none" stroke={theme.primary} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="900" className="stroke-dash-path animate-draw-path" style={{ filter: `drop-shadow(0 0 6px ${theme.primary}88)` }} />
            <path d="M36,90 C60,76 84,50 110,48 C136,46 160,124 180,132 C200,140 224,56 250,54 C276,52 302,110 330,106" fill="none" stroke={`${theme.primary}40`} strokeWidth="1" strokeLinecap="round" strokeDasharray="900" className="stroke-dash-path animate-draw-path" style={{ animationDelay: '0.4s' }} />
          </svg>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[['94%', 'Accuracy', '#16a34a'], ['88%', 'Smoothness', theme.primary], ['175ms', 'Response', '#D97706']].map(([v, k, c]) => (
            <div key={k} style={{ background: theme.primaryLight, borderRadius: 9, padding: '8px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 17, color: c as string }}>{v}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 10, color: theme.textMuted }}>{k}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 14, color: theme.text, marginBottom: 14 }}>Session Comparison</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Session 1 — 10 Sep', acc: 82, smooth: 76, resp: 210 },
            { label: 'Session 2 — 17 Sep', acc: 88, smooth: 83, resp: 195 },
            { label: 'Session 3 — 24 Sep', acc: 94, smooth: 88, resp: 175 },
          ].map((s, i) => (
            <div key={i} style={{ background: theme.primaryLight, borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans, Cairo', fontWeight: 700, fontSize: 12, color: theme.text }}>{s.label}</span>
                {i === 2 && <span style={{ fontFamily: 'Inter', fontSize: 10, color: '#16a34a', fontWeight: 700 }}>↑ Best</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                {[[s.acc, 'Accuracy', '#16a34a'], [s.smooth, 'Smooth', theme.primary], [100 - (s.resp - 150) / 2, 'Response', '#D97706']].map(([val, k, c]) => (
                  <div key={k as string}>
                    <div style={{ fontFamily: 'Inter', fontSize: 9, color: theme.textMuted, marginBottom: 2 }}>{k}</div>
                    <div style={{ height: 3, background: `${c}22`, borderRadius: 2, marginBottom: 3 }}>
                      <div style={{ height: '100%', width: `${val}%`, background: c as string, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 11, color: c as string }}>
                      {k === 'Response' ? `${s.resp}ms` : `${val}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── SVG Chart Helpers ────────────────────────────────────────────────────────
function TimelineChart() {
  const { theme } = useApp()
  const sessions = [{ x: 20, score: 72 }, { x: 50, score: 83 }, { x: 80, score: 87 }]
  const toY = (s: number) => 100 - s + 8
  return (
    <svg width="100%" height="110" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="tlGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.primary} stopOpacity="0.25" />
          <stop offset="100%" stopColor={theme.primary} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${sessions[0].x},${toY(sessions[0].score)} ${sessions.slice(1).map(s => `L${s.x},${toY(s.score)}`).join(' ')} L${sessions[sessions.length-1].x},95 L${sessions[0].x},95 Z`} fill="url(#tlGrad)" />
      <path d={sessions.map((s,i) => `${i===0?'M':'L'}${s.x},${toY(s.score)}`).join(' ')} fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" />
      {sessions.map((s,i) => <g key={i}><circle cx={s.x} cy={toY(s.score)} r="3" fill={theme.primary} stroke="white" strokeWidth="1.5" /><text x={s.x} y={toY(s.score)-6} textAnchor="middle" fill={theme.primary} fontSize="7" fontWeight="700">{s.score}%</text></g>)}
    </svg>
  )
}

function LineChart({ color, data }: { color: string; data: number[] }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const w = 100 / (data.length - 1)
  const pts = data.map((v, i) => ({ x: i * w, y: 85 - ((v - min) / range) * 70 }))
  return (
    <svg width="100%" height="130" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={`grad${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25,50,75].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#E5E7EB" strokeWidth="0.5" />)}
      <path d={`M${pts[0].x},${pts[0].y} ${pts.slice(1).map(p=>`L${p.x},${p.y}`).join(' ')} L${pts[pts.length-1].x},90 L${pts[0].x},90 Z`} fill={`url(#grad${color.replace('#','')})`} />
      <path d={pts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {pts.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color} stroke="white" strokeWidth="1" />)}
    </svg>
  )
}

function BarChart({ color, data, labels }: { color: string; data: number[]; labels: string[] }) {
  const max = Math.max(...data), bw = 100 / data.length
  return (
    <svg width="100%" height="130" viewBox="0 0 100 100">
      {[25,50,75].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#E5E7EB" strokeWidth="0.5" />)}
      {data.map((v, i) => {
        const h = (v / max) * 70, x = i * bw + bw * 0.15, w = bw * 0.7
        return (
          <g key={i}>
            <rect x={x} y={85 - h} width={w} height={h} rx="2" fill={color} opacity="0.85" />
            <text x={x + w/2} y={97} textAnchor="middle" fill="#888" fontSize="5" fontFamily="Inter">{labels[i]}</text>
            <text x={x + w/2} y={85 - h - 3} textAnchor="middle" fill={color} fontSize="5" fontWeight="700">{v}%</text>
          </g>
        )
      })}
    </svg>
  )
}

function RadarChart() {
  const { theme } = useApp()
  const metrics = [
    { label: 'Fixation', value: 0.92 }, { label: 'Saccades', value: 0.78 },
    { label: 'Pursuit', value: 0.88 }, { label: 'Response', value: 0.82 },
    { label: 'Drawing', value: 0.94 }, { label: 'Overall', value: 0.87 },
  ]
  const cx = 50, cy = 50, r = 35, step = (2 * Math.PI) / metrics.length
  const toPoint = (i: number, val: number) => ({ x: cx + r * val * Math.sin(i * step), y: cy - r * val * Math.cos(i * step) })
  const outer = metrics.map((_, i) => toPoint(i, 1))
  const inner = metrics.map((m, i) => toPoint(i, m.value))
  return (
    <svg width="100%" height="170" viewBox="0 0 100 100">
      {[0.25, 0.5, 0.75, 1].map(r_ => <polygon key={r_} points={outer.map(p => { const dx = p.x - cx, dy = p.y - cy; return `${cx + dx*r_},${cy + dy*r_}` }).join(' ')} fill="none" stroke={`${theme.primary}22`} strokeWidth="0.5" />)}
      {outer.map((p, i) => <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={`${theme.primary}22`} strokeWidth="0.5" />)}
      <polygon points={inner.map(p => `${p.x},${p.y}`).join(' ')} fill={`${theme.primary}25`} stroke={theme.primary} strokeWidth="1.5" />
      {inner.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2" fill={theme.primary} />)}
      {metrics.map((m, i) => { const p = toPoint(i, 1.2); return <text key={m.label} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill={theme.textMuted} fontSize="5.5" fontFamily="Inter" fontWeight="600">{m.label}</text> })}
    </svg>
  )
}

function FixationMap() {
  const { theme } = useApp()
  return (
    <div style={{ background: '#050510', borderRadius: 12, height: 130, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, ${theme.primary}08 1px, transparent 1px)`, backgroundSize: '18px 18px' }} />
      <svg width="100%" height="100%" viewBox="0 0 200 120" style={{ position: 'absolute', inset: 0 }}>
        {[32, 25, 18, 11, 5].map(r => <circle key={r} cx="100" cy="60" r={r} fill="none" stroke={`${theme.primary}${Math.round((35-r)*5).toString(16)}`} strokeWidth="0.8" />)}
        <line x1="97" y1="60" x2="103" y2="60" stroke={theme.primary} strokeWidth="1.5" />
        <line x1="100" y1="57" x2="100" y2="63" stroke={theme.primary} strokeWidth="1.5" />
        {[{x:100,y:60,r:3,op:0.9},{x:102,y:58,r:2,op:0.7},{x:99,y:62,r:2,op:0.6},{x:101,y:59,r:2,op:0.8},{x:98,y:61,r:1.5,op:0.5}].map((d,i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#DC2626" opacity={d.op} style={{filter:`blur(${d.r*0.4}px)`}} />)}
      </svg>
      <div style={{ position: 'absolute', bottom: 6, right: 8 }}>
        <span style={{ fontFamily: 'Inter', fontSize: 9, color: '#888', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: 10 }}>92% within 2°</span>
      </div>
    </div>
  )
}

function SmoothPursuitViz() {
  const { theme } = useApp()
  return (
    <div style={{ background: '#050510', borderRadius: 12, height: 130, position: 'relative', overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox="0 0 300 120">
        <path d="M20,60 Q50,20 80,60 Q110,100 140,60 Q170,20 200,60 Q230,100 260,60 Q280,40 290,50" fill="none" stroke={`${theme.primary}50`} strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M20,62 Q50,24 80,62 Q110,98 140,58 Q170,18 200,62 Q230,102 260,58 Q280,42 290,52" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeDasharray="900" className="stroke-dash-path animate-draw-path" style={{ filter: 'drop-shadow(0 0 4px rgba(217,119,6,0.5))' }} />
        <rect x="20" y="108" width="8" height="2" rx="1" fill={`${theme.primary}50`} />
        <text x="32" y="111" fill="#888" fontSize="6" fontFamily="Inter">Target</text>
        <rect x="75" y="108" width="8" height="2" rx="1" fill="#D97706" />
        <text x="87" y="111" fill="#888" fontSize="6" fontFamily="Inter">Eye tracking (gain 0.92)</text>
      </svg>
    </div>
  )
}
