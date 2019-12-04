import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(
    private http: HttpClient) {}

  getGitHubInfo(userId) {
    return this.http.get(`https://api.github.com/users/${userId}`)
      .pipe(
        map((response: any) => response)
      );
  }

  createUser(user: User) {
    return this.http.post(`${environment.databaseUrl}/users/${user.userId}.json`, user)
      .pipe(
        map((response: any) => response)
      );
  }

  getUserById(userId: string) {
    return this.http.get<User>(`${environment.databaseUrl}/users/${userId}.json`)
      .pipe(
        map((user: User) => {
          return {
            ...Object.values(user)[0]
          };
        })
      );
  }
}
