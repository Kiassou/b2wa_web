import { Injectable, signal, computed } from '@angular/core';
import {
  FinanceOverview,
  Transaction,
  WithdrawalRequest,
  RevenueByChannel
} from '../models/finance.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  /* Aperçu Financier Général */
  private overviewState = signal<FinanceOverview>({
    totalRevenue: 4850000,
    availableBalance: 1250000,
    pendingBalance: 320000,
    totalWithdrawals: 3280000,
    monthlyGrowthPercentage: 14.5
  });

  /* Historique des Transactions */
  private transactionsState = signal<Transaction[]>([
    {
      id: 'tx-101',
      reference: 'TX-2026-0901',
      date: '2026-09-01 14:32',
      description: 'Vente 50x Sacs riz local (Produits agricoles)',
      amount: 450000,
      type: 'VENTE_COMMUNAUTE',
      status: 'COMPLETE',
      paymentMethod: 'ORANGE_MONEY',
      customerName: 'Sokona Coulibaly'
    },
    {
      id: 'tx-102',
      reference: 'TX-2026-0830',
      date: '2026-08-30 09:15',
      description: 'Vente Smartphone Samsung Galaxy A54',
      amount: 185000,
      type: 'VENTE_DIRECTE',
      status: 'COMPLETE',
      paymentMethod: 'WAVE',
      customerName: 'Ibrahim Touré'
    },
    {
      id: 'tx-103',
      reference: 'TX-2026-0828',
      date: '2026-08-28 17:45',
      description: 'Demande de retrait vers Orange Money',
      amount: 500000,
      type: 'RETRAIT',
      status: 'COMPLETE',
      paymentMethod: 'ORANGE_MONEY'
    },
    {
      id: 'tx-104',
      reference: 'TX-2026-0825',
      date: '2026-08-25 11:20',
      description: 'Commande groupe de Bazin Riche',
      amount: 320000,
      type: 'VENTE_COMMUNAUTE',
      status: 'EN_ATTENTE',
      paymentMethod: 'MOOV_MONEY',
      customerName: 'Oumou Diallo'
    }
  ]);

  /* Demandes de Retrait */
  private withdrawalsState = signal<WithdrawalRequest[]>([
    {
      id: 'ret-101',
      amount: 500000,
      paymentMethod: 'ORANGE_MONEY',
      phoneNumberOrIban: '+223 70 00 11 22',
      requestedAt: '2026-08-28',
      status: 'VALIDE'
    }
  ]);

  /* Répartition des recettes par canal */
  private revenueChannelsState = signal<RevenueByChannel[]>([
    { channel: 'Ventes Communautés', amount: 2800000, percentage: 57.7, color: '#3B82F6' },
    { channel: 'Boutique Directe', amount: 1550000, percentage: 31.9, color: '#10B981' },
    { channel: 'Lives Shopping', amount: 500000, percentage: 10.4, color: '#F59E0B' }
  ]);

  /* Signaux Publics */
  overview = computed(() => this.overviewState());
  transactions = computed(() => this.transactionsState());
  withdrawals = computed(() => this.withdrawalsState());
  revenueChannels = computed(() => this.revenueChannelsState());

  /* Effectuer une demande de retrait */
  requestWithdrawal(amount: number, method: any, destination: string): boolean {
    const currentOverview = this.overviewState();

    if (amount <= 0 || amount > currentOverview.availableBalance) {
      return false;
    }

    // Mise à jour des soldes
    this.overviewState.update(state => ({
      ...state,
      availableBalance: state.availableBalance - amount,
      pendingBalance: state.pendingBalance + amount
    }));

    // Ajout dans les demandes de retrait
    const newRequest: WithdrawalRequest = {
      id: `ret-${Date.now()}`,
      amount,
      paymentMethod: method,
      phoneNumberOrIban: destination,
      requestedAt: new Date().toISOString().split('T')[0],
      status: 'EN_ATTENTE'
    };

    this.withdrawalsState.update(list => [newRequest, ...list]);

    // Ajout dans les transactions
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      reference: `TX-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('fr-FR'),
      description: `Demande de retrait vers ${method}`,
      amount: amount,
      type: 'RETRAIT',
      status: 'EN_ATTENTE',
      paymentMethod: method
    };

    this.transactionsState.update(list => [newTx, ...list]);
    return true;
  }
}