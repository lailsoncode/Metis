import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CertificateData {
  studentName: string;
  courseTitle: string;
  durationHours: number;
  completionDate: string;
  certificateNumber: string;
  verificationCode: string;
}

function generateCertificateHTML(data: CertificateData): string {
  const formattedDate = new Date(data.completionDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificado - ${data.studentName}</title>
        <style>
            @page {
                size: A4 landscape;
                margin: 0;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Georgia', serif;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                width: 297mm;
                height: 210mm;
                position: relative;
                overflow: hidden;
            }
            
            .certificate-container {
                width: 100%;
                height: 100%;
                position: relative;
                padding: 30mm;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
            }
            
            .decorative-border {
                position: absolute;
                top: 15mm;
                left: 15mm;
                right: 15mm;
                bottom: 15mm;
                border: 3px solid #059669;
                border-radius: 20px;
                box-shadow: inset 0 0 0 5px #f8fafc, inset 0 0 0 8px #059669;
            }
            
            .corner-decoration {
                position: absolute;
                width: 40px;
                height: 40px;
                border: 2px solid #059669;
                transform: rotate(45deg);
            }
            
            .corner-decoration.top-left {
                top: 25mm;
                left: 25mm;
            }
            
            .corner-decoration.top-right {
                top: 25mm;
                right: 25mm;
            }
            
            .corner-decoration.bottom-left {
                bottom: 25mm;
                left: 25mm;
            }
            
            .corner-decoration.bottom-right {
                bottom: 25mm;
                right: 25mm;
            }
            
            .header {
                margin-bottom: 30px;
            }
            
            .logo-section {
                margin-bottom: 20px;
            }
            
            .main-title {
                font-size: 42px;
                font-weight: bold;
                color: #059669;
                letter-spacing: 3px;
                margin-bottom: 10px;
                text-transform: uppercase;
            }
            
            .subtitle {
                font-size: 18px;
                color: #6b7280;
                font-style: italic;
            }
            
            .content {
                max-width: 600px;
                margin: 0 auto;
            }
            
            .certification-text {
                font-size: 16px;
                color: #374151;
                margin-bottom: 25px;
                line-height: 1.6;
            }
            
            .student-name {
                font-size: 36px;
                font-weight: bold;
                color: #111827;
                margin: 20px 0;
                border-bottom: 2px solid #059669;
                padding-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            
            .course-title {
                font-size: 24px;
                color: #059669;
                font-weight: bold;
                margin: 20px 0;
                line-height: 1.4;
            }
            
            .course-details {
                font-size: 16px;
                color: #6b7280;
                margin: 15px 0;
            }
            
            .completion-date {
                font-size: 18px;
                color: #374151;
                margin: 20px 0;
                font-weight: 500;
            }
            
            .footer {
                position: absolute;
                bottom: 40mm;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                justify-content: space-between;
                width: 500px;
                font-size: 12px;
                color: #6b7280;
            }
            
            .certificate-info {
                text-align: center;
            }
            
            .verification-section {
                position: absolute;
                bottom: 20mm;
                right: 30mm;
                font-size: 10px;
                color: #9ca3af;
                text-align: right;
            }
            
            .seal {
                position: absolute;
                bottom: 30mm;
                left: 30mm;
                width: 80px;
                height: 80px;
                border: 3px solid #059669;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: white;
                font-size: 12px;
                font-weight: bold;
                color: #059669;
                text-align: center;
                line-height: 1.2;
            }
        </style>
    </head>
    <body>
        <div class="certificate-container">
            <div class="decorative-border"></div>
            <div class="corner-decoration top-left"></div>
            <div class="corner-decoration top-right"></div>
            <div class="corner-decoration bottom-left"></div>
            <div class="corner-decoration bottom-right"></div>
            
            <div class="header">
                <div class="logo-section">
                    <!-- Espaço para logo futuro -->
                </div>
                <h1 class="main-title">Certificado</h1>
                <p class="subtitle">de Conclusão de Curso</p>
            </div>
            
            <div class="content">
                <p class="certification-text">
                    Certificamos que
                </p>
                
                <div class="student-name">${data.studentName}</div>
                
                <p class="certification-text">
                    concluiu com êxito o curso
                </p>
                
                <div class="course-title">${data.courseTitle}</div>
                
                <div class="course-details">
                    com carga horária de <strong>${data.durationHours} horas</strong>
                </div>
                
                <div class="completion-date">
                    Concluído em ${formattedDate}
                </div>
            </div>
            
            <div class="footer">
                <div class="certificate-info">
                    <div><strong>Conexão Palmeira</strong></div>
                    <div>Educação Ambiental e Sustentabilidade</div>
                </div>
            </div>
            
            <div class="seal">
                CONEXÃO<br>PALMEIRA
            </div>
            
            <div class="verification-section">
                <div>Certificado Nº: <strong>${data.certificateNumber}</strong></div>
                <div>Código de Verificação: <strong>${data.verificationCode}</strong></div>
                <div>Este certificado pode ser verificado em nosso sistema</div>
            </div>
        </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { certificateId } = await req.json();

    if (!certificateId) {
      return new Response(
        JSON.stringify({ error: 'Certificate ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar dados do certificado
    const { data: certificate, error: certError } = await supabaseClient
      .from('certificates')
      .select(`
        *,
        student:profiles!certificates_student_id_fkey(full_name),
        course:courses!certificates_course_id_fkey(title, duration_hours)
      `)
      .eq('id', certificateId)
      .single();

    if (certError || !certificate) {
      return new Response(
        JSON.stringify({ error: 'Certificate not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const certificateData: CertificateData = {
      studentName: certificate.student?.full_name || 'Nome não encontrado',
      courseTitle: certificate.course?.title || 'Curso não encontrado',
      durationHours: certificate.course?.duration_hours || 0,
      completionDate: certificate.issued_at,
      certificateNumber: certificate.certificate_number,
      verificationCode: certificate.verification_code,
    };

    const htmlContent = generateCertificateHTML(certificateData);

    // Usar Puppeteer para gerar PDF
    const command = new Deno.Command("chromium-browser", {
      args: [
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=5000",
        "--print-to-pdf",
        "--print-to-pdf-no-header",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-features=TranslateUI",
        "--disable-default-apps",
        "--no-first-run",
        "--disable-extensions",
        `--print-to-pdf=/tmp/certificate-${certificateId}.pdf`,
        "data:text/html;charset=utf-8," + encodeURIComponent(htmlContent)
      ]
    });

    const { code } = await command.output();

    if (code !== 0) {
      throw new Error('Failed to generate PDF');
    }

    const pdfData = await Deno.readFile(`/tmp/certificate-${certificateId}.pdf`);
    
    // Limpar arquivo temporário
    await Deno.remove(`/tmp/certificate-${certificateId}.pdf`);

    return new Response(pdfData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificado-${certificate.certificate_number}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating certificate:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});