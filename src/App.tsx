import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import WelcomeScreen from './screens/WelcomeScreen'
import EmergencyFlow from './screens/EmergencyFlow'
import ClinicalFlow from './screens/ClinicalFlow'
import DoctorDashboard from './screens/DoctorDashboard'

type AppScreen = 'welcome' | 'emergency' | 'clinical' | 'dashboard'

function AppContent() {
  const [screen, setScreen] = useState<AppScreen>('welcome')
  const { dir, isDark } = useApp()

  return (
    <div dir={dir} style={{ minHeight: '100vh', background: isDark ? '#060F1E' : '#EEF5FB' }}>
      {screen === 'welcome' && (
        <WelcomeScreen
          onEmergency={() => setScreen('emergency')}
          onClinical={() => setScreen('clinical')}
          onDashboard={() => setScreen('dashboard')}
        />
      )}
      {screen === 'emergency' && <EmergencyFlow onBack={() => setScreen('welcome')} />}
      {screen === 'clinical' && <ClinicalFlow onBack={() => setScreen('welcome')} />}
      {screen === 'dashboard' && <DoctorDashboard onBack={() => setScreen('welcome')} />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}


