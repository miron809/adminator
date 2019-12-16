import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  constructor(private weatherService: WeatherService) { }

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
          console.log(response);
        }
      );
  }

}
