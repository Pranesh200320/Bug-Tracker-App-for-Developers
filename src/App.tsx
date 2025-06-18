import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BugProvider } from './contexts/BugContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { BugBoard } from './components/BugBoard';
import { CreateBug } from './components/CreateBug';
import { Analytics } from './components/Analytics';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/bugs" element={<ProtectedRoute><BugBoard /></ProtectedRoute>} />
      <Route path="/create-bug" element={<ProtectedRoute><CreateBug /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BugProvider>
        <Router>
          <AppRoutes />
        </Router>
      </BugProvider>
    </AuthProvider>
  );
}

export default App;