import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFlashSale } from './create-flash-sale';

describe('CreateFlashSale', () => {
  let component: CreateFlashSale;
  let fixture: ComponentFixture<CreateFlashSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFlashSale],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateFlashSale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
