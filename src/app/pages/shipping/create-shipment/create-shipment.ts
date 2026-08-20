import {
  Component
} from '@angular/core';


import {
  CommonModule
} from '@angular/common';


import {
  FormsModule
} from '@angular/forms';


import {
  Router
} from '@angular/router';


import {
  Shipment,
  ShipmentStoreService
} from '../../../services/shipment-store.service';


@Component({
  selector: 'app-create-shipment',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './create-shipment.html',

  styleUrl: './create-shipment.css'
})
export class CreateShipmentComponent {


  /* =====================================================
     FORMULAIRE
  ====================================================== */

  shipment = {

    reference: '',

    packageType: '',

    quantity: 1,

    weight: 0,

    value: 0,

    description: '',

    transport: 'Route',

    service: 'Standard',

    shippingDate: '',


    sender: {

      name: '',

      phone: '',

      address: '',

      city: '',

      country: ''
    },


    receiver: {

      name: '',

      phone: '',

      address: '',

      city: '',

      country: ''
    }
  };


  /* =====================================================
     ÉTAT
  ====================================================== */

  submitting = false;

  errorMessage = '';

  successMessage = '';

  showSuccessModal = false;

  trackingCopied = false;


  /* =====================================================
     DONNÉES APRÈS CRÉATION
  ====================================================== */

  createdShipment = {

    id: 0,

    trackingNumber: '',

    reference: '',

    route: '',

    quantity: 0,

    transport: '',

    service: '',

    cost: 0
  };


  /* =====================================================
     CONSTRUCTEUR
  ====================================================== */

  constructor(

    private router: Router,

    private shipmentStore:
      ShipmentStoreService

  ) {}


  /* =====================================================
     PRIX ESTIMÉ
  ====================================================== */

  get estimatedCost(): number {

    const weight =
      Number(this.shipment.weight) || 0;


    const quantity =
      Number(this.shipment.quantity) || 1;


    let pricePerKg = 1500;


    if (
      this.shipment.service === 'Express'
    ) {

      pricePerKg = 2500;
    }


    if (
      this.shipment.service === 'Prioritaire'
    ) {

      pricePerKg = 3500;
    }


    let transportMultiplier = 1;


    if (
      this.shipment.transport === 'Aérien'
    ) {

      transportMultiplier = 1.8;
    }


    if (
      this.shipment.transport === 'Maritime'
    ) {

      transportMultiplier = 0.8;
    }


    const weightCost =
      weight *
      pricePerKg *
      transportMultiplier;


    const quantityCost =
      Math.max(
        0,
        quantity - 1
      ) * 1000;


    return Math.max(

      2500,

      Math.round(
        weightCost + quantityCost
      )
    );
  }


  /* =====================================================
     VALIDATION
  ====================================================== */

  get canCreateShipment(): boolean {

    return (

      this.shipment.sender.name.trim().length > 0 &&

      this.shipment.sender.phone.trim().length > 0 &&

      this.shipment.sender.city.trim().length > 0 &&

      this.shipment.sender.country.trim().length > 0 &&

      this.shipment.receiver.name.trim().length > 0 &&

      this.shipment.receiver.phone.trim().length > 0 &&

      this.shipment.receiver.city.trim().length > 0 &&

      this.shipment.receiver.country.trim().length > 0 &&

      this.shipment.packageType.trim().length > 0 &&

      Number(this.shipment.quantity) >= 1 &&

      Number(this.shipment.weight) > 0 &&

      Number(this.shipment.value) >= 0 &&

      this.shipment.transport.trim().length > 0 &&

      this.shipment.service.trim().length > 0 &&

      this.shipment.shippingDate.trim().length > 0
    );
  }


  /* =====================================================
     SÉLECTION TRANSPORT
  ====================================================== */

  selectTransport(
    transport: 'Route' | 'Aérien' | 'Maritime'
  ): void {

    this.shipment.transport =
      transport;
  }


  /* =====================================================
     NETTOYAGE TEXTE
  ====================================================== */

  private cleanText(
    value: string | null | undefined
  ): string {

    return String(
      value || ''
    ).trim();
  }


  /* =====================================================
     NUMÉRO DE SUIVI
  ====================================================== */

  private generateTrackingNumber(): string {

    const randomPart =

      Math.random()

        .toString(36)

        .substring(2, 8)

        .toUpperCase();


    return `B2WA-ML-${randomPart}`;
  }


  /* =====================================================
     RÉFÉRENCE
  ====================================================== */

  private generateReference(
    id: number
  ): string {

    const year =
      new Date().getFullYear();


    return (

      this.cleanText(
        this.shipment.reference
      ) ||

      `B2WA-EXP-${year}-${String(
        id
      ).padStart(5, '0')}`
    );
  }


  /* =====================================================
     DATE DE CRÉATION
  ====================================================== */

  private getCreatedAt(): string {

    return new Date().toLocaleDateString(

      'fr-FR',

      {
        day: 'numeric',

        month: 'long',

        year: 'numeric'
      }
    );
  }


  /* =====================================================
     DATE MINIMALE
  ====================================================== */

  getTodayForInput(): string {

    const today =
      new Date();


    const year =
      today.getFullYear();


    const month =
      String(
        today.getMonth() + 1
      ).padStart(
        2,
        '0'
      );


    const day =
      String(
        today.getDate()
      ).padStart(
        2,
        '0'
      );


    return `${year}-${month}-${day}`;
  }


