import {
  Component,
  OnInit,
  ChangeDetectorRef
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
  ShipmentStatus,
  ShipmentStoreService
} from '../../services/shipment-store.service';


export type OrderStatus =
  | 'CONFIRMED'
  | 'IN_SHIPMENT'
  | 'DELIVERED'
  | 'CANCELLED';


export type PaymentStatus =
  | 'PAID'
  | 'UNPAID'
  | 'REFUNDED';


export type PaymentMethod =
  | 'ORANGE_MONEY'
  | 'WAVE'
  | 'CASH'
  | 'CARTE';


export interface OrderItem {

  id: string;

  productName: string;

  quantity: number;

  unitPrice: number;
}


export interface Order {

  id: string;

  orderNumber: string;

  customerName: string;

  customerPhone: string;

  customerAddress: string;

  items: OrderItem[];

  totalAmount: number;

  status: OrderStatus;

  paymentStatus: PaymentStatus;

  paymentMethod: PaymentMethod;

  createdAt: Date;

  notes?: string;
}


interface ToastState {

  visible: boolean;

  type: 'success' | 'warning' | 'error';

  title: string;

  message: string;

  icon: string;
}


@Component({

  selector: 'app-orders',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './orders.html',

  styleUrls: ['./orders.css']

})
export class OrdersComponent
  implements OnInit {


  constructor(

    private readonly cdr: ChangeDetectorRef,

    private readonly router: Router,

    private readonly shipmentStore: ShipmentStoreService

  ) {}


  orders: Order[] = [];

  filteredOrders: Order[] = [];

  paginatedOrders: Order[] = [];


  /* =========================
     FILTRES
  ========================= */

  searchQuery = '';

  selectedStatus = 'ALL';

  selectedPaymentStatus = 'ALL';


  /* =========================
     PAGINATION
  ========================= */

  currentPage = 1;

  itemsPerPage = 8;

  readonly pageSizeOptions =
    [5, 8, 12, 20];


  /* =========================
     ACTION MENU
  ========================= */

  openActionMenuId:
    string | null = null;


  /* =========================
     DETAIL MODAL
  ========================= */

  isDetailModalOpen = false;

  selectedOrder:
    Order | null = null;


  /* =========================
     TOAST
  ========================= */

  toast: ToastState = {

    visible: false,

    type: 'success',

    title: '',

    message: '',

    icon: 'check_circle'

  };


  private toastTimeout:
    ReturnType<typeof setTimeout> | null = null;


  /* =========================
     INIT
  ========================= */

  ngOnInit(): void {

    this.loadMockOrders();

    this.applyFilters();

  }


  /* =========================
     REFRESH
  ========================= */

  private refreshView(): void {

    this.cdr.markForCheck();

    this.cdr.detectChanges();

  }


  /* =========================
     MOCK ORDERS
  ========================= */

  loadMockOrders(): void {

    this.orders = [

      {

        id: 'ORD-101',

        orderNumber:
          'CMD-2026-001',

        customerName:
          'Aïssata Diallo',

        customerPhone:
          '+223 76 12 34 56',

        customerAddress:
          'Hamdallaye ACI 2000, Bamako',

        items: [

          {
            id: '1',
            productName:
              'Ordinateur Portable Pro',
            quantity: 1,
            unitPrice: 450000
          },

          {
            id: '4',
            productName:
              'Casque Audio Sans Fil',
            quantity: 1,
            unitPrice: 35000
          }

        ],

        totalAmount:
          485000,

        status:
          'DELIVERED',

        paymentStatus:
          'PAID',

        paymentMethod:
          'ORANGE_MONEY',

        createdAt:
          new Date('2026-08-15T10:30:00')

      },


      {

        id: 'ORD-102',

        orderNumber:
          'CMD-2026-002',

        customerName:
          'Mamadou Traoré',

        customerPhone:
          '+223 66 98 76 54',

        customerAddress:
          'Badalabougou, Bamako',

        items: [

          {
            id: '2',
            productName:
              'Smartphone X 128GB',
            quantity: 2,
            unitPrice: 210000
          }

        ],

        totalAmount:
          420000,

        status:
          'CONFIRMED',

        paymentStatus:
          'PAID',

        paymentMethod:
          'WAVE',

        createdAt:
          new Date('2026-08-16T08:15:00')

      },


      {

        id: 'ORD-103',

        orderNumber:
          'CMD-2026-003',

        customerName:
          'Oumar Coulibaly',

        customerPhone:
          '+223 70 11 22 33',

        customerAddress:
          'Faladié SEMA, Bamako',

        items: [

          {
            id: '5',
            productName:
              'T-Shirt Premium B2WA',
            quantity: 3,
            unitPrice: 15000
          }

        ],

        totalAmount:
          45000,

        status:
          'CONFIRMED',

        paymentStatus:
          'UNPAID',

        paymentMethod:
          'CASH',

        createdAt:
          new Date('2026-08-16T14:20:00')

      },


      {

        id: 'ORD-104',

        orderNumber:
          'CMD-2026-004',

        customerName:
          'Fatoumata Keïta',

        customerPhone:
          '+223 75 44 55 66',

        customerAddress:
          'Korofina Nord, Bamako',

        items: [

          {
            id: '7',
            productName:
              'Crème Hydratante Visage',
            quantity: 2,
            unitPrice: 9500
          },

          {
            id: '6',
            productName:
              'Lampe de Bureau LED',
            quantity: 1,
            unitPrice: 18500
          }

        ],

        totalAmount:
          37500,

        status:
          'CANCELLED',

        paymentStatus:
          'UNPAID',

        paymentMethod:
          'ORANGE_MONEY',

        createdAt:
          new Date('2026-08-14T16:00:00')

      }

    ];

  }


  /* =========================
     STATS
  ========================= */

  get totalOrdersCount(): number {

    return this.orders.length;

  }


  get confirmedOrdersCount(): number {

    return this.orders.filter(

      order =>
        order.status === 'CONFIRMED'

    ).length;

  }


  get inShipmentOrdersCount(): number {

    return this.orders.filter(

      order =>
        order.status === 'IN_SHIPMENT'

    ).length;

  }


  get deliveredOrdersCount(): number {

    return this.orders.filter(

      order =>
        order.status === 'DELIVERED'

    ).length;

  }


  get totalRevenue(): number {

    return this.orders

      .filter(
        order =>
          order.paymentStatus === 'PAID'
      )

      .reduce(

        (sum, order) =>
          sum + order.totalAmount,

        0

      );

  }


  /* =========================
     FILTERS
  ========================= */

  applyFilters(): void {

    const search =
      this.searchQuery
        .trim()
        .toLowerCase();


    this.filteredOrders =
      this.orders.filter(order => {

        const matchesSearch =

          !search ||

          order.orderNumber
            .toLowerCase()
            .includes(search) ||

          order.customerName
            .toLowerCase()
            .includes(search) ||

          order.customerPhone
            .includes(search);


        const matchesStatus =

          this.selectedStatus === 'ALL' ||

          order.status ===
            this.selectedStatus;


        const matchesPayment =

          this.selectedPaymentStatus === 'ALL' ||

          order.paymentStatus ===
            this.selectedPaymentStatus;


        return (

          matchesSearch &&

          matchesStatus &&

          matchesPayment

        );

      });


    this.currentPage = 1;

    this.updatePagination();

    this.refreshView();

  }


  /* =========================
     PAGINATION
  ========================= */

  get totalPages(): number {

    return Math.max(

      1,

      Math.ceil(

        this.filteredOrders.length /
        this.itemsPerPage

      )

    );

  }


  get paginationPages():
    Array<number | string> {

    const total =
      this.totalPages;

    const current =
      this.currentPage;


    if (total <= 7) {

      return Array.from(

        {
          length: total
        },

        (_, i) => i + 1

      );

    }


    const pages:
      Array<number | string> =
      [1];


    if (current > 4) {

      pages.push('...');

    }


    const start =
      Math.max(2, current - 1);

    const end =
      Math.min(
        total - 1,
        current + 1
      );


    for (
      let p = start;
      p <= end;
      p++
    ) {

      pages.push(p);

    }


    if (current < total - 3) {

      pages.push('...');

    }


    pages.push(total);

    return pages;

  }


  updatePagination(): void {

    const start =
      (this.currentPage - 1) *
      this.itemsPerPage;


    this.paginatedOrders =
      this.filteredOrders.slice(

        start,

        start + this.itemsPerPage

      );

  }


  changePage(
    page: number | string
  ): void {

    if (

      typeof page !== 'number' ||

      page < 1 ||

      page > this.totalPages

    ) {

      return;

    }


    this.currentPage = page;

    this.updatePagination();

    this.refreshView();

  }


  changeItemsPerPage(): void {

    this.currentPage = 1;

    this.updatePagination();

    this.refreshView();

  }


  get paginationStart(): number {

    return this.filteredOrders.length === 0

      ? 0

      : (

          (this.currentPage - 1) *
          this.itemsPerPage

        ) + 1;

  }


  get paginationEnd(): number {

    return Math.min(

      this.currentPage *
      this.itemsPerPage,

      this.filteredOrders.length

    );

  }


  /* =========================
     ACTION MENU
  ========================= */

  toggleActionMenu(
    orderId: string
  ): void {

    this.openActionMenuId =

      this.openActionMenuId === orderId

        ? null

        : orderId;

    this.refreshView();

  }


  closeActionMenu(): void {

    this.openActionMenuId = null;

    this.refreshView();

  }


  /* =========================
     DETAIL
  ========================= */

  openDetailModal(
    order: Order
  ): void {

    this.openActionMenuId = null;

    this.selectedOrder = {
      ...order
    };

    this.isDetailModalOpen = true;

    this.refreshView();

  }


  closeDetailModal(): void {

    this.isDetailModalOpen = false;

    this.selectedOrder = null;

    this.refreshView();

  }


  /* =========================
     SHIPMENT
  ========================= */

  getShipmentForOrder(
    orderId: string
  ): Shipment | undefined {

    const shipments =
      this.shipmentStore.getShipments();


    return shipments.find(

      shipment =>
        String(
          (shipment as Shipment & {
            orderId?: string
          }).orderId
        ) === orderId

    );

  }


  canCreateShipment(
    order: Order
  ): boolean {

    return (

      order.status === 'CONFIRMED' &&

      !this.getShipmentForOrder(order.id)

    );

  }


  createShipment(
    order: Order
  ): void {

    this.openActionMenuId = null;

    this.closeDetailModal();


    this.router.navigate(

      [
        '/dashboard/create-shipment'
      ],

      {

        queryParams: {
          orderId: order.id
        }

      }

    );

  }


  viewShipment(
    shipment: Shipment
  ): void {

    this.openActionMenuId = null;

    this.closeDetailModal();


    this.router.navigate(

      [
        '/dashboard/shipment-detail',
        shipment.id
      ]

    );

  }


  /* =========================
     CANCEL ORDER
  ========================= */

  cancelOrder(
    order: Order
  ): void {

    this.openActionMenuId = null;

    order.status = 'CANCELLED';

    this.showToast(

      'warning',

      'Commande annulée',

      `La commande ${order.orderNumber} a été annulée.`,

      'cancel'

    );

    this.applyFilters();

  }


  /* =========================
     STATUS
  ========================= */

  getStatusLabel(
    status: OrderStatus
  ): string {

    switch (status) {

      case 'CONFIRMED':
        return 'Confirmée';

      case 'IN_SHIPMENT':
        return 'En expédition';

      case 'DELIVERED':
        return 'Livrée';

      case 'CANCELLED':
        return 'Annulée';

      default:
        return status;

    }

  }


  getStatusClass(
    status: OrderStatus
  ): string {

    switch (status) {

      case 'CONFIRMED':
        return 'badge-confirmed';

      case 'IN_SHIPMENT':
        return 'badge-shipping';

      case 'DELIVERED':
        return 'badge-success';

      case 'CANCELLED':
        return 'badge-danger';

      default:
        return '';

    }

  }


  /* =========================
     SHIPMENT STATUS
  ========================= */

  getShipmentStatusLabel(
    status: ShipmentStatus
  ): string {

    switch (status) {

      case 'preparing':
        return 'Préparation';

      case 'picked':
        return 'Collecté';

      case 'transit':
        return 'En transit';

      case 'delivered':
        return 'Livré';

      case 'problem':
        return 'Problème';

      case 'cancelled':
        return 'Annulée';

      default:
        return status;

    }

  }


  getShipmentStatusClass(
    status: ShipmentStatus
  ): string {

    switch (status) {

      case 'preparing':
        return 'shipment-preparing';

      case 'picked':
        return 'shipment-picked';

      case 'transit':
        return 'shipment-transit';

      case 'delivered':
        return 'shipment-delivered';

      case 'problem':
        return 'shipment-problem';

      case 'cancelled':
        return 'shipment-cancelled';

      default:
        return '';

    }

  }


  /* =========================
     PAYMENT
  ========================= */

  getPaymentLabel(
    status: PaymentStatus
  ): string {

    switch (status) {

      case 'PAID':
        return 'PAYÉ';

      case 'UNPAID':
        return 'NON PAYÉ';

      case 'REFUNDED':
        return 'REMBOURSÉ';

      default:
        return status;

    }

  }


  getPaymentMethodLabel(
    method: PaymentMethod
  ): string {

    switch (method) {

      case 'ORANGE_MONEY':
        return 'Orange Money';

      case 'WAVE':
        return 'Wave';

      case 'CASH':
        return 'Espèces';

      case 'CARTE':
        return 'Carte bancaire';

      default:
        return method;

    }

  }


  /* =========================
     TRACK BY
  ========================= */

  trackByOrderId(
    index: number,
    order: Order
  ): string {

    return order.id;

  }


  /* =========================
     TOAST
  ========================= */

  showToast(

    type:
      'success' |
      'warning' |
      'error',

    title: string,

    message: string,

    icon: string

  ): void {

    if (this.toastTimeout) {

      clearTimeout(
        this.toastTimeout
      );

    }


    this.toast = {

      visible: true,

      type,

      title,

      message,

      icon

    };


    this.refreshView();


    this.toastTimeout =
      setTimeout(() => {

        this.hideToast();

      }, 3500);

  }


  hideToast(): void {

    this.toast.visible = false;

    this.refreshView();

  }

}