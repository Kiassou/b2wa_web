import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  computed,
  signal
} from '@angular/core';

import {
  CommonModule,
  DatePipe,
  DecimalPipe
} from '@angular/common';

import { RouterLink } from '@angular/router';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type DashboardPeriod =
  | 'today'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

export type DashboardStatus =
  | 'ALL'
  | 'EN COURS'
  | 'LIVRÉ'
  | 'EN ATTENTE'
  | 'ANNULÉ';

export interface KpiCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
  color: string;
  background: string;
  description: string;
}

export interface QuickAction {
  label: string;
  icon: string;
  route: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  icon: string;
  colorClass: string;
  title: string;
  time: string;
}

export interface OrderItem {
  id: string;
  client: string;
  product: string;
  category: string;
  amount: number;
  status: Exclude<DashboardStatus, 'ALL'>;
  date: string;
  quantity: number;
}

export interface SalesPoint {
  label: string;
  value: number;
}

export interface CategorySale {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface ChartPoint {
  label: string;
  value: number;
  x: number;
  y: number;
}

export interface DonutSegment extends CategorySale {
  dashArray: string;
  dashOffset: number;
}

export interface TopProduct {
  position: number;
  name: string;
  quantity: number;
  progress: number;
}

interface PeriodOption {
  label: string;
  value: DashboardPeriod;
}

interface PdfColors {
  navy: [number, number, number];
  green: [number, number, number];
  dark: [number, number, number];
  muted: [number, number, number];
  light: [number, number, number];
  border: [number, number, number];
  white: [number, number, number];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent
  implements OnInit, OnDestroy {
isFiltered() {
throw new Error('Method not implemented.');
}
clearSearch() {
throw new Error('Method not implemented.');
}
    

  loading = false;

  exportingPdf = false;

  lastUpdate = new Date();

  private refreshTimer?: ReturnType<typeof setInterval>;

  readonly periods: PeriodOption[] = [
    {
      label: 'Aujourd’hui',
      value: 'today'
    },
    {
      label: 'Cette semaine',
      value: 'week'
    },
    {
      label: 'Ce mois',
      value: 'month'
    },
    {
      label: '3 derniers mois',
      value: 'quarter'
    },
    {
      label: 'Cette année',
      value: 'year'
    }
  ];

  readonly categoryFilters: string[] = [
    'ALL',
    'Céréales & Riz',
    'Huiles & Conserves',
    'Sucre & Farine',
    'Autres'
  ];

  readonly statusFilters: DashboardStatus[] = [
    'ALL',
    'EN COURS',
    'LIVRÉ',
    'EN ATTENTE',
    'ANNULÉ'
  ];

  readonly selectedPeriod =
    signal<DashboardPeriod>('month');

  readonly selectedCategory =
    signal<string>('ALL');

  readonly selectedStatus =
    signal<DashboardStatus>('ALL');

  readonly searchTerm =
    signal<string>('');

  readonly quickActions: QuickAction[] = [
    {
      label: 'Nouveau produit',
      icon: 'add_box',
      route: '/dashboard/products/add',
      color: '#16a34a'
    },
    {
      label: 'Créer une story',
      icon: 'add_a_photo',
      route: '/dashboard/stories',
      color: '#0f2c59'
    },
    {
      label: 'Gérer le stock',
      icon: 'inventory',
      route: '/dashboard/products',
      color: '#d97706'
    },
    {
      label: 'Factures B2WA',
      icon: 'receipt_long',
      route: '/dashboard/orders',
      color: '#2563eb'
    }
  ];

  readonly orders =
    signal<OrderItem[]>([
      {
        id: '#ORD-8921',
        client: 'Moussa Diarra',
        product: 'Riz parfumé 50kg',
        category: 'Céréales & Riz',
        amount: 125000,
        status: 'EN COURS',
        date: '2026-08-14',
        quantity: 5
      },
      {
        id: '#ORD-8920',
        client: 'Aïssata Touré',
        product: 'Huile Dinor 5L',
        category: 'Huiles & Conserves',
        amount: 95000,
        status: 'LIVRÉ',
        date: '2026-08-13',
        quantity: 10
      },
      {
        id: '#ORD-8919',
        client: 'Sékou Coulibaly',
        product: 'Sucre roux 50kg',
        category: 'Sucre & Farine',
        amount: 56000,
        status: 'EN ATTENTE',
        date: '2026-08-12',
        quantity: 2
      },
      {
        id: '#ORD-8918',
        client: 'Fatoumata Keita',
        product: 'Riz parfumé 50kg',
        category: 'Céréales & Riz',
        amount: 250000,
        status: 'LIVRÉ',
        date: '2026-08-11',
        quantity: 10
      },
      {
        id: '#ORD-8917',
        client: 'Ibrahim Traoré',
        product: 'Tomate concentrée',
        category: 'Huiles & Conserves',
        amount: 42000,
        status: 'ANNULÉ',
        date: '2026-08-10',
        quantity: 6
      },
      {
        id: '#ORD-8916',
        client: 'Aminata Konaté',
        product: 'Farine de blé 25kg',
        category: 'Sucre & Farine',
        amount: 78000,
        status: 'LIVRÉ',
        date: '2026-08-09',
        quantity: 4
      },
      {
        id: '#ORD-8915',
        client: 'Boubacar Diallo',
        product: 'Riz parfumé 50kg',
        category: 'Céréales & Riz',
        amount: 375000,
        status: 'LIVRÉ',
        date: '2026-08-08',
        quantity: 15
      },
      {
        id: '#ORD-8914',
        client: 'Mariama Sanogo',
        product: 'Huile Dinor 5L',
        category: 'Huiles & Conserves',
        amount: 76000,
        status: 'EN COURS',
        date: '2026-08-07',
        quantity: 8
      },
      {
        id: '#ORD-8913',
        client: 'Oumar Cissé',
        product: 'Sucre roux 50kg',
        category: 'Sucre & Farine',
        amount: 112000,
        status: 'LIVRÉ',
        date: '2026-08-06',
        quantity: 4
      },
      {
        id: '#ORD-8912',
        client: 'Salimata Diabaté',
        product: 'Lait en poudre',
        category: 'Autres',
        amount: 68000,
        status: 'EN ATTENTE',
        date: '2026-08-05',
        quantity: 7
      },
      {
        id: '#ORD-8911',
        client: 'Mahamadou Maïga',
        product: 'Riz parfumé 50kg',
        category: 'Céréales & Riz',
        amount: 150000,
        status: 'LIVRÉ',
        date: '2026-08-04',
        quantity: 6
      },
      {
        id: '#ORD-8910',
        client: 'Kadiatou Coulibaly',
        product: 'Huile Dinor 5L',
        category: 'Huiles & Conserves',
        amount: 114000,
        status: 'LIVRÉ',
        date: '2026-08-03',
        quantity: 12
      }
    ]);

  readonly activities =
    signal<ActivityItem[]>([
      { id: '1', icon: 'local_shipping', colorClass: 'act-green', title: 'Nouvelle commande #ORD-8921 reçue de Moussa D.', time: 'Il y a 10 min' },
      { id: '2', icon: 'visibility', colorClass: 'act-blue', title: 'Votre Story "Arrivage Riz" a atteint 400 vues', time: 'Il y a 1 h' },
      { id: '3', icon: 'inventory_2', colorClass: 'act-amber', title: 'Alerte stock faible : Huile Dinor 5L', time: 'Il y a 3 h' },
      { id: '4', icon: 'forum', colorClass: 'act-purple', title: 'Sékou C. a répondu dans la Communauté B2WA', time: 'Il y a 5 h' },
      { id: '5', icon: 'local_shipping', colorClass: 'act-green', title: 'Nouvelle commande #ORD-8920 reçue de Aïssata T.', time: 'Il y a 10 min' }
    ]);

  readonly filteredOrders =
    computed<OrderItem[]>(() => {
      const period = this.selectedPeriod();
      const category = this.selectedCategory();
      const status = this.selectedStatus();
      const search = this.searchTerm()
        .trim()
        .toLowerCase();

      const periodStartDate =
        this.getPeriodStartDate(period);

      return this.orders().filter((order) => {
        const orderDate = new Date(order.date);

        const matchesPeriod =
          orderDate >= periodStartDate;

        const matchesCategory =
          category === 'ALL' ||
          order.category === category;

        const matchesStatus =
          status === 'ALL' ||
          order.status === status;

        const matchesSearch =
          search.length === 0 ||
          order.id.toLowerCase().includes(search) ||
          order.client.toLowerCase().includes(search) ||
          order.product.toLowerCase().includes(search);

        return (
          matchesPeriod &&
          matchesCategory &&
          matchesStatus &&
          matchesSearch
        );
      });
    });

  readonly totalRevenue =
    computed<number>(() => {
      return this.filteredOrders()
        .filter(
          (order) => order.status !== 'ANNULÉ'
        )
        .reduce(
          (total, order) =>
            total + order.amount,
          0
        );
    });

  readonly deliveredOrdersCount =
    computed<number>(() => {
      return this.filteredOrders()
        .filter(
          (order) => order.status === 'LIVRÉ'
        )
        .length;
    });

  readonly averageOrderValue =
    computed<number>(() => {
      const validOrders =
        this.filteredOrders()
          .filter(
            (order) => order.status !== 'ANNULÉ'
          );

      if (validOrders.length === 0) {
        return 0;
      }

      const total = validOrders.reduce(
        (sum, order) =>
          sum + order.amount,
        0
      );

      return Math.round(
        total / validOrders.length
      );
    });

  readonly deliveryRate =
    computed<number>(() => {
      const validOrders =
        this.filteredOrders()
          .filter(
            (order) => order.status !== 'ANNULÉ'
          );

      if (validOrders.length === 0) {
        return 0;
      }

      return Math.round(
        (this.deliveredOrdersCount() /
          validOrders.length) *
          100
      );
    });

  readonly kpis =
    computed<KpiCard[]>(() => {
      const orders = this.filteredOrders();

      return [
        {
          title: 'Chiffre d’affaires',
          value: this.formatMoney(
            this.totalRevenue()
          ),
          change: '+12,5%',
          isPositive: true,
          icon: 'payments',
          color: '#16a34a',
          background: 'rgba(22, 163, 74, 0.14)',
          description:
            `Période : ${this.selectedPeriodLabel()}`
        },
        {
          title: 'Commandes reçues',
          value: String(orders.length),
          change: '+8%',
          isPositive: true,
          icon: 'shopping_bag',
          color: '#2563eb',
          background: 'rgba(37, 99, 235, 0.14)',
          description:
            'Commandes selon les filtres'
        },
        {
          title: 'Produits en stock',
          value: '45 références',
          change: '-3',
          isPositive: false,
          icon: 'inventory_2',
          color: '#d97706',
          background: 'rgba(217, 119, 6, 0.14)',
          description:
            '3 produits nécessitent une vérification'
        },
        {
          title: 'Vues Stories B2WA',
          value: '3,2k',
          change: '+24%',
          isPositive: true,
          icon: 'auto_stories',
          color: '#9333ea',
          background: 'rgba(147, 51, 234, 0.14)',
          description:
            'Vues cumulées de vos stories'
        }
      ];
    });

  readonly salesPoints =
    computed<SalesPoint[]>(() => {
      const period = this.selectedPeriod();

      const orders = this.filteredOrders()
        .filter(
          (order) => order.status !== 'ANNULÉ'
        );

      const labels =
        this.getChartLabels(period);

      return labels.map((label) => {
        const matchingOrders =
          orders.filter((order) =>
            this.orderBelongsToLabel(
              order,
              label,
              period
            )
          );

        return {
          label,
          value: matchingOrders.reduce(
            (total, order) =>
              total + order.amount,
            0
          )
        };
      });
    });

  readonly chartMaxValue =
    computed<number>(() => {
      const values = this.salesPoints()
        .map((point) => point.value);

      const max = Math.max(...values, 0);

      return max === 0
        ? 100
        : this.roundChartMax(max);
    });

  readonly chartPoints =
    computed<ChartPoint[]>(() => {
      const points = this.salesPoints();

      if (points.length === 0) {
        return [];
      }

      const chartLeft = 55;
      const chartRight = 680;
      const chartTop = 25;
      const chartBottom = 255;

      const chartWidth =
        chartRight - chartLeft;

      const chartHeight =
        chartBottom - chartTop;

      const max = this.chartMaxValue();

      return points.map((point, index) => {
        const x = points.length === 1
          ? chartLeft + chartWidth / 2
          : chartLeft +
            (index / (points.length - 1)) *
              chartWidth;

        const y =
          chartBottom -
          (point.value / max) *
            chartHeight;

        return {
          label: point.label,
          value: point.value,
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2))
        };
      });
    });