  /* =====================================================
     CRÉATION DE L'EXPÉDITION
  ====================================================== */

  createShipment(): void {

    this.errorMessage = '';

    this.successMessage = '';

    this.trackingCopied = false;


    if (
      !this.canCreateShipment
    ) {

      this.errorMessage =

        'Veuillez remplir tous les champs obligatoires avant de continuer.';

      return;
    }


    this.submitting = true;


    const id =
      this.shipmentStore.getNextId();


    const trackingNumber =
      this.generateTrackingNumber();


    const reference =
      this.generateReference(
        id
      );


    const createdAt =
      this.getCreatedAt();


    const shipmentToStore: Shipment = {

      id,

      reference,

      trackingNumber,

      status:
        'preparing',

      createdAt,

      estimatedDelivery:
        this.shipment.shippingDate,

      price:
        this.estimatedCost,

      currency:
        'FCFA',

      description:
        this.cleanText(
          this.shipment.description
        ) ||

        `Expédition de ${
          this.shipment.packageType
        }.`,

      origin:
        this.cleanText(
          this.shipment.sender.city
        ),

      destination:
        this.cleanText(
          this.shipment.receiver.city
        ),

      packages:
        Number(
          this.shipment.quantity
        ),

      weight:
        Number(
          this.shipment.weight
        ),

      carrier:
        'B2WA Shipping',

      service:
        this.cleanText(
          this.shipment.service
        ),


      sender: {

        name:
          this.cleanText(
            this.shipment.sender.name
          ),

        phone:
          this.cleanText(
            this.shipment.sender.phone
          ),

        address:
          this.cleanText(
            this.shipment.sender.address
          ),

        city:
          this.cleanText(
            this.shipment.sender.city
          ),

        country:
          this.cleanText(
            this.shipment.sender.country
          )
      },


      receiver: {

        name:
          this.cleanText(
            this.shipment.receiver.name
          ),

        phone:
          this.cleanText(
            this.shipment.receiver.phone
          ),

        address:
          this.cleanText(
            this.shipment.receiver.address
          ),

        city:
          this.cleanText(
            this.shipment.receiver.city
          ),

        country:
          this.cleanText(
            this.shipment.receiver.country
          )
      }
    };


    this.shipmentStore.addShipment(
      shipmentToStore
    );


    this.createdShipment = {

      id:
        shipmentToStore.id,

      trackingNumber:
        shipmentToStore.trackingNumber,

      reference:
        shipmentToStore.reference,

      route:
        `${shipmentToStore.origin} → ${shipmentToStore.destination}`,

      quantity:
        shipmentToStore.packages,

      transport:
        this.shipment.transport,

      service:
        shipmentToStore.service,

      cost:
        shipmentToStore.price
    };


    this.successMessage =
      'Expédition créée avec succès.';

    this.submitting = false;

    this.showSuccessModal = true;
  }


  /* =====================================================
     BROUILLON
  ====================================================== */

  saveDraft(): void {

    localStorage.setItem(

      'b2wa-shipment-draft',

      JSON.stringify(
        this.shipment
      )
    );


    this.successMessage =
      'Votre brouillon a été enregistré.';

    this.errorMessage = '';
  }


  /* =====================================================
     CHARGER LE BROUILLON
  ====================================================== */

  loadDraft(): void {

    const draft =
      localStorage.getItem(
        'b2wa-shipment-draft'
      );


    if (!draft) {
      return;
    }


    try {

      const savedShipment =
        JSON.parse(
          draft
        );


      this.shipment = {

        ...this.shipment,

        ...savedShipment,

        sender: {

          ...this.shipment.sender,

          ...savedShipment.sender
        },

        receiver: {

          ...this.shipment.receiver,

          ...savedShipment.receiver
        }
      };

    } catch {

      localStorage.removeItem(
        'b2wa-shipment-draft'
      );
    }
  }


  /* =====================================================
     FERMER LA MODALE
  ====================================================== */

  closeSuccessModal(): void {

    this.showSuccessModal = false;

    this.trackingCopied = false;
  }


  /* =====================================================
     COPIER LE SUIVI
  ====================================================== */

  async copyTrackingNumber(): Promise<void> {

    const trackingNumber =
      this.createdShipment.trackingNumber;


    if (
      !trackingNumber ||
      !navigator.clipboard
    ) {
      return;
    }


    try {

      await navigator.clipboard.writeText(
        trackingNumber
      );


      this.trackingCopied = true;


      window.setTimeout(
        () => {

          this.trackingCopied = false;
        },

        2500
      );

    } catch {

      this.errorMessage =
        'Impossible de copier le numéro de suivi.';
    }
  }


  /* =====================================================
     VOIR L'EXPÉDITION
  ====================================================== */

  viewShipment(): void {

    if (
      !this.createdShipment.id
    ) {
      return;
    }


    this.showSuccessModal = false;


    this.router.navigate([

      '/dashboard/shipment-detail',

      this.createdShipment.id
    ]);
  }


  /* =====================================================
     RETOUR
  ====================================================== */

  goBack(): void {

    this.router.navigate([

      '/dashboard/shipping'
    ]);
  }
}