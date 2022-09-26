import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadflowBillingComponent } from './radflow-billing.component';

describe('RadflowBillingComponent', () => {
  let component: RadflowBillingComponent;
  let fixture: ComponentFixture<RadflowBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadflowBillingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadflowBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
