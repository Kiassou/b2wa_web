import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinedCommunities } from './joined-communities';

describe('JoinedCommunities', () => {
  let component: JoinedCommunities;
  let fixture: ComponentFixture<JoinedCommunities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinedCommunities],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinedCommunities);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
