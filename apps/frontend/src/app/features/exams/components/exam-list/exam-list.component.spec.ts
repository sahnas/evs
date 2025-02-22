// apps/frontend/src/app/features/exams/components/exam-list/exam-list.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamListComponent } from './exam-list.component';
import { ExamsService } from '../../services/exams.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Exam } from '@evs/shared';

describe('ExamListComponent', () => {
  let component: ExamListComponent;
  let fixture: ComponentFixture<ExamListComponent>;
  let examServiceSpy: jasmine.SpyObj<ExamsService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockExams: Exam[] = [
    {
      student: { first_name: 'Test', last_name: 'User' },
      meeting_point: 'Paris',
      date: new Date().toISOString(),
      status: 'A organiser'
    }
  ];

  beforeEach(async () => {
    const examsServiceSpy = jasmine.createSpyObj('ExamsService', ['getExams', 'createExam']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [ExamListComponent, NoopAnimationsModule],
      providers: [
        { provide: ExamsService, useValue: examsServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    }).compileComponents();

    examServiceSpy = TestBed.inject(ExamsService) as jasmine.SpyObj<ExamsService>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load exams on init', () => {
    examServiceSpy.getExams.and.returnValue(of(mockExams));
    fixture.detectChanges();
    expect(examServiceSpy.getExams).toHaveBeenCalled();
    expect(component.state().items).toEqual(mockExams);
  });

  it('should show error notification on load failure', () => {
    examServiceSpy.getExams.and.returnValue(throwError(() => new Error('Test error')));
    fixture.detectChanges();
    expect(notificationServiceSpy.error).toHaveBeenCalled();
    expect(component.state().loadingState).toBe('error');
  });

  // ... plus de tests ...
});