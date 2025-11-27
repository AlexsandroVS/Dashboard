import { useEffect, useState } from 'react';
import { agentsApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Zap, AlertTriangle, BookOpen, Users, 
    Layout, RefreshCw, ArrowRight, Brain, Activity 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

export function AgentsMonitorPage() {
  const [dispatchData, setDispatchData] = useState<any>(null);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
        setLoading(true);
        const [dispatch, activity] = await Promise.all([
            agentsApi.getDispatch(),
            agentsApi.getRecentActivity()
        ]);
        setDispatchData(dispatch);
        setActivityLog(activity);
    } catch (error) {
        console.error("Error fetching agent data:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Optional: Auto-refresh every 30s for a "Command Center" feel
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !dispatchData) {
      return (
          <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
               <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-zinc-500 animate-pulse">Sincronizando red neuronal de agentes...</p>
              </div>
          </div>
      );
  }

  // Prepare Chart Data
  const chartData = dispatchData ? [
      { name: 'Riesgo', value: dispatchData.M2_Riesgo.length, color: '#ef4444' },
      { name: 'Académico', value: dispatchData.M3_Tutor.length, color: '#3b82f6' },
      { name: 'Social', value: dispatchData.M5_Social.length, color: '#10b981' },
      { name: 'Estratégico', value: dispatchData.M6_Estrategico.length, color: '#a855f7' },
  ] : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center shrink-0">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Layout className="h-6 w-6 text-indigo-600" />
                Centro de Comando de Agentes
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Monitoreo en tiempo real de la asignación de recursos IA.
            </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchData}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full min-h-0">
          
          {/* Left Column: Analysis & Logs */}
          <div className="space-y-6 flex flex-col h-full lg:col-span-1 overflow-hidden">
              
              {/* Workload Distribution Chart */}
              <Card className="shrink-0">
                  <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Distribución de Carga</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend verticalAlign="bottom" height={36} iconSize={8} fontSize={10} />
                        </PieChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>

              {/* Live Activity Feed */}
              <Card className="flex-1 flex flex-col min-h-0">
                  <CardHeader className="pb-3 shrink-0 border-b border-zinc-100 dark:border-zinc-800">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Activity className="h-4 w-4 text-indigo-500" />
                          Actividad Reciente
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto p-0">
                      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {activityLog.map((log: any, i: number) => (
                              <div key={i} className="p-3 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                  <div className="flex justify-between items-center mb-1">
                                      <span className="font-semibold text-xs text-indigo-600">{log.agent}</span>
                                      <span className="text-[10px] text-zinc-400">{log.time}</span>
                                  </div>
                                  <p className="text-zinc-600 dark:text-zinc-300 leading-snug text-xs">
                                      {log.action}
                                  </p>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Right Column: Kanban Board */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full min-h-0 overflow-hidden">
            <AgentColumn 
                title="M2 Riesgo" 
                count={dispatchData?.M2_Riesgo?.length || 0}
                icon={AlertTriangle}
                color="text-red-600"
                bgColor="bg-red-50/50 dark:bg-red-900/5"
                borderColor="border-red-200 dark:border-red-800"
                students={dispatchData?.M2_Riesgo}
                onStudentClick={(id) => navigate(`/students/${id}`)}
            />

            <AgentColumn 
                title="M3 Tutor IA" 
                count={dispatchData?.M3_Tutor?.length || 0}
                icon={BookOpen}
                color="text-blue-600"
                bgColor="bg-blue-50/50 dark:bg-blue-900/5"
                borderColor="border-blue-200 dark:border-blue-800"
                students={dispatchData?.M3_Tutor}
                onStudentClick={(id) => navigate(`/students/${id}`)}
            />

            <AgentColumn 
                title="M5 Social" 
                count={dispatchData?.M5_Social?.length || 0}
                icon={Users}
                color="text-emerald-600"
                bgColor="bg-emerald-50/50 dark:bg-emerald-900/5"
                borderColor="border-emerald-200 dark:border-emerald-800"
                students={dispatchData?.M5_Social}
                onStudentClick={(id) => navigate(`/students/${id}`)}
            />

            <AgentColumn 
                title="M6 Estratégico" 
                count={dispatchData?.M6_Estrategico?.length || 0}
                icon={Brain}
                color="text-purple-600"
                bgColor="bg-purple-50/50 dark:bg-purple-900/5"
                borderColor="border-purple-200 dark:border-purple-800"
                students={dispatchData?.M6_Estrategico}
                onStudentClick={(id) => navigate(`/students/${id}`)}
            />
          </div>

      </div>
    </div>
  );
}

function AgentColumn({ title, count, icon: Icon, color, bgColor, borderColor, students, onStudentClick }: any) {
    return (
        <div className={`flex flex-col h-full rounded-xl border ${borderColor} ${bgColor} overflow-hidden transition-all`}>
            {/* Column Header */}
            <div className="p-3 border-b border-black/5 dark:border-white/5 bg-white/60 dark:bg-black/20 backdrop-blur-sm flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md bg-white dark:bg-zinc-800 shadow-sm`}>
                        <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{title}</h3>
                </div>
                <Badge variant="secondary" className="bg-white/80 dark:bg-zinc-800 text-xs font-mono">
                    {count}
                </Badge>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
                {students && students.length > 0 ? (
                    students.map((student: any) => (
                        <div 
                            key={student.id} 
                            onClick={() => onStudentClick(student.id)}
                            className="group bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-all"
                        >
                            <div className="flex justify-between items-start mb-1.5">
                                <span className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 line-clamp-1">
                                    {student.nombre}
                                </span>
                                {student.severity === 'critical' && (
                                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" title="Crítico" />
                                )}
                            </div>
                            <p className="text-[11px] text-zinc-500 leading-relaxed">
                                {student.motivo}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-zinc-400 text-xs text-center italic opacity-60">
                        <Zap className="h-5 w-5 mb-2" />
                        Sin alertas
                    </div>
                )}
            </div>
        </div>
    )
}
