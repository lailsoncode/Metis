import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, Move } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CourseModule {
  id: string;
  title: string;
  description?: string;
  content?: string;
  video_url?: string;
  module_type: 'texto' | 'video' | 'quiz' | 'atividade';
  duration_minutes?: number;
  order_index: number;
  is_required: boolean;
}

interface CourseModuleEditorProps {
  courseId: string;
  onModulesChange?: () => void;
}

export function CourseModuleEditor({ courseId, onModulesChange }: CourseModuleEditorProps) {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    video_url: '',
    module_type: 'texto' as 'texto' | 'video' | 'quiz' | 'atividade',
    duration_minutes: 0,
    is_required: true
  });

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error('Erro ao buscar módulos:', error);
      toast.error('Erro ao carregar módulos do curso');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      video_url: '',
      module_type: 'texto',
      duration_minutes: 0,
      is_required: true
    });
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (module: CourseModule) => {
    setFormData({
      title: module.title,
      description: module.description || '',
      content: module.content || '',
      video_url: module.video_url || '',
      module_type: module.module_type,
      duration_minutes: module.duration_minutes || 0,
      is_required: module.is_required
    });
    setEditingModule(module);
    setIsEditDialogOpen(true);
  };

  const handleSaveModule = async () => {
    try {
      if (!formData.title.trim()) {
        toast.error('Título do módulo é obrigatório');
        return;
      }

      if (editingModule) {
        // Atualizar módulo existente
        const { error } = await supabase
          .from('course_modules')
          .update({
            title: formData.title,
            description: formData.description,
            content: formData.content,
            video_url: formData.video_url,
            module_type: formData.module_type,
            duration_minutes: formData.duration_minutes,
            is_required: formData.is_required
          })
          .eq('id', editingModule.id);

        if (error) throw error;
        toast.success('Módulo atualizado com sucesso');
        setIsEditDialogOpen(false);
      } else {
        // Criar novo módulo
        const nextOrderIndex = Math.max(...modules.map(m => m.order_index), -1) + 1;
        
        const { error } = await supabase
          .from('course_modules')
          .insert({
            course_id: courseId,
            title: formData.title,
            description: formData.description,
            content: formData.content,
            video_url: formData.video_url,
            module_type: formData.module_type,
            duration_minutes: formData.duration_minutes,
            is_required: formData.is_required,
            order_index: nextOrderIndex
          });

        if (error) throw error;
        toast.success('Módulo criado com sucesso');
        setIsAddDialogOpen(false);
      }

      resetForm();
      fetchModules();
      onModulesChange?.();
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
      toast.error('Erro ao salvar módulo');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Tem certeza que deseja excluir este módulo?')) return;

    try {
      const { error } = await supabase
        .from('course_modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;
      
      toast.success('Módulo excluído com sucesso');
      fetchModules();
      onModulesChange?.();
    } catch (error) {
      console.error('Erro ao excluir módulo:', error);
      toast.error('Erro ao excluir módulo');
    }
  };

  const handleMoveModule = async (moduleId: string, direction: 'up' | 'down') => {
    const currentIndex = modules.findIndex(m => m.id === moduleId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return;

    try {
      const currentModule = modules[currentIndex];
      const targetModule = modules[targetIndex];

      // Trocar as posições
      await supabase
        .from('course_modules')
        .update({ order_index: targetModule.order_index })
        .eq('id', currentModule.id);

      await supabase
        .from('course_modules')
        .update({ order_index: currentModule.order_index })
        .eq('id', targetModule.id);

      fetchModules();
      onModulesChange?.();
    } catch (error) {
      console.error('Erro ao mover módulo:', error);
      toast.error('Erro ao reorganizar módulos');
    }
  };

  const getModuleTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Vídeo';
      case 'quiz': return 'Quiz';
      case 'atividade': return 'Atividade';
      default: return 'Texto';
    }
  };

  const ModuleDialog = ({ isEdit = false }: { isEdit?: boolean }) => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {isEdit ? 'Editar Módulo' : 'Adicionar Novo Módulo'}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Ex: MÓDULO 1 - Fundamentos da Energia Eólica"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Sugestão: Use o formato "MÓDULO X - Assunto" para melhor organização
          </p>
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descrição opcional do módulo"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="module_type">Tipo de Módulo</Label>
          <Select 
            value={formData.module_type} 
            onValueChange={(value: 'texto' | 'video' | 'quiz' | 'atividade') => 
              setFormData(prev => ({ ...prev, module_type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="texto">Texto</SelectItem>
              <SelectItem value="video">Vídeo</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="atividade">Atividade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.module_type === 'video' && (
          <div>
            <Label htmlFor="video_url">URL do Vídeo</Label>
            <Input
              id="video_url"
              value={formData.video_url}
              onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        )}

        <div>
          <Label htmlFor="content">Conteúdo</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Conteúdo do módulo (suporta Markdown)"
            rows={6}
          />
        </div>

        <div>
          <Label htmlFor="duration">Duração (minutos)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
            min="0"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_required"
            checked={formData.is_required}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_required: checked }))}
          />
          <Label htmlFor="is_required">Módulo obrigatório</Label>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => {
          if (isEdit) setIsEditDialogOpen(false);
          else setIsAddDialogOpen(false);
        }}>
          Cancelar
        </Button>
        <Button onClick={handleSaveModule}>
          {isEdit ? 'Atualizar' : 'Criar'} Módulo
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Módulos do Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Módulos do Curso ({modules.length})</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Módulo
            </Button>
          </DialogTrigger>
          <ModuleDialog />
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {modules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum módulo encontrado.</p>
            <p className="text-sm">Clique em "Adicionar Módulo" para começar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((module, index) => (
              <Card key={module.id} className="border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{module.order_index + 1}
                        </span>
                        <h4 className="font-semibold">{module.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {getModuleTypeLabel(module.module_type)}
                        </Badge>
                        {module.is_required && (
                          <Badge variant="default" className="text-xs">
                            Obrigatório
                          </Badge>
                        )}
                      </div>
                      
                      {module.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {module.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {module.duration_minutes > 0 && (
                          <span>Duração: {module.duration_minutes} min</span>
                        )}
                        {module.video_url && (
                          <span>Com vídeo</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveModule(module.id, 'up')}
                        disabled={index === 0}
                      >
                        <Move className="h-3 w-3 rotate-180" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveModule(module.id, 'down')}
                        disabled={index === modules.length - 1}
                      >
                        <Move className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(module)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteModule(module.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <ModuleDialog isEdit />
      </Dialog>
    </Card>
  );
}