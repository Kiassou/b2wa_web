import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProducts } from './update-products';

describe('UpdateProducts', () => {
  let component: UpdateProducts;
  let fixture: ComponentFixture<UpdateProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProducts],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
