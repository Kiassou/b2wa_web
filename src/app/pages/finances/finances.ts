import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';
import { ExportFinanceService } from '../../services/export-finance.service';
import {
  Transaction,
  PaymentMethod,
  TransactionType
} from '../../models/finance.model';

@Component({
  selector: 'app-finances',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finances.html',
  styleUrl: './finances.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancesComponent implements OnInit {
  private financeService = inject(FinanceService);
  private exportFinanceService = inject(ExportFinanceService);

  /* Signaux venant du service */
  overview = this.financeService.overview;
  transactions = this.financeService.transactions;
  withdrawals = this.financeService.withdrawals;
  revenueChannels = this.financeService.revenueChannels;

  /* Filtres & Recherches */
  searchQuery = signal<string>('');
  selectedTypeFilter = signal<string>('TOUS');

  /* Formulaire de Retrait */
  showWithdrawModal = signal<boolean>(false);
  withdrawAmount = signal<number | null>(null);
  selectedMethod = signal<PaymentMethod>('ORANGE_MONEY');
  destinationAccount = signal<string>('');

  /* Notification Toast */
  showSuccessToast = signal<boolean>(false);
  toastMessage = signal<string>('');

  /* Transactions Filtrées Réactives */
  filteredTransactions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const type = this.selectedTypeFilter();

    return this.transactions().filter(tx => {
      const matchesSearch =
        tx.reference.toLowerCase().includes(query) ||
        tx.description.toLowerCase().includes(query) ||
        (tx.customerName && tx.customerName.toLowerCase().includes(query));

      const matchesType = type === 'TOUS' || tx.type === type;

      return matchesSearch && matchesType;
    });
  });

  ngOnInit(): void {}

  /* Action : Exporter un reçu unique en PDF */
  exportSingleReceipt(tx: Transaction, event: MouseEvent): void {
    event.stopPropagation();
    this.exportFinanceService.exportTransactionReceiptPDF(tx);
    this.triggerToast(`Reçu #${tx.reference} télécharge en PDF.`);
  }

  /* Action : Exporter le journal filtré en PDF */
  exportJournalPDF(): void {
    const currentList = this.filteredTransactions();
    if (currentList.length === 0) {
      alert('Aucune transaction à exporter.');
      return;
    }
    this.exportFinanceService.exportTransactionsPDF(currentList, 'Filtrée');
    this.triggerToast('Journal des ventes exporté en PDF.');
  }

  /* Action : Exporter le journal filtré en Excel */
  exportJournalExcel(): void {
    const currentList = this.filteredTransactions();
    if (currentList.length === 0) {
      alert('Aucune transaction à exporter.');
      return;
    }
    this.exportFinanceService.exportTransactionsExcel(currentList);
    this.triggerToast('Journal des ventes exporté en Excel (.xlsx).');
  }

  openWithdrawModal(): void {
    this.withdrawAmount.set(null);
    this.destinationAccount.set('');
    this.showWithdrawModal.set(true);
  }

  closeWithdrawModal(): void {
    this.showWithdrawModal.set(false);
  }

  submitWithdrawal(): void {
    const amount = this.withdrawAmount();
    const method = this.selectedMethod();
    const account = this.destinationAccount();

    if (!amount || amount <= 0) {
      alert('Veuillez saisir un montant valide.');
      return;
    }

    if (!account) {
      alert('Veuillez renseigner le numéro de compte ou téléphone.');
      return;
    }

    const success = this.financeService.requestWithdrawal(amount, method, account);

    if (success) {
      this.closeWithdrawModal();
      this.triggerToast(`Demande de retrait de ${amount.toLocaleString('fr-FR')} FCFA enregistrée.`);
    } else {
      alert('Le montant demandé dépasse votre solde disponible.');
    }
  }

  getTypeBadgeClass(type: TransactionType): string {
    switch (type) {
      case 'VENTE_DIRECTE':
        return 'badge-success';
      case 'VENTE_COMMUNAUTE':
        return 'badge-primary';
      case 'ABONNEMENT':
        return 'badge-info';
      case 'RETRAIT':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }

  private triggerToast(message: string): void {
    this.toastMessage.set(message);
    this.showSuccessToast.set(true);
    setTimeout(() => {
      this.showSuccessToast.set(false);
    }, 4000);
  }
}