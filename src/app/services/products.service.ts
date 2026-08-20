import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  status: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly STORAGE_KEY = 'b2wa_products';

  private productsSubject =
    new BehaviorSubject<Product[]>(this.loadProducts());

  products$ = this.productsSubject.asObservable();


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
    return this.getProducts().find(
      product => product.id === id
    );
  }


  /* =====================================================
     ADD PRODUCT
  ====================================================== */

  addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {

    const newProduct: Product = {
      ...product,

      id: this.generateId(),

      createdAt: new Date().toISOString()
    };

    const products = [
      newProduct,
      ...this.getProducts()
    ];

    this.saveProducts(products);

    return newProduct;
  }


  /* =====================================================
     UPDATE PRODUCT
  ====================================================== */

  updateProduct(
    id: string,
    data: Partial<Product>
  ): void {

    const products = this.getProducts().map(product => {

      if (product.id !== id) {
        return product;
      }

      return {
        ...product,
        ...data
      };

    });

    this.saveProducts(products);
  }


  /* =====================================================
     TOGGLE STATUS
  ====================================================== */

  toggleStatus(id: string): void {

    const products = this.getProducts().map(product => {

      if (product.id !== id) {
        return product;
      }

      return {
        ...product,
        status: !product.status
      };

    });

    this.saveProducts(products);
  }


  /* =====================================================
     DELETE
     Pour le moment on ne supprime pas les produits.
  ====================================================== */

  // Aucun delete volontairement.
  // B2WA utilise activation / désactivation.


  /* =====================================================
     PRIVATE — LOAD
  ====================================================== */

  private loadProducts(): Product[] {

    const stored =
      localStorage.getItem(this.STORAGE_KEY);

    if (!stored) {

      const defaultProducts =
        this.getDefaultProducts();

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(defaultProducts)
      );

      return defaultProducts;
    }

    try {

      return JSON.parse(stored);

    } catch {

      return [];
    }
  }


  /* =====================================================
     PRIVATE — SAVE
  ====================================================== */

  private saveProducts(
    products: Product[]
  ): void {

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(products)
    );

    this.productsSubject.next(products);
  }


  /* =====================================================
     PRIVATE — ID
  ====================================================== */

  private generateId(): string {

    return (
      'B2WA-PROD-' +
      Date.now().toString(36).toUpperCase() +
      '-' +
      Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase()
    );
  }


  /* =====================================================
     DEFAULT PRODUCTS
  ====================================================== */

  private getDefaultProducts(): Product[] {

    return [
      {
        id: 'B2WA-PROD-001',
        title: 'Sac artisanal malien',
        category: 'Artisanat',
        description:
          'Sac artisanal fabriqué à la main.',
        price: 15000,
        stock: 24,
        images: [],
        status: true,
        createdAt: new Date().toISOString()
      },

      {
        id: 'B2WA-PROD-002',
        title: 'Tissu traditionnel',
        category: 'Mode',
        description:
          'Tissu traditionnel de qualité supérieure.',
        price: 25000,
        stock: 12,
        images: [],
        status: true,
        createdAt: new Date().toISOString()
      }
    ];
  }
}