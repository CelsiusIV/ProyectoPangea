/*import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // 1. Buscamos el token XSRF en las cookies del navegador
  const xsrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  // 2. Preparamos la petición clonada
  let authReq = req.clone({
    withCredentials: true, // Asegura el envío de cookies
    setHeaders: {
      'Accept': 'application/json'
    }
  });

  // 3. SI existe el token, lo añadimos como CABECERA
  if (xsrfToken) {
    // IMPORTANTE: Hay que decodificarlo porque en la cookie viene codificado (con %)
    // Si no haces decodeURIComponent, Laravel dirá "Token mismatch"
    const tokenValue = decodeURIComponent(xsrfToken);

    authReq = authReq.clone({
      headers: authReq.headers.set('X-XSRF-TOKEN', tokenValue)
    });
  }

  return next(authReq);
};*/

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core'; // <--- Importante
import { Router } from '@angular/router'; // <--- Importante
import { catchError, throwError } from 'rxjs'; // <--- Importante
import { AuthService } from '../service/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Inyectamos las dependencias necesarias dentro de la función
  const router = inject(Router);
  const authService = inject(AuthService);

  // --- TU CÓDIGO ACTUAL (Manejo de XSRF y Headers) ---
  
  // 1. Buscamos el token XSRF en las cookies del navegador
  const xsrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  // 2. Preparamos la petición clonada
  let authReq = req.clone({
    withCredentials: true, 
    setHeaders: {
      'Accept': 'application/json'
    }
  });

  // 3. SI existe el token, lo añadimos como CABECERA
  if (xsrfToken) {
    const tokenValue = decodeURIComponent(xsrfToken);
    authReq = authReq.clone({
      headers: authReq.headers.set('X-XSRF-TOKEN', tokenValue)
    });
  }

  // --- AQUÍ VIENE EL CAMBIO ---
  
  // En lugar de devolver next(authReq) directamente, le añadimos un pipe
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Si el servidor responde con 401 (Unauthorized)
      if (error.status === 401) {
        console.warn('Sesión expirada detectada. Cerrando sesión local...');
        
        // 1. Limpiamos la sesión en el front
        // Opción A: Si creaste el método cleanupLocalState()
        // authService.cleanupLocalState(); 
        
        // Opción B: Si no lo creaste, hazlo manual aquí:
        authService.currentUser.set(null); 
        localStorage.removeItem('auth_user');

        // 2. Redirigimos al login
        router.navigate(['/']);
      }

      // Propagamos el error para que el componente también se entere si es necesario
      return throwError(() => error);
    })
  );
};