import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { successInterceptor } from './core/interceptors/success.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const WinePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fdf2f4',
      100: '#fce7eb',
      200: '#f9d0d9',
      300: '#f4a9b9',
      400: '#ec7a94',
      500: '#d14b72',
      600: '#b43d5e',
      700: '#962f4a',
      800: '#7d283d',
      900: '#6b2435',
      950: '#3d0f1b',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loaderInterceptor, errorInterceptor, successInterceptor])),
    providePrimeNG({
      theme: {
        preset: WinePreset,
        options: {
          darkModeSelector: '.dark',
        },
      },
    }),
    provideAnimationsAsync()

  ],
};
