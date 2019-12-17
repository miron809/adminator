import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [DatePipe]
})
export class WeatherComponent implements OnInit {
  weatherAll: [] = null;
  daysList = [];
  form: FormGroup;
  geolocate = false;

  constructor(
    private datePipe: DatePipe,
    private weatherService: WeatherService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getWeatherByCity('london');
    this.buildForm();
  }

  buildForm() {
    this.form = new FormGroup({
      city: new FormControl(null, [Validators.required])
    });
  }

  getWeatherByCity(city: string) {
    this.spinner.show('weather');

    this.weatherService.getWeatherByCity(city)
      .pipe()
      .subscribe(
        (response) => {
          this.handleResponse(response);
          this.spinner.hide('weather');
        },
        (error) => {
          this.spinner.hide('weather');
          this.toastr.error(error.error.message);
        }
      );

  }

  getWeatherByCoord() {
    this.spinner.show('weather');

    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(position => {
        this.geolocate = true;

        this.weatherService.getWeatherByCoord(position.coords.latitude, position.coords.longitude)
          .pipe()
          .subscribe(
            (response) => {
              this.handleResponse(response);
              this.spinner.hide('weather');
            },
            (error => {
              this.spinner.hide('weather');
              this.toastr.error(error.error.message);
            })
          );
      });
    }
    this.spinner.hide('weather');
  }

  handleResponse(response) {
    this.daysList = [];
    for (const item of response.list) {
      if ( !this.daysList.some(day => {
        return this.datePipe.transform(day.dt * 1000, 'EEEE') === this.datePipe.transform(item.dt * 1000, 'EEEE');
      })
      ) {
        this.daysList.push(item);
      }
    }
    this.weatherAll = response;
  }

}
