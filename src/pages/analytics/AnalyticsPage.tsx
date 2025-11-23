import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { detailedStudents, majors } from '@/data/mockData';
import type { DetailedStudent } from '@/data/mockData';

const riskColors: { [key: string]: string } = {
  Bajo: '#2ecc71',
  Medio: '#f39c12',
  Alto: '#e74c3c',
};

const riskTranslation: { [key: string]: 'Bajo' | 'Medio' | 'Alto' } = {
  Low: 'Bajo',
  Medium: 'Medio',
  High: 'Alto',
};

export function AnalyticsPage() {
  const [majorFilter, setMajorFilter] = useState('All');
  const [scholarshipFilter, setScholarshipFilter] = useState('All');

  const filteredData = useMemo(() => {
    return detailedStudents.filter((student: DetailedStudent) => {
      const majorMatch = majorFilter === 'All' || student.major === majorFilter;
      const scholarshipMatch =
        scholarshipFilter === 'All' ||
        (scholarshipFilter === 'Yes' && student.scholarship_holder) ||
        (scholarshipFilter === 'No' && !student.scholarship_holder);
      return majorMatch && scholarshipMatch;
    });
  }, [majorFilter, scholarshipFilter]);

  const riskByMajorData = useMemo(() => {
    type MajorData = { name: string; Bajo: number; Medio: number; Alto: number };
    const dataByMajor = filteredData.reduce((acc: Record<string, MajorData>, student: DetailedStudent) => {
      if (!acc[student.major]) {
        acc[student.major] = { name: student.major, Bajo: 0, Medio: 0, Alto: 0 };
      }
      acc[student.major][riskTranslation[student.risk]]++;
      return acc;
    }, {});

    return Object.values(dataByMajor);
  }, [filteredData]);

  const scholarshipRiskData = useMemo(() => {
    const riskCounts = filteredData.reduce((acc: { [key: string]: number }, student: DetailedStudent) => {
        const riskName = riskTranslation[student.risk];
        if (!acc[riskName]) {
          acc[riskName] = 0;
        }
        acc[riskName]++;
        return acc;
    }, {});

    return Object.entries(riskCounts).map(([name, value]) => ({
        name,
        value
    }));
  }, [filteredData]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Análisis Avanzado</h1>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="major-filter" className="text-sm font-medium">Carrera:</label>
          <Select value={majorFilter} onValueChange={setMajorFilter}>
            <SelectTrigger id="major-filter" className="w-[220px]">
              <SelectValue placeholder="Seleccionar Carrera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Todas las Carreras</SelectItem>
              {majors.map((major: string) => <SelectItem key={major} value={major}>{major}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="scholarship-filter" className="text-sm font-medium">Beca:</label>
          <Select value={scholarshipFilter} onValueChange={setScholarshipFilter}>
            <SelectTrigger id="scholarship-filter" className="w-[180px]">
              <SelectValue placeholder="Estado de Beca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Todos</SelectItem>
              <SelectItem value="Yes">Con Beca</SelectItem>
              <SelectItem value="No">Sin Beca</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk by Major Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Riesgo por Carrera</CardTitle>
            <CardDescription>Cantidad de estudiantes por nivel de riesgo, agrupados por carrera.</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskByMajorData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Bajo" stackId="a" fill={riskColors.Bajo} />
                <Bar dataKey="Medio" stackId="a" fill={riskColors.Medio} />
                <Bar dataKey="Alto" stackId="a" fill={riskColors.Alto} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Scholarship Risk Pie Chart */}
        <Card>
            <CardHeader>
                <CardTitle>Desglose de Riesgo del Grupo Filtrado</CardTitle>
                <CardDescription>
                    Muestra la distribución de riesgo para el grupo de estudiantes seleccionado.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={scholarshipRiskData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {scholarshipRiskData.map((entry) => (
                                <Cell key={entry.name} fill={riskColors[entry.name]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
