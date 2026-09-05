import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePublicationModal } from './create-publication-modal';

describe('CreatePublicationModal', () => {
  let component: CreatePublicationModal;
  let fixture: ComponentFixture<CreatePublicationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePublicationModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePublicationModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
