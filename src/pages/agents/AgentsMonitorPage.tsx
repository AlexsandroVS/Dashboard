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

const mockInteractions = [
  { id: 'a1', student: 'Ana Garcia', agent: 'Agente Tutor', message: 'Hola, necesito ayuda con mi tarea.', response: 'Claro, ¿en qué materia estás trabajando?', timestamp: '2025-11-20 14:30' },
  { id: 'a2', student: 'Juan Perez', agent: 'Agente de Riesgo', message: 'Me siento muy desmotivado últimamente.', response: 'Entiendo. Exploremos algunas estrategias...', timestamp: '2025-11-20 10:15' },
  { id: 'a3', student: 'Maria Lopez', agent: 'Agente Emocional', message: 'Me siento abrumada por mis clases.', response: 'Está bien sentirse así. Podemos hablar sobre cómo manejar tu estrés.', timestamp: '2025-11-19 16:00' },
  { id: 'a4', student: 'Carlos Ruiz', agent: 'Agente Social', message: '¿Cómo puedo unirme a grupos de estudio?', response: 'Hay varios grupos para tu carrera. ¿Quieres que te conecte?', timestamp: '2025-11-19 09:00' },
];

export function AgentsMonitorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Monitor de Agentes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Interacciones Recientes de Agentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Estudiante</TableHead>
                <TableHead>Agente</TableHead>
                <TableHead>Mensaje</TableHead>
                <TableHead>Respuesta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInteractions.map((interaction) => (
                <TableRow key={interaction.id}>
                  <TableCell>{interaction.timestamp}</TableCell>
                  <TableCell className="font-medium">{interaction.student}</TableCell>
                  <TableCell>{interaction.agent}</TableCell>
                  <TableCell className="max-w-xs truncate">{interaction.message}</TableCell>
                  <TableCell className="max-w-xs truncate">{interaction.response}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
