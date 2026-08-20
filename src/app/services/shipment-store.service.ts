import {
  Injectable
} from '@angular/core';


export type ShipmentStatus =
  | 'preparing'
  | 'picked'
  | 'transit'
  | 'delivered'
  | 'problem'
  | 'cancelled';


export interface Shipment {

  id: number;

  reference: string;

  trackingNumber: string;

  status: ShipmentStatus;

  createdAt: string;

  estimatedDelivery: string;

  price: number;

  currency: string;

  description: string;

  origin: string;

  destination: string;

  packages: number;

  weight: number;

  carrier: string;

  service: string;


  sender: {

    name: string;

    phone: string;

    address: string;

    city: string;

    country: string;
  };


  receiver: {

    name: string;

    phone: string;

    address: string;

    city: string;

    country: string;
  };
}


@Injectable({
  providedIn: 'root'
})
export class ShipmentStoreService {


  private shipments: Shipment[] = [

    {
      id: 1,

      reference:
        'B2WA-EXP-2026-00001',

      trackingNumber:
        'B2WA-ML-8F42K9',

      status:
        'transit',

      createdAt:
        '18 août 2026',

      estimatedDelivery:
        '22 août 2026',

      price:
        28500,

      currency:
        'FCFA',

      description:
        'Expédition de marchandises commerciales à destination d’Abidjan.',

      origin:
        'Bamako 🇲🇱',

      destination:
        'Abidjan 🇨🇮',

      packages:
        3,

      weight:
        12,

      carrier:
        'B2WA Express',

      service:
        'Express',


      sender: {

        name:
          'Mali Commerce SARL',

        phone:
          '+223 70 00 00 01',

        address:
          'Hamdallaye ACI 2000',

        city:
          'Bamako',

        country:
          'Mali'
      },


      receiver: {

        name:
          'Awa Traoré',

        phone:
          '+225 07 00 00 01',

        address:
          'Cocody Angré',

        city:
          'Abidjan',

        country:
          'Côte d’Ivoire'
      }
    },


    {
      id: 2,

      reference:
        'B2WA-EXP-2026-00002',

      trackingNumber:
        'B2WA-ML-91KD72',

      status:
        'preparing',

      createdAt:
        '19 août 2026',

      estimatedDelivery:
        '20 août 2026',

      price:
        7500,

      currency:
        'FCFA',

      description:
        'Petite expédition locale entre Ségou et Bamako.',

      origin:
        'Ségou 🇲🇱',

      destination:
        'Bamako 🇲🇱',

      packages:
        1,

      weight:
        4,

      carrier:
        'B2WA Standard',

      service:
        'Standard',


      sender: {

        name:
          'Moussa Koné',

        phone:
          '+223 76 00 00 02',

        address:
          'Quartier administratif',

        city:
          'Ségou',

        country:
          'Mali'
      },


      receiver: {

        name:
          'Moussa Koné',

        phone:
          '+223 76 00 00 02',

        address:
          'ACI 2000',

        city:
          'Bamako',

        country:
          'Mali'
      }
    },


    {
      id: 3,

      reference:
        'B2WA-EXP-2026-00003',

      trackingNumber:
        'B2WA-ML-72PQ41',

      status:
        'delivered',

      createdAt:
        '13 août 2026',

      estimatedDelivery:
        '18 août 2026',

      price:
        19000,

      currency:
        'FCFA',

      description:
        'Expédition livrée au destinataire à Ouagadougou.',

      origin:
        'Bamako 🇲🇱',

      destination:
        'Ouagadougou 🇧🇫',

      packages:
        2,

      weight:
        7.5,

      carrier:
        'B2WA Express',

      service:
        'Express',


      sender: {

        name:
          'B2WA Market',

        phone:
          '+223 70 00 00 03',

        address:
          'Djelibougou',

        city:
          'Bamako',

        country:
          'Mali'
      },


      receiver: {

        name:
          'Fatoumata Diallo',

        phone:
          '+226 70 00 00 03',

        address:
          'Zone du Bois',

        city:
          'Ouagadougou',

        country:
          'Burkina Faso'
      }
    },


    {
      id: 4,

      reference:
        'B2WA-EXP-2026-00004',

      trackingNumber:
        'B2WA-ML-5HX812',

      status:
        'transit',

      createdAt:
        '17 août 2026',

      estimatedDelivery:
        '25 août 2026',

      price:
        42000,

      currency:
        'FCFA',

      description:
        'Transport de plusieurs colis vers Dakar.',

      origin:
        'Koulikoro 🇲🇱',

      destination:
        'Dakar 🇸🇳',

      packages:
        4,

      weight:
        18,

      carrier:
        'B2WA Cargo',

      service:
        'Cargo',


      sender: {

        name:
          'Koulikoro Distribution',

        phone:
          '+223 70 00 00 04',

        address:
          'Centre-ville',

        city:
          'Koulikoro',

        country:
          'Mali'
      },


      receiver: {

        name:
          'Ibrahima Ba',

        phone:
          '+221 77 00 00 04',

        address:
          'Plateau',

        city:
          'Dakar',

        country:
          'Sénégal'
      }
    },


    {
      id: 5,

      reference:
        'B2WA-EXP-2026-00005',

      trackingNumber:
        'B2WA-ML-3LK921',

      status:
        'problem',

      createdAt:
        '16 août 2026',

      estimatedDelivery:
        'À confirmer',

      price:
        12500,

      currency:
        'FCFA',

      description:
        'Expédition temporairement bloquée à cause d’un problème de transport.',

      origin:
        'Bamako 🇲🇱',

      destination:
        'Conakry 🇬🇳',

      packages:
        1,

      weight:
        3,

      carrier:
        'B2WA Cargo',

      service:
        'Cargo',


      sender: {

        name:
          'Bamako Store',

        phone:
          '+223 70 00 00 05',

        address:
          'Badalabougou',

        city:
          'Bamako',

        country:
          'Mali'
      },


      receiver: {

        name:
          'Aminata Camara',

        phone:
          '+224 62 00 00 05',

        address:
          'Kaloum',

        city:
          'Conakry',

        country:
          'Guinée'
      }
    }
  ];


  getShipments(): Shipment[] {

    return this.shipments;
  }


  getShipmentById(
    id: number
  ): Shipment | undefined {

    return this.shipments.find(
      shipment =>
        shipment.id === id
    );
  }


  findByTrackingNumber(
    trackingNumber: string
  ): Shipment | undefined {

    const value =
      trackingNumber
        .trim()
        .toUpperCase();


    return this.shipments.find(
      shipment =>
        shipment.trackingNumber
          .toUpperCase() === value
    );
  }


  addShipment(
    shipment: Shipment
  ): void {

    this.shipments.unshift(
      shipment
    );
  }


  updateShipment(
    shipment: Shipment
  ): void {

    const index =
      this.shipments.findIndex(
        item =>
          item.id === shipment.id
      );


    if (index === -1) {
      return;
    }


    this.shipments[index] =
      shipment;
  }


  getNextId(): number {

    if (
      this.shipments.length === 0
    ) {
      return 1;
    }


    return Math.max(
      ...this.shipments.map(
        shipment =>
          shipment.id
      )
    ) + 1;
  }
}