  readonly salesLinePoints =
    computed<string>(() => {
      return this.chartPoints()
        .map(
          (point) =>
            `${point.x},${point.y}`
        )
        .join(' ');
    });

  readonly salesAreaPoints =
    computed<string>(() => {
      const points = this.chartPoints();

      if (points.length === 0) {
        return '';
      }

      const first = points[0];
      const last = points[points.length - 1];

      const linePoints = points
        .map(
          (point) =>
            `${point.x},${point.y}`
        )
        .join(' ');

      return [
        `${first.x},255`,
        linePoints,
        `${last.x},255`
      ].join(' ');
    });

  readonly chartGridLines =
    computed(() => {
      const max = this.chartMaxValue();

      return [0, 0.25, 0.5, 0.75, 1]
        .map((ratio) => ({
          y: 255 - ratio * 230,
          label: this.compactMoney(
            Math.round(max * ratio)
          )
        }));
    });

  readonly categoryDistribution =
    computed<CategorySale[]>(() => {
      const orders = this.filteredOrders()
        .filter(
          (order) => order.status !== 'ANNULÉ'
        );

      const totals = new Map<
        string,
        number
      >();

      for (const order of orders) {
        const current =
          totals.get(order.category) ?? 0;

        totals.set(
          order.category,
          current + order.amount
        );
      }

      const total =
        Array.from(totals.values())
          .reduce(
            (sum, value) =>
              sum + value,
            0
          );

      const colors: Record<
        string,
        string
      > = {
        'Céréales & Riz': '#16a34a',
        'Huiles & Conserves': '#0f2c59',
        'Sucre & Farine': '#d97706',
        'Autres': '#94a3b8'
      };

      return Array.from(totals.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({
          name,
          value,
          percentage:
            total === 0
              ? 0
              : Math.round(
                  (value / total) * 100
                ),
          color:
            colors[name] ?? '#64748b'
        }));
    });

