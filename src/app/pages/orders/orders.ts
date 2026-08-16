import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'UNPAID' | 'REFUNDED';
export type PaymentMethod = 'ORANGE_MONEY' | 'WAVE' | 'CASH' | 'CARTE';

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

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {
  constructor(private readonly cdr: ChangeDetectorRef) {}

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  paginatedOrders: Order[] = [];

  // Filtres
  searchQuery = '';
  selectedStatus = 'ALL';
  selectedPaymentStatus = 'ALL';

  // Pagination
  currentPage = 1;
  itemsPerPage = 8;
  readonly pageSizeOptions: number[] = [5, 8, 12, 20];

  // Modales
  isDetailModalOpen = false;
  selectedOrder: Order | null = null;

  ngOnInit(): void {
    this.loadMockOrders();
    this.applyFilters();
  }

  private refreshView(): void {
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  loadMockOrders(): void {
    this.orders = [
      {
        id: 'ORD-101',
        orderNumber: 'CMD-2026-001',
        customerName: 'Aïssata Diallo',
        customerPhone: '+223 76 12 34 56',
        customerAddress: 'Hamdallaye ACI 2000, Bamako',
        items: [
          { id: '1', productName: 'Ordinateur Portable Pro', quantity: 1, unitPrice: 450000 },
          { id: '4', productName: 'Casque Audio Sans Fil', quantity: 1, unitPrice: 35000 }
        ],
        totalAmount: 485000,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        paymentMethod: 'ORANGE_MONEY',
        createdAt: new Date('2026-08-15T10:30:00')
      },
      {
        id: 'ORD-102',
        orderNumber: 'CMD-2026-002',
        customerName: 'Mamadou Traoré',
        customerPhone: '+223 66 98 76 54',
        customerAddress: 'Badalabougou, Bamako',
        items: [
          { id: '2', productName: 'Smartphone X 128GB', quantity: 2, unitPrice: 210000 }
        ],
        totalAmount: 420000,
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        paymentMethod: 'WAVE',
        createdAt: new Date('2026-08-16T08:15:00')
      },
      {
        id: 'ORD-103',
        orderNumber: 'CMD-2026-003',
        customerName: 'Oumar Coulibaly',
        customerPhone: '+223 70 11 22 33',
        customerAddress: 'Faladié SEMA, Bamako',
        items: [
          { id: '5', productName: 'T-Shirt Premium B2WA', quantity: 3, unitPrice: 15000 }
        ],
        totalAmount: 45000,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        paymentMethod: 'CASH',
        createdAt: new Date('2026-08-16T14:20:00')
      },
      {
        id: 'ORD-104',
        orderNumber: 'CMD-2026-004',
        customerName: 'Fatoumata Keïta',
        customerPhone: '+223 75 44 55 66',
        customerAddress: 'Korofina Nord, Bamako',
        items: [
          { id: '7', productName: 'Crème Hydratante Visage', quantity: 2, unitPrice: 9500 },
          { id: '6', productName: 'Lampe de Bureau LED', quantity: 1, unitPrice: 18500 }
        ],
        totalAmount: 37500,
        status: 'CANCELLED',
        paymentStatus: 'UNPAID',
        paymentMethod: 'ORANGE_MONEY',
        createdAt: new Date('2026-08-14T16:00:00')
      }
    ];
  }

  // Statistiques
  get totalOrdersCount(): number {
    return this.orders.length;
  }

  get pendingOrdersCount(): number {
    return this.orders.filter(o => o.status === 'PENDING').length;
  }

  get processingOrdersCount(): number {
    return this.orders.filter(o => o.status === 'PROCESSING').length;
  }

  get deliveredOrdersCount(): number {
    return this.orders.filter(o => o.status === 'DELIVERED').length;
  }

  get totalRevenue(): number {
    return this.orders
      .filter(o => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }

  // Filtrage
  applyFilters(): void {
    const search = this.searchQuery.trim().toLowerCase();

    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch =
        !search ||
        order.orderNumber.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        order.customerPhone.includes(search);

      const matchesStatus =
        this.selectedStatus === 'ALL' || order.status === this.selectedStatus;

      const matchesPayment =
        this.selectedPaymentStatus === 'ALL' || order.paymentStatus === this.selectedPaymentStatus;

      return matchesSearch && matchesStatus && matchesPayment;
    });

    this.currentPage = 1;
    this.updatePagination();
    this.refreshView();
  }

  // Pagination
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
    return this.filteredOrders.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredOrders.length);
  }

  // Actions
  openDetailModal(order: Order): void {
    this.selectedOrder = { ...order };
    this.isDetailModalOpen = true;
    this.refreshView();
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedOrder = null;
    this.refreshView();
  }

  updateOrderStatus(order: Order, newStatus: OrderStatus): void {
    order.status = newStatus;
    if (this.selectedOrder && this.selectedOrder.id === order.id) {
      this.selectedOrder.status = newStatus;
    }
    this.applyFilters();
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'PROCESSING': return 'En cours';
      case 'DELIVERED': return 'Livrée';
      case 'CANCELLED': return 'Annulée';
    }
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'PENDING': return 'badge-warning';
      case 'PROCESSING': return 'badge-info';
      case 'DELIVERED': return 'badge-success';
      case 'CANCELLED': return 'badge-danger';
    }
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}