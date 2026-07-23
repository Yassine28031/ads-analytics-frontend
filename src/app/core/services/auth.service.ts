import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // 🔹 Version simple SANS backend (pour tester)
  login(email: string, password: string): Observable<LoginResponse> {
    // Admin par défaut
    if (email === 'admin@admin.com' && password === 'admin123') {
      localStorage.setItem(this.tokenKey, 'admin-token-12345');
      return of({
        success: true,
        token: 'admin-token-12345',
        user: { id: 'admin', email: 'admin@admin.com' }
      });
    }

    // Échec de la connexion
    return of({
      success: false,
      token: '',
      user: { id: '', email: '' }
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}