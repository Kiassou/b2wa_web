import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


type SettingsModal =
  | 'password'
  | 'twoFactor'
  | 'logout'
  | 'deactivate'
  | null;


interface B2WASettings {
  currency: string;
  language: string;
  timezone: string;
  dateFormat: string;

  notifications: {
    emailTransactions: boolean;
    smsAlerts: boolean;
    weeklyReport: boolean;
    stockAlerts: boolean;
  };

  security: {
    twoFactor: boolean;
    pinForPayouts: boolean;
    payoutLimit: number;
  };

  commerce: {
    confirmOrders: boolean;
    autoStock: boolean;
    publicStore: boolean;
  };

  communication: {
    news: boolean;
    offers: boolean;
  };
}


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent {


  /* =====================================================
     CONSTRUCTEUR
  ===================================================== */

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}


  /* =====================================================
     ÉTAT DE LA PAGE
  ===================================================== */

  isSaving = false;

  successMessage = '';

  activeModal: SettingsModal = null;


  /* =====================================================
     PARAMÈTRES B2WA
  ===================================================== */

  settings: B2WASettings = {

    currency: 'XOF',

    language: 'fr',

    timezone: 'Africa/Bamako',

    dateFormat: 'DD/MM/YYYY',

    notifications: {

      emailTransactions: true,

      smsAlerts: true,

      weeklyReport: true,

      stockAlerts: true

    },

    security: {

      twoFactor: false,

      pinForPayouts: true,

      payoutLimit: 500000

    },

    commerce: {

      confirmOrders: true,

      autoStock: true,

      publicStore: true

    },

    communication: {

      news: true,

      offers: false

    }

  };


  /* =====================================================
     COPIE DES PARAMÈTRES PAR DÉFAUT
  ===================================================== */

  private readonly defaultSettings: B2WASettings = {

    currency: 'XOF',

    language: 'fr',

    timezone: 'Africa/Bamako',

    dateFormat: 'DD/MM/YYYY',

    notifications: {

      emailTransactions: true,

      smsAlerts: true,

      weeklyReport: true,

      stockAlerts: true

    },

    security: {

      twoFactor: false,

      pinForPayouts: true,

      payoutLimit: 500000

    },

    commerce: {

      confirmOrders: true,

      autoStock: true,

      publicStore: true

    },

    communication: {

      news: true,

      offers: false

    }

  };


  /* =====================================================
     MOT DE PASSE
  ===================================================== */

  passwordData = {

    current: '',

    newPassword: '',

    confirm: ''

  };


  /* =====================================================
     MÉTHODE DE RAFRAÎCHISSEMENT
  ===================================================== */

  private refreshView(): void {
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }


  /* =====================================================
     SAUVEGARDE
  ===================================================== */

  saveSettings(): void {

    this.isSaving = true;

    this.successMessage = '';

    this.refreshView();

    /*
     * Ici tu pourras plus tard appeler ton service API :
     *
     * this.settingsService.update(this.settings)
     */

    setTimeout(() => {

      this.isSaving = false;

      this.successMessage =
        'Vos paramètres B2WA ont été enregistrés avec succès.';

      this.refreshView();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }, 900);

  }


  /* =====================================================
     RÉINITIALISATION
  ===================================================== */

  resetSettings(): void {

    this.settings = this.cloneSettings(
      this.defaultSettings
    );

    this.successMessage =
      'Les paramètres ont été réinitialisés.';

    this.refreshView();

  }


  private cloneSettings(
    settings: B2WASettings
  ): B2WASettings {

    return JSON.parse(
      JSON.stringify(settings)
    );

  }


  /* =====================================================
     MODAL
  ===================================================== */

  closeModal(): void {

    this.activeModal = null;

    this.refreshView();

  }


  openPasswordModal(): void {

    this.passwordData = {

      current: '',

      newPassword: '',

      confirm: ''

    };

    this.activeModal = 'password';

    this.refreshView();

  }


  openTwoFactorModal(): void {

    this.activeModal = 'twoFactor';

    this.refreshView();

  }


  openLogoutModal(): void {

    this.activeModal = 'logout';

    this.refreshView();

  }


  openDeactivateModal(): void {

    this.activeModal = 'deactivate';

    this.refreshView();

  }


  /* =====================================================
     CHANGEMENT MOT DE PASSE
  ===================================================== */

  changePassword(): void {

    if (
      !this.passwordData.current ||
      !this.passwordData.newPassword ||
      !this.passwordData.confirm
    ) {

      this.successMessage =
        'Veuillez remplir tous les champs du mot de passe.';

      this.refreshView();

      return;

    }


    if (
      this.passwordData.newPassword !==
      this.passwordData.confirm
    ) {

      this.successMessage =
        'Les deux nouveaux mots de passe ne correspondent pas.';

      this.refreshView();

      return;

    }


    if (
      this.passwordData.newPassword.length < 8
    ) {

      this.successMessage =
        'Le nouveau mot de passe doit contenir au moins 8 caractères.';

      this.refreshView();

      return;

    }


    this.closeModal();

    this.successMessage =
      'Votre mot de passe a été modifié avec succès.';

    this.refreshView();

  }


  /* =====================================================
     2FA
  ===================================================== */

  toggleTwoFactor(): void {

    this.settings.security.twoFactor =
      !this.settings.security.twoFactor;

    const enabled =
      this.settings.security.twoFactor;

    this.closeModal();

    this.successMessage = enabled
      ? 'La double authentification est maintenant activée.'
      : 'La double authentification a été désactivée.';

    this.refreshView();

  }


  /* =====================================================
     DÉCONNEXION AUTRES APPAREILS
  ===================================================== */

  logoutOtherDevices(): void {

    this.closeModal();

    this.successMessage =
      'Toutes les autres sessions ont été déconnectées.';

    this.refreshView();

  }


  /* =====================================================
     DÉSACTIVATION COMPTE
  ===================================================== */

  deactivateAccount(): void {

    this.closeModal();

    this.successMessage =
      'Votre demande de désactivation du compte a été enregistrée.';

    this.refreshView();

  }

}