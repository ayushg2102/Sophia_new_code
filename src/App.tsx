import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import TaskView from './pages/Task/TaskView';
import SubtaskDetail from './pages/SubtaskDetail/SubtaskDetail';
import ActionDetail from './pages/ActionDetail/ActionDetail';
import AllTasks from './pages/Dashboard/AllTasks';

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
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/task/:taskId" element={
              <ProtectedRoute>
                <TaskView />
              </ProtectedRoute>
            } />
            <Route path="/subtask/:subtaskId" element={
              <ProtectedRoute>
                <SubtaskDetail />
              </ProtectedRoute>
            } />
            <Route path="/action/:actionId" element={
              <ProtectedRoute>
                <ActionDetail />
              </ProtectedRoute>
            } />
            <Route path="/all-tasks" element={
              <ProtectedRoute>
                <AllTasks />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;