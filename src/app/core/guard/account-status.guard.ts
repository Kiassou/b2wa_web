import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../../services/auth.service';

export const accountStatusGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    map((user) => {
      console.log('👤 Utilisateur connecté :', user);
      console.log(
        '🔎 Clés reçues par /auth/me :',
        Object.keys(user)
      );

      // On normalise le statut reçu par le backend
      const statut = user.statut_compte?.toUpperCase();

      console.log('📌 Statut du compte :', statut);

      switch (statut) {
        case 'ACTIF':
          console.log('✅ Compte actif. Accès au dashboard autorisé.');
          return true;

        case 'EN_ATTENTE':
          console.log('⏳ Compte en attente de validation.');
          return router.createUrlTree([
            '/auth/pending-approval'
          ]);

        case 'SUSPENDU':
          console.log('⚠️ Compte suspendu.');
          return router.createUrlTree([
            '/auth/pending-approval'
          ]);

        case 'BLOQUE':
          console.log('🚫 Compte bloqué.');
          return router.createUrlTree([
            '/auth/pending-approval'
          ]);

        default:
          console.error(
            '❌ Statut de compte inconnu :',
            user.statut_compte
          );

          return router.createUrlTree([
            '/auth/login'
          ]);
      }
    }),

    catchError((error) => {
      console.error(
        '❌ Impossible de vérifier le statut du compte.'
      );

      console.error('Status :', error?.status);
      console.error('Error :', error);

      return of(
        router.createUrlTree(['/auth/login'])
      );
    })
  );
};