import { Injectable } from '@angular/core';


/* =====================================================
   STATUT D'UNE EXPÉDITION
===================================================== */

export type ShipmentStatus =
  | 'preparing'
  | 'picked'
  | 'transit'
  | 'delivered'
  | 'problem'
  | 'cancelled';


/* =====================================================
   MODÈLE EXPÉDITION
===================================================== */

export interface Shipment {

  id: number;

  /* RELATION AVEC LA COMMANDE */
  orderId: string;
  orderNumber: string;


  /* IDENTIFICATION EXPÉDITION */
  reference: string;
  trackingNumber: string;


  /* STATUT */
  status: ShipmentStatus;


  /* DATES */
  createdAt: string;
  estimatedDelivery: string;


  /* TARIFICATION */
  price: number;
  currency: string;


  /* DESCRIPTION */
  description: string;


  /* TRAJET */
  origin: string;
  destination: string;


  /* ---------------------------------------------------
     COLIS
  --------------------------------------------------- */

  packages: number;

  weight: number;


  /* ---------------------------------------------------
     TRANSPORTEUR
  --------------------------------------------------- */

  carrier: string;

  service: string;


  /* ---------------------------------------------------
     EXPÉDITEUR
  --------------------------------------------------- */

  sender: {

    name: string;

    phone: string;

    address: string;

    city: string;

    country: string;

  };


  /* ---------------------------------------------------
     DESTINATAIRE
  --------------------------------------------------- */

  receiver: {

    name: string;

    phone: string;

    address: string;

    city: string;

    country: string;

  };

}


/* =====================================================
   SERVICE
===================================================== */

@Injectable({
  providedIn: 'root'
})
export class ShipmentStoreService {


  /* ===================================================
     DONNÉES DE DÉMONSTRATION
  =================================================== */

  private shipments: Shipment[] = [


    /* -------------------------------------------------
       EXPÉDITION 1
    ------------------------------------------------- */

    {
      id: 1,

      orderId: 'ORD-101',

      orderNumber: 'CMD-2026-001',

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
          'Aïssata Diallo',

        phone:
          '+223 76 12 34 56',

        address:
          'Hamdallaye ACI 2000',

        city:
          'Bamako',

        country:
          'Mali'

      }

    },


    /* -------------------------------------------------
       EXPÉDITION 2
    ------------------------------------------------- */

    {
      id: 2,

      orderId: 'ORD-102',

      orderNumber: 'CMD-2026-002',

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
          'Mamadou Traoré',

        phone:
          '+223 66 98 76 54',

        address:
          'Badalabougou',

        city:
          'Bamako',

        country:
          'Mali'

      }

    },


    /* -------------------------------------------------
       EXPÉDITION 3
    ------------------------------------------------- */

    {
      id: 3,

      orderId: 'ORD-103',

      orderNumber: 'CMD-2026-003',

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
          'Oumar Coulibaly',

        phone:
          '+223 70 11 22 33',

        address:
          'Faladié SEMA',

        city:
          'Bamako',

        country:
          'Mali'

      }

    },


    /* -------------------------------------------------
       EXPÉDITION 4
    ------------------------------------------------- */

    {
      id: 4,

      orderId: 'ORD-104',

      orderNumber: 'CMD-2026-004',

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
          'Fatoumata Keïta',

        phone:
          '+223 75 44 55 66',

        address:
          'Korofina Nord',

        city:
          'Bamako',

        country:
          'Mali'

      }

    },


    /* -------------------------------------------------
       EXPÉDITION 5
    ------------------------------------------------- */

    {
      id: 5,

      orderId: 'ORD-105',

      orderNumber: 'CMD-2026-005',

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


  /* ===================================================
     RÉCUPÉRER TOUTES LES EXPÉDITIONS
  =================================================== */

  getShipments(): Shipment[] {

    return this.shipments;

  }


  /* ===================================================
     RÉCUPÉRER UNE EXPÉDITION PAR ID
  =================================================== */

  getShipmentById(
    id: number
  ): Shipment | undefined {

    return this.shipments.find(
      shipment =>
        shipment.id === id
    );

  }


  /* ===================================================
     RÉCUPÉRER PAR NUMÉRO DE SUIVI
  =================================================== */

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


  /* ===================================================
     RÉCUPÉRER L'EXPÉDITION D'UNE COMMANDE
  =================================================== */

  getShipmentByOrderId(
    orderId: string
  ): Shipment | undefined {

    return this.shipments.find(
      shipment =>
        shipment.orderId === orderId
    );

  }


  /* ===================================================
     VÉRIFIER SI UNE COMMANDE POSSÈDE UNE EXPÉDITION
  =================================================== */

  hasShipment(
    orderId: string
  ): boolean {

    return this.shipments.some(
      shipment =>
        shipment.orderId === orderId
    );

  }


  /* ===================================================
     AJOUTER UNE EXPÉDITION
  =================================================== */

  addShipment(
    shipment: Shipment
  ): void {

    this.shipments.unshift(
      shipment
    );

  }


  /* ===================================================
     MODIFIER UNE EXPÉDITION
  =================================================== */

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


  /* ===================================================
     METTRE À JOUR LE STATUT
  =================================================== */

  updateShipmentStatus(
    id: number,
    status: ShipmentStatus
  ): boolean {

    const shipment =
      this.getShipmentById(id);


    if (!shipment) {

      return false;

    }


    shipment.status =
      status;


    return true;

  }


  /* ===================================================
     GÉNÉRER LE PROCHAIN ID
  =================================================== */

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


  /* ===================================================
     GÉNÉRER UNE RÉFÉRENCE D'EXPÉDITION
  =================================================== */

  generateReference(): string {

    const year =
      new Date()
        .getFullYear();


    const nextId =
      this.getNextId();


    return `B2WA-EXP-${year}-${String(nextId).padStart(5, '0')}`;

  }


  /* ===================================================
     GÉNÉRER UN NUMÉRO DE TRACKING
  =================================================== */

  generateTrackingNumber(): string {

    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';


    let code = '';


    for (
      let i = 0;
      i < 6;
      i++
    ) {

      code +=
        characters.charAt(
          Math.floor(
            Math.random() *
            characters.length
          )
        );

    }


    return `B2WA-ML-${code}`;

  }

}