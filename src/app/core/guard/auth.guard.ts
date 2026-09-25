import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { TokenService } from '../../services/token.service';

export const authGuard: CanActivateFn = () => {

  const tokenService = inject(TokenService);
  const router = inject(Router);

  /*
   * L'utilisateur possède un token d'accès.
   * On autorise l'accès à la route privée.
   */
  if (tokenService.hasAccessToken()) {
    return true;
  }

  /*
   * Aucun token :
   * l'utilisateur doit se connecter.
   */
  return router.createUrlTree([
    '/auth/login'
  ]);
};