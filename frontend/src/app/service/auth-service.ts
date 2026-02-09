import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { User } from '../shared/models/user.interface';
import { UserService } from './user-service';
import { environment } from '../../environments/environment.development';
import { apiConstants } from '../consts/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiDomain;
  private userService = inject(UserService);
  public currentUser: WritableSignal<User | null> = signal(null);

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: any): Observable<any> {
    console.log(this.baseUrl);
    return this.http.get(`${this.baseUrl}/sanctum/csrf-cookie`, { withCredentials: true }).pipe(
      switchMap(() =>
        this.http.post<any>(`${this.baseUrl}/api/${apiConstants.LOGIN}`, credentials, { withCredentials: true })
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

  refreshUser(): Observable<any> {
    const userId = this.currentUser()?.id;
    if (!userId) {
      return throwError(() => new Error('No hay usuario en sesión para actualizar'));
    }
    return this.userService.getUser(userId).pipe(
      tap((response) => {
        const freshUser = response.data || response;
        this.saveUserToStorage(freshUser);
      })
    );

  }
}
