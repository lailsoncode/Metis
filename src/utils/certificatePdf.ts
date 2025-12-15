import { jsPDF } from "jspdf";

export type CertificatePdfData = {
  studentName: string;
  courseTitle: string;
  durationHours: number;
  completionDate: Date | string;
  certificateNumber: string;
  verificationCode: string;
};

export function generateCertificatePdf(data: CertificatePdfData) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Background and border
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(0, 0, width, height, 'F');

  // Decorative border
  doc.setDrawColor(5, 150, 105); // emerald-600
  doc.setLineWidth(2);
  doc.roundedRect(10, 10, width - 20, height - 20, 5, 5, 'S');

  // Header
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(34);
  doc.text('CERTIFICADO', width / 2, 35, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('de Conclusão de Curso', width / 2, 44, { align: 'center' });

  // Body
  doc.setTextColor(55, 65, 81); // slate-700
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text('Certificamos que', width / 2, 68, { align: 'center' });

  // Student name
  doc.setTextColor(17, 24, 39); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text(data.studentName.toUpperCase(), width / 2, 85, { align: 'center' });

  // Course text
  doc.setTextColor(55, 65, 81);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text('concluiu com êxito o curso', width / 2, 100, { align: 'center' });

  // Course title
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  const courseTitleLines = doc.splitTextToSize(data.courseTitle, width - 80);
  doc.text(courseTitleLines, width / 2, 115, { align: 'center', maxWidth: width - 80 });

  // Details line
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  const dateObj = typeof data.completionDate === 'string' ? new Date(data.completionDate) : data.completionDate;
  const formatted = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const hoursLabel = data.durationHours === 1 ? 'hora' : 'horas';
  const details = `Carga horária: ${data.durationHours} ${hoursLabel}  •  Concluído em ${formatted}`;
  doc.text(details, width / 2, 135, { align: 'center' });

  // Footer brand
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('METIS', width / 2, height - 40, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('IA e Avatares Digitais na Educação', width / 2, height - 34, { align: 'center' });

  // Seal circle
  doc.setDrawColor(5, 150, 105);
  doc.setLineWidth(1.5);
  doc.circle(30, height - 35, 15, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('METIS', 30, height - 36, { align: 'center' });

  // Verification block (bottom-right)
  const rightX = width - 30;
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Certificado Nº: ${data.certificateNumber}`, rightX, height - 42, { align: 'right' });
  doc.text(`Código de Verificação: ${data.verificationCode}`, rightX, height - 36, { align: 'right' });
  doc.text('Este certificado pode ser verificado em nosso sistema.', rightX, height - 30, { align: 'right' });

  // Save
  doc.save(`certificado-${data.certificateNumber}.pdf`);
}
