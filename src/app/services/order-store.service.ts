import { Injectable } from '@angular/core';

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
  customerCity?: string;
  customerCountry?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderStoreService {
  private orders: Order[] = [
    {
      id: 'ORD-101',
      orderNumber: 'CMD-2026-001',
      customerName: 'Aïssata Diallo',
      customerPhone: '+223 76 12 34 56',
      customerAddress: 'Hamdallaye ACI 2000, Bamako',
      customerCity: 'Bamako',
      customerCountry: 'Mali',
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
      customerPhone: '+225 66 98 76 54',
      customerAddress: 'Marcory, Abidjan',
      customerCity: 'Abidjan',
      customerCountry: 'Côte d\'Ivoire',
      items: [
        { id: '2', productName: 'Smartphone X 128GB', quantity: 2, unitPrice: 210000 }
      ],
      totalAmount: 420000,
      status: 'CONFIRMED',
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
      customerCity: 'Bamako',
      customerCountry: 'Mali',
      items: [
        { id: '5', productName: 'T-Shirt Premium B2WA', quantity: 3, unitPrice: 15000 }
      ],
      totalAmount: 45000,
      status: 'CONFIRMED',
      paymentStatus: 'UNPAID',
      paymentMethod: 'CASH',
      createdAt: new Date('2026-08-16T14:20:00')
    },
    {
      id: 'ORD-104',
      orderNumber: 'CMD-2026-004',
      customerName: 'Fatimata Keïta',
      customerPhone: '+221 77 44 55 66',
      customerAddress: 'Nord, Dakar',
      customerCity: 'Dakar',
      customerCountry: 'Sénégal',
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

  getOrders(): Order[] {
    return [...this.orders];
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find(o => o.id.toUpperCase() === id.toUpperCase());
  }

  updateOrderStatus(id: string, status: OrderStatus): void {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
    }
  }
}