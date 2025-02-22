// apps/frontend/src/app/features/exams/components/exam-filters/exam-filters.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-filters',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule
  ],
  template: `
    <div class="flex gap-2 mb-4 p-2">
      <mat-chip-listbox [selectable]="true" [multiple]="false">
        <mat-chip-option
          [selected]="!activeFilter"
          (click)="setFilter('')">
          Tous
        </mat-chip-option>
        @for (status of statuses; track status) {
          <mat-chip-option
            [selected]="status === activeFilter"
            (click)="setFilter(status)">
            {{ status }}
          </mat-chip-option>
        }
      </mat-chip-listbox>
    </div>
  `
})
export class ExamFiltersComponent {
  @Input() activeFilter = '';
  @Output() filterChange = new EventEmitter<string>();

  statuses = ['A organiser', 'Confirmé', 'Annulé', 'Recherche de place'];

  setFilter(status: string): void {
    this.filterChange.emit(status);
  }
}