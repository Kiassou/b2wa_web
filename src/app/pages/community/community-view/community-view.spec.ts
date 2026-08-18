import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityView } from './community-view';

describe('CommunityView', () => {
  let component: CommunityView;
  let fixture: ComponentFixture<CommunityView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityView],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
