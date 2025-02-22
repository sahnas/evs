import { Route } from '@angular/router';
import { ExamListComponent } from './components/exam-list/exam-list.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'exams', pathMatch: 'full' },
  { path: 'exams', component: ExamListComponent },
];
