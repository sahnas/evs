import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../../services/toast/toast.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private toastService = inject(ToastService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.status === 0) {
          errorMessage =
            'Problème de connexion au serveur. Vérifiez votre connexion internet.';
        } else if (error.status === 400) {
          errorMessage =
            error.error?.message || 'Les données envoyées sont invalides.';
        } else if (error.status === 404) {
          errorMessage = 'La ressource demandée est introuvable.';
        } else if (error.status === 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else {
          errorMessage = `Erreur inattendue: ${
            error.error?.message || error.statusText
          }`;
        }

        this.toastService.show(errorMessage, 'error');
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
