import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalEnrollments: 0,
    totalCertificates: 0,
    userCourses: 0,
    userCertificates: 0,
    userProgress: 0
  });

  useEffect(() => {
    if (profile && user) {
      fetchStats();
    }
  }, [profile, user]);

  const fetchStats = async () => {
    try {
      if (profile?.role === 'admin') {
        // Admin stats
        const [coursesRes, usersRes, enrollmentsRes, certificatesRes] = await Promise.all([
          supabase.from('courses').select('id', { count: 'exact' }),
          supabase.from('profiles').select('id', { count: 'exact' }),
          supabase.from('enrollments').select('id', { count: 'exact' }).eq('is_active', true),
          supabase.from('certificates').select('id', { count: 'exact' })
        ]);

        setStats({
          totalCourses: coursesRes.count || 0,
          totalUsers: usersRes.count || 0,
          totalEnrollments: enrollmentsRes.count || 0,
          totalCertificates: certificatesRes.count || 0,
          userCourses: 0,
          userCertificates: 0,
          userProgress: 0
        });
      } else {
        // Student stats
        const [enrollmentsRes, certificatesRes, progressRes] = await Promise.all([
          supabase.from('enrollments').select('id', { count: 'exact' }).eq('student_id', user.id).eq('is_active', true),
          supabase.from('certificates').select('id', { count: 'exact' }).eq('student_id', user.id),
          supabase.from('enrollments').select('progress_percentage').eq('student_id', user.id).eq('is_active', true)
        ]);

        const avgProgress = progressRes.data && progressRes.data.length > 0 
          ? Math.round(progressRes.data.reduce((sum, e) => sum + e.progress_percentage, 0) / progressRes.data.length)
          : 0;

        setStats({
          totalCourses: 0,
          totalUsers: 0,
          totalEnrollments: 0,
          totalCertificates: 0,
          userCourses: enrollmentsRes.count || 0,
          userCertificates: certificatesRes.count || 0,
          userProgress: avgProgress
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Bem-vindo, {profile?.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground mt-2">
              {profile?.role === 'admin' 
                ? 'Gerencie cursos, usuários e monitore o progresso da plataforma' 
                : 'Continue sua jornada de aprendizado sobre energia eólica e biodiversidade'
              }
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {profile?.role === 'admin' ? 'Total de Cursos' : 'Meus Cursos'}
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profile?.role === 'admin' ? stats.totalCourses : stats.userCourses}
                </div>
                <p className="text-xs text-muted-foreground">
                  {profile?.role === 'admin' ? 'cursos disponíveis' : 'cursos matriculados'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {profile?.role === 'admin' ? 'Total de Usuários' : 'Certificados'}
                </CardTitle>
                {profile?.role === 'admin' ? (
                  <Users className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Award className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profile?.role === 'admin' ? stats.totalUsers : stats.userCertificates}
                </div>
                <p className="text-xs text-muted-foreground">
                  {profile?.role === 'admin' ? 'usuários registrados' : 'certificados obtidos'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {profile?.role === 'admin' ? 'Matrículas Ativas' : 'Horas de Estudo'}
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profile?.role === 'admin' ? stats.totalEnrollments : '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {profile?.role === 'admin' ? 'matrículas em progresso' : 'horas completadas'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {profile?.role === 'admin' ? 'Certificados Emitidos' : 'Progresso Geral'}
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profile?.role === 'admin' ? stats.totalCertificates : `${stats.userProgress}%`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {profile?.role === 'admin' ? 'certificados gerados' : 'do total de conteúdo'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {profile?.role === 'admin' ? 'Atividade Recente' : 'Cursos em Progresso'}
                </CardTitle>
                <CardDescription>
                  {profile?.role === 'admin' 
                    ? 'Últimas atividades dos usuários na plataforma'
                    : 'Continue de onde parou'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-muted-foreground">
                  <p>Nenhum dados disponível ainda.</p>
                  <p className="text-sm mt-2">
                    {profile?.role === 'admin' 
                      ? 'Crie cursos e aguarde as primeiras matrículas'
                      : 'Matricule-se em um curso para começar'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {profile?.role === 'admin' ? 'Estatísticas Rápidas' : 'Próximos Passos'}
                </CardTitle>
                <CardDescription>
                  {profile?.role === 'admin' 
                    ? 'Resumo do desempenho da plataforma'
                    : 'Continue sua jornada de aprendizado'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-muted-foreground">
                  <p>Dados em breve...</p>
                  <p className="text-sm mt-2">
                    {profile?.role === 'admin' 
                      ? 'Estatísticas aparecerão conforme a plataforma for utilizada'
                      : 'Explore os cursos disponíveis sobre energia eólica e biodiversidade'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}