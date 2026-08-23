import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFlashSale } from './update-flash-sale';

describe('UpdateFlashSale', () => {
  let component: UpdateFlashSale;
  let fixture: ComponentFixture<UpdateFlashSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFlashSale],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateFlashSale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
