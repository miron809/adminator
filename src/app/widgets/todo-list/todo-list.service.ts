import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToDo } from '../../shared/interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})

export class TodoListService {
  constructor(private http: HttpClient) {}

  create(todo: ToDo): Observable<ToDo> {
    return this.http.post(`${environment.databaseUrl}/todoLists.json`, todo)
      .pipe(map( (response: any) => {
        return {
          ...todo,
          id: response.name
        };
      }));
  }

  getAll(): Observable<ToDo[]> {
    return this.http.get(`${environment.databaseUrl}/todoLists.json`)
      .pipe(map((response: any) => {
        return Object
          .keys(response)
          .map(key => ({...response[key], id: key}))
          .reverse();
      }));
  }

  update(todo: ToDo): Observable<ToDo> {
    return this.http.patch<ToDo>(`${environment.databaseUrl}/todoLists/${todo.id}.json`, todo);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.databaseUrl}/todoList/${id}.json`);
  }
}
