import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { detailedStudents } from '@/data/mockData';
import type { DetailedStudent } from '@/data/mockData';

const riskTranslation: { [key: string]: string } = {
  Low: 'Bajo',
  Medium: 'Medio',
  High: 'Alto',
};

export function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = detailedStudents.filter((student: DetailedStudent) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Estudiantes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar estudiantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Carrera</TableHead>
                <TableHead>Nivel de Riesgo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student: DetailedStudent) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>{student.major}</TableCell>
                  <TableCell>{riskTranslation[student.risk]}</TableCell>
                  <TableCell>{/* Add action buttons here, e.g., View Details */}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}