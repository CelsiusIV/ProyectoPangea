import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { catchError, throwError } from 'rxjs'; 
import { AuthService } from '../service/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Inyectamos las dependencias necesarias dentro de la función
  const router = inject(Router);
  const authService = inject(AuthService);

  //Buscamos el token XSRF en las cookies del navegador
  const xsrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  //Preparamos la petición clonada
  let authReq = req.clone({
    withCredentials: true, 
    setHeaders: {
      'Accept': 'application/json'
    }
  });

  //SI existe el token, lo añadimos como CABECERA
  if (xsrfToken) {
    const tokenValue = decodeURIComponent(xsrfToken);
    authReq = authReq.clone({
      headers: authReq.headers.set('X-XSRF-TOKEN', tokenValue)
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      if (error.status === 401) {
        authService.currentUser.set(null); 
        localStorage.removeItem('auth_user');
        router.navigate(['/']);
      }
      return throwError(() => error);
    })
  );
};