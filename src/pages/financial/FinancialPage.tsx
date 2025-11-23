import { useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { payments } from "@/data/mockData";

export function FinancialPage() {
  const [statusFilter, setStatusFilter] = useState("All");

  const summary = useMemo(() => {
    return payments.reduce((acc, payment) => {
        if (payment.status === 'Pagado') {
            acc.recaudado += payment.amount;
        } else if (payment.status === 'Pendiente') {
            acc.pendiente += payment.amount;
        } else if (payment.status === 'Vencido') {
            acc.vencido += payment.amount;
        }
        return acc;
    }, { recaudado: 0, pendiente: 0, vencido: 0 });
  }, []);

  const filteredPayments = useMemo(() => {
    if (statusFilter === 'All') return payments;
    return payments.filter(p => p.status === statusFilter);
  }, [statusFilter]);
  
  // Datos simulados para el gráfico de ingresos mensuales
  const monthlyRevenue = [
      { month: 'Ago', revenue: 4500 }, { month: 'Sep', revenue: 5200 },
      { month: 'Oct', revenue: 7800 }, { month: 'Nov', revenue: 6500 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Módulo Financiero</h1>
      
      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardHeader><CardTitle>Total Recaudado</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">${summary.recaudado.toFixed(2)}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Total Pendiente</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-yellow-600">${summary.pendiente.toFixed(2)}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Total Vencido</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">${summary.vencido.toFixed(2)}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ingresos */}
        <Card>
            <CardHeader><CardTitle>Ingresos Mensuales</CardTitle></CardHeader>
            <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenue}>
                        <XAxis dataKey="month" /><YAxis />
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        <Legend />
                        <Bar dataKey="revenue" name="Ingresos" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        
        {/* Tabla de Pagos */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Registros de Pago</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrar por estado" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">Todos</SelectItem>
                        <SelectItem value="Pagado">Pagado</SelectItem>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Vencido">Vencido</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Estudiante</TableHead><TableHead>Monto</TableHead><TableHead>Estado</TableHead><TableHead>Acciones</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredPayments.slice(0, 5).map(p => ( // Limitar a 5 para el ejemplo
                  <TableRow key={p.id}>
                    <TableCell>{p.studentName}</TableCell>
                    <TableCell>${p.amount.toFixed(2)}</TableCell>
                    <TableCell><Badge variant={p.status === 'Pagado' ? 'default' : (p.status === 'Vencido' ? 'destructive' : 'secondary')}>{p.status}</Badge></TableCell>
                    <TableCell>
                        {p.status !== 'Pagado' && <Button size="sm">Marcar Pagado</Button>}
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