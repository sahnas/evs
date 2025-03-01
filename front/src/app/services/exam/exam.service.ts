import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ExamValidationService } from './exam-validation.service';
import { environment } from '../../../environments/environment';
import { Exam } from '../../models/exam.model';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private validationService = inject(ExamValidationService);

  private examsSignal = signal<Exam[]>([]);
  private loadingSignal = signal(false);

  public exams = this.examsSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();

  private apiUrl = `${environment.apiBaseUrl}/exams`;

  async loadExams() {
    if (this.loadingSignal()) return;

    try {
      this.loadingSignal.set(true);
      const data = await firstValueFrom(this.http.get<Exam[]>(this.apiUrl));
      this.examsSignal.set(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des examens:', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async createExam(exam: Exam) {
    const validation = this.validationService.validateExam(exam);
    if (!validation.valid) {
      this.toastService.show(validation.errors.join('. '), 'error');
      return false;
    }

    try {
      this.loadingSignal.set(true);
      await firstValueFrom(this.http.post<Exam>(this.apiUrl, exam));
      await this.loadExams();
      this.toastService.show('Examen créé avec succès !', 'success');
      return true;
    } catch (error) {
      console.error("Erreur lors de la création de l'examen:", error);
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }
}
