import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamListComponent } from './exam-list.component';
import { ExamService } from '../../../services/exam/exam.service';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ExamFormComponent } from '../exam-form/exam-form.component';
import { ExamItemComponent } from '../exam-item/exam-item.component';
import { Exam } from '../../../models/exam.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ExamListComponent', () => {
  let component: ExamListComponent;
  let fixture: ComponentFixture<ExamListComponent>;
  let examServiceMock: jest.Mocked<ExamService>;

  beforeEach(async () => {
    const mockExams: Exam[] = [
      {
        student: { first_name: 'John', last_name: 'Doe' },
        status: 'A organiser',
      },
      {
        student: { first_name: 'Jane', last_name: 'Smith' },
        status: 'Confirmé',
      },
    ];

    examServiceMock = {
      exams: jest.fn().mockReturnValue(mockExams),
      loading: jest.fn().mockReturnValue(false),
      loadExams: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<ExamService>;

    await TestBed.configureTestingModule({
      imports: [ExamListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: ExamService, useValue: examServiceMock }],
    })
      .overrideComponent(ExamListComponent, {
        remove: {
          imports: [ModalComponent, ExamFormComponent, ExamItemComponent],
        },
        add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ExamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load exams on init', () => {
    expect(examServiceMock.loadExams).toHaveBeenCalled();
  });

  it('should calculate total exams correctly', () => {
    expect(component.totalExams()).toBe(2);
  });

  it('should show loading state when loading', () => {
    examServiceMock.loading.mockReturnValue(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const loadingElement = compiled.querySelector('.animate-spin');
    expect(loadingElement).toBeTruthy();
  });

  it('should show empty state when no exams', () => {
    examServiceMock.exams.mockReturnValue([]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const emptyElement = compiled.querySelector('.bg-gray-50.rounded-2xl');
    expect(emptyElement).toBeTruthy();
    expect(emptyElement.textContent).toContain('Aucun examen à afficher');
  });

  it('should close modal and reload exams when exam is created', () => {
    component.showModal = true;

    component.onExamCreated();

    expect(component.showModal).toBe(false);

    expect(examServiceMock.loadExams).toHaveBeenCalledTimes(2);
  });
});
