import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ExamFormComponent } from './exam-form.component';
import { ExamService } from '../../../services/exam/exam.service';
import { ToastService } from '../../../services/toast/toast.service';
import { Exam } from '../../../models/exam.model';

describe('ExamFormComponent', () => {
  let component: ExamFormComponent;
  let fixture: ComponentFixture<ExamFormComponent>;
  let examServiceMock: jest.Mocked<ExamService>;
  let toastServiceMock: jest.Mocked<ToastService>;

  beforeEach(async () => {
    examServiceMock = {
      createExam: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<ExamService>;

    toastServiceMock = {
      show: jest.fn(),
    } as unknown as jest.Mocked<ToastService>;

    await TestBed.configureTestingModule({
      imports: [ExamFormComponent, ReactiveFormsModule],
      providers: [
        { provide: ExamService, useValue: examServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const formValues = component.examForm.value as Exam;
    expect(formValues.student.first_name).toBe('');
    expect(formValues.student.last_name).toBe('');
    expect(formValues.meeting_point).toBe('');
    expect(formValues.status).toBe('A organiser');
  });

  it('should validate first name and last name length', () => {
    component.examForm.get('student.first_name')?.setValue('A');
    component.examForm.get('student.last_name')?.setValue('B');

    component.examForm.get('student.first_name')?.markAsTouched();
    component.examForm.get('student.last_name')?.markAsTouched();

    expect(component.examForm.valid).toBe(false);

    component.examForm.get('student.first_name')?.setValue('John');
    component.examForm.get('student.last_name')?.setValue('Doe');

    expect(component.examForm.valid).toBe(true);
  });

  it('should emit examCreated event when form is successfully submitted', async () => {
    const emitSpy = jest.spyOn(component.examCreated, 'emit');

    component.examForm.setValue({
      student: {
        first_name: 'John',
        last_name: 'Doe',
      },
      meeting_point: 'Paris',
      date: '2023-09-01T10:00',
      status: 'A organiser',
    });

    await component.onSubmit();

    expect(examServiceMock.createExam).toHaveBeenCalledWith(
      expect.objectContaining({
        student: {
          first_name: 'John',
          last_name: 'Doe',
        },
        meeting_point: 'Paris',
        status: 'A organiser',
      })
    );

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not submit invalid form', async () => {
    component.examForm.get('student.first_name')?.setValue('');

    await component.onSubmit();

    expect(examServiceMock.createExam).not.toHaveBeenCalled();

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'Veuillez corriger les erreurs du formulaire',
      'error'
    );
  });

  it('should handle service errors during submission', async () => {
    examServiceMock.createExam.mockRejectedValueOnce(new Error('API Error'));

    component.examForm.setValue({
      student: {
        first_name: 'John',
        last_name: 'Doe',
      },
      meeting_point: 'Paris',
      date: '2023-09-01T10:00',
      status: 'A organiser',
    });

    await component.onSubmit();

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      expect.stringContaining("Erreur lors de la création de l'examen"),
      'error'
    );

    expect(component.isSubmitting).toBe(false);
  });
});
