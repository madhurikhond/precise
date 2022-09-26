import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LienManagementComponent } from './lien-management.component';

describe('LienManagementComponent', () => {
  let component: LienManagementComponent;
  let fixture: ComponentFixture<LienManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LienManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LienManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
