import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseUpdateAndCollectionComponent } from './case-update-and-collection.component';

describe('CaseUpdateAndCollectionComponent', () => {
  let component: CaseUpdateAndCollectionComponent;
  let fixture: ComponentFixture<CaseUpdateAndCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseUpdateAndCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseUpdateAndCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
