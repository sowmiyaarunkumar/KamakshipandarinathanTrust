import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheraphyServicesComponent } from './theraphy-services.component';

describe('TheraphyServicesComponent', () => {
  let component: TheraphyServicesComponent;
  let fixture: ComponentFixture<TheraphyServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheraphyServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheraphyServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
