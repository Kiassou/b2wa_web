import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterHelp } from './register-help';

describe('RegisterHelp', () => {
  let component: RegisterHelp;
  let fixture: ComponentFixture<RegisterHelp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterHelp],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterHelp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
