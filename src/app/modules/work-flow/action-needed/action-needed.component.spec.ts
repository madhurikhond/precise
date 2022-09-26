import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionNeededComponent } from './action-needed.component';

describe('ActionNeededComponent', () => {
  let component: ActionNeededComponent;
  let fixture: ComponentFixture<ActionNeededComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionNeededComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionNeededComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
