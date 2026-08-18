import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSuccessModal } from './live-success-modal';

describe('LiveSuccessModal', () => {
  let component: LiveSuccessModal;
  let fixture: ComponentFixture<LiveSuccessModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveSuccessModal],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveSuccessModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
