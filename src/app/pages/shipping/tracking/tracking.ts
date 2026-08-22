import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Shipment,
  ShipmentStatus,
  ShipmentStoreService
} from '../../../services/shipment-store.service';


interface TrackingStep {

  id: number;

  title: string;

  icon: string;

  date: string;

  completed: boolean;

  current: boolean;
}


interface ShipmentHistoryEvent {

  id: number;

  title: string;

  description: string;

  date: string;

  location: string;

  icon: string;

  current: boolean;
}


@Component({

  selector: 'app-tracking',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule
  ],

  templateUrl: './tracking.html',

  styleUrl: './tracking.css'
})
export class TrackingComponent implements OnInit {


  /* =====================================================
     RECHERCHE
  ====================================================== */

  trackingNumber = '';

  searched = false;

  shipment: Shipment | null = null;


  /* =====================================================
     PROGRESSION
  ====================================================== */

  trackingSteps: TrackingStep[] = [];


  /* =====================================================
     CONSTRUCTEUR
  ====================================================== */

  constructor(

    private router: Router,

    private route: ActivatedRoute,

    private shipmentStore: ShipmentStoreService

  ) {}


  /* =====================================================
     INITIALISATION
  ====================================================== */
  ngOnInit(): void {
    // Lecture du paramètre de route : /dashboard/tracking/:shipmentId
    this.route.paramMap.subscribe(params => {
      const tracking = params.get('shipmentId');

      if (tracking) {
        this.trackingNumber = tracking;
        this.trackShipment();
      }
    });
  }


  /* =====================================================
     RECHERCHE D'UNE EXPÉDITION
  ====================================================== */

  trackShipment(): void {

    const number =
      this.trackingNumber
        .trim()
        .toUpperCase();


    if (
      !number
    ) {

      this.shipment = null;

      this.trackingSteps = [];

      this.searched = false;

      return;
    }


    this.trackingNumber =
      number;

    this.searched = true;


    const foundShipment =
      this.shipmentStore.findByTrackingNumber(
        number
      );


    if (
      !foundShipment
    ) {

      this.shipment = null;

      this.trackingSteps = [];

      return;
    }


    this.shipment =
      foundShipment;


    this.trackingSteps =
      this.buildTrackingSteps(
        foundShipment
      );
  }


  /* =====================================================
     CRÉATION DES ÉTAPES
  ====================================================== */

  private buildTrackingSteps(
    shipment: Shipment
  ): TrackingStep[] {

    const currentIndex =
      this.getStatusStepIndex(
        shipment.status
      );


    const steps = [

      {

        title:
          'Expédition créée',

        icon:
          'edit_document',

        date:
          shipment.createdAt
      },


      {

        title:
          'Colis récupéré',

        icon:
          'inventory_2',

        date:
          currentIndex >= 1
            ? shipment.createdAt
            : 'Prévu'
      },


      {

        title:
          'En transit',

        icon:
          'local_shipping',

        date:
          currentIndex >= 2
            ? 'En cours'
            : 'Prévu'
      },


      {

        title:
          'Arrivé à destination',

        icon:
          'warehouse',

        date:
          currentIndex >= 3
            ? 'Terminé'
            : 'Prévu'
      },


      {

        title:
          'Livré',

        icon:
          'check_circle',

        date:
          shipment.status === 'delivered'
            ? shipment.estimatedDelivery
            : 'Prévu'
      }
    ];


    return steps.map(

      (step, index) => {

        const isDelivered =
          shipment.status === 'delivered';


        const isCancelled =
          shipment.status === 'cancelled';


        return {

          id:
            index + 1,

          title:
            step.title,

          icon:
            step.icon,

          date:
            step.date,

          completed:
            isDelivered
              ? true
              : !isCancelled &&
                index < currentIndex,

          current:
            !isDelivered &&
            !isCancelled &&
            index === currentIndex
        };
      }
    );
  }


  /* =====================================================
     INDEX DU STATUT
  ====================================================== */

  private getStatusStepIndex(
    status: ShipmentStatus
  ): number {

    switch (
      status
    ) {

      case 'preparing':

        return 0;


      case 'picked':

        return 1;


      case 'transit':

        return 2;


      case 'delivered':

        return 4;


      case 'problem':

        return 2;


      case 'cancelled':

        return 0;


      default:

        return 0;
    }
  }


  /* =====================================================
     HISTORIQUE RÉEL
  ====================================================== */

