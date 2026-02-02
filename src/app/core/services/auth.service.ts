import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  register(email: string) {
    return this.http.post<any>(`${this.apiUrl}/register`, { email });
  }

  login(email: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email });
  }

  saveToken(token: string, userEmail: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userEmail);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}