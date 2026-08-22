import { Component} from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule} from '@angular/forms';
import { Router} from '@angular/router';
import { Shipment, ShipmentStoreService } from '../../services/shipment-store.service';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shipping.html',
  styleUrl: './shipping.css'
})
export class ShippingComponent {


  /* =====================================================
     TRACKING
  ====================================================== */
  trackingNumber = '';
  trackingError = '';
  /* =====================================================
     FILTER
  ====================================================== */
  activeFilter:
    | 'all'
    | 'preparing'
    | 'transit'
    | 'delivered'
    | 'problem' = 'all';


  /* =====================================================
     RECHERCHE
  ====================================================== */
  searchQuery = '';
  /* =====================================================
     PAGINATION
  ====================================================== */
  currentPage = 1;
  readonly pageSize = 6;
  /* =====================================================
     MENU OPTIONS
  ====================================================== */
  openMenuShipmentId: number | null = null;
  /* =====================================================
     MODALE QR CODE
  ====================================================== */
  qrModalShipment: Shipment | null = null;
  qrLoading = false;
  qrError = false;
  /* =====================================================
     DONNÉES PARTAGÉES
  ====================================================== */
  get shipments(): Shipment[] {
    return this.shipmentStore.getShipments();
  }
  /* =====================================================
     STATISTIQUES RÉELLES
  ====================================================== */
  get statistics() {
    return {
      total:
        this.shipments.length,
      preparing:
        this.shipments.filter(
          shipment =>
            shipment.status === 'preparing'
        ).length,
      inTransit:
        this.shipments.filter(
          shipment =>
            shipment.status === 'picked' ||
            shipment.status === 'transit'
        ).length,
      delivered:
        this.shipments.filter(
          shipment =>
            shipment.status === 'delivered'
        ).length,
      problem:
        this.shipments.filter(
          shipment =>
            shipment.status === 'problem'
        ).length
    };
  }


  /* =====================================================
     CONSTRUCTOR
  ====================================================== */
  constructor(
    private router: Router,
    private shipmentStore: ShipmentStoreService

  ) {}
  /* =====================================================
     FILTERED SHIPMENTS
  ====================================================== */
  get filteredShipments(): Shipment[] {
    let result: Shipment[];
    if (
      this.activeFilter === 'all'
    ) {
      result = this.shipments;
    }
    else if (
      this.activeFilter === 'preparing'
    ) {
      result =
        this.shipments.filter(
          shipment =>
            shipment.status === 'preparing'
        );
    }
    else if (
      this.activeFilter === 'transit'
    ) {

      result =
        this.shipments.filter(
          shipment =>
            shipment.status === 'transit' ||
            shipment.status === 'picked'
        );
    }


    else if (
      this.activeFilter === 'delivered'
    ) {

      result =
        this.shipments.filter(
          shipment =>
            shipment.status === 'delivered'
        );
    }


    else if (
      this.activeFilter === 'problem'
    ) {

      result =
        this.shipments.filter(
          shipment =>
            shipment.status === 'problem'
        );
    }


    else {

      result = this.shipments;
    }


    const query =
      this.searchQuery
        .trim()
        .toLowerCase();


    if (!query) {
      return result;
    }


    return result.filter(
      shipment =>

        shipment.trackingNumber
          .toLowerCase()
          .includes(query) ||

        shipment.origin
          .toLowerCase()
          .includes(query) ||

        shipment.destination
          .toLowerCase()
          .includes(query)
    );
  }


  /* =====================================================
     PAGINATION
  ====================================================== */

  get pagedShipments(): Shipment[] {

    const list =
      this.filteredShipments;


    const page =
      Math.min(
        this.currentPage,
        this.totalPages
      );


    const start =
      (page - 1) * this.pageSize;


    return list.slice(
      start,
      start + this.pageSize
    );
  }


  get totalPages(): number {

    return Math.max(

      1,

      Math.ceil(
        this.filteredShipments.length /
        this.pageSize
      )
    );
  }


  get pageNumbers(): number[] {

    return Array.from(

      {
        length: this.totalPages
      },

      (_, index) =>
        index + 1
    );
  }


  goToPage(
    page: number
  ): void {

    this.currentPage =
      Math.min(
        Math.max(
          1,
          page
        ),

        this.totalPages
      );
  }
  previousPage(): void {
    this.goToPage(
      this.currentPage - 1
    );
  }


  nextPage(): void {
    this.goToPage(
      this.currentPage + 1
    );
  }
  onSearchChange(): void {
    this.currentPage = 1;
  }
  /* =====================================================
     FILTER
  ====================================================== */

  setFilter(

    filter:
      | 'all'
      | 'preparing'
      | 'transit'
      | 'delivered'
      | 'problem'

  ): void {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.openMenuShipmentId = null;
  }

  /* =====================================================
     VIEW SHIPMENT
  ====================================================== */

  viewShipment(
    shipment: Shipment
  ): void {

    this.router.navigate([
      '/dashboard/shipment-detail',
      shipment.id
    ]);
  }


  /* =====================================================
     TRACK SHIPMENT
  ====================================================== */

