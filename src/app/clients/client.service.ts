import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  enterprise: string;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private api = 'http://localhost:3000/api/clients';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.api);
  }

  get(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.api}/${id}`);
  }

  create(data: Client): Observable<Client> {
    return this.http.post<Client>(this.api, data);
  }

  update(id: number, data: Client): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}