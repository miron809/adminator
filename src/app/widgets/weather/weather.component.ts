import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [DatePipe]
})
export class WeatherComponent implements OnInit {
  weatherAll: [] = null;
  daysList = [];

  constructor(
    private datePipe: DatePipe,
    private weatherService: WeatherService,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(position => {
        this.getWeatherByCoord(position.coords.latitude, position.coords.longitude);
      });
    }
  }

  getWeatherByCoord(lat, lon) {
    this.weatherService.getWeatherByCoord(lat, lon)
      .pipe()
      .subscribe(
        (response) => {
          for (const item of response.list) {
            if ( !this.daysList.some(day => {
              return this.datePipe.transform(day.dt * 1000, 'EEEE') === this.datePipe.transform(item.dt * 1000, 'EEEE');
            })
            ) {
              this.daysList.push(item);
            }
          }
          console.log(this.daysList)
          this.weatherAll = response;
          console.log(this.weatherAll)
        },
        (error => {
          this.toastr.error(error.message);
        })
      );
  }

}
