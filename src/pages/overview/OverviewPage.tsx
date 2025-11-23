import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const riskColors = {
  Bajo: '#2ecc71',
  Medio: '#f39c12',
  Alto: '#e74c3c',
};

const mockStats = {
  totalStudents: 1250,
  totalUsers: 45,
  totalPredictions: 5320,
};

const mockRiskDistribution = [
  { name: 'Riesgo Bajo', value: 700, color: riskColors.Bajo },
  { name: 'Riesgo Medio', value: 350, color: riskColors.Medio },
  { name: 'Riesgo Alto', value: 200, color: riskColors.Alto },
];

const mockRecentPredictions = [
  { id: '1', student: 'Ana Garcia', risk: 'Bajo', date: '2025-11-20' },
  { id: '2', student: 'Juan Perez', risk: 'Medio', date: '2025-11-20' },
  { id: '3', student: 'Maria Lopez', risk: 'Alto', date: '2025-11-19' },
  { id: '4', student: 'Carlos Ruiz', risk: 'Bajo', date: '2025-11-19' },
];

export function OverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Resumen General</h1>

      {/* General Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Estudiantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+5% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Predicciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalPredictions}</div>
            <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Riesgo Estudiantil</CardTitle>
            <CardDescription>Desglose de estudiantes por nivel de riesgo de deserción.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockRiskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockRiskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Predictions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Predicciones Recientes</CardTitle>
            <CardDescription>Últimas evaluaciones de riesgo de deserción estudiantil.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Nivel de Riesgo</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentPredictions.map((prediction) => (
                  <TableRow key={prediction.id}>
                    <TableCell className="font-medium">{prediction.student}</TableCell>
                    <TableCell>{prediction.risk}</TableCell>
                    <TableCell>{prediction.date}</TableCell>
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
