import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { TokenService } from '../../services/token.service';

export const guestGuard: CanActivateFn = () => {

  const tokenService = inject(TokenService);
  const router = inject(Router);

  /*
   * Aucun token :
   * l'utilisateur est bien un visiteur.
   * Il peut accéder aux pages publiques/auth.
   */
  if (!tokenService.hasAccessToken()) {
    return true;
  }

  /*
   * L'utilisateur est déjà connecté.
   * Il ne doit pas retourner sur login/register.
   */
  return router.createUrlTree([
    '/dashboard'
  ]);
};