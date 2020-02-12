import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})

export class WeatherService {
  constructor(private http: HttpClient) {
  }

  getWeatherByCoord(lat, lon) {
    return this.http.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${environment.weatherApiKey}`);
  }

  getWeatherByCity(city) {
    return this.http.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${environment.weatherApiKey}`);
  }
}
