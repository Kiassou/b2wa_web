import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCommercant } from './register-commercant';

describe('RegisterCommercant', () => {
  let component: RegisterCommercant;
  let fixture: ComponentFixture<RegisterCommercant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCommercant],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterCommercant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
