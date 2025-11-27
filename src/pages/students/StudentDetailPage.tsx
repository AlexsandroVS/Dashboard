import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dashboardApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Activity, Users, Zap, Sparkles, ArrowLeft, GraduationCap, Brain, MessageSquare } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) return;
      console.log("Fetching data for student ID:", id);
      try {
        setLoading(true);
        const result = await dashboardApi.getStudentDashboard(parseInt(id, 10));
        console.log("Fetch success:", result);
        setData(result);
      } catch (err) {
        console.error("Fetch error:", err);
        setError('No se pudo cargar el perfil del estudiante.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) {
    console.log("Rendering loading state...");
    return (
        <div className="flex h-screen items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-zinc-500">Cargando perfil del estudiante...</p>
            </div>
        </div>
    );
  }

  if (error || !data) {
    console.log("Rendering error state:", error);
    return (
        <div className="p-8 flex flex-col items-center justify-center h-screen gap-4">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold">Error al cargar</h2>
            <p className="text-zinc-500">{error || "Estudiante no encontrado"}</p>
            <Button variant="outline" asChild>
                <Link to="/students">Volver a la lista</Link>
            </Button>
        </div>
    );
  }

  const { student, global_status, metrics, agents_status } = data;
  
  // Safe access for chart data
  const averageScore = metrics?.academic?.average ?? 0;
  const chartData = [
      { name: 'Sem 1', score: 65 },
      { name: 'Sem 2', score: 70 },
      { name: 'Sem 3', score: averageScore * 5 }, 
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
                <Link to="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
                <Link to="/students">Estudiantes</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{student.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-zinc-100 shadow-sm">
                <AvatarImage src={student.avatar} />
                <AvatarFallback className="text-2xl">{student.name[0]}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{student.name}</h1>
                <div className="flex items-center gap-2 text-zinc-500">
                    <span>{student.email}</span>
                    <span>•</span>
                    <span>ID: {student.id}</span>
                </div>
                <div className="flex gap-2 mt-2">
                    {global_status.badges.map((badge: string) => (
                        <span key={badge} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </div>
        <div className="flex flex-col items-end gap-2">
             <div className={`px-4 py-1 rounded-full text-sm font-semibold border ${
                 global_status.color === 'Rojo' ? 'bg-red-50 text-red-700 border-red-200' :
                 global_status.color === 'Amarillo' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                 'bg-emerald-50 text-emerald-700 border-emerald-200'
             }`}>
                 Estado: {global_status.color}
             </div>
             <div className="text-sm text-zinc-500 text-right max-w-xs">
                 "{global_status.ai_summary}"
             </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard 
            title="Promedio Académico" 
            value={metrics.academic.average} 
            max="/20"
            icon={GraduationCap} 
            trend={`${metrics.academic.success_rate}% Aprobado`}
            color="text-indigo-600"
        />
        <MetricCard 
            title="Riesgo Deserción" 
            value={`${(agents_status.m2_risk.value * 100).toFixed(1)}%`} 
            icon={AlertTriangle} 
            trend={agents_status.m2_risk.status}
            color={agents_status.m2_risk.value > 0.5 ? "text-red-600" : "text-emerald-600"}
        />
        <MetricCard 
            title="Estado Emocional" 
            value={metrics.emotional.current_mood.toFixed(2)} 
            icon={Brain} 
            trend={metrics.emotional.stress_level + " Estrés"}
            color="text-pink-600"
        />
        <MetricCard 
            title="Interacciones Social" 
            value={metrics.social.collaboration_score} 
            icon={MessageSquare} 
            trend={metrics.social.network_health}
            color="text-blue-600"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
          {/* Academic Chart */}
          <Card className="md:col-span-2">
              <CardHeader>
                  <CardTitle>Evolución del Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip />
                            <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" />
                        </AreaChart>
                    </ResponsiveContainer>
                  </div>
              </CardContent>
          </Card>

          {/* Agent Status */}
          <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Agentes Activos
              </h3>
              <AgentCard 
                name="M3 Tutor IA" 
                status={agents_status.m3_tutor.weak_subjects.length > 0 ? "Interviniendo" : "Inactivo"} 
                details={agents_status.m3_tutor.weak_subjects.join(", ") || "Sin materias críticas"}
              />
              <AgentCard 
                name="M6 Estrategia" 
                status={agents_status.m6_strategic.on_track ? "On Track" : "Alerta"} 
                details={agents_status.m6_strategic.intervention_needed ? "Intervención recomendada" : "Plan alineado"}
              />
              <AgentCard 
                name="M7 Asistente" 
                status="Activo" 
                details={`${agents_status.m7_assistant.pending_tasks} tareas pendientes`}
              />
          </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, max, icon: Icon, trend, color }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{value}</span>
                    {max && <span className="text-sm text-zinc-400">{max}</span>}
                </div>
                <p className="text-xs text-zinc-500 mt-1">{trend}</p>
            </CardContent>
        </Card>
    )
}

function AgentCard({ name, status, details }: any) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">{name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        status === 'Inactivo' || status === 'On Track' 
                        ? 'bg-zinc-100 border-zinc-200 text-zinc-600' 
                        : 'bg-indigo-50 border-indigo-200 text-indigo-600'
                    }`}>
                        {status}
                    </span>
                </div>
                <p className="text-xs text-zinc-500">{details}</p>
            </CardContent>
        </Card>
    )
}
