<<<<<<< HEAD
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { GoogleChartsModule } from 'angular-google-charts';
=======
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
>>>>>>> ce3b7ce2b09e3242213faa51d663b12687146e40

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
<<<<<<< HEAD
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(GoogleChartsModule)
=======
    provideRouter(routes)
>>>>>>> ce3b7ce2b09e3242213faa51d663b12687146e40
  ]
};
