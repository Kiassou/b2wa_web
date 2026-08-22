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

import {
  OrderStoreService,
  Order,
  OrderStatus,
  PaymentStatus,
  PaymentMethod
} from '../../services/order-store.service';


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
export class OrdersComponent implements OnInit {

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly shipmentStore: ShipmentStoreService,
    private readonly orderStore: OrderStoreService
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
  readonly pageSizeOptions = [5, 8, 12, 20];

  /* =========================
     ACTION MENU
  ========================= */
  openActionMenuId: string | null = null;

  /* =========================
     DETAIL MODAL
  ========================= */
  isDetailModalOpen = false;
  selectedOrder: Order | null = null;

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

  private toastTimeout: ReturnType<typeof setTimeout> | null = null;

  /* =========================
     INIT
  ========================= */
  ngOnInit(): void {
    this.loadOrders();
  }

  /* =========================
     CHARGEMENT COMMANDES
  ========================= */
  loadOrders(): void {
    this.orders = this.orderStore.getOrders();
    this.applyFilters();
  }

  private refreshView(): void {
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  /* =========================
     STATS
  ========================= */
  get totalOrdersCount(): number {
    return this.orders.length;
  }

  get confirmedOrdersCount(): number {
    return this.orders.filter(order => order.status === 'CONFIRMED').length;
  }

  get inShipmentOrdersCount(): number {
    return this.orders.filter(order => order.status === 'IN_SHIPMENT').length;
  }

  get deliveredOrdersCount(): number {
    return this.orders.filter(order => order.status === 'DELIVERED').length;
  }

  get totalRevenue(): number {
    return this.orders
      .filter(order => order.paymentStatus === 'PAID')
      .reduce((sum, order) => sum + order.totalAmount, 0);
  }

  /* =========================
     FILTERS
  ========================= */
  applyFilters(): void {
    const search = this.searchQuery.trim().toLowerCase();

    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch =
        !search ||
        order.orderNumber.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        order.customerPhone.includes(search);

      const matchesStatus =
        this.selectedStatus === 'ALL' ||
        order.status === this.selectedStatus;

      const matchesPayment =
        this.selectedPaymentStatus === 'ALL' ||
        order.paymentStatus === this.selectedPaymentStatus;

      return matchesSearch && matchesStatus && matchesPayment;
    });

    this.currentPage = 1;
    this.updatePagination();
    this.refreshView();
  }

  /* =========================
     PAGINATION
  ========================= */
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredOrders.length / this.itemsPerPage));
  }

  get paginationPages(): Array<number | string> {
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: Array<number | string> = [1];
    if (current > 4) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let p = start; p <= end; p++) pages.push(p);

    if (current < total - 3) pages.push('...');
    pages.push(total);

    return pages;
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number | string): void {
    if (typeof page !== 'number' || page < 1 || page > this.totalPages) return;
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
    return this.filteredOrders.length === 0 ? 0 : ((this.currentPage - 1) * this.itemsPerPage) + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredOrders.length);
  }

  /* =========================
     ACTION MENU
  ========================= */
  toggleActionMenu(orderId: string): void {
    this.openActionMenuId = this.openActionMenuId === orderId ? null : orderId;
    this.refreshView();
  }

  closeActionMenu(): void {
    this.openActionMenuId = null;
    this.refreshView();
  }

  /* =========================
     DETAIL
  ========================= */
  openDetailModal(order: Order): void {
    this.openActionMenuId = null;
    this.selectedOrder = { ...order };
    this.isDetailModalOpen = true;
    this.refreshView();
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedOrder = null;
    this.refreshView();
  }

  /* =========================
     SHIPMENT & SERVICES INTERACTION
  ========================= */
  getShipmentForOrder(orderId: string): Shipment | undefined {
    const shipments = this.shipmentStore.getShipments();
    return shipments.find(shipment => String(shipment.orderId) === orderId);
  }

  canCreateShipment(order: Order): boolean {
    return order.status === 'CONFIRMED' && !this.getShipmentForOrder(order.id);
  }

  createShipment(order: Order): void {
    this.openActionMenuId = null;
    this.closeDetailModal();
    // Navigation vers la page de création en lui passant l'ID de la commande
    this.router.navigate(['/dashboard/create-shipment', order.id]);
  }

  viewShipment(shipment: Shipment): void {
    this.openActionMenuId = null;
    this.closeDetailModal();
    this.router.navigate(['/dashboard/shipment-detail', shipment.id]);
  }

  /* =========================
     CANCEL ORDER
  ========================= */
  cancelOrder(order: Order): void {
    this.openActionMenuId = null;
    this.orderStore.updateOrderStatus(order.id, 'CANCELLED');
    this.loadOrders();
    this.showToast('warning', 'Commande annulée', `La commande ${order.orderNumber} a été annulée.`, 'cancel');
  }

  /* =========================
     STATUS LABELS & CLASSES
  ========================= */
  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case 'CONFIRMED': return 'Confirmée';
      case 'IN_SHIPMENT': return 'En expédition';
      case 'DELIVERED': return 'Livrée';
      case 'CANCELLED': return 'Annulée';
      default: return status;
    }
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'CONFIRMED': return 'badge-confirmed';
      case 'IN_SHIPMENT': return 'badge-shipping';
      case 'DELIVERED': return 'badge-success';
      case 'CANCELLED': return 'badge-danger';
      default: return '';
    }
  }

  getShipmentStatusLabel(status: ShipmentStatus): string {
    switch (status) {
      case 'preparing': return 'Préparation';
      case 'picked': return 'Collecté';
      case 'transit': return 'En transit';
      case 'delivered': return 'Livré';
      case 'problem': return 'Problème';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  }

  getShipmentStatusClass(status: ShipmentStatus): string {
    switch (status) {
      case 'preparing': return 'shipment-preparing';
      case 'picked': return 'shipment-picked';
      case 'transit': return 'shipment-transit';
      case 'delivered': return 'shipment-delivered';
      case 'problem': return 'shipment-problem';
      case 'cancelled': return 'shipment-cancelled';
      default: return '';
    }
  }

  getPaymentLabel(status: PaymentStatus): string {
    switch (status) {
      case 'PAID': return 'PAYÉ';
      case 'UNPAID': return 'NON PAYÉ';
      case 'REFUNDED': return 'REMBOURSÉ';
      default: return status;
    }
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    switch (method) {
      case 'ORANGE_MONEY': return 'Orange Money';
      case 'WAVE': return 'Wave';
      case 'CASH': return 'Espèces';
      case 'CARTE': return 'Carte bancaire';
      default: return method;
    }
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }

  /* =========================
     TOAST
  ========================= */
  showToast(type: 'success' | 'warning' | 'error', title: string, message: string, icon: string): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toast = { visible: true, type, title, message, icon };
    this.refreshView();
    this.toastTimeout = setTimeout(() => { this.hideToast(); }, 3500);
  }

  hideToast(): void {
    this.toast.visible = false;
    this.refreshView();
  }
}