import {
  Component,
  OnInit
} from '@angular/core';


import {
  CommonModule
} from '@angular/common';


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

  description: string;

  date: string;

  completed: boolean;

  current: boolean;
}


@Component({
  selector: 'app-shipment-detail',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './shipment-detail.html',

  styleUrl: './shipment-detail.css'
})
export class ShipmentDetailComponent
  implements OnInit {


  /* =====================================================
     IDENTIFIANT ROUTE
  ====================================================== */

  shipmentId:
    string | null = null;


  /* =====================================================
     EXPÉDITION
  ====================================================== */

  shipment:
    Shipment | null = null;


  /* =====================================================
     ÉTAT
  ====================================================== */

  loading = true;

  notFound = false;


  /* =====================================================
     TIMELINE
  ====================================================== */

  trackingSteps:
    TrackingStep[] = [];


  /* =====================================================
     CONSTRUCTOR
  ====================================================== */

  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private shipmentStore:
      ShipmentStoreService

  ) {}


  /* =====================================================
     INIT
  ====================================================== */

ngOnInit(): void {
  const param = this.route.snapshot.paramMap.get('trackingNumber') 
             || this.route.snapshot.paramMap.get('id');

  if (!param) {
    this.loading = false;
    this.notFound = true;
    return;
  }

  // Utiliser l'opérateur de coalescence nulle (??) pour garantir 'null' au lieu de 'undefined'
  let shipment: Shipment | null = this.shipmentStore.findByTrackingNumber(param) ?? null;

  if (!shipment && !isNaN(Number(param))) {
    shipment = this.shipmentStore.getShipmentById(Number(param)) ?? null;
  }

  if (!shipment) {
    this.loading = false;
    this.notFound = true;
    return;
  }

  this.shipment = shipment;
  this.trackingSteps = this.buildTrackingSteps(shipment);
  this.loading = false;
}

