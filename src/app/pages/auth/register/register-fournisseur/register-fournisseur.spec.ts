import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFournisseur } from './register-fournisseur';

describe('RegisterFournisseur', () => {
  let component: RegisterFournisseur;
  let fixture: ComponentFixture<RegisterFournisseur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFournisseur],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFournisseur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
