import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterInfo } from './register-info';

describe('RegisterInfo', () => {
  let component: RegisterInfo;
  let fixture: ComponentFixture<RegisterInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
