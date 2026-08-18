import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSuccessModal } from './post-success-modal';

describe('PostSuccessModal', () => {
  let component: PostSuccessModal;
  let fixture: ComponentFixture<PostSuccessModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostSuccessModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PostSuccessModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
