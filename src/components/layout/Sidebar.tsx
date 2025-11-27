import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Bot, BarChartBig, 
  Database, UsersRound, ScrollText, Landmark, 
  ClipboardList, Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Resumen Sistema', path: '/' }, // Renamed for clarity
  { icon: Users, label: 'Estudiantes', path: '/students' },
  { icon: Bot, label: 'Monitor de Agentes', path: '/agents' },
  { icon: BarChartBig, label: 'Análisis', path: '/analytics' },
];

const moduleItems = [
  { icon: Landmark, label: 'Finanzas', path: '/financial' },
  { icon: ClipboardList, label: 'Asistencia', path: '/attendance' },
];

const adminItems = [
  { icon: Database, label: 'Gestión de Datos', path: '/admin/data' },
  { icon: UsersRound, label: 'Gestión de Roles', path: '/admin/roles' },
  { icon: ScrollText, label: 'Visor de Logs', path: '/admin/logs' },
];

export function Sidebar() {
  const location = useLocation();

  const NavItem = ({ icon: Icon, label, path }: any) => {
    const isActive = location.pathname === path;
    return (
      <li>
        <Link 
          to={path} 
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group",
            isActive 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20" 
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          )}
        >
          <Icon size={20} className={cn("transition-colors", isActive ? "text-indigo-100" : "group-hover:text-white")} />
          <span className="font-medium text-sm">{label}</span>
        </Link>
      </li>
    );
  };

  return (
    <aside className="w-64 bg-zinc-950 text-white border-r border-zinc-800 flex flex-col h-screen transition-all">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-zinc-800/50">
        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/20">
           <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-zinc-100">EduPredict</span>
      </div>

      {/* Scrollable Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-thin scrollbar-thumb-zinc-800">
        <div>
          <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Principal</p>
          <ul className="space-y-1">
            {menuItems.map((item) => <NavItem key={item.path} {...item} />)}
          </ul>
        </div>

        <div>
          <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Módulos</p>
          <ul className="space-y-1">
            {moduleItems.map((item) => <NavItem key={item.path} {...item} />)}
          </ul>
        </div>

        <div>
          <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Administración</p>
          <ul className="space-y-1">
            {adminItems.map((item) => <NavItem key={item.path} {...item} />)}
          </ul>
        </div>
      </nav>
      
      {/* Footer/Version */}
      <div className="p-4 border-t border-zinc-800/50">
        <p className="text-xs text-zinc-600 text-center">v2.0.0 Beta</p>
      </div>
    </aside>
  );
}
