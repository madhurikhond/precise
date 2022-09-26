import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBillAndHoldLienComponent } from './generate-bill-and-hold-lien.component';

describe('GenerateBillAndHoldLienComponent', () => {
  let component: GenerateBillAndHoldLienComponent;
  let fixture: ComponentFixture<GenerateBillAndHoldLienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateBillAndHoldLienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateBillAndHoldLienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
