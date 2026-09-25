import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { guestGuard } from './core/guard/guest.guard';
import { accountStatusGuard } from './core/guard/account-status.guard';
import { registrationGuard } from './core/guard/registration.guard';


export const routes: Routes = [

  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },

  {
    path: '',
    loadComponent: () =>
      import('./pages/splash/splash')
        .then(m => m.SplashComponent)
  },



  // =========================================================
  // AUTHENTIFICATION
  // =========================================================

  {
    path: 'auth',

    loadComponent: () =>
      import('./layout/auth-layout/auth-layout')
        .then(m => m.AuthLayoutComponent),

    children: [

      // -------------------------------------------------------
      // LOGIN
      // -------------------------------------------------------

      {
        path: 'login',

        canActivate: [guestGuard],

        loadComponent: () =>
          import('./pages/auth/login/login')
            .then(m => m.LoginComponent)
      },


      // -------------------------------------------------------
      // CONDITIONS
      // -------------------------------------------------------

      {
        path: 'terms',

        canActivate: [guestGuard],

        loadComponent: () =>
          import('./pages/auth/terms/terms')
            .then(m => m.TermsComponent)
      },


      // -------------------------------------------------------
      // CHOIX INSCRIPTION
      // -------------------------------------------------------

      {
        path: 'register',

        canActivate: [guestGuard],

        loadComponent: () =>
          import('./pages/auth/register/register')
            .then(m => m.RegisterComponent)
      },


      // -------------------------------------------------------
      // AIDE INSCRIPTION / KORA
      // -------------------------------------------------------

      {
        path: 'register-help',

        canActivate: [guestGuard],

        loadComponent: () =>
          import('./pages/auth/register-help/register-help')
            .then(m => m.RegisterHelpComponent),

        title: 'B2WA | Kora - Assistant B2WA'
      },


      // -------------------------------------------------------
      // INSCRIPTION FOURNISSEUR
      // -------------------------------------------------------

      {
        path: 'register-fournisseur',

        canActivate: [guestGuard],

        loadComponent: () =>
          import(
            './pages/auth/register/register-fournisseur/register-fournisseur'
          )
            .then((m) => m.RegisterFournisseurComponent),

        title: 'B2WA | Inscription fournisseur'
      },


      // -------------------------------------------------------
      // INFORMATIONS FOURNISSEUR
      // -------------------------------------------------------

      {
        path: 'register-info',

        canActivate: [guestGuard],

        loadComponent: () =>
          import(
            './pages/auth/register/register-fournisseur/register-info/register-info'
          )
            .then((m) => m.RegisterInfoComponent),

        title: 'B2WA | Inscription fournisseur'
      },


      // -------------------------------------------------------
      // VÉRIFICATION OTP
      // -------------------------------------------------------
      /*
       * Pas de registrationGuard ici.
       *
       * À cette étape, l'utilisateur possède seulement
       * le registration_id.
       *
       * Le registration_token n'existe qu'après
       * validation de l'OTP.
       */

      {
        path: 'verify-account',

        canActivate: [guestGuard],

        loadComponent: () =>
          import(
            './pages/auth/register/register-fournisseur/verify-account/verify-account'
          )
            .then((m) => m.VerifyAccountComponent),

        title: 'B2WA | Vérification du compte'
      },


      // -------------------------------------------------------
      // DOCUMENTS FOURNISSEUR
      // -------------------------------------------------------
      /*
       * Cette route nécessite obligatoirement
       * une session d'inscription valide.
       */

      {
        path: 'documents',

        canActivate: [registrationGuard],

        loadComponent: () =>
          import(
            './pages/auth/register/register-fournisseur/supplier-documents/supplier-documents'
          )
            .then((m) => m.SupplierDocumentsComponent),

        title: 'B2WA | Documents du fournisseur'
      },


      // -------------------------------------------------------
      // INSCRIPTION RÉUSSIE
      // -------------------------------------------------------

      {
        path: 'registration-success',

        loadComponent: () =>
          import(
            './pages/auth/register/register-fournisseur/registration-success/registration-success'
          )
            .then((m) => m.RegistrationSuccessComponent),

        title: 'B2WA | Inscription réussie'
      },


      // -------------------------------------------------------
      // INSCRIPTION COMMERCANT
      // -------------------------------------------------------

      {
        path: 'register-commercant',

        canActivate: [guestGuard],

        loadComponent: () =>
          import(
            './pages/auth/register/register-commercant/register-commercant'
          )
            .then((m) => m.RegisterCommercantComponent),

        title: 'B2WA | Inscription commerçant'
      },


      // -------------------------------------------------------
      // COMPTE EN ATTENTE DE VALIDATION
      // -------------------------------------------------------
      /*
       * Cette page concerne un utilisateur déjà connecté.
       * Elle ne doit donc pas être accessible sans token.
       */

      {
        path: 'pending-approval',

        canActivate: [authGuard],

        loadComponent: () =>
          import('./pages/auth/pending-approval/pending-approval')
            .then(m => m.PendingApprovalComponent)
      },


      // -------------------------------------------------------
      // VÉRIFICATION DU COMPTE
      // -------------------------------------------------------

      {
        path: 'account-verify',

        canActivate: [guestGuard],

        loadComponent: () =>
          import('./pages/auth/account-verify/account-verify')
            .then(m => m.AccountVerifyComponent)
      },


      // -------------------------------------------------------
      // MOT DE PASSE OUBLIÉ
      // -------------------------------------------------------

      {
        path: 'forgot-password',

        canActivate: [guestGuard],

        loadComponent: () =>
          import('./pages/auth/forgot-password/forgot-password')
            .then(m => m.ForgotPasswordComponent)
      },


      // -------------------------------------------------------
      // VÉRIFICATION OTP MOT DE PASSE
      // -------------------------------------------------------

      {
        path: 'verify-otp',

        canActivate: [guestGuard],

        loadComponent: () =>
          import('./pages/auth/verify-otp/verify-otp')
            .then(m => m.VerifyOtpComponent)
      },


      // -------------------------------------------------------
      // RÉINITIALISATION MOT DE PASSE
      // -------------------------------------------------------

      {
        path: 'reset-password',

        canActivate: [guestGuard],

        loadComponent: () =>
          import('./pages/auth/reset-password/reset-password')
            .then(m => m.ResetPasswordComponent)
      }

    ]
  },



  // =========================================================
  // DASHBOARD / ESPACE PRIVÉ
  // =========================================================

  {
    path: 'dashboard',

    /*
     * Toute l'arborescence /dashboard est privée.
     */
    canActivate: [
    authGuard,
    accountStatusGuard
  ],

    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout')
        .then(m => m.DashboardLayoutComponent),

    children: [

      {
        path: '',

        loadComponent: () =>
          import('./pages/dashboard/dashboard')
            .then(m => m.DashboardComponent)
      },


      // -------------------------------------------------------
      // NOTIFICATIONS
      // -------------------------------------------------------

      {
        path: 'notifications',

        loadComponent: () =>
          import('./pages/notifications/notifications')
            .then(m => m.NotificationsComponent)
      },


      // -------------------------------------------------------
      // ACTIVITÉ
      // -------------------------------------------------------

      {
        path: 'activity',

        loadComponent: () =>
          import('./pages/activity/activity')
            .then(m => m.ActivityComponent)
      },


      // -------------------------------------------------------
      // COMMUNAUTÉS
      // -------------------------------------------------------

      {
        path: 'community',

        loadComponent: () =>
          import('./pages/community/community')
            .then(m => m.CommunityComponent)
      },

      {
        path: 'create-community',

        loadComponent: () =>
          import(
            './pages/community/create-community/create-community'
          )
            .then(m => m.CreateCommunityComponent)
      },

      {
        path: 'joined-communities',

        loadComponent: () =>
          import(
            './pages/community/joined-communities/joined-communities'
          )
            .then(m => m.JoinedCommunitiesComponent)
      },

      {
        path: 'community-explorer',

        loadComponent: () =>
          import(
            './pages/community/community-explorer/community-explorer'
          )
            .then(m => m.CommunityExplorerComponent)
      },

      {
        path: 'manage-community/:id/manage',

        loadComponent: () =>
          import(
            './pages/community/manage-community/manage-community'
          )
            .then(m => m.ManageCommunityComponent)
      },

      {
        path: 'community/:id',

        loadComponent: () =>
          import(
            './pages/community/community-detail/community-detail'
          )
            .then(m => m.CommunityDetailComponent)
      },

      {
        path: 'community-view/:id',

        loadComponent: () =>
          import(
            './pages/community/community-view/community-view'
          )
            .then(m => m.CommunityViewComponent)
      },


      // -------------------------------------------------------
      // LIVE
      // -------------------------------------------------------

      {
        path: 'live/:id',

        loadComponent: () =>
          import('./pages/community/live/live')
            .then(m => m.LiveComponent)
      },


      // -------------------------------------------------------
      // FINANCES
      // -------------------------------------------------------

      {
        path: 'finances',

        loadComponent: () =>
          import('./pages/finances/finances')
            .then(m => m.FinancesComponent)
      },


      // -------------------------------------------------------
      // VENTES FLASH
      // -------------------------------------------------------

      {
        path: 'flash-sales',

        loadComponent: () =>
          import('./pages/flash-sales/flash-sales')
            .then(m => m.FlashSalesComponent)
      },

      {
        path: 'create-flash-sale',

        loadComponent: () =>
          import(
            './pages/flash-sales/create-flash-sale/create-flash-sale'
          )
            .then(m => m.CreateFlashSaleComponent)
      },

      {
        path: 'update-flash-sale/:id',

        loadComponent: () =>
          import(
            './pages/flash-sales/update-flash-sale/update-flash-sale'
          )
            .then(m => m.UpdateFlashSaleComponent)
      },


      // -------------------------------------------------------
      // COMMANDES
      // -------------------------------------------------------

      {
        path: 'orders',

        loadComponent: () =>
          import('./pages/orders/orders')
            .then(m => m.OrdersComponent)
      },


      // -------------------------------------------------------
      // PRODUITS
      // -------------------------------------------------------

      {
        path: 'products',

        loadComponent: () =>
          import('./pages/products/products')
            .then(m => m.ProductsComponent)
      },

      {
        path: 'add-products',

        loadComponent: () =>
          import('./pages/products/add-products/add-products')
            .then(m => m.AddProductsComponent)
      },

      {
        path: 'update-products/:id',

        loadComponent: () =>
          import(
            './pages/products/update-products/update-products'
          )
            .then(m => m.UpdateProductsComponent)
      },


      // -------------------------------------------------------
      // EXPÉDITIONS
      // -------------------------------------------------------

      {
        path: 'shipping',

        loadComponent: () =>
          import('./pages/shipping/shipping')
            .then(m => m.ShippingComponent)
      },

      {
        path: 'create-shipment/:orderId',

        loadComponent: () =>
          import(
            './pages/shipping/create-shipment/create-shipment'
          )
            .then(m => m.CreateShipmentComponent)
      },

      {
        path: 'shipment-detail/:trackingNumber',

        loadComponent: () =>
          import(
            './pages/shipping/shipment-detail/shipment-detail'
          )
            .then(m => m.ShipmentDetailComponent)
      },

      {
        path: 'tracking/:shipmentId',

        loadComponent: () =>
          import(
            './pages/shipping/tracking/tracking'
          )
            .then(m => m.TrackingComponent)
      },


      // -------------------------------------------------------
      // STORIES
      // -------------------------------------------------------

      {
        path: 'stories',

        loadComponent: () =>
          import('./pages/stories/stories')
            .then(m => m.StoriesComponent)
      },


      // -------------------------------------------------------
      // PROFIL
      // -------------------------------------------------------

      {
        path: 'profile',

        loadComponent: () =>
          import('./pages/profile/profile')
            .then(m => m.ProfileComponent)
      },


      // -------------------------------------------------------
      // SUPPORT
      // -------------------------------------------------------

      {
        path: 'support',

        loadComponent: () =>
          import('./pages/support/support')
            .then(m => m.SupportComponent)
      },


      // -------------------------------------------------------
      // PARAMÈTRES
      // -------------------------------------------------------

      {
        path: 'settings',

        loadComponent: () =>
          import('./pages/settings/settings')
            .then(m => m.SettingsComponent)
      }

    ]
  },


  // =========================================================
  // ROUTE INCONNUE
  // =========================================================

  {
    path: '**',
    redirectTo: 'splash'
  }

];