import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Chart } from '../../shared/interfaces';

@Injectable({providedIn: 'root'})

export class VisitChartsService {
  constructor(private http: HttpClient) {}

  getCharts() {
    return this.http.get<Chart>(`${environment.databaseUrl}/charts.json`)
      .pipe(map( (response): any => response));
  }
}
