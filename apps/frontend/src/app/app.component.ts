// src/app/app.component.ts
import { Component } from '@angular/core';
import { ExamListComponent } from './features/exams/components/exam-list/exam-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExamListComponent],
  template: `
    <app-exam-list />
  `
})
export class AppComponent {}