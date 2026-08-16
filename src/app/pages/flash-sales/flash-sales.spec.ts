import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashSales } from './flash-sales';

describe('FlashSales', () => {
  let component: FlashSales;
  let fixture: ComponentFixture<FlashSales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashSales],
    }).compileComponents();

    fixture = TestBed.createComponent(FlashSales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
