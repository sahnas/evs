import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (isOpen) {
    <div class="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <button
        class="fixed inset-0 bg-black opacity-50 border-0 p-0 m-0"
        (click)="onClose()"
        aria-label="Close modal"
      ></button>

      <div
        class="relative bg-white w-full max-w-md m-auto rounded-lg shadow-lg"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="title ? 'modal-title' : null"
      >
        <div class="p-4 border-b">
          <div class="flex items-center justify-between">
            @if (title) {
            <h3 id="modal-title" class="text-lg font-medium text-gray-900">
              {{ title }}
            </h3>
            } @else {
            <div></div>
            }
            <button
              (click)="onClose()"
              class="text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Close"
            >
              <svg
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
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-4">
          <ng-content></ng-content>
        </div>

        @if (showFooter) {
        <div class="p-4 border-t">
          <ng-content select="[footer]"></ng-content>
        </div>
        }
      </div>
    </div>
    }
  `,
  styles: [
    `
      .bg-smoke-light {
        background-color: rgba(0, 0, 0, 0.4);
      }
    `,
  ],
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title?: string;
  @Input() showFooter = false;
  @Output() closeModal = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }
}
