import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { PublicLanding } from './screens/PublicLanding';
import { AuthScreen } from './screens/AuthScreen';
import { DashboardLayout } from './layouts/DashboardLayout';
import { IntelligenceScreen } from './screens/IntelligenceScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { DiagnosticsListScreen } from './screens/DiagnosticsListScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AnalysisResult } from './types';
import { getSession, clearSession, isAuthenticated as checkAuth } from './services/session';

export default function App() {
  // Initialize directly from localStorage so page reloads preserve the session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => checkAuth());
  const [session, setSession] = useState(() => getSession());
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const saved = localStorage.getItem('happycrops_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const addHistory = (result: AnalysisResult) => {
    const newHistory = [result, ...history].slice(0, 20); // Keep last 20
    setHistory(newHistory);
    localStorage.setItem('happycrops_history', JSON.stringify(newHistory));
  };

  const deleteHistory = (timestamp: number) => {
    const newHistory = history.filter(h => h.timestamp !== timestamp);
    setHistory(newHistory);
    localStorage.setItem('happycrops_history', JSON.stringify(newHistory));
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route 
            path="/" 
            element={!isAuthenticated ? <PublicLanding /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/auth" 
            element={!isAuthenticated ? <AuthScreen onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/dashboard" replace />} 
          />

          {/* PROTECTED ROUTES */}
          <Route 
            path="/dashboard/*" 
            element={
              isAuthenticated ? (
                <DashboardLayout isOffline={isOffline} onLogout={() => { clearSession(); setIsAuthenticated(false); setSession(null); }}>
                  <Outlet />
                </DashboardLayout>
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          >
            <Route index element={<IntelligenceScreen history={history} addHistory={addHistory} />} />
            <Route path="diagnostics" element={<DiagnosticsListScreen history={history} deleteHistory={deleteHistory} />} />
            <Route path="diagnostic/:id" element={<ResultsScreen history={history} deleteHistory={deleteHistory} />} />
            <Route path="activity" element={<ActivityScreen history={history} deleteHistory={deleteHistory} />} />
            <Route path="settings" element={<SettingsScreen isOffline={isOffline} />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </>
  );
}
