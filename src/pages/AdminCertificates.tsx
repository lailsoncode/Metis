import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Award, Search, Download, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { generateCertificatePdf } from "@/utils/certificatePdf";

interface Certificate {
  id: string;
  certificate_number: string;
  verification_code: string;
  issued_at: string;
  status: string;
  certificate_url?: string;
  course_id: string;
  profiles: {
    full_name: string;
    email: string;
  };
  courses: {
    title: string;
    duration_hours: number;
  };
}

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          profiles!certificates_student_id_fkey (
            full_name,
            email
          ),
          courses (
            title,
            duration_hours
          )
        `)
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

  const filteredCertificates = certificates.filter(cert =>
    cert.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.courses.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificate_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      // Recalcula pela soma dos módulos; se falhar, usa a carga do curso; garante >= 1
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
        studentName: certificate.profiles.full_name,
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
      console.error('Error downloading certificate (admin):', error);
      toast({
        title: 'Erro',
        description: 'Erro ao baixar certificado.',
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Award className="w-8 h-8" />
              Certificados
            </h1>
            <p className="text-muted-foreground">
              Gerencie os certificados emitidos
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou curso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Certificados Emitidos</CardTitle>
            <CardDescription>
              {filteredCertificates.length} certificado(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudante</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Código de Verificação</TableHead>
                  <TableHead>Data de Emissão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{certificate.profiles.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {certificate.profiles.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {certificate.courses.title}
                    </TableCell>
                    <TableCell className="font-mono">
                      {certificate.certificate_number}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {certificate.verification_code}
                    </TableCell>
                    <TableCell>
                      {format(new Date(certificate.issued_at), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(certificate.status)}>
                        {getStatusText(certificate.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadCertificate(certificate)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          {downloadingId === certificate.id ? 'Gerando...' : 'PDF'}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Verificar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}