import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Bot, BarChartBig, Database, UsersRound, ScrollText, Landmark, ClipboardList } from 'lucide-react';

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
                    
                            <hr className="my-4 border-t border-gray-600 dark:border-gray-700" />
                            <div className="px-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">Módulos</div>
                            <ul className="space-y-2 mt-2">
                              <li>
                                <Link to="/financial" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800">
                                  <Landmark size={20} />
                                  <span>Finanzas</span>
                                </Link>
                              </li>
                              <li>
                                <Link to="/attendance" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800">
                                  <ClipboardList size={20} />
                                                <span>Asistencia</span>                                </Link>
                              </li>
                            </ul>
                    
                            <hr className="my-4 border-t border-gray-600 dark:border-gray-700" />
                            <div className="px-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">Administración</div>
                            <ul className="space-y-2 mt-2">
                              <li>
                                <Link to="/admin/data" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800">
                                  <Database size={20} />
                                  <span>Gestión de Datos</span>
                                </Link>
                              </li>                    <li>
                      <Link to="/admin/roles" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800">
                        <UsersRound size={20} />
                        <span>Gestión de Roles</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/logs" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800">
                        <ScrollText size={20} />
                        <span>Visor de Logs</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </aside>
            );
          }
          