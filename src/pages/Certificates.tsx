import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Award, Download, ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { generateCertificatePdf } from "@/utils/certificatePdf";

interface Certificate {
  id: string;
  certificate_number: string;
  verification_code: string;
  issued_at: string;
  status: string;
  course_id: string;
  certificate_url?: string;
  courses: {
    title: string;
    description: string;
    duration_hours: number;
  };
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses (
            title,
            description,
            duration_hours
          )
        `)
        .eq('student_id', user?.id)
        .order('issued_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar certificados:', error);
      toast({
        title: "Erro ao carregar certificados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued':
        return 'default';
      case 'revoked':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'issued':
        return 'Emitido';
      case 'revoked':
        return 'Revogado';
      default:
        return status;
    }
  };

  const handleDownloadCertificate = async (certificate: Certificate) => {
    if (downloadingId) return;
    try {
      setDownloadingId(certificate.id);
      const studentName = (profile?.full_name as string) || 'Aluno';

      // Tenta recalcular pela soma dos módulos; se falhar, usa a carga do curso; por fim, garante >= 1
      let hoursFromCourse = certificate.courses.duration_hours || 0;
      let computedHours = hoursFromCourse;

      const { data: modules, error: modErr } = await supabase
        .from('course_modules')
        .select('duration_minutes')
        .eq('course_id', certificate.course_id);

      if (!modErr && modules) {
        const totalMinutes = modules.reduce((acc: number, m: any) => acc + (m.duration_minutes || 0), 0);
        computedHours = Math.max(1, Math.round(totalMinutes / 60));
      }

      const finalHours = computedHours > 0 ? computedHours : Math.max(1, hoursFromCourse);

      generateCertificatePdf({
        studentName,
        courseTitle: certificate.courses.title,
        durationHours: finalHours,
        completionDate: certificate.issued_at,
        certificateNumber: certificate.certificate_number,
        verificationCode: certificate.verification_code,
      });

      toast({
        title: 'Sucesso',
        description: 'Certificado baixado com sucesso!',
      });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao baixar certificado. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus Certificados</h1>
            <p className="text-muted-foreground">
              Visualize e gerencie seus certificados de conclusão
            </p>
          </div>
          
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Certificados</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie seus certificados de conclusão
          </p>
        </div>

        {certificates.length === 0 ? (
          <Card>
            <CardContent className="pt-8">
              <div className="text-center space-y-4">
                <Award className="w-16 h-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">Nenhum certificado ainda</h3>
                  <p className="text-muted-foreground">
                    Complete cursos para receber seus certificados de conclusão
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        {certificate.courses.title}
                      </CardTitle>
                      <CardDescription>
                        {certificate.courses.description}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(certificate.status)}>
                      {getStatusText(certificate.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Número do Certificado
                        </label>
                        <p className="font-mono text-lg">{certificate.certificate_number}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Código de Verificação
                        </label>
                        <p className="font-mono">{certificate.verification_code}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Data de Emissão
                        </label>
                        <p>
                          {format(new Date(certificate.issued_at), "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadCertificate(certificate)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {downloadingId === certificate.id ? 'Gerando...' : 'Baixar PDF'}
                        </Button>
                        
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Verificar Autenticidade
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}