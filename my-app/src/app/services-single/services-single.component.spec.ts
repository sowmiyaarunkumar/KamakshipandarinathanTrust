import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesSingleComponent } from './services-single.component';

describe('ServicesSingleComponent', () => {
  let component: ServicesSingleComponent;
  let fixture: ComponentFixture<ServicesSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
