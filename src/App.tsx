import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { Layout } from './components/layout/Layout';
import { OverviewPage } from './pages/overview/OverviewPage';
import { StudentsPage } from './pages/students/StudentsPage';
import { AgentsMonitorPage } from './pages/agents/AgentsMonitorPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<OverviewPage />} /> {/* Default route for / */}
          <Route path="students" element={<StudentsPage />} />
          <Route path="agents" element={<AgentsMonitorPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          {/* Add more routes here as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
