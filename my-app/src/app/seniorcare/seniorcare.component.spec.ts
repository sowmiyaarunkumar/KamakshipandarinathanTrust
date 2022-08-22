import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorcareComponent } from './seniorcare.component';

describe('SeniorcareComponent', () => {
  let component: SeniorcareComponent;
  let fixture: ComponentFixture<SeniorcareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeniorcareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeniorcareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
