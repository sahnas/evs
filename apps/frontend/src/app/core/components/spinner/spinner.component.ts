import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div 
      class="flex justify-center items-center" 
      [class]="fullscreen ? 'fixed inset-0 bg-white/80 z-50' : 'p-4'">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  `
})
export class SpinnerComponent {
  @Input() fullscreen = false;
}