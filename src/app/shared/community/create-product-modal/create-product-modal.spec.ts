import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductModal } from './create-product-modal';

describe('CreateProductModal', () => {
  let component: CreateProductModal;
  let fixture: ComponentFixture<CreateProductModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProductModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
