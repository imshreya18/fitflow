import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { AppStateProvider } from '@/context/AppStateContext'
import AppShell from '@/components/layout/AppShell'

import Landing from '@/pages/Landing'
import Auth from '@/pages/Auth'
import Onboarding from '@/pages/Onboarding'
import Home from '@/pages/Home'
import Courses from '@/pages/Courses'
import CourseDetails from '@/pages/CourseDetails'
import Workout from '@/pages/Workout'
import Music from '@/pages/Music'
import Community from '@/pages/Community'
import Progress from '@/pages/Progress'
import Goals from '@/pages/Goals'
import Streaks from '@/pages/Streaks'
import AICoach from '@/pages/AICoach'
import Voice from '@/pages/Voice'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import Notifications from '@/pages/Notifications'

export default function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />

            <Route path="/app" element={<AppShell />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetails />} />
              <Route path="workout" element={<Workout />} />
              <Route path="music" element={<Music />} />
              <Route path="community" element={<Community />} />
              <Route path="progress" element={<Progress />} />
              <Route path="goals" element={<Goals />} />
              <Route path="streaks" element={<Streaks />} />
              <Route path="coach" element={<AICoach />} />
              <Route path="voice" element={<Voice />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}
