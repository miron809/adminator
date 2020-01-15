import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Email } from '../interfaces';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})

export class EmailService {

  constructor(private http: HttpClient) {}

  getEmails() {
    return this.http.get<Email>(`${environment.databaseUrl}/emails.json`)
      .pipe(map( (response): any => response));
  }

  sendEmail(email: Email) {
    return this.http.post<Email>(`${environment.databaseUrl}/emails.json`, email)
      .pipe(map( (response): any => response));
  }
}
