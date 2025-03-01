import { TestBed } from '@angular/core/testing';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastService } from '../../services/toast/toast.service';

describe('HttpErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let toastServiceMock: jest.Mocked<ToastService>;

  beforeEach(() => {
    toastServiceMock = {
      show: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
      toasts: jest.fn(),
      toast: jest.fn(),
    } as unknown as jest.Mocked<ToastService>;

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: ToastService, useValue: toastServiceMock },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    jest.clearAllMocks();
  });

  it('should show toast with connection error message on network error', () => {
    httpClient.get('/api/data').subscribe({
      next: () => fail('should have failed with a network error'),
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpTestingController.expectOne('/api/data');
    const mockError = new ProgressEvent('error');
    req.error(mockError);

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'Problème de connexion au serveur. Vérifiez votre connexion internet.',
      'error'
    );
  });

  it('should show toast with server error message on 500 error', () => {
    httpClient.get('/api/data').subscribe({
      next: () => fail('should have failed with a 500 error'),
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpTestingController.expectOne('/api/data');
    req.flush(
      { message: 'Server error' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'Erreur serveur. Veuillez réessayer plus tard.',
      'error'
    );
  });

  it('should show toast with not found message on 404 error', () => {
    httpClient.get('/api/data').subscribe({
      next: () => fail('should have failed with a 404 error'),
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpTestingController.expectOne('/api/data');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'La ressource demandée est introuvable.',
      'error'
    );
  });
});
