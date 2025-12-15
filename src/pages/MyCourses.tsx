import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Award, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration_hours: number;
  cover_image_url?: string;
}

interface Enrollment {
  id: string;
  course_id: string;
  progress_percentage: number;
  enrolled_at: string;
  completed_at?: string;
  courses: Course;
}

export default function MyCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEnrollments();
      fetchAvailableCourses();
    }
  }, [user]);

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (*)
        `)
        .eq('student_id', user?.id)
        .eq('is_active', true);

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast.error('Erro ao carregar cursos matriculados');
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setAvailableCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Erro ao carregar cursos disponíveis');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          student_id: user?.id,
          course_id: courseId,
          progress_percentage: 0,
          is_active: true
        });

      if (error) throw error;
      
      toast.success('Matrícula realizada com sucesso!');
      fetchEnrollments();
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Erro ao realizar matrícula');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante': return 'bg-green-100 text-green-800';
      case 'intermediario': return 'bg-yellow-100 text-yellow-800';
      case 'avancado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnrolledCourseIds = () => enrollments.map(e => e.course_id);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Meus Cursos</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meus Cursos</h1>
          <p className="text-muted-foreground">
            Gerencie seus cursos e acompanhe seu progresso de aprendizado
          </p>
        </div>

        {/* Cursos Matriculados */}
        {enrollments.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Cursos em Andamento</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{enrollment.courses.title}</CardTitle>
                        <CardDescription>{enrollment.courses.description}</CardDescription>
                      </div>
                      {enrollment.completed_at && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Award className="w-3 h-3 mr-1" />
                          Concluído
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {enrollment.courses.duration_hours}h
                      </div>
                      <Badge className={getLevelColor(enrollment.courses.level)}>
                        {enrollment.courses.level}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{enrollment.progress_percentage}%</span>
                      </div>
                      <Progress value={enrollment.progress_percentage} className="h-2" />
                    </div>

                    <Button 
                      onClick={() => navigate(`/course/${enrollment.course_id}`)}
                      className="w-full"
                      variant={enrollment.progress_percentage > 0 ? "default" : "outline"}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {enrollment.progress_percentage > 0 ? 'Continuar' : 'Iniciar'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Cursos Disponíveis */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Cursos Disponíveis</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableCourses
              .filter(course => !getEnrolledCourseIds().includes(course.id))
              .map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration_hours}h
                    </div>
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>

                  <Button 
                    onClick={() => handleEnroll(course.id)}
                    className="w-full"
                    variant="outline"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Matricular-se
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {availableCourses.filter(course => !getEnrolledCourseIds().includes(course.id)).length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum curso disponível</h3>
                <p className="text-muted-foreground">
                  Todos os cursos disponíveis já foram matriculados. Verifique novamente em breve!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}