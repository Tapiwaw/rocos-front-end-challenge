import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterHeaderComponent } from './cluster-header.component';

describe('ClusterHeaderComponent', () => {
  let component: ClusterHeaderComponent;
  let fixture: ComponentFixture<ClusterHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClusterHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
