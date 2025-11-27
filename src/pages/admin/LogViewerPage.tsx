import { useEffect, useState } from 'react';
import { logsApi } from '@/services/api';
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
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollText, Search, FileJson, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function LogViewerPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [actionFilter, setActionFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Detail Modal
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
        const params: any = {};
        if (actionFilter) params.action_type = actionFilter;
        if (dateFilter) params.start_date = dateFilter; // Simple single date filter for now
        
        const data = await logsApi.search(params);
        setLogs(data);
    } catch (error) {
        console.error("Error fetching logs:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleViewDetails = (log: any) => {
      setSelectedLog(log);
      setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <ScrollText className="h-6 w-6 text-indigo-600" />
                Auditoría del Sistema
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Registro de actividades y cambios en la plataforma.
            </p>
        </div>
        <Button onClick={fetchLogs} variant="outline">
            Actualizar
        </Button>
      </div>

      <Card>
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                      <Input 
                        placeholder="Filtrar por tipo de acción..." 
                        className="pl-9"
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
                      />
                  </div>
                  <div className="relative w-full md:w-48">
                      <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                      <Input 
                        type="date" 
                        className="pl-9"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                      />
                  </div>
                  <Button onClick={fetchLogs}>Buscar</Button>
              </div>
          </CardHeader>
          <CardContent className="p-0">
              <Table>
                  <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
                      <TableRow>
                          <TableHead className="w-[180px]">Fecha y Hora</TableHead>
                          <TableHead>Usuario</TableHead>
                          <TableHead>Acción</TableHead>
                          <TableHead className="text-right">Detalles</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {loading ? (
                          <TableRow>
                              <TableCell colSpan={4} className="h-24 text-center">
                                  Cargando registros...
                              </TableCell>
                          </TableRow>
                      ) : logs.length === 0 ? (
                          <TableRow>
                              <TableCell colSpan={4} className="h-24 text-center text-zinc-500">
                                  No se encontraron actividades recientes.
                              </TableCell>
                          </TableRow>
                      ) : (
                          logs.map((log) => (
                              <TableRow key={log.log_id} className="group">
                                  <TableCell className="text-xs font-mono text-zinc-500">
                                      {new Date(log.timestamp).toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                      <div className="font-medium text-sm">{log.usuario}</div>
                                  </TableCell>
                                  <TableCell>
                                      <Badge variant="outline" className="bg-zinc-50 text-zinc-700 border-zinc-200">
                                          {log.tipo_accion}
                                      </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                      {log.detalles && (
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleViewDetails(log)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                              <FileJson className="h-4 w-4 text-indigo-500" />
                                              <span className="sr-only">Ver JSON</span>
                                          </Button>
                                      )}
                                  </TableCell>
                              </TableRow>
                          ))
                      )}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>

      {/* JSON Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
              <DialogHeader>
                  <DialogTitle>Detalle del Evento</DialogTitle>
                  <DialogDescription>
                      Información técnica registrada por el sistema.
                  </DialogDescription>
              </DialogHeader>
              {selectedLog && (
                  <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                              <span className="font-semibold block text-zinc-500">Usuario</span>
                              {selectedLog.usuario}
                          </div>
                          <div>
                              <span className="font-semibold block text-zinc-500">Acción</span>
                              {selectedLog.tipo_accion}
                          </div>
                          <div>
                              <span className="font-semibold block text-zinc-500">Timestamp</span>
                              {new Date(selectedLog.timestamp).toLocaleString()}
                          </div>
                      </div>
                      
                      <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md overflow-x-auto max-h-[300px]">
                          <pre className="text-xs font-mono">
                              {JSON.stringify(selectedLog.detalles, null, 2)}
                          </pre>
                      </div>
                  </div>
              )}
          </DialogContent>
      </Dialog>
    </div>
  );
}
