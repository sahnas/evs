import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../shared/toast/toast.service';
import { signal } from '@angular/core';
import { catchError, firstValueFrom, throwError } from 'rxjs';

export interface Student {
  first_name: string;
  last_name: string;
}

export interface Exam {
  student: Student;
  meeting_point?: string;
  date?: string;
  status: 'A organiser' | 'Annulé' | 'Recherche de place' | 'Confirmé';
}

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  private examsSignal = signal<Exam[]>([]);
  private loadingSignal = signal(false);

  public exams = this.examsSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();

  private apiUrl = 'http://localhost:3000/api/exams';

  showToast(
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ): void {
    this.toastService.show(message, type);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.status === 0) {
      errorMessage =
        'Problème de connexion au serveur. Vérifiez votre connexion internet.';
    } else if (error.status === 400) {
      errorMessage =
        error.error?.message || 'Les données envoyées sont invalides.';
    } else if (error.status === 404) {
      errorMessage = 'La ressource demandée est introuvable.';
    } else if (error.status === 500) {
      errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
    } else {
      errorMessage = `Erreur inattendue: ${
        error.error?.message || error.statusText
      }`;
    }

    this.showToast(errorMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }

  async loadExams() {
    if (this.loadingSignal()) return;

    try {
      this.loadingSignal.set(true);
      const response = this.http
        .get<Exam[]>(this.apiUrl)
        .pipe(catchError((error) => this.handleError(error)));

      const data = await firstValueFrom(response);
      this.examsSignal.set(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des examens:', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  validateExam(exam: Exam): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!exam.student.first_name || exam.student.first_name.trim().length < 2) {
      errors.push('Le prénom doit contenir au moins 2 caractères');
    }

    if (!exam.student.last_name || exam.student.last_name.trim().length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    }

    if (exam.date && !this.isValidISODateString(exam.date)) {
      errors.push('Le format de la date est invalide');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private isValidISODateString(dateString: string): boolean {
    try {
      return !isNaN(Date.parse(dateString));
    } catch {
      return false;
    }
  }

  async createExam(exam: Exam) {
    const validation = this.validateExam(exam);
    if (!validation.valid) {
      this.showToast(validation.errors.join('. '), 'error');
      return false;
    }

    try {
      const response = this.http
        .post<Exam>(this.apiUrl, exam)
        .pipe(catchError((error) => this.handleError(error)));

      await firstValueFrom(response);
      await this.loadExams();
      this.showToast('Examen créé avec succès !', 'success');
      return true;
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      return false;
    }
  }
}
