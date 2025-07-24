import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserFromToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  getUserName(): string {
    const user = this.getUserFromToken();
    return user?.name || user?.username || 'Usuario';
  }

  getUserRole(): string {
    const userData = this.getUserFromToken();
    const roles: { [key: number]: string } = {
      1: 'Admin',
      2: 'Jefatura', 
      3: 'Asesor'
    };
    return roles[userData?.role] || 'Asesor';
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch {
      return false;
    }
  }
  
  logout(): void {
    localStorage.removeItem('token');
  }

  getCurrentUser(): Observable<any> {
    const userData = this.getUserFromToken();
    if (userData?.id) {
      return this.http.get(`${environment.apiUrl}/users/${userData.id}`);
    }
    throw new Error('No user ID found in token');
  }

  getUserPermissions(): Observable<any[]> {
    const userData = this.getUserFromToken();
    if (userData?.role) {
      return this.http.get<any[]>(`${environment.apiUrl}/roles/${userData.role}/permissions`);
    }
    return new Observable(observer => observer.next([]));
  }

  canAccess(route: string): Observable<boolean> {
    return this.getUserPermissions().pipe(
      map(permissions => 
        permissions.some(p => p.route === route && p.can_view)
      )
    );
  }

  canCreate(route: string): Observable<boolean> {
    return this.getUserPermissions().pipe(
      map(permissions => 
        permissions.some(p => p.route === route && p.can_create)
      )
    );
  }

  canEdit(route: string): Observable<boolean> {
    return this.getUserPermissions().pipe(
      map(permissions => 
        permissions.some(p => p.route === route && p.can_edit)
      )
    );
  }

  canDelete(route: string): Observable<boolean> {
    return this.getUserPermissions().pipe(
      map(permissions => 
        permissions.some(p => p.route === route && p.can_delete)
      )
    );
  }
}