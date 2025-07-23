import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role_id: number;
  role_name?: string;
}

export interface Role {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.api);
  }

  get(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/${id}`);
  }

  create(data: User): Observable<User> {
    return this.http.post<User>(this.api, data);
  }

  update(id: number, data: User): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>('http://localhost:3000/api/roles');
  }
}