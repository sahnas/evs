// apps/frontend/src/app/features/exams/exams.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Exam } from '@evs/shared';

@Injectable({
  providedIn: 'root'
})
export class ExamsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';
  
  getExams() {
    return this.http.get<Exam[]>(`${this.apiUrl}/api/exams`);
  }

  createExam(exam: Exam) {
    return this.http.post<Exam>(`${this.apiUrl}/api/exams`, exam);
  }
}