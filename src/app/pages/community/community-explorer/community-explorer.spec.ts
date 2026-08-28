import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityExplorer } from './community-explorer';

describe('CommunityExplorer', () => {
  let component: CommunityExplorer;
  let fixture: ComponentFixture<CommunityExplorer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityExplorer],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityExplorer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
