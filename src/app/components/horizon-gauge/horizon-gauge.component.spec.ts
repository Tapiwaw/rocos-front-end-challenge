import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizonGaugeComponent } from './horizon-gauge.component';

describe('HorizonGaugeComponent', () => {
  let component: HorizonGaugeComponent;
  let fixture: ComponentFixture<HorizonGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorizonGaugeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizonGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
