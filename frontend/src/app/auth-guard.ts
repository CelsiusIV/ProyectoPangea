import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './service/auth-service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.sesionCheck().pipe(
    map(isAuth => {
      if (!isAuth) {
        router.navigate(['/']); // zona pública
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/']);
      return of(false);
    })
  );
};
