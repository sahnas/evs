// apps/frontend/src/app/features/exams/services/exam-export.service.ts
import { Injectable } from '@angular/core';
import type { Exam } from '@evs/shared';

@Injectable({
  providedIn: 'root'
})
export class ExamExportService {
  exportToCsv(exams: Exam[]): void {
    const headers = ['Prénom', 'Nom', 'Point de RDV', 'Date', 'Heure', 'Statut'];
    const data = exams.map(exam => [
      exam.student.first_name,
      exam.student.last_name,
      exam.meeting_point,
      new Date(exam.date).toLocaleDateString(),
      new Date(exam.date).toLocaleTimeString(),
      exam.status
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `examens_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}