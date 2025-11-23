import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockActivityLogs = [
    { id: 1, timestamp: "2025-11-22 10:05:14", user: "ana.g@example.com", action: "login", details: "Successful login" },
    { id: 2, timestamp: "2025-11-22 10:06:02", user: "ana.g@example.com", action: "view_materia", details: "Viewed 'Cálculo Avanzado'" },
    { id: 3, timestamp: "2025-11-22 09:45:30", user: "juan.p@example.com", action: "submit_assignment", details: "Submitted assignment for 'Física I'" },
    { id: 4, timestamp: "2025-11-21 18:30:00", user: "admin@piesa.com", action: "update_user_role", details: "Changed role for user_id 3 to 'Docente'" },
];

const mockAuditLogs = [
    { id: 1, timestamp: "2025-11-21 18:30:00", table: "persona_categorias", action: "UPDATE", user: "admin@piesa.com", before: "{'role': 'Estudiante'}", after: "{'role': 'Docente'}" },
    { id: 2, timestamp: "2025-11-20 11:00:00", table: "materias", action: "CREATE", user: "admin@piesa.com", before: "NULL", after: "{'nombre': 'Cálculo Avanzado'}" },
];

export function LogViewerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Visor de Logs</h1>
      <Tabs defaultValue="activity" className="w-full">
        <div className="flex items-center justify-between">
            <TabsList>
                <TabsTrigger value="activity">Log de Actividad</TabsTrigger>
                <TabsTrigger value="audit">Bitácora</TabsTrigger>
            </TabsList>
            <div className="w-full max-w-sm">
                <Input placeholder="Buscar en logs..." />
            </div>
        </div>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Log de Actividad de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Usuario (Email)</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Detalles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockActivityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Bitácora de Cambios (Audit Log)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Tabla Afectada</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Datos Anteriores</TableHead>
                    <TableHead>Datos Nuevos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAuditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.table}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="font-mono text-xs">{log.before}</TableCell>
                      <TableCell className="font-mono text-xs">{log.after}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}