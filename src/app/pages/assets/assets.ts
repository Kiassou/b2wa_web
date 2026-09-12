import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Asset {
  id: number;
  name: string;
  type: 'Serveur' | 'Site Web' | 'Poste de travail' | 'Domaine' | 'Réseau' | 'Cloud';
  target: string;
  description: string;
  status: 'secure' | 'warning' | 'critical' | 'unknown';
  score: number;
  threats: number;
  vulnerabilities: number;
  openPorts: number;
  services: number;
  scans: number;
  lastScan: string;
  icon: string;
  iconClass: string;
}

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './assets.html',
  styleUrl: './assets.css'
})
export class AssetsComponent {

  /* =====================================================
     SEARCH / FILTER
  ===================================================== */

  searchTerm = '';
  selectedFilter = 'Tous';


  /* =====================================================
     MODALS
  ===================================================== */

  showAssetModal = false;
  showDetailsModal = false;
  showDeleteModal = false;

  editingAsset: Asset | null = null;
  selectedAsset: Asset | null = null;


  /* =====================================================
     FORMULAIRE
  ===================================================== */

  assetForm = {
    name: '',
    type: 'Serveur' as Asset['type'],
    target: '',
    description: ''
  };


  /* =====================================================
     DONNÉES DEMO
  ===================================================== */

  assets: Asset[] = [

    {
      id: 1,
      name: 'Serveur Production',
      type: 'Serveur',
      target: '192.168.1.20',
      description: 'Serveur principal de production.',
      status: 'secure',
      score: 92,
      threats: 0,
      vulnerabilities: 1,
      openPorts: 8,
      services: 6,
      scans: 24,
      lastScan: 'Il y a 12 min',
      icon: 'dns',
      iconClass: 'server'
    },

    {
      id: 2,
      name: 'CODEC Web',
      type: 'Site Web',
      target: 'https://codec-app.com',
      description: 'Application web publique de CODEC.',
      status: 'warning',
      score: 76,
      threats: 2,
      vulnerabilities: 4,
      openPorts: 5,
      services: 4,
      scans: 18,
      lastScan: 'Il y a 1 h',
      icon: 'language',
      iconClass: 'website'
    },

    {
      id: 3,
      name: 'Poste Admin',
      type: 'Poste de travail',
      target: '192.168.1.45',
      description: 'Poste de travail administrateur.',
      status: 'critical',
      score: 48,
      threats: 3,
      vulnerabilities: 7,
      openPorts: 12,
      services: 8,
      scans: 9,
      lastScan: 'Il y a 3 h',
      icon: 'computer',
      iconClass: 'workstation'
    },

    {
      id: 4,
      name: 'codec-app.com',
      type: 'Domaine',
      target: 'codec-app.com',
      description: 'Domaine principal surveillé.',
      status: 'secure',
      score: 88,
      threats: 0,
      vulnerabilities: 2,
      openPorts: 3,
      services: 3,
      scans: 16,
      lastScan: 'Hier',
      icon: 'public',
      iconClass: 'domain'
    },

    {
      id: 5,
      name: 'Infrastructure Cloud',
      type: 'Cloud',
      target: 'cloud-prod-01',
      description: 'Infrastructure cloud de production.',
      status: 'warning',
      score: 71,
      threats: 1,
      vulnerabilities: 3,
      openPorts: 6,
      services: 7,
      scans: 13,
      lastScan: 'Hier',
      icon: 'cloud',
      iconClass: 'cloud'
    }

  ];


  constructor(
    private readonly router: Router
  ) {}


  /* =====================================================
     STATISTIQUES
  ===================================================== */

  get totalAssets(): number {
    return this.assets.length;
  }

  get secureAssets(): number {
    return this.assets.filter(
      asset => asset.status === 'secure'
    ).length;
  }

  get warningAssets(): number {
    return this.assets.filter(
      asset => asset.status === 'warning'
    ).length;
  }

  get criticalAssets(): number {
    return this.assets.filter(
      asset => asset.status === 'critical'
    ).length;
  }


  /* =====================================================
     ASSETS FILTRÉS
  ===================================================== */

