import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityPicker } from './community-picker';

describe('CommunityPicker', () => {
  let component: CommunityPicker;
  let fixture: ComponentFixture<CommunityPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
