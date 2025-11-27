import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { Layout } from './components/layout/Layout';
import { OverviewPage } from './pages/overview/OverviewPage';
import { StudentsPage } from './pages/students/StudentsPage';
import { StudentDetailPage } from './pages/students/StudentDetailPage';
import { AgentsMonitorPage } from './pages/agents/AgentsMonitorPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { DataManagementPage } from './pages/admin/DataManagementPage';
import { RoleManagementPage } from './pages/admin/RoleManagementPage';
import { LogViewerPage } from './pages/admin/LogViewerPage';
import { FinancialPage } from './pages/financial/FinancialPage';
import { AttendancePage } from './pages/attendance/AttendancePage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            {/* User-facing routes */}
            <Route index element={<OverviewPage />} />
            <Route path="students/:id" element={<StudentDetailPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="agents" element={<AgentsMonitorPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />

            {/* New Modules */}
            <Route path="financial" element={<FinancialPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            
            {/* Admin routes */}
            <Route path="admin/data" element={<DataManagementPage />} />
            <Route path="admin/roles" element={<RoleManagementPage />} />
            <Route path="admin/logs" element={<LogViewerPage />} />

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
