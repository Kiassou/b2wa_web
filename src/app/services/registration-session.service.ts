import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationSessionService {

  private readonly REGISTRATION_ID_KEY =
    'b2wa_registration_id';

  private readonly REGISTRATION_TOKEN_KEY =
    'b2wa_registration_token';

  setSession(
    registrationId: string,
    registrationToken: string
  ): void {

    sessionStorage.setItem(
      this.REGISTRATION_ID_KEY,
      registrationId
    );

    sessionStorage.setItem(
      this.REGISTRATION_TOKEN_KEY,
      registrationToken
    );
  }

  getRegistrationId(): string | null {
    return sessionStorage.getItem(
      this.REGISTRATION_ID_KEY
    );
  }

  getRegistrationToken(): string | null {
    return sessionStorage.getItem(
      this.REGISTRATION_TOKEN_KEY
    );
  }

  hasSession(): boolean {
    return !!(
      this.getRegistrationId() &&
      this.getRegistrationToken()
    );
  }

  clearSession(): void {

    sessionStorage.removeItem(
      this.REGISTRATION_ID_KEY
    );

    sessionStorage.removeItem(
      this.REGISTRATION_TOKEN_KEY
    );
  }
}