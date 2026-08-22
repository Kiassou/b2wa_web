import { Injectable } from '@angular/core';


/* =====================================================
   STATUTS D'EXPÉDITION
===================================================== */

export type ShipmentStatus =
  | 'preparing'
  | 'picked'
  | 'transit'
  | 'delivered'
  | 'problem'
  | 'cancelled';


/* =====================================================
   PERSONNE / ENTREPRISE
===================================================== */

export interface ShipmentPerson {

  name: string;

  phone: string;

  address: string;

  city: string;

  country: string;
}


/* =====================================================
   EXPÉDITION
===================================================== */

export interface Shipment {

  id: number;

  orderId: string;

  orderNumber: string;

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

  sender: ShipmentPerson;

  receiver: ShipmentPerson;
}


/* =====================================================
   SERVICE
===================================================== */

@Injectable({
  providedIn: 'root'
})
export class ShipmentStoreService {


  /* =====================================================
     STOCKAGE
  ====================================================== */

  private shipments: Shipment[] = [

    /* ===================================================
       EXPÉDITION DEMO 1
       BAMAKO → DAKAR
    ==================================================== */

    {
      id: 1,

      orderId: 'ORD-2026-001',

      orderNumber: 'B2WA-CMD-001',

      reference: 'B2WA-EXP-2026-00001',

      trackingNumber: 'B2WA-ML-8F42K9',

      status: 'transit',

      createdAt: '17 août 2026',

      estimatedDelivery: '22 août 2026',

      price: 45000,

      currency: 'FCFA',

      description:
        'Produits textiles et accessoires de mode.',

      origin: 'Bamako',

      destination: 'Dakar',

      packages: 3,

      weight: 12,

      carrier: 'B2WA Shipping',

      service: 'Express',

      sender: {

        name: 'B2WA Commerce',

        phone: '+223 70 00 00 01',

        address: 'Hamdallaye ACI 2000',

        city: 'Bamako',

        country: 'Mali'
      },

      receiver: {

        name: 'Sénégal Distribution',

        phone: '+221 77 00 00 01',

        address: 'Plateau, Dakar',

        city: 'Dakar',

        country: 'Sénégal'
      }
    },


    /* ===================================================
       EXPÉDITION DEMO 2
       BAMAKO → ABIDJAN
    ==================================================== */

    {
      id: 2,

      orderId: 'ORD-2026-002',

      orderNumber: 'B2WA-CMD-002',

      reference: 'B2WA-EXP-2026-00002',

      trackingNumber: 'B2WA-ML-P7X3Q2',

      status: 'delivered',

      createdAt: '10 août 2026',

      estimatedDelivery: '16 août 2026',

      price: 32500,

      currency: 'FCFA',

      description:
        'Accessoires électroniques et petits équipements.',

      origin: 'Bamako',

      destination: 'Abidjan',

      packages: 2,

      weight: 8,

      carrier: 'B2WA Shipping',

      service: 'Standard',

      sender: {

        name: 'Tech Mali',

        phone: '+223 70 00 00 02',

        address: 'ACI 2000',

        city: 'Bamako',

        country: 'Mali'
      },

      receiver: {

        name: 'Abidjan Tech Store',

        phone: '+225 07 00 00 01',

        address: 'Cocody',

        city: 'Abidjan',

        country: 'Côte d\'Ivoire'
      }
    }

  ];


  /* =====================================================
     CONSTRUCTEUR
  ====================================================== */

  constructor() {

    this.loadFromStorage();
  }


  /* =====================================================
     RÉCUPÉRER TOUTES LES EXPÉDITIONS
  ====================================================== */

  getShipments(): Shipment[] {

    return [
      ...this.shipments
    ];
  }


  /* =====================================================
     RÉCUPÉRER UNE EXPÉDITION PAR ID
  ====================================================== */

  getShipmentById(
    id: number
  ): Shipment | undefined {

    return this.shipments.find(

      shipment =>
        shipment.id === Number(id)
    );
  }


  /* =====================================================
     RÉCUPÉRER PAR ORDER ID
  ====================================================== */

  getShipmentByOrderId(
    orderId: string
  ): Shipment | undefined {

    const normalizedId =
      String(orderId)
        .trim()
        .toUpperCase();


    return this.shipments.find(

      shipment =>
        shipment.orderId
          .toUpperCase() === normalizedId
    );
  }


  /* =====================================================
     RÉCUPÉRER PAR ORDER NUMBER
  ====================================================== */

  getShipmentByOrderNumber(
    orderNumber: string
  ): Shipment | undefined {

    const normalizedNumber =
      String(orderNumber)
        .trim()
        .toUpperCase();


    return this.shipments.find(

      shipment =>
        shipment.orderNumber
          .toUpperCase() === normalizedNumber
    );
  }


