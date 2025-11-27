import { useEffect, useState } from 'react';
import { rolesApi, genericCrudApi } from '@/services/api';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, UserPlus, X, Trash2, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { SimplePagination } from '@/components/SimplePagination';

export function RoleManagementPage() {
  const [activeTab, setActiveTab] = useState('assignments');
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  // Assignment Modal State
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Roles CRUD State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");

  useEffect(() => {
    loadData();
  }, [page, pageSize]); // Reload when page changes

  const loadData = async () => {
    setLoading(true);
    try {
      // Parallel fetch: Users (paginated) + Roles (all)
      const [usersData, rolesData] = await Promise.all([
        rolesApi.getUsersWithRoles(page, pageSize),
        genericCrudApi.getAll('admin/categorias')
      ]);
      
      if (usersData.length < pageSize) {
          setHasMore(false);
      } else {
          setHasMore(true);
      }

      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error("Error loading roles data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedUser || !selectedRole) return;
    try {
      await rolesApi.assignRole(selectedUser, parseInt(selectedRole));
      setIsAssignOpen(false);
      loadData();
    } catch (error) {
      alert("Error al asignar rol");
    }
  };

  const handleRevoke = async (userId: number, roleName: string) => {
    const role = roles.find(r => r.nombre_categoria === roleName);
    if (!role) return;
    
    if (!confirm(`¿Remover rol ${roleName} de este usuario?`)) return;
    
    try {
      await rolesApi.revokeRole(userId, role.categoria_id);
      loadData();
    } catch (error) {
      alert("Error al remover rol");
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await genericCrudApi.create('admin/categorias', { 
              nombre_categoria: roleName, 
              descripcion: roleDesc 
          });
          setIsRoleModalOpen(false);
          setRoleName("");
          setRoleDesc("");
          // Only reload roles if needed, usually separate call or just this:
          const newRoles = await genericCrudApi.getAll('admin/categorias');
          setRoles(newRoles);
      } catch (error) {
          alert("Error al crear rol");
      }
  };

  const handleDeleteRole = async (id: number) => {
      if (!confirm("¿Eliminar este rol del sistema?")) return;
      try {
          await genericCrudApi.delete('admin/categorias', id);
          const newRoles = await genericCrudApi.getAll('admin/categorias');
          setRoles(newRoles);
      } catch (error) {
          alert("Error al eliminar rol");
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Shield className="h-6 w-6 text-indigo-600" />
                Control de Acceso
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Gestión de roles y privilegios de usuarios.
            </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
            <TabsTrigger value="assignments">Asignación de Usuarios</TabsTrigger>
            <TabsTrigger value="roles">Definición de Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4 mt-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Usuarios y Permisos</CardTitle>
                        <CardDescription>Asigna roles a los usuarios existentes.</CardDescription>
                    </div>
                    <Button onClick={() => setIsAssignOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Asignar Rol
                    </Button>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-8 flex justify-center">
                            <div className="h-8 w-8 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Roles Actuales</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.persona_id}>
                                        <TableCell className="font-medium">{user.nombre} {user.apellido}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 flex-wrap">
                                                {user.roles.length > 0 ? user.roles.map((role: string) => (
                                                    <Badge key={role} variant="outline" className="gap-1 pr-1">
                                                        {role}
                                                        <X 
                                                            className="h-3 w-3 cursor-pointer hover:text-red-500" 
                                                            onClick={() => handleRevoke(user.persona_id, role)}
                                                        />
                                                    </Badge>
                                                )) : (
                                                    <span className="text-zinc-400 text-xs italic">Sin roles</span>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        
                        <div className="mt-4 border-t border-zinc-100 dark:border-zinc-800/50 pt-4">
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
        </TabsContent>

        <TabsContent value="roles" className="space-y-4 mt-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Catálogo de Roles</CardTitle>
                        <CardDescription>Define los tipos de usuarios del sistema.</CardDescription>
                    </div>
                    <Button onClick={() => setIsRoleModalOpen(true)} variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Nuevo Rol
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre del Rol</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => (
                                <TableRow key={role.categoria_id}>
                                    <TableCell className="font-medium">
                                        <Badge>{role.nombre_categoria}</Badge>
                                    </TableCell>
                                    <TableCell>{role.descripcion || "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRole(role.categoria_id)}>
                                            <Trash2 className="h-4 w-4 text-zinc-400 hover:text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      {/* Assign Role Modal */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Asignar Rol a Usuario</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                  <div className="space-y-2">
                      <Label>Usuario</Label>
                      <Select onValueChange={(val) => setSelectedUser(parseInt(val))}>
                          <SelectTrigger>
                              <SelectValue placeholder="Seleccionar usuario..." />
                          </SelectTrigger>
                          <SelectContent>
                              {users.map((u) => (
                                  <SelectItem key={u.persona_id} value={u.persona_id.toString()}>
                                      {u.nombre} {u.apellido} ({u.email})
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label>Rol</Label>
                      <Select onValueChange={setSelectedRole}>
                          <SelectTrigger>
                              <SelectValue placeholder="Seleccionar rol..." />
                          </SelectTrigger>
                          <SelectContent>
                              {roles.map((r) => (
                                  <SelectItem key={r.categoria_id} value={r.categoria_id.toString()}>
                                      {r.nombre_categoria}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancelar</Button>
                  <Button onClick={handleAssign}>Asignar</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      {/* Create Role Modal */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Crear Nuevo Rol</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateRole} className="space-y-4 py-4">
                  <div className="space-y-2">
                      <Label>Nombre del Rol</Label>
                      <Input 
                        value={roleName} 
                        onChange={(e) => setRoleName(e.target.value)} 
                        placeholder="Ej. Coordinador" 
                        required 
                      />
                  </div>
                  <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Input 
                        value={roleDesc} 
                        onChange={(e) => setRoleDesc(e.target.value)} 
                        placeholder="Descripción opcional" 
                      />
                  </div>
                  <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsRoleModalOpen(false)}>Cancelar</Button>
                      <Button type="submit">Crear</Button>
                  </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>
    </div>
  );
}