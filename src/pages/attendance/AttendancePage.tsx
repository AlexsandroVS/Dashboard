import { useEffect, useState } from 'react';
import { attendanceApi } from '@/services/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    CalendarDays, Users, AlertOctagon, CheckCircle2, 
    MoreHorizontal, Mail 
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AttendancePage() {
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [criticalStudents, setCriticalStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsRes, coursesRes, criticalRes] = await Promise.all([
          attendanceApi.getStats(),
          attendanceApi.getByCourse(),
          attendanceApi.getCritical()
        ]);
        setStats(statsRes);
        setCourses(coursesRes);
        setCriticalStudents(criticalRes);
      } catch (error) {
        console.error("Attendance load error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
      return (
          <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
               <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-zinc-500 animate-pulse">Verificando registros de asistencia...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Control de Asistencia
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Monitoreo de presencia y alertas de ausentismo crónico.
            </p>
        </div>
        <Button variant="outline">
            <CalendarDays className="mr-2 h-4 w-4" />
            Ver Calendario
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard 
            title="Asistencia Global" 
            value={`${stats?.global_rate}%`} 
            icon={Users} 
            trend="Promedio histórico"
            color="text-blue-600"
        />
        <MetricCard 
            title="Tasa del Día" 
            value={`${stats?.today_rate}%`} 
            icon={CheckCircle2} 
            trend={`Registros: ${stats?.last_record_date}`}
            color="text-emerald-600"
        />
        <MetricCard 
            title="Ausencias Hoy" 
            value={stats?.today_absent} 
            icon={AlertOctagon} 
            trend="Requiere justificación"
            color="text-red-600"
            alert
        />
        <MetricCard 
            title="En Riesgo Crítico" 
            value={criticalStudents.length} 
            icon={AlertOctagon} 
            trend="< 70% Asistencia"
            color="text-amber-600"
            alert
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
          
          {/* Course Performance Chart */}
          <Card className="md:col-span-4">
              <CardHeader>
                  <CardTitle>Asistencia por Materia</CardTitle>
                  <CardDescription>Cursos con mayor y menor tasa de participación.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={courses} layout="vertical" margin={{ left: 40, right: 20, top: 10, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" unit="%" domain={[0, 100]} />
                            <YAxis dataKey="course" type="category" width={120} fontSize={11} />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                formatter={(value: number) => [`${value}%`, 'Asistencia']}
                            />
                            <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={20}>
                                {courses.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.rate < 70 ? '#ef4444' : entry.rate < 85 ? '#f59e0b' : '#10b981'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                  </div>
              </CardContent>
          </Card>

          {/* Critical Absences Table */}
          <Card className="md:col-span-3 flex flex-col">
              <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                      <span>Alerta de Ausentismo</span>
                      <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                          Crítico
                      </Badge>
                  </CardTitle>
                  <CardDescription>Estudiantes con asistencia por debajo del umbral.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto max-h-[400px] p-0">
                  <Table>
                      <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50 sticky top-0">
                          <TableRow>
                              <TableHead>Estudiante</TableHead>
                              <TableHead className="text-center">Asistencia</TableHead>
                              <TableHead className="text-right">Contactar</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {criticalStudents.length === 0 ? (
                              <TableRow>
                                  <TableCell colSpan={3} className="text-center py-8 text-zinc-500">
                                      No hay estudiantes en riesgo crítico.
                                  </TableCell>
                              </TableRow>
                          ) : (
                              criticalStudents.map((student) => (
                                  <TableRow key={student.id}>
                                      <TableCell>
                                          <div className="flex items-center gap-3">
                                              <Avatar className="h-8 w-8 border border-zinc-200">
                                                  <AvatarImage src={`https://ui-avatars.com/api/?name=${student.name}&background=random`} />
                                                  <AvatarFallback>{student.name[0]}</AvatarFallback>
                                              </Avatar>
                                              <div className="flex flex-col">
                                                  <span className="font-medium text-sm">{student.name}</span>
                                                  <span className="text-xs text-zinc-500">{student.email}</span>
                                              </div>
                                          </div>
                                      </TableCell>
                                      <TableCell className="text-center">
                                          <span className={`font-bold ${student.average < 50 ? "text-red-600" : "text-amber-600"}`}>
                                              {student.average}%
                                          </span>
                                      </TableCell>
                                      <TableCell className="text-right">
                                          <Button size="icon" variant="ghost" className="h-8 w-8">
                                              <Mail className="h-4 w-4 text-zinc-400 hover:text-indigo-600" />
                                          </Button>
                                      </TableCell>
                                  </TableRow>
                              ))
                          )}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, trend, color, alert }: any) {
    return (
        <Card className={alert ? "border-red-200 bg-red-50/50 dark:bg-red-900/10" : ""}>
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
