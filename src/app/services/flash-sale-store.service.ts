import { Injectable } from '@angular/core';

export type FlashSaleStatus =
  | 'scheduled'
  | 'active'
  | 'ended'
  | 'cancelled';


export interface FlashSale {

  id: number;
  /* =====================================================
     COMMUNAUTÉ
  ====================================================== */
  communityId: string;
  communityName: string;
  /* =====================================================
     PRODUIT
  ====================================================== */
  productId: string;
  productName: string;
  productImage: string;
  /* =====================================================
     PRIX
  ====================================================== */
  originalPrice: number;
  flashPrice: number;
  currency: string;
  /* =====================================================
     STOCK
  ====================================================== */
  quantity: number;
  soldQuantity: number;
  /* =====================================================
     PÉRIODE
  ====================================================== */
  startDate: string;
  endDate: string;
  /* =====================================================
     ÉTAT
  ====================================================== */
  status: FlashSaleStatus;
  /* =====================================================
     INFORMATIONS
  ====================================================== */
  description: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlashSaleStoreService {

  /* =====================================================
     STOCKAGE
  ====================================================== */
  private readonly storageKey =
    'b2wa-flash-sales';
  /* =====================================================
     DONNÉES
  ====================================================== */
  private flashSales: FlashSale[] = [];
  /* =====================================================
     CONSTRUCTEUR
  ====================================================== */
  constructor() {

    this.load();

    this.refreshStatuses();
  }


  /* =====================================================
     CHARGER
  ====================================================== */

  private load(): void {

    const stored =
      localStorage.getItem(
        this.storageKey
      );


    if (!stored) {

      this.flashSales =
        this.getDemoFlashSales();

      this.save();

      return;
    }


    try {

      this.flashSales =
        JSON.parse(stored);

    } catch {

      this.flashSales =
        this.getDemoFlashSales();

      this.save();
    }
  }


  /* =====================================================
     SAUVEGARDER
  ====================================================== */

  private save(): void {

    localStorage.setItem(

      this.storageKey,

      JSON.stringify(
        this.flashSales
      )
    );
  }


  /* =====================================================
     ID SUIVANT
  ====================================================== */

  getNextId(): number {

    if (
      this.flashSales.length === 0
    ) {

      return 1;
    }


    return Math.max(

      ...this.flashSales.map(
        sale => sale.id
      )

    ) + 1;
  }


  /* =====================================================
     TOUTES LES VENTES FLASH
  ====================================================== */

  getAll(): FlashSale[] {

    this.refreshStatuses();

    return [...this.flashSales];
  }


  /* =====================================================
     VENTES FLASH D'UNE COMMUNAUTÉ
  ====================================================== */

  getByCommunity(
    communityId: string
  ): FlashSale[] {

    this.refreshStatuses();


    return this.flashSales.filter(

      sale =>
        sale.communityId === communityId
    );
  }


  /* =====================================================
     VENTE FLASH PAR ID
  ====================================================== */

  getById(
    id: number
  ): FlashSale | undefined {

    return this.flashSales.find(

      sale =>
        sale.id === id
    );
  }


  /* =====================================================
     CRÉER
  ====================================================== */

  add(
    flashSale: FlashSale
  ): void {

    this.flashSales.push(
      flashSale
    );

    this.save();
  }


  /* =====================================================
     MODIFIER
  ====================================================== */

  update(
    flashSale: FlashSale
  ): void {

    const index =
      this.flashSales.findIndex(

        sale =>
          sale.id === flashSale.id
      );


    if (
      index === -1
    ) {

      return;
    }


    this.flashSales[index] =
      flashSale;


    this.save();
  }


  /* =====================================================
     SUPPRIMER
  ====================================================== */

  delete(
    id: number
  ): void {

    this.flashSales =
      this.flashSales.filter(

        sale =>
          sale.id !== id
      );


    this.save();
  }


  /* =====================================================
     ANNULER
  ====================================================== */

  cancel(
    id: number
  ): void {

    const sale =
      this.getById(id);


    if (!sale) {

      return;
    }


    sale.status =
      'cancelled';


    this.save();
  }


  /* =====================================================
     STOCK RESTANT
  ====================================================== */

  getRemainingQuantity(
    sale: FlashSale
  ): number {

    return Math.max(

      0,

      sale.quantity -
      sale.soldQuantity
    );
  }


  /* =====================================================
     POURCENTAGE VENDU
  ====================================================== */

  getSoldPercentage(
    sale: FlashSale
  ): number {

    if (
      sale.quantity <= 0
    ) {

      return 0;
    }


    return Math.min(

      100,

      Math.round(

        (
          sale.soldQuantity /
          sale.quantity
        ) * 100
      )
    );
  }


  /* =====================================================
     RÉDUCTION
  ====================================================== */

  getDiscountPercentage(
    sale: FlashSale
  ): number {

    if (
      sale.originalPrice <= 0
    ) {

      return 0;
    }


    return Math.round(

      (
        1 -
        (
          sale.flashPrice /
          sale.originalPrice
        )
      ) * 100
    );
  }


  /* =====================================================
     ACTUALISER LES STATUTS
  ====================================================== */

  refreshStatuses(): void {

    const now =
      new Date();


    let changed = false;


    this.flashSales.forEach(

      sale => {

        if (
          sale.status === 'cancelled'
        ) {

          return;
        }


        const start =
          new Date(
            sale.startDate
          );


        const end =
          new Date(
            sale.endDate
          );


        let newStatus:
          FlashSaleStatus;


        if (
          now < start
        ) {

          newStatus =
            'scheduled';

        } else if (
          now >= start &&
          now <= end &&
          this.getRemainingQuantity(sale) > 0
        ) {

          newStatus =
            'active';

        } else {

          newStatus =
            'ended';
        }


        if (
          sale.status !== newStatus
        ) {

          sale.status =
            newStatus;

          changed = true;
        }
      }
    );


    if (changed) {

      this.save();
    }
  }


  /* =====================================================
     VENTES ACTIVES
  ====================================================== */

  getActive(): FlashSale[] {

    this.refreshStatuses();


    return this.flashSales.filter(

      sale =>
        sale.status === 'active'
    );
  }


  /* =====================================================
     VENTES PROGRAMMÉES
  ====================================================== */

  getScheduled(): FlashSale[] {

    this.refreshStatuses();


    return this.flashSales.filter(

      sale =>
        sale.status === 'scheduled'
    );
  }


  /* =====================================================
     VENTES TERMINÉES
  ====================================================== */

  getEnded(): FlashSale[] {

    this.refreshStatuses();


    return this.flashSales.filter(

      sale =>
        sale.status === 'ended'
    );
  }


  /* =====================================================
     STATISTIQUES
  ====================================================== */

  getStats() {

    this.refreshStatuses();


    const active =
      this.flashSales.filter(

        sale =>
          sale.status === 'active'
      );


    const sold =
      this.flashSales.reduce(

        (total, sale) =>
          total + sale.soldQuantity,

        0
      );


    const revenue =
      this.flashSales.reduce(

        (total, sale) =>
          total +
          (
            sale.flashPrice *
            sale.soldQuantity
          ),

        0
      );


    const endingSoon =
      active.filter(

        sale => {

          const end =
            new Date(
              sale.endDate
            );


          const hours =
            (
              end.getTime() -
              Date.now()
            ) /
            (
              1000 *
              60 *
              60
            );


          return (
            hours > 0 &&
            hours <= 24
          );
        }
      );


    return {

      activeCount:
        active.length,

      soldQuantity:
        sold,

      revenue,

      endingSoonCount:
        endingSoon.length
    };
  }


  /* =====================================================
     DONNÉES DE DÉMONSTRATION
  ====================================================== */

  private getDemoFlashSales():
    FlashSale[] {

    const now =
      new Date();


    const activeStart =
      new Date(
        now.getTime() -
        2 *
        60 *
        60 *
        1000
      );


    const activeEnd =
      new Date(
        now.getTime() +
        8 *
        60 *
        60 *
        1000
      );


    const scheduledStart =
      new Date(
        now.getTime() +
        24 *
        60 *
        60 *
        1000
      );


    const scheduledEnd =
      new Date(
        now.getTime() +
        48 *
        60 *
        60 *
        1000
      );


    return [

      {

        id: 1,

        communityId:
          'community-1',

        communityName:
          'Tech & Électronique Mali',


        productId:
          'product-101',

        productName:
          'Samsung Galaxy A25',

        productImage:
          'https://i.pinimg.com/1200x/6d/c6/d8/6dc6d88ba7dd3269e93c1ff0c66fdb49.jpg',


        originalPrice:
          250000,

        flashPrice:
          175000,

        currency:
          'FCFA',


        quantity:
          20,

        soldQuantity:
          14,


        startDate:
          activeStart.toISOString(),

        endDate:
          activeEnd.toISOString(),


        status:
          'active',


        description:
          'Offre exceptionnelle réservée aux membres de la communauté.',


        createdAt:
          now.toISOString()
      },


      {

        id: 2,

        communityId:
          'community-1',

        communityName:
          'Tech & Électronique Mali',


        productId:
          'product-102',

        productName:
          'Écouteurs Bluetooth Pro',

        productImage:
          'https://i.pinimg.com/1200x/b9/e8/3e/b9e83e1fa44fd089331df40f8382b7d2.jpg',


        originalPrice:
          45000,

        flashPrice:
          29900,

        currency:
          'FCFA',


        quantity:
          30,

        soldQuantity:
          9,


        startDate:
          scheduledStart.toISOString(),

        endDate:
          scheduledEnd.toISOString(),


        status:
          'scheduled',


        description:
          'Vente flash programmée pour les membres.',


        createdAt:
          now.toISOString()
      }

    ];
  }
}