import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FbAuthResponse, User } from '../interfaces';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(private http: HttpClient) {}

  get token(): string {
    const expDate = new Date(localStorage.getItem('expToken'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('idToken');
  }

  login(user: User) {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken)
      );
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(response: FbAuthResponse | null) {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('idToken', response.idToken);
      localStorage.setItem('expToken', expDate.toString());
    } else {
      localStorage.clear();
    }
  }

}
