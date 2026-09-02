import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStoryModal } from './create-story-modal';

describe('CreateStoryModal', () => {
  let component: CreateStoryModal;
  let fixture: ComponentFixture<CreateStoryModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStoryModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateStoryModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
