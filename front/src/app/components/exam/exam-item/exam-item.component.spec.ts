import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamItemComponent } from './exam-item.component';
import { StatusDisplayPipe } from '../../../shared/pipes/status-display.pipe';
import { DatePipe } from '@angular/common';

describe('ExamItemComponent', () => {
  let component: ExamItemComponent;
  let fixture: ComponentFixture<ExamItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamItemComponent, StatusDisplayPipe, DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamItemComponent);
    component = fixture.componentInstance;

    component.exam = {
      student: { first_name: 'John', last_name: 'Doe' },
      meeting_point: 'Paris 75001',
      date: '2023-01-01T10:00:00',
      status: 'A organiser',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display student name correctly', () => {
    const compiled = fixture.nativeElement;
    const studentName = compiled.querySelector('.font-medium.text-gray-900');
    expect(studentName.textContent.trim()).toBe('John.Doe');
  });

  it('should display meeting point correctly', () => {
    const compiled = fixture.nativeElement;
    const meetingPoint = compiled.querySelectorAll('.text-gray-700')[0];
    expect(meetingPoint.textContent.trim()).toBe('Paris 75001');
  });

  it('should display "En attente" when meeting point is missing', () => {
    component.exam = {
      ...component.exam,
      meeting_point: undefined,
    };
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const meetingPoint = compiled.querySelectorAll('.text-gray-700')[0];
    expect(meetingPoint.textContent.trim()).toBe('En attente');
  });

  it('should apply correct CSS classes for different statuses', () => {
    expect(component.getStatusClasses('A organiser')).toContain('bg-orange-50');
    expect(component.getStatusClasses('A organiser')).toContain(
      'text-orange-700'
    );

    expect(component.getStatusClasses('Confirmé')).toContain('bg-green-50');
    expect(component.getStatusClasses('Confirmé')).toContain('text-green-700');

    expect(component.getStatusClasses('Annulé')).toContain('bg-red-50');
    expect(component.getStatusClasses('Annulé')).toContain('text-red-700');

    expect(component.getStatusClasses('Recherche de place')).toContain(
      'bg-gray-50'
    );
    expect(component.getStatusClasses('Recherche de place')).toContain(
      'text-gray-700'
    );
  });
});
