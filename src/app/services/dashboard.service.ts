import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`).pipe(
      catchError(() => of({
        totalSales: 25600,
        totalProducts: 45,
        totalClients: 38,
        totalEmployees: 12
      }))
    );
  }

  getSalesByMonth(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sales-by-month`).pipe(
      catchError(() => of({
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
        values: [6500, 5900, 8000, 8100, 5600, 5500, 4000]
      }))
    );
  }

  getTopProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/top-products`).pipe(
      catchError(() => of({
        labels: ['Laptop', 'Smartphone', 'Tablet', 'Monitor', 'Teclado'],
        values: [30, 25, 15, 10, 8]
      }))
    );
  }

  getSalesTrend(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sales-trend`).pipe(
      catchError(() => of({
        labels: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
        values: [4200, 4500, 5100, 5400, 6200, 5800, 5900, 6500, 6300, 6800, 7200, 7500]
      }))
    );
  }

  getSalesByCategory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sales-by-category`).pipe(
      catchError(() => of({
        months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
        categories: [
          {
            name: 'Electrónicos',
            values: [1200, 1300, 1400, 1350, 1500, 1600, 1700]
          },
          {
            name: 'Muebles',
            values: [800, 900, 950, 850, 1000, 1050, 1100]
          },
          {
            name: 'Accesorios',
            values: [400, 450, 500, 550, 600, 650, 700]
          }
        ]
      }))
    );
  }
}