  readonly categoryTotal =
    computed<number>(() => {
      return this.categoryDistribution()
        .reduce(
          (total, category) =>
            total + category.value,
          0
        );
    });

  readonly donutSegments =
    computed<DonutSegment[]>(() => {
      const categories =
        this.categoryDistribution();

      let cumulativePercentage = 0;

      return categories.map((category) => {
        const segment: DonutSegment = {
          ...category,
          dashArray:
            `${category.percentage} ` +
            `${100 - category.percentage}`,
          dashOffset:
            25 - cumulativePercentage
        };

        cumulativePercentage +=
          category.percentage;

        return segment;
      });
    });

  readonly topProducts =
    computed<TopProduct[]>(() => {
      const totals = new Map<
        string,
        number
      >();

      for (const order of this.filteredOrders()) {
        if (order.status === 'ANNULÉ') {
          continue;
        }

        const current =
          totals.get(order.product) ?? 0;

        totals.set(
          order.product,
          current + order.quantity
        );
      }

      const sortedProducts =
        Array.from(totals.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

      const max =
        sortedProducts[0]?.[1] ?? 1;

      return sortedProducts.map(
        ([name, quantity], index) => ({
          position: index + 1,
          name,
          quantity,
          progress: Math.round(
            (quantity / max) * 100
          )
        })
      );
    });

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  onPeriodChange(event: Event): void {
    const select =
      event.target as HTMLSelectElement;

    this.selectedPeriod.set(
      select.value as DashboardPeriod
    );

    this.lastUpdate = new Date();

    this.changeDetectorRef.markForCheck();
  }

  onCategoryChange(event: Event): void {
    const select =
      event.target as HTMLSelectElement;

    this.selectedCategory.set(select.value);

    this.lastUpdate = new Date();

    this.changeDetectorRef.markForCheck();
  }

  onStatusChange(event: Event): void {
    const select =
      event.target as HTMLSelectElement;

    this.selectedStatus.set(
      select.value as DashboardStatus
    );

    this.lastUpdate = new Date();

    this.changeDetectorRef.markForCheck();
  }

  onSearchChange(event: Event): void {
    const input =
      event.target as HTMLInputElement;

    this.searchTerm.set(input.value);

    this.changeDetectorRef.markForCheck();
  }

  resetFilters(): void {
    this.selectedPeriod.set('month');
    this.selectedCategory.set('ALL');
    this.selectedStatus.set('ALL');
    this.searchTerm.set('');
    this.lastUpdate = new Date();

    this.changeDetectorRef.markForCheck();
  }

  refreshDashboard(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.changeDetectorRef.markForCheck();

    setTimeout(() => {
      this.lastUpdate = new Date();
      this.loading = false;

      this.changeDetectorRef.markForCheck();
    }, 700);
  }

  selectedPeriodLabel(): string {
    const period = this.periods.find(
      (item) =>
        item.value === this.selectedPeriod()
    );

    return period?.label ?? 'Cette période';
  }

  exportOrdersPdf(): void {
    const ordersList =
      this.filteredOrders();

    if (
      ordersList.length === 0 ||
      this.exportingPdf
    ) {
      return;
    }

    this.exportingPdf = true;

    this.changeDetectorRef.markForCheck();

    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageWidth =
        doc.internal.pageSize.getWidth();

      const pageHeight =
        doc.internal.pageSize.getHeight();

      const margin = 12;

      const colors: PdfColors = {
        navy: [15, 44, 89],
        green: [22, 163, 74],
        dark: [30, 41, 59],
        muted: [100, 116, 139],
        light: [248, 250, 252],
        border: [226, 232, 240],
        white: [255, 255, 255]
      };

      this.drawPdfHeader(
        doc,
        pageWidth,
        margin,
        colors
      );

      this.drawPdfSummary(
        doc,
        pageWidth,
        margin,
        42,
        colors
      );

      const tableRows =
        ordersList.map((order) => [
          order.id,
          order.client,
          order.product,
          order.category,
          this.formatPdfMoney(order.amount),
          String(order.quantity),
          order.status,
          this.formatPdfDate(order.date)
        ]);

      autoTable(doc, {
        startY: 78,
        head: [['Référence','Client','Produit','Catégorie','Montant','Qté','Statut','Date' ]],
        body: tableRows,
        theme: 'grid',
        margin: {
          top: 36,
          right: margin,
          bottom: 18,
          left: margin
        },

        tableWidth: 'auto',

        showHead: 'everyPage',

        styles: {
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
          valign: 'middle',
          textColor: colors.dark,
          lineColor: colors.border,
          lineWidth: 0.2
        },

        headStyles: {
          fillColor: colors.navy,
          textColor: colors.white,
          fontStyle: 'bold',
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          cellPadding: 3.5
        },

        bodyStyles: {
          minCellHeight: 9
        },

        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },

        columnStyles: {
          0: {
            cellWidth: 30,
            fontStyle: 'bold'
          },

          1: {
            cellWidth: 40
          },

          2: {
            cellWidth: 55
          },

          3: {
            cellWidth: 45
          },

          4: {
            cellWidth: 39,
            halign: 'right',
            fontStyle: 'bold'
          },

          5: {
            cellWidth: 17,
            halign: 'center'
          },

          6: {
            cellWidth: 32,
            halign: 'center'
          },

          7: {
            cellWidth: 27,
            halign: 'center'
          }
        },

        didParseCell: (data) => {
          if (
            data.section === 'body' &&
            data.column.index === 6
          ) {
            const status =
              String(data.cell.raw);

            data.cell.styles.fontStyle =
              'bold';

            if (status === 'LIVRÉ') {
              data.cell.styles.textColor =
                [22, 163, 74];
            }

            if (status === 'EN COURS') {
              data.cell.styles.textColor =
                [37, 99, 235];
            }

            if (status === 'EN ATTENTE') {
              data.cell.styles.textColor =
                [217, 119, 6];
            }

            if (status === 'ANNULÉ') {
              data.cell.styles.textColor =
                [220, 38, 38];
            }
          }

          if (
            data.section === 'body' &&
            data.column.index === 4
          ) {
            data.cell.styles.textColor =
              colors.navy;

            data.cell.styles.fontStyle =
              'bold';
          }
        },

        didDrawPage: (data) => {
          this.drawPdfHeader(
            doc,
            pageWidth,
            margin,
            colors
          );

          this.drawPdfFooter(
            doc,
            pageWidth,
            pageHeight,
            data.pageNumber,
            colors
          );
        }
      });

      const totalPages =
        doc.getNumberOfPages();

      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        doc.setPage(page);

        this.drawPdfFooter(
          doc,
          pageWidth,
          pageHeight,
          page,
          colors,
          totalPages
        );
      }

