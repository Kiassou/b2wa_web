import { Injectable, signal } from '@angular/core';

export interface CurrentUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
  type_compte: string;
  statut_compte: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private readonly userSignal = signal<CurrentUser | null>(null);

  user = this.userSignal.asReadonly();

  setUser(user: CurrentUser): void {
    this.userSignal.set(user);
  }

  clearUser(): void {
    this.userSignal.set(null);
  }

  getUser(): CurrentUser | null {
    return this.userSignal();
  }
}