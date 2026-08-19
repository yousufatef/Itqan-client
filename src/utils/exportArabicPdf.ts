import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export type ArabicPdfColumn<T> = {
    header: string;
    value: (row: T) => string | number | null | undefined;
};

export type ArabicPdfOptions<T> = {
    title: string;
    filename: string;
    columns: ArabicPdfColumn<T>[];
    rows: T[];
};

const escapeHtml = (value: string) =>
    value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

export async function exportArabicTableToPdf<T>({
    title,
    filename,
    columns,
    rows,
}: ArabicPdfOptions<T>) {
    const container = document.createElement('div');
    container.dir = 'rtl';
    container.style.cssText = [
        'position: fixed',
        'left: -10000px',
        'top: 0',
        'width: 1120px',
        'padding: 48px',
        'background: #ffffff',
        'color: #17202a',
        'font-family: Arial, sans-serif',
        'direction: rtl',
    ].join(';');

    const headers = columns.map((column) => `<th>${escapeHtml(column.header)}</th>`).join('');
    const body = rows
        .map(
            (row) =>
                `<tr>${columns
                    .map((column) => `<td>${escapeHtml(String(column.value(row) ?? ''))}</td>`)
                    .join('')}</tr>`,
        )
        .join('');

    container.innerHTML = `
    <h1 style="margin: 0 0 28px; text-align: right; font-size: 28px;">${escapeHtml(title)}</h1>
    <table style="width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 16px;">
      <thead><tr>${headers}</tr></thead>
      <tbody>${body}</tbody>
    </table>
  `;

    const style = document.createElement('style');
    style.textContent = `
    th, td { border: 1px solid #d6dce1; padding: 14px 12px; text-align: right; word-break: break-word; }
    th { background: #eef2f5; font-weight: 700; }
    tbody tr:nth-child(even) { background: #f8fafb; }
  `;
    container.append(style);
    document.body.append(container);

    try {
        const canvas = await html2canvas(container, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false,
        });
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 24;
        const imageWidth = pageWidth - margin * 2;
        const printableHeight = pageHeight - margin * 2;
        const pageCanvasHeight = Math.floor((canvas.width * printableHeight) / imageWidth);

        for (let sourceY = 0; sourceY < canvas.height; sourceY += pageCanvasHeight) {
            if (sourceY > 0) pdf.addPage();
            const sliceHeight = Math.min(pageCanvasHeight, canvas.height - sourceY);
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvas.width;
            pageCanvas.height = sliceHeight;
            pageCanvas
                .getContext('2d')
                ?.drawImage(canvas, 0, sourceY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
            const sliceImageHeight = (sliceHeight * imageWidth) / canvas.width;
            pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', margin, margin, imageWidth, sliceImageHeight);
        }

        pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    } finally {
        container.remove();
    }
}
