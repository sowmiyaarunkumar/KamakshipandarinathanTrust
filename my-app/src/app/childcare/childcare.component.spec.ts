import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildcareComponent } from './childcare.component';

describe('ChildcareComponent', () => {
  let component: ChildcareComponent;
  let fixture: ComponentFixture<ChildcareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildcareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildcareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
