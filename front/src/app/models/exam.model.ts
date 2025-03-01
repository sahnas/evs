export interface Student {
  first_name: string;
  last_name: string;
}

export type ExamStatus =
  | 'A organiser'
  | 'Annulé'
  | 'Recherche de place'
  | 'Confirmé';

export interface Exam {
  id?: number;
  student: Student;
  meeting_point?: string;
  date?: string;
  status: ExamStatus;
}

export interface ExamValidationResult {
  valid: boolean;
  errors: string[];
}
