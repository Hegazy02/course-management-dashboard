import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoaderService } from '../services/loader.service';
import { SHOW_LOADER } from '../tokens/http-context.tokens';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(SHOW_LOADER)) {
    return next(req);
  }

  const loader = inject(LoaderService);

  const requestId = crypto.randomUUID();

  loader.show(requestId);

  return next(req).pipe(
    finalize(() => loader.hide(requestId))
  );
};