  trackShipment(): void {

    const value =
      this.trackingNumber
        .trim()
        .toUpperCase();


    if (!value) {
      this.trackingError =
        'Veuillez saisir un numéro de suivi.';
      return;
    }
    const shipment =
      this.shipmentStore.findByTrackingNumber(
        value
      );
    if (!shipment) {
      this.trackingError =
        'Aucune expédition ne correspond à ce numéro de suivi.';
      return;
    }
    this.trackingError = '';
    this.router.navigate([
      '/dashboard/shipment-detail',
      shipment.id
    ]);
  }
  /* =====================================================
     COPY TRACKING NUMBER
  ====================================================== */
  async copyTrackingNumber(
    trackingNumber: string
  ): Promise<void> {
    if (
      !navigator.clipboard
    ) {
      return;
    }


    try {
      await navigator.clipboard.writeText(
        trackingNumber
      );
    } catch {
      console.error(
        'Impossible de copier le numéro de suivi.'
      );
    }
  }
  /* =====================================================
     STATUS LABEL
  ====================================================== */
  getStatusLabel(
    status: Shipment['status']
  ): string {
    switch (status) {
      case 'preparing':
        return 'En préparation';
      case 'picked':
        return 'Colis récupéré';
      case 'transit':
        return 'En transit';
      case 'delivered':
        return 'Livrée';
      case 'problem':
        return 'Problème';
      default:
        return 'Inconnu';
    }
  }
  /* =====================================================
     STATUS CLASS
  ====================================================== */
  getStatusClass(
    status: Shipment['status']
  ): string {
    switch (status) {
      case 'preparing':
        return 'status-preparing';
      case 'picked':
        return 'status-picked';
      case 'transit':
        return 'status-transit';

      case 'delivered':
        return 'status-delivered';

      case 'problem':
        return 'status-problem';

      default:
        return '';
    }
  }

  /* =====================================================
     MORE MENU
  ====================================================== */
  openShipmentMenu(
    shipment: Shipment
  ): void {
    this.openMenuShipmentId =
      this.openMenuShipmentId === shipment.id
        ? null
        : shipment.id;
  }

  closeShipmentMenu(): void {
    this.openMenuShipmentId = null;
  }

  /* =====================================================
     OUVRIR LE QR CODE
  ====================================================== */
  openQrCode(
    shipment: Shipment
  ): void {
    this.qrLoading = true;
    this.qrError = false;
    this.qrModalShipment = shipment;
    this.openMenuShipmentId = null;
  }

  /* =====================================================
     FERMER LE QR CODE
  ====================================================== */
  closeQrModal(): void {
    this.qrModalShipment = null;
    this.qrLoading = false;
    this.qrError = false;
  }

  /* =====================================================
     URL DE SUIVI
  ====================================================== */
  getTrackingUrl(
    shipment: Shipment
  ): string {
    const baseUrl =
      window.location.origin;
    return [
      baseUrl,
      '/dashboard/shipment-detail',
      shipment.id
    ].join('/');
  }

  /* =====================================================
     URL DU QR CODE
  ====================================================== */
  getQrCodeUrl(
    shipment: Shipment
  ): string {

    const trackingUrl =
      this.getTrackingUrl(
        shipment
      );
    const encodedData =
      encodeURIComponent(
        trackingUrl
      );
    return [
      'https://api.qrserver.com/v1/create-qr-code/',
      '?size=300x300',
      '&format=png',
      '&margin=12',
      '&qzone=12',
      '&ecc=H',
      '&color=0f172a',
      '&bgcolor=ffffff',
      `&data=${encodedData}`
    ].join('');
  }


  /* =====================================================
     QR CHARGÉ
  ====================================================== */
  onQrLoaded(): void {
    this.qrLoading = false;
    this.qrError = false;
  }

  /* =====================================================
     ERREUR QR
  ====================================================== */
  onQrError(): void {
    this.qrLoading = false;
    this.qrError = true;
  }

  /* =====================================================
     TÉLÉCHARGER LE QR
  ====================================================== */
  downloadQrCode(
    shipment: Shipment
  ): void {
    const qrUrl =
      this.getQrCodeUrl(
        shipment
      );
    const link =
      document.createElement('a');
    link.href = qrUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.download =
      `${shipment.trackingNumber}-qr.png`;
    document.body.appendChild(
      link
    );
    link.click();
    document.body.removeChild(
      link
    );
  }

  /* =====================================================
     OUVRIR LE SUIVI
  ====================================================== */
  openTrackingPage(
    shipment: Shipment
  ): void {
    this.closeQrModal();
    this.router.navigate([
      '/dashboard/shipment-detail',
      shipment.id
    ]);
  }

  /* =====================================================
     REPORT PROBLEM
  ====================================================== */
  reportProblem(
    shipment: Shipment
  ): void {
    shipment.status = 'problem';
    this.shipmentStore.updateShipment(
      shipment
    );
    this.openMenuShipmentId = null;
  }

  /* =====================================================
     REFRESH
  ====================================================== */
  refreshShipments(): void {
    console.log(
      'Refreshing shipments...'
    );
  }

  /* =====================================================
     BACK
  ====================================================== */
  goBack(): void {
    window.history.back();
  }
}