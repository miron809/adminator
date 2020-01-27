import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { VisitChartsService } from './visit-charts.service';
import { Chart } from '../../shared/interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-visit-charts',
  templateUrl: './visit-charts.component.html',
  styleUrls: ['./visit-charts.component.scss']
})
export class VisitChartsComponent implements OnInit, OnDestroy {

  unsubscriber: Subject<void> = new Subject<void>();

  chartUpdated = false;

  charts: Chart[] = [];
  public chartLegend = false;
  public chartType: ChartType = 'polarArea';
  public chartLabels: Label[] = [];
  public chartData: SingleDataSet = [];
  public chartColors: any[] = [];
  public chartColors: any[] = [];

  constructor(private visitChartsService: VisitChartsService) { }

  ngOnInit() {
    this.getCharts();
  }

  getCharts() {
    this.visitChartsService.getCharts()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(
        (charts: Chart[]) => {
          if (charts) {
            this.createChart(charts);
          }
        }
      );
  }

  createChart(charts) {
    this.charts = Object.values(charts)[0];

    const backgroundColor: any[] = [];
    const borderColor: any[] = [];

    this.charts.forEach(item => {
      this.chartData.push(item.value);
      this.chartLabels.push(item.label);
      backgroundColor.push(item.backgroundColor);
      borderColor.push(item.borderColor);
    });
    this.chartColors.push({backgroundColor, borderColor})

    this.chartUpdated = true;
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

}
