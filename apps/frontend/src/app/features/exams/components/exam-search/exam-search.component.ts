// apps/frontend/src/app/features/exams/components/exam-search/exam-search.component.ts
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-exam-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-icon matPrefix>search</mat-icon>
      <input 
        matInput 
        [formControl]="searchControl"
        placeholder="Rechercher un étudiant...">
    </mat-form-field>
  `
})
export class ExamSearchComponent {
  @Output() search = new EventEmitter<string>();
  
  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.search.emit(value ?? '');
    });
  }
}