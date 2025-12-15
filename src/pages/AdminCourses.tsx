import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, Search, BookOpen, Users, Settings, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CourseModuleEditor } from "@/components/CourseModuleEditor";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  detailed_description?: string;
  duration_hours: number;
  level: 'iniciante' | 'intermediario' | 'avancado';
  price?: number;
  is_featured: boolean;
  is_active: boolean;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
  instructor_id?: string;
}

export default function AdminCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAdvancedEditDialogOpen, setIsAdvancedEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    totalEnrollments: 0,
    totalHours: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailed_description: '',
    duration_hours: 0,
    level: 'iniciante' as 'iniciante' | 'intermediario' | 'avancado',
    price: 0,
    is_featured: false,
    is_active: true,
    cover_image_url: ''
  });

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [courses, searchTerm, levelFilter, statusFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      toast.error('Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        supabase.from('courses').select('*'),
        supabase.from('enrollments').select('id', { count: 'exact' }).eq('is_active', true)
      ]);

      const courses = coursesRes.data || [];
      setStats({
        totalCourses: courses.length,
        activeCourses: courses.filter(c => c.is_active).length,
        totalEnrollments: enrollmentsRes.count || 0,
        totalHours: courses.reduce((sum, c) => sum + c.duration_hours, 0)
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const applyFilters = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(course => course.level === levelFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => 
        statusFilter === 'active' ? course.is_active : !course.is_active
      );
    }

    setFilteredCourses(filtered);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      detailed_description: '',
      duration_hours: 0,
      level: 'iniciante',
      price: 0,
      is_featured: false,
      is_active: true,
      cover_image_url: ''
    });
    setEditingCourse(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      detailed_description: course.detailed_description || '',
      duration_hours: course.duration_hours,
      level: course.level,
      price: course.price || 0,
      is_active: course.is_active,
      is_featured: course.is_featured,
      cover_image_url: course.cover_image_url || ''
    });
    setIsEditDialogOpen(true);
  };

  const openAdvancedEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      detailed_description: course.detailed_description || '',
      duration_hours: course.duration_hours,
      level: course.level,
      price: course.price || 0,
      is_active: course.is_active,
      is_featured: course.is_featured,
      cover_image_url: course.cover_image_url || ''
    });
    setIsAdvancedEditDialogOpen(true);
  };

  const handleSaveCourse = async () => {
    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        toast.error('Título e descrição são obrigatórios');
        return;
      }

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update({
            title: formData.title,
            description: formData.description,
            detailed_description: formData.detailed_description,
            duration_hours: formData.duration_hours,
            level: formData.level,
            price: formData.price,
            is_featured: formData.is_featured,
            is_active: formData.is_active,
            cover_image_url: formData.cover_image_url
          })
          .eq('id', editingCourse.id);

        if (error) throw error;
        toast.success('Curso atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('courses')
          .insert({
            title: formData.title,
            description: formData.description,
            detailed_description: formData.detailed_description,
            duration_hours: formData.duration_hours,
            level: formData.level,
            price: formData.price,
            is_featured: formData.is_featured,
            is_active: formData.is_active,
            cover_image_url: formData.cover_image_url,
            instructor_id: user?.id
          });

        if (error) throw error;
        toast.success('Curso criado com sucesso!');
      }

      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
      setIsAdvancedEditDialogOpen(false);
      resetForm();
      fetchCourses();
      fetchStats();
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      toast.error('Erro ao salvar curso');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      
      toast.success('Curso excluído com sucesso!');
      fetchCourses();
      fetchStats();
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      toast.error('Erro ao excluir curso');
    }
  };

  const handleEnrollInCourse = async (courseId: string) => {
    if (!user) return;

    try {
      // Verificar se já está matriculado
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('student_id', user.id)
        .eq('is_active', true)
        .single();

      if (existingEnrollment) {
        toast.error('Você já está matriculado neste curso');
        return;
      }

      const { error } = await supabase
        .from('enrollments')
        .insert({
          course_id: courseId,
          student_id: user.id
        });

      if (error) throw error;
      toast.success('Matriculado com sucesso!');
      fetchStats();
    } catch (error) {
      console.error('Erro ao se matricular:', error);
      toast.error('Erro ao se matricular no curso');
    }
  };

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'iniciante': return 'default';
      case 'intermediario': return 'secondary';
      case 'avancado': return 'destructive';
      default: return 'outline';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'iniciante': return 'Iniciante';
      case 'intermediario': return 'Intermediário';
      case 'avancado': return 'Avançado';
      default: return level;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Cursos</h1>
            <p className="text-muted-foreground">
              Crie, edite e gerencie os cursos da plataforma
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Curso
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Curso</DialogTitle>
                <DialogDescription>
                  Preencha as informações básicas do novo curso.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-title">Título *</Label>
                  <Input
                    id="new-title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Digite o título do curso"
                  />
                </div>

                <div>
                  <Label htmlFor="new-description">Descrição *</Label>
                  <Textarea
                    id="new-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição breve do curso"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="new-detailed-description">Descrição Detalhada</Label>
                  <Textarea
                    id="new-detailed-description"
                    value={formData.detailed_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
                    placeholder="Descrição completa do curso"
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-duration">Duração (horas) *</Label>
                    <Input
                      id="new-duration"
                      type="number"
                      value={formData.duration_hours}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: parseInt(e.target.value) || 0 }))}
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-price">Preço (R$)</Label>
                    <Input
                      id="new-price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-level">Nível *</Label>
                  <Select value={formData.level} onValueChange={(value: any) => setFormData(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iniciante">Iniciante</SelectItem>
                      <SelectItem value="intermediario">Intermediário</SelectItem>
                      <SelectItem value="avancado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="new-cover-url">URL da Imagem de Capa</Label>
                  <Input
                    id="new-cover-url"
                    value={formData.cover_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="new-is-active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="new-is-active">Curso Ativo</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="new-is-featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                    />
                    <Label htmlFor="new-is-featured">Curso em Destaque</Label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveCourse}>Criar Curso</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">cursos criados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCourses}</div>
              <p className="text-xs text-muted-foreground">disponíveis para matrícula</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas de Conteúdo</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHours}</div>
              <p className="text-xs text-muted-foreground">horas de aprendizado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matrículas Ativas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
              <p className="text-xs text-muted-foreground">estudantes matriculados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="iniciante">Iniciante</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="avancado">Avançado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Apenas Ativos</SelectItem>
                  <SelectItem value="inactive">Apenas Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Cursos ({filteredCourses.length})</CardTitle>
            <CardDescription>
              Gerencie todos os cursos da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhum curso encontrado</h3>
                <p>
                  {courses.length === 0 
                    ? 'Comece criando seu primeiro curso.' 
                    : 'Tente ajustar os filtros de busca.'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Duração</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {course.description}
                            </div>
                            {course.is_featured && (
                              <Badge variant="outline" className="mt-1">Destaque</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getLevelBadgeVariant(course.level)}>
                            {getLevelText(course.level)}
                          </Badge>
                        </TableCell>
                        <TableCell>{course.duration_hours}h</TableCell>
                        <TableCell>
                          {course.price && course.price > 0 
                            ? `R$ ${course.price.toFixed(2)}` 
                            : 'Gratuito'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={course.is_active ? 'default' : 'secondary'}>
                            {course.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEnrollInCourse(course.id)}
                              title="Matricular-se no curso"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(course)}
                              title="Edição Básica"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openAdvancedEditDialog(course)}
                              title="Edição Avançada"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCourse(course.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
            <DialogDescription>
              Atualize as informações básicas do curso.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Digite o título do curso"
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Descrição *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição breve do curso"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-detailed-description">Descrição Detalhada</Label>
              <Textarea
                id="edit-detailed-description"
                value={formData.detailed_description}
                onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
                placeholder="Descrição completa do curso"
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-duration">Duração (horas) *</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: parseInt(e.target.value) || 0 }))}
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="edit-price">Preço (R$)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  min="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-level">Nível *</Label>
              <Select value={formData.level} onValueChange={(value: any) => setFormData(prev => ({ ...prev, level: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iniciante">Iniciante</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="avancado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-cover-url">URL da Imagem de Capa</Label>
              <Input
                id="edit-cover-url"
                value={formData.cover_image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is-active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="edit-is-active">Curso Ativo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is-featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
                <Label htmlFor="edit-is-featured">Curso em Destaque</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCourse}>Atualizar Curso</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Edit Dialog */}
      <Dialog open={isAdvancedEditDialogOpen} onOpenChange={setIsAdvancedEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edição Avançada - {editingCourse?.title}</DialogTitle>
            <DialogDescription>
              Gerencie todas as configurações e módulos do curso.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              <TabsTrigger value="modules">Módulos e Conteúdo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="mt-4 space-y-4 overflow-y-auto max-h-[60vh]">
              <div>
                <Label htmlFor="adv-title">Título *</Label>
                <Input
                  id="adv-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Digite o título do curso"
                />
              </div>

              <div>
                <Label htmlFor="adv-description">Descrição *</Label>
                <Textarea
                  id="adv-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição breve do curso"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="adv-detailed-description">Descrição Detalhada</Label>
                <Textarea
                  id="adv-detailed-description"
                  value={formData.detailed_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
                  placeholder="Descrição completa do curso"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adv-duration">Duração (horas) *</Label>
                  <Input
                    id="adv-duration"
                    type="number"
                    value={formData.duration_hours}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: parseInt(e.target.value) || 0 }))}
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="adv-price">Preço (R$)</Label>
                  <Input
                    id="adv-price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="adv-level">Nível *</Label>
                <Select value={formData.level} onValueChange={(value: any) => setFormData(prev => ({ ...prev, level: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="avancado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="adv-cover-url">URL da Imagem de Capa</Label>
                <Input
                  id="adv-cover-url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="adv-is-active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="adv-is-active">Curso Ativo</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="adv-is-featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="adv-is-featured">Curso em Destaque</Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="modules" className="mt-4 overflow-y-auto max-h-[60vh]">
              {editingCourse && (
                <CourseModuleEditor 
                  courseId={editingCourse.id} 
                  onModulesChange={() => {
                    // Refresh course data if needed
                    fetchCourses();
                  }}
                />
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdvancedEditDialogOpen(false)}>
              Fechar
            </Button>
            <Button onClick={handleSaveCourse}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}