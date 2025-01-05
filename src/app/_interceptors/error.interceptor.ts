import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status) {
        switch (error.status) {
          case 400:
            // Handle validation or bad request errors
            if (error.error?.validationErrors) {
              const formattedErrors = Object.values(error.error.validationErrors).join('<br>');
              toastr.error(formattedErrors, '', { enableHtml: true });
            } else {
              toastr.error(error.error?.message || 'Bad Request', '', { timeOut: 5000 });
            }
            break;

          case 401:
            // Handle Unauthorized errors
            const unauthorizedMessage =
              typeof error.error === 'string' ? error.error : error.error?.message || 'Unauthorized';
            toastr.error(unauthorizedMessage, '', { timeOut: 5000 });
            break;

          case 403:
            toastr.error(error.error?.message || 'Access is forbidden.', '', { timeOut: 5000 });
            break;

          case 404:
            // Navigate to the NotFound component
            router.navigate(['/not-found']);
            break;

          case 500:
            // Navigate to the ServerError component
            router.navigate(['/server-error']);
            break;

          default:
            // Handle other errors with a generic message
            toastr.error(
              error.error?.message || 'An unexpected error occurred.',
              '',
              { timeOut: 5000 }
            );
            break;
        }
      } else {
        // Handle unexpected errors
        toastr.error('A network or client-side error occurred.', '', { timeOut: 5000 });
      }

      return throwError(() => error);
    })
  );
};
