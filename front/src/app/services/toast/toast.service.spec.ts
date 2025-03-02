import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a toast to the list with default type', () => {
    service.show('Test message');
    const toasts = service.toasts();

    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Test message');
    expect(toasts[0].type).toBe('info');
  });

  it('should add a toast with specific type', () => {
    service.show('Error occurred', 'error');
    expect(service.toasts()[0].type).toBe('error');
  });

  it('should remove a toast by id', () => {
    const id = service.show('Test message');
    expect(service.toasts().length).toBe(1);

    service.remove(id);
    expect(service.toasts().length).toBe(0);
  });

  it('should clear all toasts', () => {
    service.show('Message 1');
    service.show('Message 2');
    expect(service.toasts().length).toBe(2);

    service.clear();
    expect(service.toasts().length).toBe(0);
  });

  it('should auto-remove toasts after specified duration', () => {
    jest.useFakeTimers();

    service.show('Test message', 'info', 1000);
    expect(service.toasts().length).toBe(1);

    jest.advanceTimersByTime(1000);
    expect(service.toasts().length).toBe(0);

    jest.useRealTimers();
  });
});
