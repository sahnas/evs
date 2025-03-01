import { Injectable, signal, computed } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  message: string;
  type: ToastType;
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private lastId = 0;
  private toastsSignal = signal<Toast[]>([]);
  public toasts = this.toastsSignal.asReadonly();
  public toast = computed(() => {
    const toasts = this.toastsSignal();
    return toasts.length > 0 ? toasts[toasts.length - 1] : null;
  });

  show(message: string, type: ToastType = 'info', duration = 3000): number {
    const id = ++this.lastId;
    const newToast: Toast = { message, type, id };

    this.toastsSignal.update((toasts) => [...toasts, newToast]);

    setTimeout(() => this.remove(id), duration);

    return id;
  }

  remove(id: number): void {
    this.toastsSignal.update((toasts) =>
      toasts.filter((toast) => toast.id !== id)
    );
  }

  clear(): void {
    this.toastsSignal.set([]);
  }
}
