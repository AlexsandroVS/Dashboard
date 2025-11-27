import { useEffect, useState } from 'react';
import { genericCrudApi } from '@/services/api';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Plus, Database, Server } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Configuration for each resource type
const resourceConfig: Record<string, any> = {
    "academic/materias": {
        label: "Materias",
        idField: "materia_id",
        columns: [
            { key: "nombre", label: "Nombre Materia" },
            { key: "ciclo_materia", label: "Ciclo" }
        ],
        schema: [
            { key: "nombre", label: "Nombre", type: "text", required: true },
            { key: "ciclo_materia", label: "Ciclo", type: "number", required: true }
        ]
    },
    "academic/aulas": {
        label: "Aulas",
        idField: "aula_id",
        columns: [
            { key: "nombre", label: "Identificador" },
            { key: "capacidad", label: "Capacidad" },
            { key: "sucursal_id", label: "ID Sucursal" } 
        ],
        schema: [
            { key: "nombre", label: "Identificador (Ej. A-101)", type: "text", required: true },
            { key: "capacidad", label: "Capacidad", type: "number", required: true },
            { 
                key: "sucursal_id", 
                label: "Sucursal", 
                type: "select", 
                source: "academic/sucursales", 
                labelField: "nombre", 
                valueField: "sucursal_id", 
                required: true 
            }
        ]
    },
    "academic/semestres": {
        label: "Semestres",
        idField: "semestre_id",
        columns: [
            { key: "nombre", label: "Código" },
            { key: "fecha_inicio", label: "Inicio" },
            { key: "fecha_fin", label: "Fin" }
        ],
        schema: [
            { key: "nombre", label: "Código (Ej. 2025-1)", type: "text", required: true },
            { key: "fecha_inicio", label: "Fecha Inicio", type: "date", required: true },
            { key: "fecha_fin", label: "Fecha Fin", type: "date", required: true }
        ]
    },
    "academic/sucursales": {
        label: "Sucursales",
        idField: "sucursal_id",
        columns: [
            { key: "nombre", label: "Sede" },
            { key: "direccion", label: "Dirección" }
        ],
        schema: [
            { key: "nombre", label: "Nombre Sede", type: "text", required: true },
            { key: "direccion", label: "Dirección", type: "text", required: true }
        ]
    }
};

export function DataManagementPage() {
  const [activeResource, setActiveResource] = useState("academic/materias");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  
  // Select Options Cache
  const [selectOptions, setSelectOptions] = useState<Record<string, any[]>>({});

  const config = resourceConfig[activeResource];

  const loadData = async () => {
      setLoading(true);
      try {
          const res = await genericCrudApi.getAll(activeResource);
          setData(res);
      } catch (error) {
          console.error("Error loading data:", error);
      } finally {
          setLoading(false);
      }
  };

  const loadOptions = async (source: string) => {
      if (selectOptions[source]) return; // Use cached
      try {
          const res = await genericCrudApi.getAll(source);
          setSelectOptions(prev => ({ ...prev, [source]: res }));
      } catch (error) {
          console.error("Error loading options for " + source, error);
      }
  };

  // Load options when opening modal if schema has select fields
  useEffect(() => {
      if (isModalOpen) {
          config.schema.forEach((field: any) => {
              if (field.type === 'select' && field.source) {
                  loadOptions(field.source);
              }
          });
      }
  }, [isModalOpen, activeResource]);

  useEffect(() => {
      loadData();
  }, [activeResource]);

  const handleEdit = (item: any) => {
      setEditingItem(item);
      setFormData(item);
      setIsModalOpen(true);
  };

  const handleCreate = () => {
      setEditingItem(null);
      setFormData({});
      setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
      if (!confirm("¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.")) return;
      try {
          await genericCrudApi.delete(activeResource, id);
          loadData();
      } catch (error) {
          alert("Error al eliminar. Verifique que no tenga dependencias.");
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          if (editingItem) {
              await genericCrudApi.update(activeResource, editingItem[config.idField], formData);
          } else {
              await genericCrudApi.create(activeResource, formData);
          }
          setIsModalOpen(false);
          loadData();
      } catch (error) {
          console.error("Error saving:", error);
          alert("Error al guardar datos. Revise los campos.");
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Database className="h-6 w-6 text-indigo-600" />
                Gestión de Datos Maestros
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Administración centralizada de entidades académicas e infraestructura.
            </p>
        </div>
        <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Registro
        </Button>
      </div>

      <Tabs value={activeResource} onValueChange={setActiveResource} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
            {Object.entries(resourceConfig).map(([key, conf]) => (
                <TabsTrigger key={key} value={key} className="px-4">
                    {conf.label}
                </TabsTrigger>
            ))}
        </TabsList>
      </Tabs>

      <Card>
          <CardHeader>
              <CardTitle>{config.label}</CardTitle>
              <CardDescription>Mostrando {data.length} registros en el sistema.</CardDescription>
          </CardHeader>
          <CardContent>
              {loading ? (
                  <div className="py-8 flex justify-center">
                      <div className="h-8 w-8 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
                  </div>
              ) : (
                  <Table>
                      <TableHeader>
                          <TableRow>
                              {config.columns.map((col: any) => (
                                  <TableHead key={col.key}>{col.label}</TableHead>
                              ))}
                              <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {data.map((item) => (
                              <TableRow key={item[config.idField]}>
                                  {config.columns.map((col: any) => (
                                      <TableCell key={col.key}>{item[col.key]}</TableCell>
                                  ))}
                                  <TableCell className="text-right space-x-2">
                                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                          <Edit className="h-4 w-4 text-blue-500" />
                                      </Button>
                                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item[config.idField])}>
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                  </TableCell>
                              </TableRow>
                          ))}
                          {data.length === 0 && (
                              <TableRow>
                                  <TableCell colSpan={config.columns.length + 1} className="text-center py-8 text-zinc-500">
                                      No hay registros disponibles.
                                  </TableCell>
                              </TableRow>
                          )}
                      </TableBody>
                  </Table>
              )}
          </CardContent>
      </Card>

      {/* Generic CRUD Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{editingItem ? 'Editar' : 'Crear'} {config.label.slice(0, -1)}</DialogTitle>
                  <DialogDescription>
                      Complete los campos requeridos para guardar el registro.
                  </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  {config.schema.map((field: any) => (
                      <div key={field.key} className="space-y-2">
                          <Label htmlFor={field.key}>{field.label}</Label>
                          {field.type === 'select' ? (
                              <Select 
                                onValueChange={(val) => setFormData({...formData, [field.key]: parseInt(val)})}
                                defaultValue={editingItem ? editingItem[field.key]?.toString() : undefined}
                              >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione una opción" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectOptions[field.source]?.map((opt: any) => (
                                        <SelectItem key={opt[field.valueField]} value={opt[field.valueField].toString()}>
                                            {opt[field.labelField]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                          ) : (
                              <Input
                                  id={field.key}
                                  type={field.type}
                                  required={field.required}
                                  defaultValue={editingItem ? editingItem[field.key] : ''}
                                  onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                              />
                          )}
                      </div>
                  ))}
                  <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                          Cancelar
                      </Button>
                      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                          Guardar
                      </Button>
                  </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>
    </div>
  );
}