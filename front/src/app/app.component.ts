import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="max-w-6xl mx-auto px-4 py-4">
          <img
            src="https://www.envoituresimone.com/packs/media/images/logo-799cc6b9049e7e56d573120ec02c5eb5.svg"
            alt="En Voiture Simone"
            class="h-8"
          />
        </div>
      </header>

      <main>
        <router-outlet />
      </main>
    </div>

    <app-toast />
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AppComponent {
  title = 'En Voiture Simone - Gestion des examens';
}
