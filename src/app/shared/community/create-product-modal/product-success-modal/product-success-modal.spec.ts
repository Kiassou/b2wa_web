import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSuccessModal } from './product-success-modal';

describe('ProductSuccessModal', () => {
  let component: ProductSuccessModal;
  let fixture: ComponentFixture<ProductSuccessModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSuccessModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSuccessModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
