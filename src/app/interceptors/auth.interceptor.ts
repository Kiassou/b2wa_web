import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  const accessToken = tokenService.getAccessToken();

  console.log('🔑 Access token récupéré :', accessToken);

  if (!accessToken) {
    console.log('⚠️ Aucun access token');
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  console.log(
    '📤 Authorization envoyée :',
    authReq.headers.get('Authorization')
  );

  return next(authReq);
};