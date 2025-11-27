import { useState, useEffect } from 'react';
import { studentsApi } from '@/services/api';
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
import { Button } from '@/components/ui/button';
import { 
    Search, MoreHorizontal, Eye, UserPlus, 
    Filter, Download, RefreshCw, ArrowUpDown
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { SimplePagination } from '@/components/SimplePagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useNavigate } from 'react-router-dom';

export function StudentsPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  // Sort state
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await studentsApi.getAll(page, pageSize);
        
        if (data.length < pageSize) {
            setHasMore(false);
        } else {
            setHasMore(true);
        }
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, pageSize]);

  // Filtering
  let processedStudents = students.filter((student: any) => {
    const matchesSearch = 
        `${student.nombre} ${student.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (riskFilter !== 'all') {
        const risk = getRiskLevel(student.notas_promedio);
        if (risk.toLowerCase() !== riskFilter) return false;
    }

    return true;
  });

  // Sorting
  if (sortConfig) {
    processedStudents = [...processedStudents].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested or special values
        if (sortConfig.key === 'nombre') {
            aValue = `${a.nombre} ${a.apellido}`;
            bValue = `${b.nombre} ${b.apellido}`;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
  }

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getRiskLevel = (grade: number) => {
      if (grade < 11) return 'Alto';
      if (grade < 14) return 'Medio';
      return 'Bajo';
  };

  const getRiskClassName = (level: string) => {
      switch(level) {
          case 'Alto': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100/80 border-red-200';
          case 'Medio': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100/80 border-amber-200';
          case 'Bajo': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100/80 border-emerald-200';
          default: return '';
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Directorio de Estudiantes
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Visualiza y gestiona el rendimiento académico y riesgo de deserción.
            </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchStudents}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Nuevo Estudiante
            </Button>
        </div>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Buscar por nombre, apellido o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-zinc-50/50 dark:bg-zinc-900"
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <Select value={riskFilter} onValueChange={setRiskFilter}>
                        <SelectTrigger className="w-[150px]">
                            <Filter className="h-3.5 w-3.5 mr-2 text-zinc-500" />
                            <SelectValue placeholder="Riesgo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los Riesgos</SelectItem>
                            <SelectItem value="alto">Riesgo Alto</SelectItem>
                            <SelectItem value="medio">Riesgo Medio</SelectItem>
                            <SelectItem value="bajo">Riesgo Bajo</SelectItem>
                        </SelectContent>
                    </Select>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Download className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Exportar datos</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Como CSV</DropdownMenuItem>
                            <DropdownMenuItem>Como PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
             </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                   <div className="h-8 w-8 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
                   <p className="text-sm text-zinc-500">Cargando estudiantes...</p>
              </div>
          ) : (
            <>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-zinc-50/80 dark:bg-zinc-900/50">
                    <TableRow>
                        <TableHead className="w-[300px]">
                            <Button variant="ghost" size="sm" onClick={() => handleSort('nombre')} className="-ml-3 h-8 data-[state=open]:bg-accent">
                                Estudiante
                                <ArrowUpDown className="ml-2 h-3 w-3" />
                            </Button>
                        </TableHead>
                        <TableHead className="w-[100px]">
                            <Button variant="ghost" size="sm" onClick={() => handleSort('notas_promedio')} className="-ml-3 h-8">
                                Promedio
                                <ArrowUpDown className="ml-2 h-3 w-3" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" size="sm" onClick={() => handleSort('asistencia_promedio')} className="-ml-3 h-8">
                                Asistencia Global
                                <ArrowUpDown className="ml-2 h-3 w-3" />
                            </Button>
                        </TableHead>
                        <TableHead className="w-[150px]">Estado de Riesgo</TableHead>
                        <TableHead className="text-right w-[80px]">Acciones</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {processedStudents.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-12">
                                <div className="flex flex-col items-center justify-center text-zinc-500">
                                    <Search className="h-8 w-8 mb-2 opacity-20" />
                                    <p>No se encontraron estudiantes con estos filtros.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        processedStudents.map((student: any) => {
                            const risk = getRiskLevel(student.notas_promedio);
                            return (
                                <TableRow key={student.persona_id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-700 bg-white">
                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${student.nombre}+${student.apellido}&background=random&color=fff&background=6366f1`} />
                                            <AvatarFallback>{student.nombre[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
                                                {student.nombre} {student.apellido}
                                            </span>
                                            <span className="text-xs text-zinc-500">{student.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <span className={`font-semibold ${student.notas_promedio < 11 ? "text-red-600" : "text-zinc-700 dark:text-zinc-300"}`}>
                                            {student.notas_promedio ? student.notas_promedio.toFixed(2) : '0.00'}
                                        </span>
                                        <span className="text-zinc-400 text-xs ml-1">/20</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="w-full max-w-[140px]">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-zinc-500">Global</span>
                                            <span className="font-medium">{Math.round((student.asistencia_promedio || 0) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${
                                                    (student.asistencia_promedio || 0) < 0.7 ? "bg-amber-500" : "bg-emerald-500"
                                                }`} 
                                                style={{ width: `${(student.asistencia_promedio || 0) * 100}%` }} 
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={getRiskClassName(risk)} variant="outline">
                                        {risk}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/students/${student.persona_id}`)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Ver Perfil Completo
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Search className="mr-2 h-4 w-4" />
                                                Analizar con IA
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                    </TableBody>
                </Table>
            </div>
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/30">
                <SimplePagination 
                    currentPage={page} 
                    onPageChange={setPage} 
                    hasNextPage={hasMore} 
                />
            </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
