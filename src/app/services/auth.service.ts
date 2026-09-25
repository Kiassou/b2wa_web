import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';

import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserResponse,
} from '../models/auth.models';

import { TokenService } from './token.service';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);

  private readonly apiUrl = 'http://localhost:8081';

  constructor(
    private currentUserService: CurrentUserService
  ) { }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/auth/login`,
        request
      )
      .pipe(
        tap((response) => {
          console.log('🔐 Réponse complète du login :', response);
        console.log('🎟️ Access token reçu :', response.access_token);
        console.log('🔄 Refresh token reçu :', response.refresh_token);

        this.tokenService.setTokens(
          response.access_token,
          response.refresh_token
        );

        console.log(
          '💾 Access token après sauvegarde :',
          this.tokenService.getAccessToken()
        );

        console.log(
          '💾 Refresh token après sauvegarde :',
          this.tokenService.getRefreshToken()
        );
      })
    );
}

  getCurrentUser(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/auth/me`).pipe(
    tap(user => {
      this.currentUserService.setUser(user);
    })
  );
}

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken =
      this.tokenService.getRefreshToken();

    return this.http
      .post<RefreshTokenResponse>(
        `${this.apiUrl}/auth/refresh`,
        {
          refreshToken,
        }
      )
      .pipe(
        tap((response) => {
          this.tokenService.setTokens(
            response.access_token,
            response.refresh_token
          );
        })
      );
  }

  logout(): Observable<void> {

  const refreshToken =
    this.tokenService.getRefreshToken();

  console.log(
    '🔄 Refresh token utilisé pour logout :',
    refreshToken
  );

  if (!refreshToken) {
    console.error(
      '❌ Aucun refresh token disponible pour le logout.'
    );

    this.tokenService.clearTokens();
    localStorage.removeItem('b2wa_user');

    return of(void 0);
  }

  return this.http
    .post<void>(
      `${this.apiUrl}/auth/logout`,
      {
        refreshToken
      }
    )
    .pipe(
      tap(() => {
        console.log(
          '✅ Backend logout terminé.'
        );

        this.tokenService.clearTokens();
        localStorage.removeItem('b2wa_user');
      })
    );
}
}