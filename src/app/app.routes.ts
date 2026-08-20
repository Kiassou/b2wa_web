import { Routes } from '@angular/router';

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



  {
    path: 'auth',

    loadComponent: () =>
      import('./layout/auth-layout/auth-layout')
        .then(m => m.AuthLayoutComponent),

    children: [

      {
        path: 'login',

        loadComponent: () =>
          import('./pages/auth/login/login')
            .then(m => m.LoginComponent)
      },

      {
        path: 'terms',

        loadComponent: () =>
          import('./pages/auth/terms/terms')
            .then(m => m.TermsComponent)
      },

      {
        path: 'register',

        loadComponent: () =>
          import('./pages/auth/register/register')
            .then(m => m.RegisterComponent)
      },
      {
        path: 'pending-approval',

        loadComponent: () =>
          import('./pages/auth/pending-approval/pending-approval')
            .then(m => m.PendingApprovalComponent)
      },
      {
        path: 'account-verify',

        loadComponent: () =>
          import('./pages/auth/account-verify/account-verify')
            .then(m => m.AccountVerifyComponent)
      },

      {
        path: 'forgot-password',

        loadComponent: () =>
          import('./pages/auth/forgot-password/forgot-password')
            .then(m => m.ForgotPasswordComponent)
      },

      {
        path: 'verify-otp',

        loadComponent: () =>
          import('./pages/auth/verify-otp/verify-otp')
            .then(m => m.VerifyOtpComponent)
      },

      {
        path: 'reset-password',

        loadComponent: () =>
          import('./pages/auth/reset-password/reset-password')
            .then(m => m.ResetPasswordComponent)
      }

    ]
  },



  {
    path: 'dashboard',

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
      {
        path: 'notifications',

        loadComponent: () =>
          import('./pages/notifications/notifications')
            .then(m => m.NotificationsComponent)
      },
      {
        path: 'activity',

        loadComponent: () =>
          import('./pages/activity/activity')
            .then(m => m.ActivityComponent)
      },
      {
        path: 'community',

        loadComponent: () =>
          import('./pages/community/community')
            .then(m => m.CommunityComponent)
      },
      {
        path: 'create-community',

        loadComponent: () =>
          import('./pages/community/create-community/create-community')
            .then(m => m.CreateCommunityComponent)
      },
      {
        path: 'manage-community/:id/manage',
        loadComponent: () =>
          import('./pages/community/manage-community/manage-community')
            .then(m => m.ManageCommunityComponent)
      },
      {
        path: 'community/:id',
        loadComponent: () =>
          import('./pages/community/community-detail/community-detail')
            .then(m => m.CommunityDetailComponent)
      },
       {
        path: 'community-view/:id',

        loadComponent: () =>
          import('./pages/community/community-view/community-view')
            .then(m => m.CommunityViewComponent)
      },
      {
        path: 'live/:id',

        loadComponent: () =>
          import('./pages/community/live/live')
            .then(m => m.LiveComponent)
      },
      {
        path: 'finances',

        loadComponent: () =>
          import('./pages/finances/finances')
            .then(m => m.FinancesComponent)
      },
      {
        path: 'flash-sales',

        loadComponent: () =>
          import('./pages/flash-sales/flash-sales')
            .then(m => m.FlashSalesComponent)
      },
      {
        path: 'orders',

        loadComponent: () =>
          import('./pages/orders/orders')
            .then(m => m.OrdersComponent)
      },
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
        path: 'shipping',

        loadComponent: () =>
          import('./pages/shipping/shipping')
            .then(m => m.ShippingComponent)
      },
      {
        path: 'create-shipment',

        loadComponent: () =>
          import('./pages/shipping/create-shipment/create-shipment')
            .then(m => m.CreateShipmentComponent)
      },
      { 
        path: 'shipment-detail/:id',
        loadComponent: () =>
          import('./pages/shipping/shipment-detail/shipment-detail')
            .then(m => m.ShipmentDetailComponent)
      },
      { 
        path: 'tracking',
        loadComponent: () =>
          import('./pages/shipping/tracking/tracking')
            .then(m => m.TrackingComponent)
      },
      {
        path: 'stories',

        loadComponent: () =>
          import('./pages/stories/stories')
            .then(m => m.StoriesComponent)
      },
      {
        path: 'profile',

        loadComponent: () =>
          import('./pages/profile/profile')
            .then(m => m.ProfileComponent)
      },
      {
        path: 'support',

        loadComponent: () =>
          import('./pages/support/support')
            .then(m => m.SupportComponent)
      },
      {
        path: 'settings',

        loadComponent: () =>
          import('./pages/settings/settings')
            .then(m => m.SettingsComponent)
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'splash'
  }

];