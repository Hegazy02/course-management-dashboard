import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ToastService } from '../services/toast.service';
import {
  SHOW_ERROR,
  ERROR_MESSAGE,
} from '../tokens/http-context.tokens';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (req.context.get(SHOW_ERROR)) {

        const message =
          req.context.get(ERROR_MESSAGE) ??
          error.error?.message ??
          'Something went wrong';

        toast.error(message);
      }

      return throwError(() => error);
    })
  );
};