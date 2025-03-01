import { Injectable } from '@angular/core';
import { Exam, ExamValidationResult } from '../../models/exam.model';

@Injectable({
  providedIn: 'root',
})
export class ExamValidationService {
  validateExam(exam: Exam): ExamValidationResult {
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

    if (exam.meeting_point && exam.meeting_point.trim().length > 100) {
      errors.push('Le lieu de rendez-vous ne doit pas dépasser 100 caractères');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private isValidISODateString(dateString: string): boolean {
    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }
}
