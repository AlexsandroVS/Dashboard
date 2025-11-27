import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dashboardApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, BookOpen, Users, Activity, TrendingUp, Bell, Search } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Input } from '@/components/ui/input';

export function OverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch system-wide stats instead of individual student stats
        const data = await dashboardApi.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la información del sistema.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-zinc-500 animate-pulse">Analizando datos del sistema...</p>
            </div>
        </div>
    );
  }

  if (error) {
      return (
          <div className="p-8 flex items-center justify-center h-full">
              <Card className="max-w-md border-red-200 bg-red-50 dark:bg-red-900/10">
                  <CardHeader>
                      <CardTitle className="text-red-600 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" /> Error
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-red-600/80">{error}</p>
                      <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
                          Reintentar
                      </Button>
                  </CardContent>
              </Card>
          </div>
      )
  }

  if (!stats) return null;

  // Mock trend data
  const trendData = [
      { name: 'Ene', students: 120, risk: 10 },
      { name: 'Feb', students: 125, risk: 12 },
      { name: 'Mar', students: 130, risk: 15 },
      { name: 'Abr', students: 128, risk: 8 },
      { name: 'May', students: stats.total_students, risk: stats.at_risk_count },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Panel de Administración
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Visión general del estado de los estudiantes y alertas de riesgo.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative w-64 hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                <Input placeholder="Buscar estudiante..." className="pl-9 bg-white dark:bg-zinc-900" />
            </div>
            <Button>Generar Reporte</Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
            title="Total Estudiantes" 
            value={stats.total_students} 
            icon={Users} 
            trend="+5% este mes" 
            color="text-blue-600"
        />
        <MetricCard 
            title="En Riesgo Alto" 
            value={stats.at_risk_count} 
            icon={AlertTriangle} 
            trend={`${stats.risk_percentage}% del total`}
            color="text-red-600"
            alert={stats.at_risk_count > 0}
        />
        <MetricCard 
            title="Promedio General" 
            value={stats.system_average_grade} 
            icon={Activity} 
            trend="Estable"
            color="text-emerald-600"
        />
        <MetricCard 
            title="Cursos Activos" 
            value={stats.active_courses_count} 
            icon={BookOpen} 
            trend="Ciclo 2025-1"
            color="text-purple-600"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-7">
        
        {/* Chart Section */}
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Tendencia de Matrícula y Riesgo</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <Tooltip />
                            <Area type="monotone" dataKey="students" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStudents)" name="Estudiantes" />
                            <Area type="monotone" dataKey="risk" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisk)" name="En Riesgo" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        {/* Recent Alerts Section */}
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-zinc-500" />
                    Alertas Recientes
                </CardTitle>
                <CardDescription>Intervenciones requeridas inmediatamente.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {stats.recent_alerts.map((alert: any) => (
                        <div key={alert.id} className="flex items-start gap-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                            <div className={`mt-1 h-2 w-2 rounded-full ${
                                alert.type === 'High Risk' ? 'bg-red-500' : 
                                alert.type === 'Financial' ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">{alert.student}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{alert.message}</p>
                            </div>
                            <div className="text-xs text-zinc-400">{alert.time}</div>
                        </div>
                    ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-xs">Ver todas las alertas</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, trend, color, alert }: any) {
    return (
        <Card className={alert ? "border-red-200 bg-red-50 dark:bg-red-900/10" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{value}</div>
                <p className={`text-xs mt-1 ${alert ? "text-red-600 font-medium" : "text-zinc-500"}`}>
                    {trend}
                </p>
            </CardContent>
        </Card>
    )
}
