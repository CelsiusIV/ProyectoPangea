import { HttpInterceptorFn } from '@angular/common/http';

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
};