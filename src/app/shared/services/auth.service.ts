import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FbAuthResponse, User } from '../interfaces';
import { environment } from '../../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(
    private http: HttpClient,
    private toastr: ToastrService) {}

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
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }

  signUp(user: User) {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }

  getGitHubInfo(userId) {
    return this.http.get(`https://api.github.com/users/${userId}`)
      .pipe(
        map((response): any => response)
      );
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse) {
    this.toastr.error(error.error.error.message);
    return throwError(error.error.error);
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