  get filteredAssets(): Asset[] {

    const search = this.searchTerm
      .trim()
      .toLowerCase();

    return this.assets.filter(asset => {

      const matchesSearch =
        !search ||
        asset.name.toLowerCase().includes(search) ||
        asset.target.toLowerCase().includes(search) ||
        asset.type.toLowerCase().includes(search);

      const matchesFilter =
        this.selectedFilter === 'Tous' ||
        asset.type === this.selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }


  /* =====================================================
     AJOUT
  ===================================================== */

  openAddModal(): void {

    this.editingAsset = null;

    this.assetForm = {
      name: '',
      type: 'Serveur',
      target: '',
      description: ''
    };

    this.showAssetModal = true;
  }


  /* =====================================================
     MODIFICATION
  ===================================================== */

  openEditModal(asset: Asset): void {

    this.editingAsset = asset;

    this.assetForm = {
      name: asset.name,
      type: asset.type,
      target: asset.target,
      description: asset.description
    };

    this.showAssetModal = true;
  }


  /* =====================================================
     SAUVEGARDE
  ===================================================== */

  saveAsset(): void {

    if (
      !this.assetForm.name.trim() ||
      !this.assetForm.target.trim()
    ) {
      return;
    }

    if (this.editingAsset) {

      this.editingAsset.name =
        this.assetForm.name.trim();

      this.editingAsset.type =
        this.assetForm.type;

      this.editingAsset.target =
        this.assetForm.target.trim();

      this.editingAsset.description =
        this.assetForm.description.trim();

    } else {

      const newAsset: Asset = {

        id: Date.now(),

        name: this.assetForm.name.trim(),

        type: this.assetForm.type,

        target: this.assetForm.target.trim(),

        description:
          this.assetForm.description.trim(),

        status: 'unknown',

        score: 0,

        threats: 0,

        vulnerabilities: 0,

        openPorts: 0,

        services: 0,

        scans: 0,

        lastScan: 'Jamais',

        icon: this.getIconForType(
          this.assetForm.type
        ),

        iconClass: this.getIconClassForType(
          this.assetForm.type
        )

      };

      this.assets.unshift(newAsset);
    }

    this.closeAssetModal();
  }


  /* =====================================================
     DÉTAILS
  ===================================================== */

  openDetails(asset: Asset): void {

    this.selectedAsset = asset;

    this.showDetailsModal = true;
  }


  closeDetails(): void {

    this.showDetailsModal = false;

    this.selectedAsset = null;
  }


  /* =====================================================
     SUPPRESSION
  ===================================================== */

  askDelete(asset: Asset): void {

    this.selectedAsset = asset;

    this.showDeleteModal = true;
  }


  deleteAsset(): void {

    if (!this.selectedAsset) {
      return;
    }

    this.assets =
      this.assets.filter(
        asset =>
          asset.id !== this.selectedAsset!.id
      );

    this.showDeleteModal = false;
    this.selectedAsset = null;
  }


  /* =====================================================
     MODAL
  ===================================================== */

  closeAssetModal(): void {

    this.showAssetModal = false;

    this.editingAsset = null;
  }


  closeDeleteModal(): void {

    this.showDeleteModal = false;

    this.selectedAsset = null;
  }


  /* =====================================================
     SCAN
  ===================================================== */

  scanAsset(asset: Asset): void {

    /*
     * Pour le moment on prépare simplement
     * la navigation vers la page Scan.
     *
     * Plus tard on pourra transmettre
     * l'ID de l'actif au scanner.
     */

    this.router.navigate(
      ['/dashboard/scans'],
      {
        queryParams: {
          asset: asset.id
        }
      }
    );
  }


  /* =====================================================
     FILTRE
  ===================================================== */

  setFilter(filter: string): void {

    this.selectedFilter = filter;
  }


  /* =====================================================
     HELPERS
  ===================================================== */

  getStatusLabel(
    status: Asset['status']
  ): string {

    switch (status) {

      case 'secure':
        return 'Sécurisé';

      case 'warning':
        return 'À surveiller';

      case 'critical':
        return 'Critique';

      default:
        return 'Non analysé';
    }
  }


  getStatusIcon(
    status: Asset['status']
  ): string {

    switch (status) {

      case 'secure':
        return 'verified_user';

      case 'warning':
        return 'warning';

      case 'critical':
        return 'error';

      default:
        return 'help';
    }
  }


  getScoreClass(score: number): string {

    if (score >= 80) {
      return 'score-good';
    }

    if (score >= 60) {
      return 'score-warning';
    }

    return 'score-critical';
  }


  private getIconForType(
    type: Asset['type']
  ): string {

    switch (type) {

      case 'Serveur':
        return 'dns';

      case 'Site Web':
        return 'language';

      case 'Poste de travail':
        return 'computer';

      case 'Domaine':
        return 'public';

      case 'Réseau':
        return 'hub';

      case 'Cloud':
        return 'cloud';

      default:
        return 'devices';
    }
  }


  private getIconClassForType(
    type: Asset['type']
  ): string {

    switch (type) {

      case 'Serveur':
        return 'server';

      case 'Site Web':
        return 'website';

      case 'Poste de travail':
        return 'workstation';

      case 'Domaine':
        return 'domain';

      case 'Réseau':
        return 'network';

      case 'Cloud':
        return 'cloud';

      default:
        return 'default';
    }
  }

}