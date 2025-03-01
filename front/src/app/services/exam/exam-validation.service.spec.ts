import { TestBed } from '@angular/core/testing';
import { ExamValidationService } from './exam-validation.service';
import { Exam } from '../../models/exam.model';

describe('ExamValidationService', () => {
  let service: ExamValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateExam', () => {
    it('should return valid for a complete and valid exam', () => {
      const validExam: Exam = {
        student: { first_name: 'John', last_name: 'Doe' },
        meeting_point: 'Paris 75001',
        date: new Date().toISOString(),
        status: 'A organiser',
      };

      const result = service.validateExam(validExam);
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should detect invalid first name', () => {
      const invalidExam: Exam = {
        student: { first_name: 'J', last_name: 'Doe' },
        status: 'A organiser',
      };

      const result = service.validateExam(invalidExam);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Le prénom doit contenir au moins 2 caractères'
      );
    });

    it('should detect invalid last name', () => {
      const invalidExam: Exam = {
        student: { first_name: 'John', last_name: '' },
        status: 'A organiser',
      };

      const result = service.validateExam(invalidExam);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Le nom doit contenir au moins 2 caractères'
      );
    });

    it('should detect invalid date format', () => {
      const invalidExam: Exam = {
        student: { first_name: 'John', last_name: 'Doe' },
        date: 'not-a-date',
        status: 'A organiser',
      };

      const result = service.validateExam(invalidExam);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Le format de la date est invalide');
    });

    it('should detect too long meeting point', () => {
      const longMeetingPoint = 'A'.repeat(101);
      const invalidExam: Exam = {
        student: { first_name: 'John', last_name: 'Doe' },
        meeting_point: longMeetingPoint,
        status: 'A organiser',
      };

      const result = service.validateExam(invalidExam);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Le lieu de rendez-vous ne doit pas dépasser 100 caractères'
      );
    });
  });
});
