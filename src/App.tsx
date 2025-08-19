import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard/Dashboard';
import TaskView from './pages/Task/TaskView';
import SubtaskDetail from './pages/SubtaskDetail/SubtaskDetail';
import ActionDetail from './pages/ActionDetail/ActionDetail';
import AllTasks from './pages/Dashboard/AllTasks';
import ExternalRedirect from './components/ExternalRedirect/ExternalRedirect';
import SocialMediaMonitoringDashboard from './components/SocialMediaContributions/SocialMediaMonitoringDashboard';
import PoliticalContributionsDashboard from './components/PoliticalContributionsDashboard';
import ContentDisplay from './components/ContentDisplay/ContentDisplay';
import { API_CONFIG } from './constants/api';

const theme = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    borderRadius: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* External SSO login redirect - only used for logout */}
            <Route
              path="/login"
              element={<ExternalRedirect url={API_CONFIG.ENDPOINTS.AUTH_LOGIN} />}
            />
            
            {/* Main application routes - no authentication required */}
            <Route path="/tasks" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/task/:taskId" element={<TaskView />} />
            <Route path="/subtask/:subtaskId" element={<SubtaskDetail />} />
            <Route path="/action/:actionId" element={<ActionDetail />} />
            <Route path="/all-tasks" element={<AllTasks />} />
            <Route path="/social-media-dashboard" element={<SocialMediaMonitoringDashboard />} />
            <Route path="/political-contributions-dashboard" element={<PoliticalContributionsDashboard />} />
            <Route path="/content-display" element={<ContentDisplay />} />
            {/* Default route - redirect to tasks */}
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            
            {/* Fallback route - redirect to tasks */}
            <Route path="*" element={<Navigate to="/tasks" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;