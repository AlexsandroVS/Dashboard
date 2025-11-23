import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { attendanceRecords, materias } from "@/data/mockData";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

// Extraer listas únicas para filtros
const studentNames = [...new Set(attendanceRecords.map(r => r.studentName))];
const courseNames = [...new Set(materias.map(m => m.nombre))];


export function AttendancePage() {
  const [materiaFilter, setMateriaFilter] = useState("All");
  const [studentFilter, setStudentFilter] = useState("All");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(record => {
        const materiaMatch = materiaFilter === 'All' || record.materia === materiaFilter;
        const studentMatch = studentFilter === 'All' || record.studentName === studentFilter;
        const dateMatch = !date || record.date === format(date, "yyyy-MM-dd");
        return materiaMatch && studentMatch && dateMatch;
    });
  }, [materiaFilter, studentFilter, date]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Control de Asistencia</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Asistencia</CardTitle>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Select value={materiaFilter} onValueChange={setMateriaFilter}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filtrar por materia..." /></SelectTrigger>
                <SelectContent><SelectItem value="All">Todas las Materias</SelectItem>{courseNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={studentFilter} onValueChange={setStudentFilter}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filtrar por estudiante..." /></SelectTrigger>
                <SelectContent><SelectItem value="All">Todos los Estudiantes</SelectItem>{studentNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent>
            </Select>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-[240px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Seleccionar fecha</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent>
            </Popover>
            <Button onClick={() => setDate(undefined)} variant="ghost">Limpiar Fecha</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Estudiante</TableHead><TableHead>Materia</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredRecords.map(record => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.studentName}</TableCell>
                  <TableCell>{record.materia}</TableCell>
                  <TableCell><Badge variant={record.status === 'Presente' ? 'default' : 'destructive'}>{record.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}