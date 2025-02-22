// apps/frontend/src/app/features/exams/components/create-exam-dialog/create-exam-dialog.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Exam } from '@evs/shared';

@Component({
  selector: 'app-create-exam-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-6">Organiser un examen</h2>
      
      <form [formGroup]="examForm" (ngSubmit)="onSubmit()">
        <div class="space-y-4">
          <div formGroupName="student" class="space-y-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Prénom</mat-label>
              <input matInput formControlName="first_name" required>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Nom</mat-label>
              <input matInput formControlName="last_name" required>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Point de rendez-vous</mat-label>
            <input matInput formControlName="meeting_point" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status" required>
              <mat-option value="A organiser">A organiser</mat-option>
              <mat-option value="Confirmé">Confirmé</mat-option>
              <mat-option value="Annulé">Annulé</mat-option>
              <mat-option value="Recherche de place">Recherche de place</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button 
            type="button"
            mat-stroked-button
            (click)="dialogRef.close()">
            Annuler
          </button>
          <button 
            type="submit"
            mat-flat-button 
            color="primary"
            [disabled]="!examForm.valid">
            Créer
          </button>
        </div>
      </form>
    </div>
  `
})
export class CreateExamDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<CreateExamDialogComponent>);

  examForm = this.fb.group({
    student: this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]]
    }),
    meeting_point: ['', [Validators.required]],
    status: ['A organiser', [Validators.required]],
    date: [new Date().toISOString()]
  });

  onSubmit(): void {
    if (this.examForm.valid) {
      const exam: Exam = this.examForm.value as Exam;
      this.dialogRef.close(exam);
    }
  }
}