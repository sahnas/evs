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
