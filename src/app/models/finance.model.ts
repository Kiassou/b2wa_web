export interface FinanceOverview {
  totalRevenue: number;        // Recettes totales (FCFA)
  availableBalance: number;    // Solde disponible au retrait (FCFA)
  pendingBalance: number;      // Solde en attente de validation (FCFA)
  totalWithdrawals: number;    // Total des retraits effectués (FCFA)
  monthlyGrowthPercentage: number; // Pourcentage de croissance mensuelle
}

export type TransactionType = 'VENTE_DIRECTE' | 'VENTE_COMMUNAUTE' | 'ABONNEMENT' | 'RETRAIT';
export type TransactionStatus = 'COMPLETE' | 'EN_ATTENTE' | 'ECHOUE';
export type PaymentMethod = 'ORANGE_MONEY' | 'WAVE' | 'MOOV_MONEY' | 'CARTE_BANCAIRE' | 'VIREMENT';

export interface Transaction {
  id: string;
  reference: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  customerName?: string;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  paymentMethod: PaymentMethod;
  phoneNumberOrIban: string;
  requestedAt: string;
  status: 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
}

export interface RevenueByChannel {
  channel: string;
  amount: number;
  percentage: number;
  color: string;
}