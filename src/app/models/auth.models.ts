export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface UserResponse {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  type_compte: string;
  statut_compte: AccountStatus;
  date_creation: string;
}

export type AccountStatus =
  | 'ACTIF'
  | 'EN_ATTENTE'
  | 'SUSPENDU'
  | 'BLOQUE';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserResponse;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}