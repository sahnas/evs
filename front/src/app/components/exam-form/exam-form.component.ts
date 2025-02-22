import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Exam, ExamService } from '../../services/exam.service';
import { ToastService } from '../../shared/toast/toast.service';

interface ExamFormValue {
  student: {
    first_name: string;
    last_name: string;
  };
  meeting_point: string;
  date: string;
  status: Exam['status'];
}

type ExamFormType = FormGroup<{
  student: FormGroup<{
    first_name: FormControl<string>;
    last_name: FormControl<string>;
  }>;
  meeting_point: FormControl<string>;
  date: FormControl<string>;
  status: FormControl<Exam['status']>;
}>;

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="examForm" (ngSubmit)="onSubmit()" class="space-y-6">
      <!-- Section Étudiant -->
      <div formGroupName="student" class="space-y-4">
        <div class="form-group">
          <label
            for="firstName"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Prénom
          </label>
          <input
            id="firstName"
            type="text"
            formControlName="first_name"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Prénom de l'étudiant"
          />
          @if (examForm.get('student.first_name')?.invalid &&
          examForm.get('student.first_name')?.touched) { @if
          (examForm.get('student.first_name')?.errors?.['required']) {
          <p class="mt-1 text-sm text-red-600">Le prénom est requis</p>
          } @else if (examForm.get('student.first_name')?.errors?.['minlength'])
          {
          <p class="mt-1 text-sm text-red-600">
            Le prénom doit contenir au moins 2 caractères
          </p>
          } }
        </div>

        <div class="form-group">
          <label
            for="lastName"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Nom
          </label>
          <input
            id="lastName"
            type="text"
            formControlName="last_name"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Nom de l'étudiant"
          />
          @if (examForm.get('student.last_name')?.invalid &&
          examForm.get('student.last_name')?.touched) { @if
          (examForm.get('student.last_name')?.errors?.['required']) {
          <p class="mt-1 text-sm text-red-600">Le nom est requis</p>
          } @else if (examForm.get('student.last_name')?.errors?.['minlength'])
          {
          <p class="mt-1 text-sm text-red-600">
            Le nom doit contenir au moins 2 caractères
          </p>
          } }
        </div>
      </div>

      <!-- Lieu de rendez-vous -->
      <div class="form-group">
        <label
          for="meetingPoint"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Lieu de rendez-vous
        </label>
        <input
          id="meetingPoint"
          type="text"
          formControlName="meeting_point"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Lieu du rendez-vous"
        />
      </div>

      <!-- Date et heure -->
      <div class="form-group">
        <label for="date" class="block text-sm font-medium text-gray-700 mb-1">
          Date et heure
        </label>
        <input
          id="date"
          type="datetime-local"
          formControlName="date"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <!-- Statut -->
      <div class="form-group">
        <label
          for="status"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Statut
        </label>
        <select
          id="status"
          formControlName="status"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
        >
          <option value="A organiser">À organiser</option>
          <option value="Recherche de place">En recherche de place</option>
          <option value="Confirmé">Confirmé</option>
          <option value="Annulé">Annulé</option>
        </select>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          (click)="cancel.emit()"
          class="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          Annuler
        </button>
        <button
          type="submit"
          [disabled]="!examForm.valid || isSubmitting"
          class="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          @if (isSubmitting) { Création... } @else { Créer l'examen }
        </button>
      </div>
    </form>
  `,
})
export class ExamFormComponent {
  private fb = inject(FormBuilder);
  private examService = inject(ExamService);
  private toastService = inject(ToastService);

  @Output() examCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  isSubmitting = false;

  examForm: ExamFormType = this.fb.nonNullable.group(
    {
      student: this.fb.nonNullable.group({
        first_name: ['', [Validators.required, Validators.minLength(2)]],
        last_name: ['', [Validators.required, Validators.minLength(2)]],
      }),
      meeting_point: [''],
      date: [''],
      status: ['A organiser' as Exam['status']],
    },
    {
      updateOn: 'blur',
    }
  );

  async onSubmit() {
    if (!this.examForm.valid) {
      this.markFormGroupTouched(this.examForm);
      this.toastService.show(
        'Veuillez corriger les erreurs du formulaire',
        'error'
      );
      return;
    }

    this.isSubmitting = true;
    try {
      const formValue: ExamFormValue = this.examForm.getRawValue();

      const exam: Exam = {
        student: {
          first_name: formValue.student.first_name.trim(),
          last_name: formValue.student.last_name.trim(),
        },
        meeting_point: formValue.meeting_point?.trim() || '',
        date: formValue.date || new Date().toISOString(),
        status: formValue.status,
      };

      const success = await this.examService.createExam(exam);
      if (success) {
        this.resetForm();
        this.examCreated.emit();
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      let errorMessage = "Erreur lors de la création de l'examen";

      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }

      this.toastService.show(errorMessage, 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private resetForm(): void {
    this.examForm.reset({
      student: {
        first_name: '',
        last_name: '',
      },
      meeting_point: '',
      date: '',
      status: 'A organiser' as Exam['status'],
    });
  }
}
