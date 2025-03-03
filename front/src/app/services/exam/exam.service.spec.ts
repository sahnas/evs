import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ExamService } from './exam.service';
import { ExamValidationService } from './exam-validation.service';
import { Exam } from '../../models/exam.model';
import { environment } from '../../../environments/environment';
import { ToastService } from '../toast/toast.service';

describe('ExamService', () => {
  let service: ExamService;
  let httpMock: HttpTestingController;
  let toastServiceMock: jest.Mocked<ToastService>;
  let validationServiceMock: jest.Mocked<ExamValidationService>;

  beforeEach(() => {
    toastServiceMock = {
      show: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
      toasts: jest.fn(),
      toast: jest.fn(),
    } as unknown as jest.Mocked<ToastService>;

    validationServiceMock = {
      validateExam: jest.fn(),
    } as unknown as jest.Mocked<ExamValidationService>;

    TestBed.configureTestingModule({
      providers: [
        ExamService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ToastService, useValue: toastServiceMock },
        { provide: ExamValidationService, useValue: validationServiceMock },
      ],
    });

    service = TestBed.inject(ExamService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadExams', () => {
    it('should fetch exams from the API', async () => {
      const mockExams: Exam[] = [
        {
          student: { first_name: 'John', last_name: 'Doe' },
          status: 'A organiser',
        },
      ];

      const promise = service.loadExams();

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/exams`);
      expect(req.request.method).toBe('GET');

      req.flush(mockExams);

      await promise;

      expect(service.exams()).toEqual(mockExams);
    });

    it('should retry failed HTTP requests', fakeAsync(() => {
      const loadExamsPromise = service.loadExams();

      let req = httpMock.expectOne(`${environment.apiBaseUrl}/exams`);
      expect(req.request.method).toBe('GET');
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      tick(1000);

      req = httpMock.expectOne(`${environment.apiBaseUrl}/exams`);
      expect(req.request.method).toBe('GET');
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      tick(2000);

      req = httpMock.expectOne(`${environment.apiBaseUrl}/exams`);
      expect(req.request.method).toBe('GET');

      const mockExams = [
        {
          student: { first_name: 'Test', last_name: 'User' },
          status: 'A organiser',
        },
      ];
      req.flush(mockExams);

      tick();

      return loadExamsPromise.then(() => {
        expect(service.exams()).toEqual(mockExams);
        expect(toastServiceMock.show).not.toHaveBeenCalled(); // No error toast should be shown
      });
    }));

    it('should show error toast after all retries fail', fakeAsync(() => {
      const loadExamsPromise = service.loadExams();

      let req = httpMock.expectOne(`${environment.apiBaseUrl}/exams`);
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      tick(1000);
      req = httpMock.expectOne(`${environment.apiBaseUrl}/exams`);
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      tick(2000);
      req = httpMock.expectOne(`${environment.apiBaseUrl}/exams`);
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      tick();

      return loadExamsPromise.then(() => {
        expect(toastServiceMock.show).toHaveBeenCalledWith(
          'Impossible de charger les examens. Veuillez réessayer.',
          'error'
        );
      });
    }));
  });

  describe('createExam', () => {
    it('should validate the exam before creating it', async () => {
      const mockExam: Exam = {
        student: { first_name: 'John', last_name: 'Doe' },
        status: 'A organiser',
      };

      validationServiceMock.validateExam.mockReturnValue({
        valid: true,
        errors: [],
      });

      const promise = service.createExam(mockExam);

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/exams`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockExam);

      req.flush(mockExam);

      const result = await promise;

      expect(result).toBe(true);
      expect(toastServiceMock.show).toHaveBeenCalledWith(
        'Examen créé avec succès !',
        'success'
      );
    });

    it('should not create an exam if validation fails', async () => {
      const mockExam: Exam = {
        student: { first_name: 'J', last_name: '' },
        status: 'A organiser',
      };

      validationServiceMock.validateExam.mockReturnValue({
        valid: false,
        errors: [
          'Le prénom doit contenir au moins 2 caractères',
          'Le nom doit contenir au moins 2 caractères',
        ],
      });

      const result = await service.createExam(mockExam);

      httpMock.expectNone(`${environment.apiBaseUrl}/exams`);

      expect(result).toBe(false);
      expect(toastServiceMock.show).toHaveBeenCalledWith(
        'Le prénom doit contenir au moins 2 caractères. Le nom doit contenir au moins 2 caractères',
        'error'
      );
    });
  });
});
