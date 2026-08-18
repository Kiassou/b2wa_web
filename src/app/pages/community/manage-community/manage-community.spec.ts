import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCommunity } from './manage-community';

describe('ManageCommunity', () => {
  let component: ManageCommunity;
  let fixture: ComponentFixture<ManageCommunity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCommunity],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageCommunity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
