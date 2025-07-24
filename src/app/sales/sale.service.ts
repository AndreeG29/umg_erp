import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Sale {
  id: number;
  client_id: number;
  user_id: number;
  total: number;
  sale_date: string;
  items: SaleItem[];
  client_name?: string;
  user_name?: string;
}

export interface SaleItem {
  id?: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name?: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class SaleService {
  private api = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.api);
  }

  get(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.api}/${id}`);
  }

  create(data: any): Observable<Sale> {
    return this.http.post<Sale>(this.api, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${environment.apiUrl}/clients`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`);
  }

  getSaleItems(id: number): Observable<SaleItem[]> {
    return this.http.get<SaleItem[]>(`${this.api}/${id}/items`);
  }
}