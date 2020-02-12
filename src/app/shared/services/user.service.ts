import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(
    private http: HttpClient) {}

  getGitHubInfo(userId) {
    return this.http.get(`https://api.github.com/users/${userId}`);
  }

  updateUserProfile(user: User) {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${environment.apiKey}`, user);
  }

  getUserById(userId) {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${environment.apiKey}`, userId);
  }
}
