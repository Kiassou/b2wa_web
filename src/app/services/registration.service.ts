import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SupplierRegistrationStartRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password: string;

  nom_entreprise: string;
  categorie_id: number;
  adresse: string;
  ville: string;
  pays: string;
  terms_accepted: boolean;
  terms_version: string;
}

export interface SupplierRegistrationStartResponse {
  registration_id: string;
  otpSent: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  registration_id: string;
  otp: string;
}

export interface VerifyOtpResponse {
  registration_id: string;
  verified: boolean;
  registration_token: string;
  requires_documents: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private readonly http = inject(HttpClient);

 private readonly baseUrl = 'http://localhost:8081/auth/register';

  /**
   * Démarre l'inscription fournisseur.
   */
  startSupplierRegistration(
    data: SupplierRegistrationStartRequest
  ): Observable<SupplierRegistrationStartResponse> {

    return this.http.post<SupplierRegistrationStartResponse>(
      `${this.baseUrl}/supplier/start`,
      data
    );
  }

  /**
   * Vérifie le code OTP envoyé au fournisseur.
   */
  verifyOtp(
    data: VerifyOtpRequest
  ): Observable<VerifyOtpResponse> {

    return this.http.post<VerifyOtpResponse>(
      `${this.baseUrl}/verify-otp`,
      data
    );
  }

  /**
   * Envoie les documents du fournisseur.
   */
  uploadSupplierDocuments(
    registration_id: string,
    registration_token: string,
    files: {
      registreCommerce: File;
      nif: File;
      identiteResponsable: File;
    }
  ): Observable<unknown> {

    const formData = new FormData();

    formData.append('registration_id', registration_id);

    formData.append(
      'registre_commerce',
      files.registreCommerce
    );

    formData.append(
      'nif',
      files.nif
    );

    formData.append(
      'identite_responsable',
      files.identiteResponsable
    );

    return this.http.post(
      `${this.baseUrl}/supplier/documents`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${registration_token}`
        }
      }
    );
  }
}