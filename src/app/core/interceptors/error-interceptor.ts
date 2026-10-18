import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/components/toast/service/toast-service';
import { ErrorResponse } from '../../shared/interfaces/errors';

function isErrorResponse(value: unknown): value is ErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string' &&
    value.message.trim() !== ''
  );
}

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const toastService = inject(ToastService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status >= 400 &&
        error.status < 600 &&
        isErrorResponse(error.error)
      ) {
        toastService.show(error.error.message);
      }

      return throwError(() => error);
    }),
  );
};
