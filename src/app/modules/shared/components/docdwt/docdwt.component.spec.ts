import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocdwtComponent } from './docdwt.component';

describe('DocdwtComponent', () => {
  let component: DocdwtComponent;
  let fixture: ComponentFixture<DocdwtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocdwtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocdwtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
