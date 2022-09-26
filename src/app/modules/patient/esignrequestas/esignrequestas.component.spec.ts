import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignrequestasComponent } from './esignrequestas.component';

describe('EsignrequestasComponent', () => {
  let component: EsignrequestasComponent;
  let fixture: ComponentFixture<EsignrequestasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsignrequestasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignrequestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
