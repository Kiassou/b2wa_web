import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountVerify } from './account-verify';

describe('AccountVerify', () => {
  let component: AccountVerify;
  let fixture: ComponentFixture<AccountVerify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountVerify],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountVerify);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
