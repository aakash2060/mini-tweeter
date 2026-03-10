import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { AuthPage } from './pages/AuthPage';
import { GenreSelectionPage } from './pages/GenreSelectionPage';
import { DashboardPage } from './pages/DashboardPage';
import { TopicsPage } from './pages/TopicsPage';
import { TopicDetailPage } from './pages/TopicDetailPage';
import { StatsPage } from './pages/StatsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/genre-selection" element={
            <ProtectedRoute><GenreSelectionPage /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/topics" element={
            <ProtectedRoute><TopicsPage /></ProtectedRoute>
          } />
          <Route path="/topics/:id" element={
            <ProtectedRoute><TopicDetailPage /></ProtectedRoute>
          } />
          <Route path="/stats" element={
            <ProtectedRoute><StatsPage /></ProtectedRoute>
          } />
          <Route path="/recommendations" element={
            <ProtectedRoute><RecommendationsPage /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
