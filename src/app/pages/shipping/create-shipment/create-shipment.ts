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
  ShipmentStoreService
} from '../../../services/shipment-store.service';

import {
  OrderStoreService,
  Order
} from '../../../services/order-store.service';


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
export class CreateShipmentComponent
  implements OnInit {


  /* =====================================================
     COMMANDE À L'ORIGINE DE L'EXPÉDITION
  ====================================================== */

  orderId: string = '';

  orderNumber: string = '';

  currentOrder: Order | null = null;


  /* =====================================================
     FORMULAIRE
  ====================================================== */

  shipment = {

    reference: '',

    packageType: 'Colis Standard',

    quantity: 1,

    weight: 1,

    value: 0,

    description: '',

    transport: 'Route',

    service: 'Standard',

    shippingDate: '',


    sender: {

      name: 'B2WA Fournisseur',

      phone: '+223 70 00 00 01',

      address: 'Hamdallaye ACI 2000',

      city: 'Bamako',

      country: 'Mali'

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
     EXPÉDITION CRÉÉE
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

    private route: ActivatedRoute,

    private router: Router,

    private shipmentStore: ShipmentStoreService,

    private orderStore: OrderStoreService

  ) {}

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
     INIT
  ====================================================== */

  ngOnInit(): void {

    this.orderId =

      this.route.snapshot.paramMap.get(

        'orderId'

      ) || '';


    if (!this.orderId) {

      this.errorMessage =

        'Aucune commande n’a été associée à cette expédition.';

      return;

    }


    /*

     * Charger la commande depuis le OrderStoreService

     */

    this.loadOrderFromService(this.orderId);


    /*

     * Date du jour par défaut.

     */

    this.shipment.shippingDate =

      this.getTodayForInput();


    /*

     * Charger un éventuel brouillon sauvegardé

     */

    this.loadDraft();

  }


  /* =====================================================
     CHARGER LA COMMANDE DEPUIS LE SERVICE
  ====================================================== */

  private loadOrderFromService(orderId: string): void {

    const order = this.orderStore.getOrderById(orderId);


    if (!order) {

      this.orderNumber = `Commande #${orderId}`;

      return;

    }


    this.currentOrder = order;

    this.orderNumber = order.orderNumber || `Commande #${order.id}`;


    // Auto-remplissage à partir des données réelles de la commande du service

    this.shipment.value = order.totalAmount || 0;


    // Extraction de la ville depuis l'adresse du client

    const addressParts = (order.customerAddress || '').split(',');

    const extractedCity = addressParts.length > 1 

      ? addressParts[addressParts.length - 1].trim() 

      : (order.customerCity || 'Bamako');


    this.shipment.receiver = {

      name: order.customerName || '',

      phone: order.customerPhone || '',

      address: order.customerAddress || '',

      city: extractedCity,

      country: order.customerCountry || 'Mali'

    };


    // Description et quantité calculées dynamiquement selon les articles de la commande

    if (order.items && order.items.length > 0) {

      const itemsSummary = order.items.map((item: any) => `${item.productName} (x${item.quantity})`).join(', ');

      this.shipment.description = `Articles de la commande ${this.orderNumber} : ${itemsSummary}`;

      this.shipment.quantity = order.items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);

    }

  }


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

      !!this.orderId &&

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
     TRANSPORT
  ====================================================== */

  selectTransport(

    transport:

      'Route' |

      'Aérien' |

      'Maritime'

  ): void {

    this.shipment.transport =

      transport;

  }


  /* =====================================================
     NETTOYAGE
  ====================================================== */

  private cleanText(

    value:

      string |

      null |

      undefined

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
     RÉFÉRENCE EXPÉDITION
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

      ).padStart(

        5,

        '0'

      )}`

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
     DATE POUR INPUT
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
     CRÉATION EXPÉDITION
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

      orderId:

        this.orderId,

      orderNumber:

        this.orderNumber,


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

        `Expédition de ${this.shipment.packageType}.`,

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


    localStorage.removeItem(

      'b2wa-shipment-draft'

    );

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
     CHARGER BROUILLON
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
     FERMER MODALE
  ====================================================== */

  closeSuccessModal(): void {

    this.showSuccessModal = false;

    this.trackingCopied = false;

  }


  /* =====================================================
     COPIER TRACKING
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
     VOIR EXPÉDITION
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

    if (this.orderId) {

      this.router.navigate([

        '/dashboard/orders'

      ]);

      return;

    }


    this.router.navigate([

      '/dashboard/shipping'

    ]);

  }

}