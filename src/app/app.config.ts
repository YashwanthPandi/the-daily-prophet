import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideAuth0({
      domain: 'dev-ha45qv20nhpgtskl.us.auth0.com',
      clientId: 'Ros0iu6EifdgaWbKJ9sFF2czanVTCbLb',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
  ],
};
