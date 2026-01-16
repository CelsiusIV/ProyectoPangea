import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  /**
   * Paso 1: obtener cookie CSRF
   * Paso 2: hacer login
   */
  login(data: any): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/sanctum/csrf-cookie`, {
        withCredentials: true,
      })
      .pipe(
        switchMap(() =>
          this.http.post(
            `${this.baseUrl}/api/login`,
            data,
            { withCredentials: true }
          )
        )
      );
  }
}