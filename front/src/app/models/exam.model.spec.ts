import { Exam, Student, ExamValidationResult } from './exam.model';

describe('Exam Model', () => {
  it('should create an Exam object with required properties', () => {
    const student: Student = {
      first_name: 'John',
      last_name: 'Doe',
    };

    const exam: Exam = {
      student,
      status: 'A organiser',
    };

    expect(exam.student).toBe(student);
    expect(exam.status).toBe('A organiser');
    expect(exam.meeting_point).toBeUndefined();
    expect(exam.date).toBeUndefined();
  });

  it('should create an Exam object with all properties', () => {
    const student: Student = {
      first_name: 'Jane',
      last_name: 'Smith',
    };

    const date = new Date().toISOString();

    const exam: Exam = {
      student,
      meeting_point: 'Paris',
      date,
      status: 'Confirmé',
    };

    expect(exam.student).toBe(student);
    expect(exam.status).toBe('Confirmé');
    expect(exam.meeting_point).toBe('Paris');
    expect(exam.date).toBe(date);
  });

  it('should create a valid validation result', () => {
    const validationResult: ExamValidationResult = {
      valid: true,
      errors: [],
    };

    expect(validationResult.valid).toBe(true);
    expect(validationResult.errors.length).toBe(0);
  });

  it('should create an invalid validation result with errors', () => {
    const validationResult: ExamValidationResult = {
      valid: false,
      errors: ['Error 1', 'Error 2'],
    };

    expect(validationResult.valid).toBe(false);
    expect(validationResult.errors.length).toBe(2);
    expect(validationResult.errors[0]).toBe('Error 1');
    expect(validationResult.errors[1]).toBe('Error 2');
  });
});