getCountryCode(location: string): string {
  if (!location) return '';
  
  const loc = location.toLowerCase();
  
  if (loc.includes('mali') || loc.includes('bamako')) return 'ml';
  if (loc.includes('sénégal') || loc.includes('senegal') || loc.includes('dakar')) return 'sn';
  if (loc.includes('niger') || loc.includes('niamey')) return 'ne';
  if (loc.includes('ivoire') || loc.includes('abidjan')) return 'ci';
  if (loc.includes('burkina') || loc.includes('ouagadougou')) return 'bf';
  if (loc.includes('mauritanie') || loc.includes('nouakchott')) return 'mr';
  if (loc.includes('bénin') || loc.includes('benin') || loc.includes('cotonou')) return 'bj';
  if (loc.includes('guinée') || loc.includes('guinee') || loc.includes('conakry')) return 'gn';
  if (loc.includes('ghana') || loc.includes('accra')) return 'gh';
  if (loc.includes('togo') || loc.includes('lomé') || loc.includes('lome')) return 'tg';

  return '';
}

  /* =====================================================
     TIMELINE DYNAMIQUE
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

        description:
          'Votre demande d’expédition a été enregistrée.',

        date:
          shipment.createdAt
      },


      {
        title:
          'Colis récupéré',

        description:
          'Le colis a été récupéré auprès de l’expéditeur.',

        date:
          currentIndex >= 1
            ? shipment.createdAt
            : ''
      },


      {
        title:
          'En transit',

        description:
          'Votre colis est actuellement en cours de transport.',

        date:
          currentIndex >= 2
            ? 'En cours'
            : ''
      },


      {
        title:
          'Arrivé au centre de distribution',

        description:
          'Le colis sera traité dans le centre de distribution.',

        date:
          currentIndex >= 3
            ? 'Terminé'
            : ''
      },


      {
        title:
          'Livraison en cours',

        description:
          'Le colis sera remis au destinataire.',

        date:
          currentIndex >= 4
            ? 'En cours'
            : ''
      },


      {
        title:
          'Livré',

        description:
          'L’expédition sera considérée comme terminée.',

        date:
          shipment.status === 'delivered'
            ? shipment.estimatedDelivery
            : ''
      }
    ];


    return steps.map(
      (step, index) => ({

        id:
          index + 1,

        title:
          step.title,

        description:
          step.description,

        date:
          step.date,

        completed:
          index < currentIndex ||
          (
            shipment.status === 'delivered' &&
            index === 5
          ),

        current:
          index === currentIndex &&
          shipment.status !== 'delivered'
      })
    );
  }


  /* =====================================================
     INDEX DU STATUT
  ====================================================== */

  private getStatusStepIndex(
    status: ShipmentStatus
  ): number {

    switch (status) {

      case 'preparing':

        return 0;


      case 'picked':

        return 1;


      case 'transit':

        return 2;


      case 'delivered':

        return 5;


      case 'problem':

        return 2;


      case 'cancelled':

        return 0;


      default:

        return 0;
    }
  }


  /* =====================================================
     BACK
  ====================================================== */

  goBack(): void {

    this.router.navigate([
      '/dashboard/shipping'
    ]);
  }


  /* =====================================================
     TRACK
  ====================================================== */

  trackShipment(): void {

    if (!this.shipment) {
      return;
    }

    console.log('Tracking shipment:', this.shipment.trackingNumber);

    // Utiliser l'ID ou le trackingNumber directement dans le chemin
    const trackingId = this.shipment.id || this.shipment.trackingNumber;

    this.router.navigate(['/dashboard/tracking', this.shipment.trackingNumber]);
  }


  /* =====================================================
     COPY TRACKING NUMBER
  ====================================================== */

  async copyTrackingNumber(): Promise<void> {

    if (
      !this.shipment ||
      !navigator.clipboard
    ) {
      return;
    }


    try {

      await navigator.clipboard.writeText(
        this.shipment.trackingNumber
      );


      console.log(
        'Tracking number copied'
      );

    } catch {

      console.error(
        'Impossible de copier le numéro de suivi.'
      );
    }
  }


  /* =====================================================
     CONTACT TRANSPORTER
  ====================================================== */

  contactTransporter(): void {

    if (
      !this.shipment
    ) {
      return;
    }


    const message = encodeURIComponent(

      `Bonjour, je souhaite obtenir des informations sur l'expédition ${this.shipment.trackingNumber}.`
    );


    window.open(
      `https://wa.me/?text=${message}`,
      '_blank',
      'noopener'
    );
  }


  /* =====================================================
     CANCEL SHIPMENT
  ====================================================== */

  cancelShipment(): void {

    if (
      !this.shipment
    ) {
      return;
    }


    if (
      this.shipment.status === 'delivered'
    ) {

      window.alert(
        'Une expédition déjà livrée ne peut pas être annulée.'
      );

      return;
    }


    const confirmed =
      window.confirm(
        'Voulez-vous vraiment annuler cette expédition ?'
      );


    if (!confirmed) {
      return;
    }


    this.shipment.status =
      'cancelled';


    this.shipmentStore.updateShipment(
      this.shipment
    );


    this.trackingSteps =
      this.buildTrackingSteps(
        this.shipment
      );
  }


  /* =====================================================
     STATUS LABEL
  ====================================================== */

  getStatusLabel(
    status: ShipmentStatus
  ): string {

    switch (status) {

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

        return 'Annulée';


      default:

        return 'Inconnu';
    }
  }


  /* =====================================================
     STATUS CLASS
  ====================================================== */

  getStatusClass(
    status: ShipmentStatus
  ): string {

    switch (status) {

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
     INITIALS
  ====================================================== */

  getInitials(
    name: string
  ): string {

    if (
      !name
    ) {
      return '';
    }


    return name

      .trim()

      .split(/\s+/)

      .map(
        word =>
          word.charAt(0)
      )

      .slice(0, 2)

      .join('')

      .toUpperCase();
  }
}