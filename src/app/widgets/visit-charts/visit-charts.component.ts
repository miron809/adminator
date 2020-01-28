import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { VisitChartsService } from './visit-charts.service';
import { Chart } from '../../shared/interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-visit-charts',
  templateUrl: './visit-charts.component.html',
  styleUrls: ['./visit-charts.component.scss'],
  animations: [
    trigger('progressbar', [
      transition(':enter', [
        animate('2s', keyframes([
          style({width: '0'}),
          style({width: '{{width}}'}),
        ]))
      ]),
    ])
  ]
})
export class VisitChartsComponent implements OnInit, OnDestroy {

  unsubscriber: Subject<void> = new Subject<void>();

  chartUpdated = false;

  charts: Chart[] = [];
  public chartLegend = false;
  public chartType: ChartType = 'polarArea';
  public chartLabels: Label[] = [];
  public chartData = [];
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
    const chartsTemp: any = Object.values(charts)[0];
    this.charts = [...chartsTemp];

    const backgroundColor: any[] = [];
    const borderColor: any[] = [];

    this.charts.forEach(item => {
      this.chartData.push(item.value);
      this.chartLabels.push(item.label);
      backgroundColor.push(item.backgroundColor);
      borderColor.push(item.borderColor);
    });
    this.chartColors.push({backgroundColor, borderColor});

    this.chartUpdated = true;
  }

  progressBar(value) {
    if (this.chartData.length > 0) {
      const sum = this.chartData.reduce((accum, current) => accum + current, 0);
      const width = value * 100 / sum;
      return width.toFixed(1) + '%';
    }
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

}
