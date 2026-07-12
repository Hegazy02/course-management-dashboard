import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

import { ToastService } from '../services/toast.service';
import { SUCCESS_MESSAGE } from '../tokens/http-context.tokens';

export const successInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    tap((event) => {
      if (event.type !== HttpEventType.Response) {
        return;
      }

      const message = req.context.get(SUCCESS_MESSAGE);

      if (message) {
        toast.success(message);
      }
    }),
  );
};
