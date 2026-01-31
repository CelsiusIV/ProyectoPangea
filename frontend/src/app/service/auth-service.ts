import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { User } from '../shared/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080';

  // Usamos una Signal para tener reactividad instantánea en toda la app
  public currentUser: WritableSignal<User | null> = signal(null);

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/sanctum/csrf-cookie`, { withCredentials: true }).pipe(
      switchMap(() =>
        this.http.post<any>(`${this.baseUrl}/api/login`, credentials, { withCredentials: true })
      ),
      tap((response) => {
        const userToSave = response.resultado?.data;
        if (userToSave) {
          this.saveUserToStorage(userToSave);
        }
      })
    );
  }
  private saveUserToStorage(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/logout`, {}, { withCredentials: true }
    ).pipe(
      tap(() => {
        this.currentUser.set(null);
        localStorage.removeItem('auth_user');
      })
    );

  }

  sesionCheck(): Observable<boolean> {
    return this.http.get<{ authenticated: boolean }>(`${this.baseUrl}/api/session-check`, { withCredentials: true }).pipe(
      map(response => response.authenticated),
      catchError(() => of(false))
    );
  };
}
