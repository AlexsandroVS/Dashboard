import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Bot, BarChartBig } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 space-y-4 shadow-lg dark:bg-gray-950">
      <div className="text-2xl font-bold text-center mb-6">EduMonitor</div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800">
              <LayoutDashboard size={20} />
              <span>Resumen</span>
            </Link>
          </li>
          <li>
            <Link to="/students" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800">
              <Users size={20} />
              <span>Estudiantes</span>
            </Link>
          </li>
          <li>
            <Link to="/agents" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800">
              <Bot size={20} />
              <span>Monitor de Agentes</span>
            </Link>
          </li>
          <li>
            <Link to="/analytics" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800">
              <BarChartBig size={20} />
              <span>Análisis</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}