  get shipmentHistory(): ShipmentHistoryEvent[] {

    if (
      !this.shipment
    ) {

      return [];
    }


    const shipment =
      this.shipment;


    const currentIndex =
      this.getStatusStepIndex(
        shipment.status
      );


    const history:
      ShipmentHistoryEvent[] = [

      {

        id:
          1,

        title:
          'Expédition créée',

        description:
          'Votre expédition a été enregistrée sur B2WA Shipping.',

        date:
          shipment.createdAt,

        location:
          `${shipment.sender.city}, ${shipment.sender.country}`,

        icon:
          'edit_document',

        current:
          currentIndex === 0 &&
          shipment.status !== 'cancelled'
      }
    ];


    if (
      currentIndex >= 1
    ) {

      history.push({

        id:
          2,

        title:
          'Colis récupéré',

        description:
          'Le colis a été récupéré par le transporteur.',

        date:
          shipment.createdAt,

        location:
          `${shipment.sender.city}, ${shipment.sender.country}`,

        icon:
          'inventory_2',

        current:
          currentIndex === 1
      });
    }


    if (
      currentIndex >= 2 ||
      shipment.status === 'problem'
    ) {

      history.push({

        id:
          3,

        title:
          shipment.status === 'problem'
            ? 'Problème signalé'
            : 'Colis en transit',

        description:
          shipment.status === 'problem'
            ? 'Un problème a été signalé pendant l’acheminement.'
            : 'Votre colis est actuellement en cours d’acheminement.',

        date:
          'En cours',

        location:
          `${shipment.origin} → ${shipment.destination}`,

        icon:
          shipment.status === 'problem'
            ? 'warning'
            : 'local_shipping',

        current:
          shipment.status === 'problem' ||
          currentIndex === 2
      });
    }


    if (
      currentIndex >= 3
    ) {

      history.push({

        id:
          4,

        title:
          'Arrivé à destination',

        description:
          'Le colis est arrivé dans la zone de destination.',

        date:
          'Terminé',

        location:
          `${shipment.receiver.city}, ${shipment.receiver.country}`,

        icon:
          'warehouse',

        current:
          currentIndex === 3
      });
    }


    if (
      shipment.status === 'delivered'
    ) {

      history.push({

        id:
          5,

        title:
          'Expédition livrée',

        description:
          'Le colis a été remis au destinataire.',

        date:
          shipment.estimatedDelivery,

        location:
          `${shipment.receiver.city}, ${shipment.receiver.country}`,

        icon:
          'check_circle',

        current:
          false
      });
    }


    if (
      shipment.status === 'cancelled'
    ) {

      history.push({

        id:
          6,

        title:
          'Expédition annulée',

        description:
          'Cette expédition a été annulée.',

        date:
          'Annulée',

        location:
          `${shipment.origin}`,

        icon:
          'cancel',

        current:
          true
      });
    }


    return history;
  }


  /* =====================================================
     POURCENTAGE DE PROGRESSION
  ====================================================== */

  getProgress(): number {

    if (
      !this.shipment ||
      this.trackingSteps.length === 0
    ) {

      return 0;
    }


    if (
      this.shipment.status === 'delivered'
    ) {

      return 100;
    }


    if (
      this.shipment.status === 'cancelled'
    ) {

      return 0;
    }


    const currentIndex =
      this.getStatusStepIndex(
        this.shipment.status
      );


    const totalSteps =
      this.trackingSteps.length - 1;


    if (
      totalSteps <= 0
    ) {

      return 0;
    }


    return Math.round(

      (
        currentIndex /
        totalSteps
      ) * 100
    );
  }


  /* =====================================================
     LIBELLÉ DU STATUT
  ====================================================== */

  getStatusLabel(
    status: ShipmentStatus
  ): string {

    switch (
      status
    ) {

      case 'preparing':

        return 'En préparation';


      case 'picked':

        return 'Colis récupéré';


      case 'transit':

        return 'En transit';


      case 'delivered':

        return 'Livré';


      case 'problem':

        return 'Problème';


      case 'cancelled':

        return 'Annulé';


      default:

        return 'Inconnu';
    }
  }


  /* =====================================================
     CLASSE CSS DU STATUT
  ====================================================== */

  getStatusClass(
    status: ShipmentStatus
  ): string {

    switch (
      status
    ) {

      case 'preparing':

        return 'status-preparing';


      case 'picked':

        return 'status-picked';


      case 'transit':

        return 'status-transit';


      case 'delivered':

        return 'status-delivered';


      case 'problem':

        return 'status-problem';


      case 'cancelled':

        return 'status-cancelled';


      default:

        return '';
    }
  }


  /* =====================================================
     RÉINITIALISER LA RECHERCHE
  ====================================================== */

  resetSearch(): void {

    this.trackingNumber = '';

    this.shipment = null;

    this.trackingSteps = [];

    this.searched = false;


    this.router.navigate([

      '/dashboard/tracking'
    ]);
  }


  /* =====================================================
     RETOUR
  ====================================================== */

  goBack(): void {

    if (
      this.shipment
    ) {

      this.router.navigate([

        '/dashboard/shipment-detail',

        this.shipment.id
      ]);

      return;
    }


    this.router.navigate([

      '/dashboard/shipping'
    ]);
  }


  /* =====================================================
     SUPPORT
  ====================================================== */

  contactSupport(): void {

    this.router.navigate([

      '/dashboard/support'
    ]);
  }
}