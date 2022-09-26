import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadPortalTabComponent } from './rad-portal-tab.component';

describe('RadPortalTabComponent', () => {
  let component: RadPortalTabComponent;
  let fixture: ComponentFixture<RadPortalTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadPortalTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadPortalTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
