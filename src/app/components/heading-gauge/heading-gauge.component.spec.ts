import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingGaugeComponent } from './heading-gauge.component';

describe('HeadingGaugeComponent', () => {
  let component: HeadingGaugeComponent;
  let fixture: ComponentFixture<HeadingGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadingGaugeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadingGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
