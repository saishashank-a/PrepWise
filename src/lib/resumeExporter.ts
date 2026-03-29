import type { ResumeSection } from "./resumeTypes";

export async function exportToPDF(sections: ResumeSection[], fileName: string): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const margin = 50;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function addPage() {
    doc.addPage();
    y = margin;
  }

  function checkPageBreak(needed: number) {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      addPage();
    }
  }

  for (const section of sections) {
    checkPageBreak(40);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text(section.title.toUpperCase(), margin, y);
    y += 6;

    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    const lines = doc.splitTextToSize(section.content, contentWidth);
    for (const line of lines) {
      checkPageBreak(14);
      doc.text(line, margin, y);
      y += 14;
    }

    y += 12;
  }

  doc.save(`${fileName}.pdf`);
}

export async function exportToDOCX(sections: ResumeSection[], fileName: string): Promise<void> {
  const docx = await import("docx");

  const children: InstanceType<typeof docx.Paragraph>[] = [];

  for (const section of sections) {
    children.push(
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            size: 24,
            font: "Calibri",
          }),
        ],
        spacing: { before: 240, after: 80 },
        border: {
          bottom: { style: docx.BorderStyle.SINGLE, size: 1, color: "BBBBBB" },
        },
      }),
    );

    const contentLines = section.content.split("\n");
    for (const line of contentLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const isBullet = /^[-•*]\s/.test(trimmed);
      const cleanText = isBullet ? trimmed.replace(/^[-•*]\s*/, "") : trimmed;
      const isBoldLine = /^\*\*/.test(trimmed);
      const displayText = cleanText.replace(/\*\*/g, "");

      children.push(
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: displayText,
              bold: isBoldLine,
              size: 20,
              font: "Calibri",
            }),
          ],
          bullet: isBullet ? { level: 0 } : undefined,
          spacing: { after: 40 },
        }),
      );
    }
  }

  const document = new docx.Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  });

  const blob = await docx.Packer.toBlob(document);
  const link = globalThis.document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.docx`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export async function exportFullDocumentToPDF(text: string, fileName: string): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const margin = 50;
  const contentWidth = doc.internal.pageSize.getWidth() - margin * 2;
  let y = margin;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);

  const lines = doc.splitTextToSize(text, contentWidth);
  for (const line of lines) {
    if (y + 14 > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 14;
  }

  doc.save(`${fileName}.pdf`);
}

export async function exportFullDocumentToDOCX(text: string, fileName: string): Promise<void> {
  const docx = await import("docx");

  const paragraphs = text.split("\n").map(
    (line) =>
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: line,
            size: 20,
            font: "Calibri",
          }),
        ],
        spacing: { after: 40 },
      }),
  );

  const document = new docx.Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await docx.Packer.toBlob(document);
  const link = globalThis.document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.docx`;
  link.click();
  URL.revokeObjectURL(link.href);
}
