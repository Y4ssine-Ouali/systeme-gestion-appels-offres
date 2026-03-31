import {
  HttpContextToken,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  const tokenStorage = inject(TokenStorageService);
  const authService = inject(AuthService);

  const accessToken = tokenStorage.getAccessToken();

  const authedReq = accessToken ? addAuthHeader(req, accessToken) : req;

  return next(authedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && accessToken) {
        return handle401(req, next, authService);
      }
      return throwError(() => error);
    }),
  );
};

function addAuthHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
): ReturnType<HttpHandlerFn> {
  return authService.refreshToken().pipe(
    switchMap((newAccessToken) => {
      const retryReq = addAuthHeader(req, newAccessToken);
      return next(retryReq);
    }),
    catchError((err) => {
      authService.logout();
      return throwError(() => err);
    }),
  );
}
