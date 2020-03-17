import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BriefChartComponent } from './brief-chart.component';

describe('BriefChartComponent', () => {
  let component: BriefChartComponent;
  let fixture: ComponentFixture<BriefChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BriefChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BriefChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
