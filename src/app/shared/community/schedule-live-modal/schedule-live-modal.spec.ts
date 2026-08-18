import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleLiveModal } from './schedule-live-modal';

describe('ScheduleLiveModal', () => {
  let component: ScheduleLiveModal;
  let fixture: ComponentFixture<ScheduleLiveModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleLiveModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleLiveModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
