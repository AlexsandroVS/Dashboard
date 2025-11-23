import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminStudents, materias, semestres, Materia, Semestre } from "@/data/mockData";
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- Componente de Paginación ---
interface PaginationProps {
  currentPage: number; totalPages: number; onPageChange: (page: number) => void;
}
const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => (
  <div className="flex items-center justify-end space-x-2 py-4">
    <span className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</span>
    <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /> Anterior</Button>
    <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Siguiente <ChevronRight className="h-4 w-4" /></Button>
  </div>
);

// --- Diálogo de Confirmación de Borrado ---
const DeleteConfirmationDialog = ({ entityName }: { entityName: string }) => (
  <DialogContent>
    <DialogHeader><DialogTitle>¿Estás seguro?</DialogTitle><DialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente {entityName}.</DialogDescription></DialogHeader>
    <DialogFooter><Button variant="outline">Cancelar</Button><Button variant="destructive">Eliminar</Button></DialogFooter>
  </DialogContent>
);

// --- Formularios para Entidades ---
const MateriaForm = ({ materia }: { materia?: Materia }) => (
    <div className="space-y-4 py-4">
        <div className="space-y-2"><Label htmlFor="m-nombre">Nombre</Label><Input id="m-nombre" defaultValue={materia?.nombre} placeholder="Cálculo I"/></div>
        <div className="space-y-2"><Label htmlFor="m-ciclo">Ciclo</Label><Input id="m-ciclo" type="number" defaultValue={materia?.ciclo_materia} placeholder="1"/></div>
    </div>
);
const SemestreForm = ({ semestre }: { semestre?: Semestre }) => (
    <div className="space-y-4 py-4">
        <div className="space-y-2"><Label htmlFor="s-nombre">Nombre</Label><Input id="s-nombre" defaultValue={semestre?.nombre} placeholder="2025-1"/></div>
        <div className="space-y-2"><Label htmlFor="s-inicio">Fecha Inicio</Label><Input id="s-inicio" type="date" defaultValue={semestre?.fecha_inicio}/></div>
        <div className="space-y-2"><Label htmlFor="s-fin">Fecha Fin</Label><Input id="s-fin" type="date" defaultValue={semestre?.fecha_fin}/></div>
    </div>
);
const EstudianteForm = ({ student }: { student?: { id: string; nombre: string; apellido: string; email: string } }) => (
    <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="e-nombre">Nombre</Label><Input id="e-nombre" defaultValue={student?.nombre} /></div>
            <div className="space-y-2"><Label htmlFor="e-apellido">Apellido</Label><Input id="e-apellido" defaultValue={student?.apellido} /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="e-email">Email</Label><Input id="e-email" type="email" defaultValue={student?.email} /></div>
    </div>
);


// --- Pestañas de Contenido ---
const MateriasTab = () => {
  const [currentPage, setCurrentPage] = useState(1); const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(materias.length / ITEMS_PER_PAGE);
  const currentData = materias.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Gestionar Materias</CardTitle>
            <Dialog><DialogTrigger asChild><Button>Añadir Materia</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Crear Nueva Materia</DialogTitle></DialogHeader><MateriaForm /><DialogFooter><Button>Guardar Materia</Button></DialogFooter></DialogContent></Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Ciclo</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
          <TableBody>{currentData.map((materia) => (
              <TableRow key={materia.id}>
                <TableCell>{materia.nombre}</TableCell><TableCell>{materia.ciclo_materia}</TableCell>
                <TableCell className="text-right space-x-2">
                    <Dialog><DialogTrigger asChild><Button variant="outline" size="sm">Editar</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Editar Materia</DialogTitle></DialogHeader><MateriaForm materia={materia} /><DialogFooter><Button>Guardar Cambios</Button></DialogFooter></DialogContent></Dialog>
                    <Dialog><DialogTrigger asChild><Button variant="destructive" size="sm">Eliminar</Button></DialogTrigger><DeleteConfirmationDialog entityName={`la materia "${materia.nombre}"`} /></Dialog>
                </TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </CardContent>
    </Card>
  );
};

const SemestresTab = () => {
    const [currentPage, setCurrentPage] = useState(1); const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(semestres.length / ITEMS_PER_PAGE);
    const currentData = semestres.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    return (
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center"><CardTitle>Gestionar Semestres</CardTitle>
            <Dialog><DialogTrigger asChild><Button>Añadir Semestre</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Crear Nuevo Semestre</DialogTitle></DialogHeader><SemestreForm /><DialogFooter><Button>Guardar Semestre</Button></DialogFooter></DialogContent></Dialog>
        </div></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Fecha Inicio</TableHead><TableHead>Fecha Fin</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
            <TableBody>{currentData.map((semestre) => (
                <TableRow key={semestre.id}>
                  <TableCell>{semestre.nombre}</TableCell><TableCell>{semestre.fecha_inicio}</TableCell><TableCell>{semestre.fecha_fin}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog><DialogTrigger asChild><Button variant="outline" size="sm">Editar</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Editar Semestre</DialogTitle></DialogHeader><SemestreForm semestre={semestre} /><DialogFooter><Button>Guardar Cambios</Button></DialogFooter></DialogContent></Dialog>
                    <Dialog><DialogTrigger asChild><Button variant="destructive" size="sm">Eliminar</Button></DialogTrigger><DeleteConfirmationDialog entityName={`el semestre "${semestre.nombre}"`} /></Dialog>
                  </TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </CardContent>
      </Card>
    );
};

const EstudiantesTab = () => {
    const [currentPage, setCurrentPage] = useState(1); const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(adminStudents.length / ITEMS_PER_PAGE);
    const currentData = adminStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    return (
        <Card>
          <CardHeader><div className="flex justify-between items-center"><CardTitle>Gestionar Estudiantes</CardTitle>
          <Dialog><DialogTrigger asChild><Button>Añadir Estudiante</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Crear Nuevo Estudiante</DialogTitle></DialogHeader><EstudianteForm /><DialogFooter><Button>Crear Estudiante</Button></DialogFooter></DialogContent></Dialog>
        </div></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Nombre Completo</TableHead><TableHead>Email</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
              <TableBody>{currentData.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.nombre} {student.apellido}</TableCell><TableCell>{student.email}</TableCell>
                    <TableCell className="text-right space-x-2">
                        <Dialog><DialogTrigger asChild><Button variant="outline" size="sm">Editar</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Editar Estudiante</DialogTitle></DialogHeader><EstudianteForm student={student} /><DialogFooter><Button>Guardar Cambios</Button></DialogFooter></DialogContent></Dialog>
                        <Dialog><DialogTrigger asChild><Button variant="destructive" size="sm">Eliminar</Button></DialogTrigger><DeleteConfirmationDialog entityName={`al estudiante "${student.nombre}"`} /></Dialog>
                    </TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </CardContent>
        </Card>
      );
};

export function DataManagementPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Datos Centralizada</h1>
      <Tabs defaultValue="materias" className="w-full">
        <TabsList>
          <TabsTrigger value="materias">Materias</TabsTrigger>
          <TabsTrigger value="semestres">Semestres</TabsTrigger>
          <TabsTrigger value="estudiantes">Estudiantes</TabsTrigger>
        </TabsList>
        <TabsContent value="materias"><MateriasTab /></TabsContent>
        <TabsContent value="semestres"><SemestresTab /></TabsContent>
        <TabsContent value="estudiantes"><EstudiantesTab /></TabsContent>
      </Tabs>
    </div>
  );
}