  /* =====================================================
     RECHERCHE PAR NUMÉRO DE SUIVI
  ====================================================== */

findByTrackingNumber(trackingNumber: string): Shipment | null {
  if (!trackingNumber) return null;

  const target = trackingNumber.trim().toUpperCase();

  return this.shipments.find(s => 
    s.trackingNumber?.trim().toUpperCase() === target ||
    s.id?.toString().trim().toUpperCase() === target
  ) || null;
}


  /* =====================================================
     AJOUTER UNE EXPÉDITION
  ====================================================== */

  addShipment(
    shipment: Shipment
  ): void {

    this.shipments.push(
      shipment
    );

    this.saveToStorage();
  }


  /* =====================================================
     MODIFIER UNE EXPÉDITION
  ====================================================== */

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
      {
        ...shipment
      };


    this.saveToStorage();
  }


  /* =====================================================
     SUPPRIMER UNE EXPÉDITION
  ====================================================== */

  deleteShipment(
    id: number
  ): void {

    this.shipments =
      this.shipments.filter(

        shipment =>
          shipment.id !== Number(id)
      );


    this.saveToStorage();
  }


  /* =====================================================
     PROCHAIN ID
  ====================================================== */

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


  /* =====================================================
     COMPTER LES EXPÉDITIONS
  ====================================================== */

  getShipmentCount(): number {

    return this.shipments.length;
  }


  /* =====================================================
     EXPÉDITIONS PAR STATUT
  ====================================================== */

  getShipmentsByStatus(
    status: ShipmentStatus
  ): Shipment[] {

    return this.shipments.filter(

      shipment =>
        shipment.status === status
    );
  }


  /* =====================================================
     CHANGER LE STATUT
  ====================================================== */

  updateStatus(
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


    this.saveToStorage();


    return true;
  }


  /* =====================================================
     STORAGE
  ====================================================== */

  private readonly storageKey =
    'b2wa-shipments';


  /* =====================================================
     SAUVEGARDER
  ====================================================== */

  private saveToStorage(): void {

    try {

      localStorage.setItem(

        this.storageKey,

        JSON.stringify(
          this.shipments
        )
      );

    } catch {

      console.warn(
        'Impossible de sauvegarder les expéditions.'
      );
    }
  }


  /* =====================================================
     CHARGER
  ====================================================== */

  private loadFromStorage(): void {

    try {

      const stored =
        localStorage.getItem(
          this.storageKey
        );


      if (!stored) {

        return;
      }


      const parsed =
        JSON.parse(stored);


      if (
        !Array.isArray(parsed)
      ) {

        return;
      }


      this.shipments =
        parsed;

    } catch {

      console.warn(
        'Impossible de charger les expéditions sauvegardées.'
      );
    }
  }


  /* =====================================================
     RÉINITIALISER LES DONNÉES DE TEST
  ====================================================== */

  resetDemoData(): void {

    this.shipments = [

      {
        id: 1,

        orderId: 'ORD-2026-001',

        orderNumber: 'B2WA-CMD-001',

        reference: 'B2WA-EXP-2026-00001',

        trackingNumber: 'B2WA-ML-8F42K9',

        status: 'transit',

        createdAt: '17 août 2026',

        estimatedDelivery: '22 août 2026',

        price: 45000,

        currency: 'FCFA',

        description:
          'Produits textiles et accessoires de mode.',

        origin: 'Bamako',

        destination: 'Dakar',

        packages: 3,

        weight: 12,

        carrier: 'B2WA Shipping',

        service: 'Express',

        sender: {

          name: 'B2WA Commerce',

          phone: '+223 70 00 00 01',

          address: 'Hamdallaye ACI 2000',

          city: 'Bamako',

          country: 'Mali'
        },

        receiver: {

          name: 'Sénégal Distribution',

          phone: '+221 77 00 00 01',

          address: 'Plateau, Dakar',

          city: 'Dakar',

          country: 'Sénégal'
        }
      },


      {
        id: 2,

        orderId: 'ORD-2026-002',

        orderNumber: 'B2WA-CMD-002',

        reference: 'B2WA-EXP-2026-00002',

        trackingNumber: 'B2WA-ML-P7X3Q2',

        status: 'delivered',

        createdAt: '10 août 2026',

        estimatedDelivery: '16 août 2026',

        price: 32500,

        currency: 'FCFA',

        description:
          'Accessoires électroniques et petits équipements.',

        origin: 'Bamako',

        destination: 'Abidjan',

        packages: 2,

        weight: 8,

        carrier: 'B2WA Shipping',

        service: 'Standard',

        sender: {

          name: 'Tech Mali',

          phone: '+223 70 00 00 02',

          address: 'ACI 2000',

          city: 'Bamako',

          country: 'Mali'
        },

        receiver: {

          name: 'Abidjan Tech Store',

          phone: '+225 07 00 00 01',

          address: 'Cocody',

          city: 'Abidjan',

          country: 'Côte d\'Ivoire'
        }
      }

    ];


    this.saveToStorage();
  }
}