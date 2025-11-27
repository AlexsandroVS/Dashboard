import { useEffect, useState } from 'react';
import { financialApi } from '@/services/api';
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
    DollarSign, TrendingUp, TrendingDown, AlertTriangle, 
    CreditCard, Calendar, Send 
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export function FinancialPage() {
  const [stats, setStats] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [delinquents, setDelinquents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, trendsData, delinquencyData] = await Promise.all([
          financialApi.getStats(),
          financialApi.getTrends(),
          financialApi.getDelinquency()
        ]);
        setStats(statsData);
        setTrends(trendsData);
        setDelinquents(delinquencyData);
      } catch (error) {
        console.error("Financial data error:", error);
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
                  <p className="text-zinc-500 animate-pulse">Auditando finanzas...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Gestión Financiera
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Control de ingresos, deuda estudiantil y proyección de recaudación.
            </p>
        </div>
        <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            Registrar Pago Manual
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <FinancialCard 
            title="Ingresos Totales" 
            value={`S/${stats?.total_revenue?.toLocaleString()}`} 
            icon={DollarSign} 
            trend="+12% vs mes anterior"
            color="text-emerald-600"
        />
        <FinancialCard 
            title="Deuda Pendiente" 
            value={`S/${stats?.pending_debt?.toLocaleString()}`} 
            icon={TrendingDown} 
            trend="Crítico"
            color="text-red-600"
            alert
        />
        <FinancialCard 
            title="Tasa de Morosidad" 
            value={`${stats?.delinquency_rate}%`} 
            icon={AlertTriangle} 
            trend="56 estudiantes"
            color="text-amber-600"
        />
        <FinancialCard 
            title="Recaudación" 
            value={`${stats?.collection_rate}%`} 
            icon={TrendingUp} 
            trend="Meta: 95%"
            color="text-blue-600"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
          
          {/* Revenue Chart */}
          <Card className="md:col-span-4">
              <CardHeader>
                  <CardTitle>Tendencia de Ingresos (2025)</CardTitle>
                  <CardDescription>Evolución mensual de pagos confirmados.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trends}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(value) => `S/${value}`} 
                            />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                formatter={(value: number) => [`S/${value.toLocaleString()}`, 'Ingresos']}
                            />
                            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                                {trends.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === trends.length - 1 ? '#4f46e5' : '#cbd5e1'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                  </div>
              </CardContent>
          </Card>

          {/* Delinquency List */}
          <Card className="md:col-span-3 flex flex-col">
              <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                      <span>Riesgo Financiero</span>
                      <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                          Top Deudores
                      </Badge>
                  </CardTitle>
                  <CardDescription>Estudiantes con mayor acumulación de deuda vencida.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto max-h-[400px] p-0">
                  <Table>
                      <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50 sticky top-0">
                          <TableRow>
                              <TableHead>Estudiante</TableHead>
                              <TableHead>Deuda</TableHead>
                              <TableHead className="text-right">Acción</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {delinquents.map((student) => (
                              <TableRow key={student.id}>
                                  <TableCell>
                                      <div className="flex flex-col">
                                          <span className="font-medium text-sm">{student.name}</span>
                                          <span className="text-xs text-zinc-500">{student.overdue_count} cuotas vencidas</span>
                                      </div>
                                  </TableCell>
                                  <TableCell className="font-semibold text-red-600">
                                      S/{student.total_debt.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-right">
                                      <Button size="icon" variant="ghost" title="Enviar Recordatorio">
                                          <Send className="h-4 w-4 text-zinc-400 hover:text-indigo-600" />
                                      </Button>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}

function FinancialCard({ title, value, icon: Icon, trend, color, alert }: any) {
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
