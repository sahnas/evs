import { Component, OnInit, computed, inject } from '@angular/core';
import { ExamService } from '../../../services/exam/exam.service';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ExamFormComponent } from '../exam-form/exam-form.component';
import { ExamItemComponent } from '../exam-item/exam-item.component';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [ModalComponent, ExamFormComponent, ExamItemComponent],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Mes examens</h1>
          <p class="text-gray-900 mt-1">{{ totalExams() }} examens à venir</p>
        </div>
        <button
          (click)="showModal = true"
          class="px-6 py-3 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-full transition-colors duration-200 text-sm font-medium shadow-sm"
        >
          Organiser un examen
        </button>
      </div>

      @if (examService.loading()) {
      <div class="flex justify-center items-center py-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"
        ></div>
      </div>
      } @if (!examService.loading() && examService.exams().length === 0) {
      <div class="bg-gray-50 rounded-2xl p-8 text-center">
        <p class="text-gray-600">
          Aucun examen à afficher. Créez votre premier examen en cliquant sur
          "Organiser un examen".
        </p>
      </div>
      } @if (!examService.loading() && examService.exams().length > 0) {
      <div class="space-y-3">
        @for (exam of examService.exams(); track exam.student.first_name +
        exam.student.last_name + (exam.date || '')) {
        <app-exam-item [exam]="exam"></app-exam-item>
        }
      </div>
      }

      <app-modal
        [isOpen]="showModal"
        title="Créer un nouvel examen"
        (closeModal)="showModal = false"
      >
        <app-exam-form
          (examCreated)="onExamCreated()"
          (cancelForm)="showModal = false"
        />
      </app-modal>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ExamListComponent implements OnInit {
  examService = inject(ExamService);
  showModal = false;
  totalExams = computed(() => this.examService.exams().length);

  ngOnInit() {
    this.examService.loadExams();
  }

  onExamCreated(): void {
    this.showModal = false;
    this.examService.loadExams();
  }
}