      const filename =
        `rapport-commandes-b2wa-` +
        `${this.selectedPeriod()}-` +
        `${this.formatFileDate(new Date())}.pdf`;

      doc.save(filename);
    } catch (error) {
      console.error(
        'Erreur pendant la génération du PDF :',
        error
      );
    } finally {
      this.exportingPdf = false;

      this.changeDetectorRef.markForCheck();
    }
  }

  private drawPdfHeader(
    doc: jsPDF,
    pageWidth: number,
    margin: number,
    colors: PdfColors
  ): void {
    doc.setFillColor(...colors.navy);

    doc.rect(
      0,
      0,
      pageWidth,
      31,
      'F'
    );

    doc.setFillColor(...colors.green);

    doc.rect(
      0,
      29,
      pageWidth,
      2,
      'F'
    );

    doc.setTextColor(...colors.white);

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(20);

    doc.text(
      'B2WA',
      margin,
      14
    );

    doc.setFont(
      'helvetica',
      'normal'
    );

    doc.setFontSize(8);

    doc.text(
      'PLATEFORME COMMERÇANTE',
      margin,
      21
    );

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(13);

    doc.text(
      'RAPPORT DES COMMANDES',
      pageWidth - margin,
      14,
      {
        align: 'right'
      }
    );

    doc.setFont(
      'helvetica',
      'normal'
    );

    doc.setFontSize(8);

    doc.text(
      `Période : ${this.selectedPeriodLabel()}`,
      pageWidth - margin,
      21,
      {
        align: 'right'
      }
    );
  }

  private drawPdfSummary(
    doc: jsPDF,
    pageWidth: number,
    margin: number,
    startY: number,
    colors: PdfColors
  ): void {
    const contentWidth =
      pageWidth - margin * 2;

    const gap = 4;

    const cardWidth =
      (contentWidth - gap * 3) / 4;

    const cards = [
      {
        title: 'Chiffre d’affaires',
        value: this.formatPdfMoney(
          this.totalRevenue()
        ),
        color: colors.green
      },
      {
        title: 'Commandes filtrées',
        value: String(
          this.filteredOrders().length
        ),
        color: [37, 99, 235] as [
          number,
          number,
          number
        ]
      },
      {
        title: 'Panier moyen',
        value: this.formatPdfMoney(
          this.averageOrderValue()
        ),
        color: [217, 119, 6] as [
          number,
          number,
          number
        ]
      },
      {
        title: 'Taux de livraison',
        value: `${this.deliveryRate()}%`,
        color: [147, 51, 234] as [
          number,
          number,
          number
        ]
      }
    ];

    cards.forEach((card, index) => {
      const x =
        margin + index * (cardWidth + gap);

      doc.setFillColor(...colors.light);

      doc.roundedRect(
        x,
        startY,
        cardWidth,
        22,
        2,
        2,
        'F'
      );

      doc.setFillColor(...card.color);

      doc.roundedRect(
        x,
        startY,
        3,
        22,
        1.5,
        1.5,
        'F'
      );

      doc.setTextColor(...colors.muted);

      doc.setFont(
        'helvetica',
        'normal'
      );

      doc.setFontSize(7);

      doc.text(
        card.title,
        x + 8,
        startY + 8
      );

      doc.setTextColor(...colors.navy);

      doc.setFont(
        'helvetica',
        'bold'
      );

      doc.setFontSize(10);

      doc.text(
        card.value,
        x + 8,
        startY + 16
      );
    });

    const filtersY = startY + 29;

    doc.setTextColor(...colors.muted);

    doc.setFont(
      'helvetica',
      'normal'
    );

    doc.setFontSize(7.5);

    doc.text(
      `Filtres : ${this.selectedPeriodLabel()} | ` +
      `Catégorie : ${this.getCategoryLabel()} | ` +
      `Statut : ${this.getStatusLabel()}`,
      margin,
      filtersY
    );

    doc.text(
      `Généré le : ${this.formatPdfDateTime(new Date())}`,
      pageWidth - margin,
      filtersY,
      {
        align: 'right'
      }
    );
  }

  private drawPdfFooter(
    doc: jsPDF,
    pageWidth: number,
    pageHeight: number,
    pageNumber: number,
    colors: PdfColors,
    totalPages?: number
  ): void {
    const footerY =
      pageHeight - 8;

    doc.setDrawColor(...colors.border);

    doc.setLineWidth(0.3);

    doc.line(
      12,
      footerY - 4,
      pageWidth - 12,
      footerY - 4
    );

    doc.setTextColor(...colors.muted);

    doc.setFont(
      'helvetica',
      'normal'
    );

    doc.setFontSize(7);

    doc.text(
      'B2WA - Rapport généré automatiquement',
      12,
      footerY
    );

    const pageLabel = totalPages
      ? `Page ${pageNumber} sur ${totalPages}`
      : `Page ${pageNumber}`;

    doc.text(
      pageLabel,
      pageWidth - 12,
      footerY,
      {
        align: 'right'
      }
    );
  }

  private getCategoryLabel(): string {
    const category =
      this.selectedCategory();

    return category === 'ALL'
      ? 'Toutes les catégories'
      : category;
  }

  private getStatusLabel(): string {
    const status =
      this.selectedStatus();

    return status === 'ALL'
      ? 'Tous les statuts'
      : status;
  }

  private getPeriodStartDate(
    period: DashboardPeriod
  ): Date {
    const now = new Date();

    const start = new Date(now);

    start.setHours(0, 0, 0, 0);

    switch (period) {
      case 'today':
        return start;

      case 'week': {
        const day = start.getDay();

        const difference =
          day === 0 ? 6 : day - 1;

        start.setDate(
          start.getDate() - difference
        );

        return start;
      }

      case 'month':
        start.setDate(1);
        return start;

      case 'quarter':
        start.setMonth(
          start.getMonth() - 2
        );

        start.setDate(1);

        return start;

      case 'year':
        start.setMonth(0);
        start.setDate(1);

        return start;

      default:
        return start;
    }
  }

  private getChartLabels(
    period: DashboardPeriod
  ): string[] {
    switch (period) {
      case 'today':
        return ['08h','10h','12h','14h','16h','18h','20h'];

      case 'week':
        return ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

      case 'month':
        return ['01','05','10','15','20','25','30'];

      case 'quarter':
        return ['M-2','M-1','Mois actuel'];

      case 'year':
        return ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];

      default:
        return [];
    }
  }

  private orderBelongsToLabel(
    order: OrderItem,
    label: string,
    period: DashboardPeriod
  ): boolean {
    const date = new Date(order.date);
    const now = new Date();

    switch (period) {
      case 'today': {
        const hour = date.getHours();

        if (label === '08h') {
          return hour < 10;
        }

        if (label === '10h') {
          return hour >= 10 && hour < 12;
        }

        if (label === '12h') {
          return hour >= 12 && hour < 14;
        }

        if (label === '14h') {
          return hour >= 14 && hour < 16;
        }

        if (label === '16h') {
          return hour >= 16 && hour < 18;
        }

        if (label === '18h') {
          return hour >= 18 && hour < 20;
        }

        return hour >= 20;
      }

      case 'week': {
        const dayNames = [
          'Dim',
          'Lun',
          'Mar',
          'Mer',
          'Jeu',
          'Ven',
          'Sam'
        ];

        return (
          dayNames[date.getDay()] === label
        );
      }

      case 'month': {
        const day = date.getDate();

        if (label === '01') {
          return day <= 4;
        }

        if (label === '05') {
          return day >= 5 && day <= 9;
        }

        if (label === '10') {
          return day >= 10 && day <= 14;
        }

        if (label === '15') {
          return day >= 15 && day <= 19;
        }

        if (label === '20') {
          return day >= 20 && day <= 24;
        }

        if (label === '25') {
          return day >= 25 && day <= 29;
        }

        return day >= 30;
      }

      case 'quarter': {
        const currentMonth =
          now.getMonth();

        const currentYear =
          now.getFullYear();

        const orderMonth =
          date.getMonth();

        const orderYear =
          date.getFullYear();

        const monthDifference =
          (currentYear - orderYear) * 12 +
          (currentMonth - orderMonth);

        if (label === 'Mois actuel') {
          return monthDifference === 0;
        }

        if (label === 'M-1') {
          return monthDifference === 1;
        }

        return monthDifference >= 2;
      }

      case 'year': {
        const monthNames = [
          'Jan',
          'Fév',
          'Mar',
          'Avr',
          'Mai',
          'Juin',
          'Juil',
          'Août',
          'Sep',
          'Oct',
          'Nov',
          'Déc'
        ];

        return (
          monthNames[date.getMonth()] === label
        );
      }

      default:
        return false;
    }
  }

  private roundChartMax(value: number): number {
    if (value <= 1000) {
      return 1000;
    }

    const magnitude = Math.pow(
      10,
      Math.floor(Math.log10(value))
    );

    return Math.ceil(
      value / magnitude
    ) * magnitude;
  }

  private formatMoney(value: number): string {
    return `${new Intl.NumberFormat('fr-FR').format(value)} FCFA`;
  }

  private formatPdfMoney(value: number): string {
    return `${new Intl.NumberFormat('fr-FR').format(value)} FCFA`;
  }

  private compactMoney(value: number): string {
    if (value >= 1000000) {
      return `${(
        value / 1000000
      ).toFixed(1)}M`;
    }

    if (value >= 1000) {
      return `${Math.round(
        value / 1000
      )}k`;
    }

    return String(value);
  }

  private formatDate(
    dateString: string
  ): string {
    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    ).format(new Date(dateString));
  }

  private formatPdfDate(
    dateString: string
  ): string {
    return this.formatDate(dateString);
  }

  private formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(date);
  }

  private formatPdfDateTime(date: Date): string {
    return this.formatDateTime(date);
  }

  private formatFileDate(date: Date): string {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private startAutoRefresh(): void {
    this.refreshTimer = setInterval(() => {
      this.refreshDashboard();
    }, 60000);
  }

  private stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }
}