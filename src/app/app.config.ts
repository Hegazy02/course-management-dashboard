import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { successInterceptor } from './core/interceptors/success.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loaderInterceptor, errorInterceptor, successInterceptor])),
    providePrimeNG({ theme: { preset: Aura } }),
    provideAnimationsAsync()

  ],
};
