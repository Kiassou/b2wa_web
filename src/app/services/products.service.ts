import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  minStockThreshold: number;
  isActive: boolean;
  images: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly STORAGE_KEY = 'b2wa_products';

  private readonly productsSubject = new BehaviorSubject<Product[]>(
    this.loadProducts()
  );

  readonly products$ = this.productsSubject.asObservable();

  /* =====================================================
     GET PRODUCTS
  ====================================================== */

  getProducts(): Product[] {
    return this.productsSubject.value;
  }

  /* =====================================================
     GET PRODUCT BY ID
  ====================================================== */

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(product => product.id === id);
  }

  /* =====================================================
     ADD PRODUCT
  ====================================================== */

  addProduct(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Product {
    const now = new Date().toISOString();

    const newProduct: Product = {
      ...product,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    };

    const products = [newProduct, ...this.getProducts()];
    this.saveProducts(products);

    return newProduct;
  }

  /* =====================================================
     UPDATE PRODUCT
  ====================================================== */

  updateProduct(
    id: string,
    data: Partial<Product>
  ): Product | undefined {
    let updatedProduct: Product | undefined;

    const products = this.getProducts().map(product => {
      if (product.id !== id) {
        return product;
      }

      updatedProduct = {
        ...product,
        ...data,
        updatedAt: new Date().toISOString()
      };

      return updatedProduct;
    });

    this.saveProducts(products);

    return updatedProduct;
  }

  /* =====================================================
     UPDATE PRODUCT STATUS
  ====================================================== */

  updateProductStatus(
    id: string,
    isActive: boolean
  ): Product | undefined {
    return this.updateProduct(id, { isActive });
  }

  /* =====================================================
     TOGGLE STATUS
  ====================================================== */

  toggleStatus(id: string): Product | undefined {
    const product = this.getProductById(id);

    if (!product) {
      return undefined;
    }

    return this.updateProduct(id, {
      isActive: !product.isActive
    });
  }

  /* =====================================================
     LOAD PRODUCTS
  ====================================================== */

  private loadProducts(): Product[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);

    if (!stored) {
      const defaultProducts = this.getDefaultProducts();
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(defaultProducts)
      );
      return defaultProducts;
    }

    try {
      const parsed = JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map(product => this.normalizeProduct(product));
    } catch {
      return [];
    }
  }

  /* =====================================================
     SAVE PRODUCTS
  ====================================================== */

  private saveProducts(products: Product[]): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(products)
    );

    this.productsSubject.next(products);
  }

  /* =====================================================
     NORMALIZE PRODUCT
  ====================================================== */

  private normalizeProduct(product: Partial<Product>): Product {
    const now = new Date().toISOString();

    return {
      id: product.id || this.generateId(),
      name: product.name || '',
      sku: product.sku || '',
      category: product.category || '',
      description: product.description || '',
      price: Number(product.price || 0),
      stock: Number(product.stock || 0),
      minStockThreshold: Number(product.minStockThreshold || 5),
      isActive: product.isActive ?? true,
      images: Array.isArray(product.images) ? product.images : [],
      imageUrl: product.imageUrl || '',
      createdAt: product.createdAt || now,
      updatedAt: product.updatedAt || product.createdAt || now
    };
  }

  /* =====================================================
     GENERATE ID
  ====================================================== */

  private generateId(): string {
    return [
      'B2WA-PROD',
      Date.now().toString(36).toUpperCase(),
      Math.random().toString(36).substring(2, 7).toUpperCase()
    ].join('-');
  }

  /* =====================================================
     DEFAULT PRODUCTS
  ====================================================== */

  private getDefaultProducts(): Product[] {
    const now = new Date().toISOString();

    return [
      {
        id: 'PRD-001',
        name: 'Ordinateur Portable Pro',
        sku: 'LAP-102',
        category: 'Électronique',
        price: 450000,
        stock: 12,
        minStockThreshold: 3,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'Ordinateur portable professionnel performant.',
        createdAt: now,
        updatedAt: now
      },

      {
        id: 'PRD-002',
        name: 'Smartphone X 128GB',
        sku: 'PHN-908',
        category: 'Électronique',
        price: 210000,
        stock: 2,
        minStockThreshold: 5,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'Smartphone moderne avec stockage 128GB.',
        createdAt: now,
        updatedAt: now
      },

      {
        id: 'PRD-003',
        name: 'Jus d\'Orange Pur 1L',
        sku: 'BEV-001',
        category: 'Alimentation',
        price: 1200,
        stock: 0,
        minStockThreshold: 10,
        isActive: false,
        imageUrl: '',
        images: [],
        description:
          'Jus d\'orange naturel.',
        createdAt: now,
        updatedAt: now
      },

      {
        id: 'PRD-004',
        name: 'Casque Audio Sans Fil',
        sku: 'AUD-345',
        category: 'Électronique',
        price: 35000,
        stock: 18,
        minStockThreshold: 5,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'Casque audio sans fil haute qualité.',
        createdAt: now,
        updatedAt: now
      },

      {
        id: 'PRD-005',
        name: 'T-Shirt Premium B2WA',
        sku: 'TSH-221',
        category: 'Mode & Textile',
        price: 15000,
        stock: 7,
        minStockThreshold: 4,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'T-shirt premium aux couleurs B2WA.',
        createdAt: now,
        updatedAt: now
      },

      {
        id: 'PRD-006',
        name: 'Lampe de Bureau LED',
        sku: 'DEC-119',
        category: 'Maison & Déco',
        price: 18500,
        stock: 1,
        minStockThreshold: 5,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'Lampe LED moderne pour bureau.',
        createdAt: now,
        updatedAt: now
      },

      {
        id: 'PRD-007',
        name: 'Crème Hydratante Visage',
        sku: 'BEA-772',
        category: 'Santé & Beauté',
        price: 9500,
        stock: 24,
        minStockThreshold: 6,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'Crème hydratante pour le visage.',
        createdAt: now,
        updatedAt: now
      },

      {
        id: 'PRD-008',
        name: 'Riz Parfumé 5KG',
        sku: 'ALI-510',
        category: 'Alimentation',
        price: 8500,
        stock: 0,
        minStockThreshold: 10,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'Riz parfumé premium 5KG.',
        createdAt: now,
        updatedAt: now
      },

      {
        id: 'PRD-009',
        name: 'Table Basse Moderne',
        sku: 'HOM-845',
        category: 'Maison & Déco',
        price: 75000,
        stock: 4,
        minStockThreshold: 2,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'Table basse moderne pour salon.',
        createdAt: now,
        updatedAt: now
      },

      {
        id: 'PRD-010',
        name: 'Montre Classique Élégante',
        sku: 'MOD-921',
        category: 'Mode & Textile',
        price: 42000,
        stock: 3,
        minStockThreshold: 5,
        isActive: false,
        imageUrl: '',
        images: [],
        description:
          'Montre élégante et intemporelle.',
        createdAt: now,
        updatedAt: now
      }
    ];
  }

  /* =====================================================
   RESET TO DEFAULT PRODUCTS
  ====================================================== */
  resetToDefaultProducts(): Product[] {
    const defaultProducts = this.getDefaultProducts();
    this.saveProducts(defaultProducts);
    return defaultProducts;
  }
}