// apps/frontend/src/app/features/exams/components/exam-list/exam-list.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ExamsService } from '../../services/exams.service';
import { CreateExamDialogComponent } from '../create-exam-dialog/create-exam-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';
import type { Exam } from '@evs/shared';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { ExamFiltersComponent } from '../exam-filters/exam-filters.component';
import { ExamSearchComponent } from '../exam-search/exam-search.component';
import { ExamExportService } from '../../services/exam-export.service';

interface ExamFilters {
    search: string;
    status: string | null;
  }

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatPaginatorModule,
    SpinnerComponent,
    ExamSearchComponent,
    ExamFiltersComponent,
  ],
  template: `
    <div class="container mx-auto p-4">
      <!-- Header avec export -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-xl font-semibold">Mes examens</h1>
        <div class="flex items-center gap-4">
          <p class="text-gray-600">{{ filteredExams().length }} examens à venir</p>
          <button 
            class="bg-green-500 text-white px-4 py-2 rounded-lg"
            (click)="exportExams()">
            Exporter
          </button>
          <button 
            class="bg-orange-500 text-white px-4 py-2 rounded-lg"
            (click)="openCreateExamDialog()">
            Organiser un examen
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="flex gap-4 mb-6">
        <div class="flex-1">
          <app-exam-search (search)="onSearch($event)" />
        </div>
        <app-exam-filters 
          [activeFilter]="filters().status || ''"
          (filterChange)="onFilterChange($event)" />
      </div>

      <!-- Liste des examens avec état de chargement -->
      @if (state().loadingState === 'loading') {
        <app-spinner />
      } @else if (state().loadingState === 'error') {
        <div class="text-red-500 p-4 text-center">
          Une erreur est survenue
          <button class="ml-2 underline" (click)="loadExams()">
            Réessayer
          </button>
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow-sm">
          @if (filteredExams().length === 0) {
            <div class="p-8 text-center text-gray-500">
              Aucun examen ne correspond à vos critères
            </div>
          } @else {
            @for (exam of paginatedExams(); track exam.student.first_name) {
              <div class="flex items-center p-4 border-b hover:bg-gray-50 transition-colors">
                <!-- ... contenu existant ... -->
              </div>
            }
          }
        </div>

        <mat-paginator
          [length]="filteredExams().length"
          [pageSize]="state().pageSize"
          [pageIndex]="state().page"
          [pageSizeOptions]="[5, 10, 25]"
          (page)="onPageChange($event)"
          aria-label="Sélectionner la page">
        </mat-paginator>
      }
    </div>
  `
})
export class ExamListComponent {
    private exportService = inject(ExamExportService);
  
  filters = signal<ExamFilters>({
    search: '',
    status: null
  });

  filteredExams = computed(() => {
    let result = this.state().items;
    
    // Filtre par recherche
    if (this.filters().search) {
      const search = this.filters().search.toLowerCase();
      result = result.filter(exam => 
        exam.student.first_name.toLowerCase().includes(search) ||
        exam.student.last_name.toLowerCase().includes(search)
      );
    }
    
    // Filtre par statut
    if (this.filters().status) {
      result = result.filter(exam => exam.status === this.filters().status);
    }
    
    return result;
  });

  onSearch(term: string): void {
    this.filters.update(f => ({ ...f, search: term }));
    this.state.update(s => ({ ...s, page: 0 })); // Reset pagination
  }

  onFilterChange(status: string): void {
    this.filters.update(f => ({ ...f, status: status || null }));
    this.state.update(s => ({ ...s, page: 0 })); // Reset pagination
  }

  exportExams(): void {
    this.exportService.exportToCsv(this.filteredExams());
    this.notificationService.success('Export réussi');
  }
  
  private dialog = inject(MatDialog);
  private examService = inject(ExamsService);
  private notificationService = inject(NotificationService);

  state = signal<{
    items: Exam[];
    loadingState: 'idle' | 'loading' | 'error' | 'success';
    page: number;
    pageSize: number;
  }>({
    items: [],
    loadingState: 'idle',
    page: 0,
    pageSize: 10
  });

  paginatedExams = computed(() => {
    const { page, pageSize, items } = this.state();
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  });

  constructor() {
    this.loadExams();
  }

  loadExams(): void {
    this.state.update(s => ({ ...s, loadingState: 'loading' }));

    this.examService.getExams().subscribe({
      next: (exams: Exam[]) => {
        this.state.update(s => ({
          ...s,
          items: exams,
          loadingState: 'success'
        }));
      },
      error: (err: Error) => {
        console.error('Erreur lors du chargement des examens:', err);
        this.state.update(s => ({
          ...s,
          loadingState: 'error'
        }));
        this.notificationService.error('Erreur lors du chargement des examens');
      }
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.state.update(s => ({
      ...s,
      page: event.pageIndex,
      pageSize: event.pageSize
    }));
  }

  getStatusClass(status: Exam['status']): string {
    const baseClasses = 'px-3 py-1 rounded-full text-sm';
    switch (status) {
      case 'Confirmé':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'A organiser':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'Annulé':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Recherche de place':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return baseClasses;
    }
  }

  openCreateExamDialog(): void {
    const dialogRef = this.dialog.open(CreateExamDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe({
      next: (result?: Exam) => {
        if (result) {
          this.examService.createExam(result).subscribe({
            next: (newExam) => {
              this.state.update(s => ({
                ...s,
                items: [...s.items, newExam]
              }));
              this.notificationService.success('Examen créé avec succès');
            },
            error: (err: Error) => {
              console.error('Erreur lors de la création:', err);
              this.notificationService.error('Erreur lors de la création de l\'examen');
            }
          });
        }
      }
    });
  }
}