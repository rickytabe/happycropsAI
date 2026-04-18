import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { PublicLanding } from './screens/PublicLanding';
import { AuthScreen } from './screens/AuthScreen';
import { DashboardLayout } from './layouts/DashboardLayout';
import { IntelligenceScreen } from './screens/IntelligenceScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { DiagnosticsListScreen } from './screens/DiagnosticsListScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AnalysisResult } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const saved = localStorage.getItem('agrinova_history');
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
    localStorage.setItem('agrinova_history', JSON.stringify(newHistory));
  };

  return (
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
              <DashboardLayout isOffline={isOffline} onLogout={() => setIsAuthenticated(false)}>
                <Outlet />
              </DashboardLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        >
          <Route index element={<IntelligenceScreen history={history} addHistory={addHistory} />} />
          <Route path="diagnostics" element={<DiagnosticsListScreen history={history} />} />
          <Route path="diagnostic/:id" element={<ResultsScreen history={history} />} />
          <Route path="activity" element={<ActivityScreen history={history} />} />
          <Route path="settings" element={<SettingsScreen isOffline={isOffline} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
