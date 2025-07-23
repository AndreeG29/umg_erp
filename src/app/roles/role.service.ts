import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Role {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class RoleService {
  private api = 'http://localhost:3000/api/roles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(this.api);
  }

  get(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.api}/${id}`);
  }

  create(data: Role): Observable<Role> {
    return this.http.post<Role>(this.api, data);
  }

  update(id: number, data: Role): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}