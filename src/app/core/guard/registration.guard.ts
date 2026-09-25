import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { RegistrationSessionService }
  from '../../services/registration-session.service';

export const registrationGuard: CanActivateFn = () => {

  const registrationSession =
    inject(RegistrationSessionService);

  const router = inject(Router);

  /*
   * L'utilisateur possède une session
   * d'inscription fournisseur valide.
   */
  if (registrationSession.hasSession()) {
    return true;
  }

  /*
   * Pas de session :
   * impossible d'accéder directement
   * à l'étape des documents.
   */
  return router.createUrlTree([
    '/auth/register-fournisseur'
  ]);
};