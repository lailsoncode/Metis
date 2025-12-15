import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  CheckCircle, 
  Circle, 
  ArrowLeft, 
  ArrowRight, 
  Clock,
  Award
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration_hours: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  content: string;
  order_index: number;
  duration_minutes: number;
  is_required: boolean;
}

interface ModuleProgress {
  id: string;
  module_id: string;
  is_completed: boolean;
  completed_at?: string;
}

interface Enrollment {
  id: string;
  progress_percentage: number;
  completed_at?: string;
}

export default function Course() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId && user) {
      fetchCourseData();
    }
  }, [courseId, user]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (modulesError) throw modulesError;
      setModules(modulesData || []);

      // Fetch enrollment
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', courseId)
        .eq('student_id', user?.id)
        .eq('is_active', true)
        .single();

      if (enrollmentError && enrollmentError.code !== 'PGRST116') {
        throw enrollmentError;
      }
      setEnrollment(enrollmentData);

      // Fetch module progress
      if (enrollmentData) {
        const { data: progressData, error: progressError } = await supabase
          .from('module_progress')
          .select('*')
          .eq('student_id', user?.id)
          .eq('enrollment_id', enrollmentData.id);

        if (progressError) throw progressError;
        setModuleProgress(progressData || []);
      }

    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Erro ao carregar dados do curso');
      navigate('/my-courses');
    } finally {
      setLoading(false);
    }
  };

  const isModuleCompleted = (moduleId: string) => {
    return moduleProgress.some(p => p.module_id === moduleId && p.is_completed);
  };

  const handleCompleteModule = async (moduleId: string) => {
    if (!enrollment) return;

    try {
      const existingProgress = moduleProgress.find(p => p.module_id === moduleId);
      
      if (existingProgress) {
        // Update existing progress
        const { error } = await supabase
          .from('module_progress')
          .update({ 
            is_completed: true,
            completed_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);

        if (error) throw error;
      } else {
        // Create new progress
        const { error } = await supabase
          .from('module_progress')
          .insert({
            student_id: user?.id,
            module_id: moduleId,
            enrollment_id: enrollment.id,
            is_completed: true,
            completed_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      toast.success('Módulo concluído!');
      fetchCourseData(); // Refresh data to update progress

    } catch (error) {
      console.error('Error completing module:', error);
      toast.error('Erro ao concluir módulo');
    }
  };

  const getCompletedModulesCount = () => {
    return modules.filter(module => isModuleCompleted(module.id)).length;
  };

  const getProgressPercentage = () => {
    if (modules.length === 0) return 0;
    return Math.round((getCompletedModulesCount() / modules.length) * 100);
  };

  const currentModule = modules[currentModuleIndex];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-6">
            <div className="h-96 bg-muted rounded"></div>
            <div className="col-span-3 h-96 bg-muted rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course || !enrollment) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Curso não encontrado</h2>
          <p className="text-muted-foreground mb-6">
            Você não está matriculado neste curso ou ele não existe.
          </p>
          <Button onClick={() => navigate('/my-courses')}>
            Voltar aos Meus Cursos
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/my-courses')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <h3 className="font-semibold">Progresso do Curso</h3>
                <p className="text-sm text-muted-foreground">
                  {getCompletedModulesCount()} de {modules.length} módulos concluídos
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{getProgressPercentage()}%</span>
                {getProgressPercentage() === 100 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Award className="w-3 h-3 mr-1" />
                    Concluído
                  </Badge>
                )}
              </div>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </CardContent>
        </Card>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Module List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Módulos do Curso</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <ScrollArea className="h-[500px]">
                <div className="space-y-4 p-4">
                  {modules.map((module, index) => {
                    const groupIndex = Math.floor(index / 3);
                    const isFirstInGroup = index % 3 === 0;
                    
                    return (
                      <div key={module.id}>
                        {isFirstInGroup && (
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                            Módulo {groupIndex + 1}
                          </div>
                        )}
                         <div
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            currentModuleIndex === index
                              ? 'bg-primary/10 border border-primary/20'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setCurrentModuleIndex(index)}
                        >
                          <div className="mt-1">
                            {isModuleCompleted(module.id) ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm leading-tight">
                              {module.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {module.duration_minutes} min
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {currentModule && (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{currentModule.title}</CardTitle>
                      <CardDescription>{currentModule.description}</CardDescription>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {currentModule.duration_minutes} minutos
                      </div>
                    </div>
                    {!isModuleCompleted(currentModule.id) && (
                      <Button
                        onClick={() => handleCompleteModule(currentModule.id)}
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Concluir
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{currentModule.content}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentModuleIndex(Math.max(0, currentModuleIndex - 1))}
                disabled={currentModuleIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setCurrentModuleIndex(Math.min(modules.length - 1, currentModuleIndex + 1))}
                disabled={currentModuleIndex === modules.length - 1}
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}