import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (isOpen()) {
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      (click)="closeModal.emit()"
    >
      <div
        class="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">{{ title() }}</h2>
          <button
            class="text-gray-400 hover:text-gray-600"
            (click)="closeModal.emit()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="modal-content">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
    }
  `,
})
export class ModalComponent {
  isOpen = input(false);
  title = input('');
  closeModal = output<void>();
}
