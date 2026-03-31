import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  Subject,
  catchError,
  finalize,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AuthResponse,
  AuthTokens,
  AuthUser,
  LoginRequest,
  TokenPayload,
} from '../models/auth.models';
import { SKIP_AUTH } from '../interceptors/auth.interceptor';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly _currentUser = signal<AuthUser | null>(null);
  private readonly _isAuthenticated = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly userRoles = computed(() => this._currentUser()?.roles ?? []);

  private isRefreshing = false;
  private refreshSubject$ = new Subject<string>();

  constructor(
    private readonly http: HttpClient,
    private readonly tokenStorage: TokenStorageService,
    private readonly router: Router,
  ) {
    this.tryRestoreSession();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials, {
        context: new HttpContext().set(SKIP_AUTH, true),
      })
      .pipe(tap((res) => this.handleAuthSuccess(res)));
  }

  logout(): void {
    const refreshToken = this.tokenStorage.getRefreshToken();
    if (refreshToken) {
      this.http
        .post(
          `${this.apiUrl}/logout`,
          { refreshToken },
          { context: new HttpContext().set(SKIP_AUTH, true) },
        )
        .pipe(catchError(() => of(null)))
        .subscribe();
    }
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<string> {
    if (this.isRefreshing) {
      return this.refreshSubject$.pipe(take(1));
    }

    this.isRefreshing = true;

    const refreshToken = this.tokenStorage.getRefreshToken();
    if (!refreshToken) {
      this.isRefreshing = false;
      this.clearSession();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http
      .post<AuthTokens>(
        `${this.apiUrl}/refresh`,
        { refreshToken },
        { context: new HttpContext().set(SKIP_AUTH, true) },
      )
      .pipe(
        tap((tokens) => {
          this.tokenStorage.setTokens(tokens);
          this.refreshSubject$.next(tokens.accessToken);
        }),
        switchMap((tokens) => of(tokens.accessToken)),
        catchError((err) => {
          this.refreshSubject$.error(err);
          this.refreshSubject$ = new Subject<string>();
          this.clearSession();
          return throwError(() => err);
        }),
        finalize(() => (this.isRefreshing = false)),
      );
  }

  hasRole(role: string): boolean {
    return this.userRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((r) => this.userRoles().includes(r));
  }

  private handleAuthSuccess(res: AuthResponse): void {
    this.tokenStorage.setTokens({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    });
    const payload = this.decodeToken(res.accessToken);
    const roles = payload?.roles ?? res.user?.roles ?? [];
    const user: AuthUser = {
      id: payload?.userId ?? res.user?.id ?? 0,
      email: payload?.sub ?? res.user?.email ?? '',
      firstName: res.user?.firstName ?? '',
      lastName: res.user?.lastName ?? '',
      roles,
    };
    this.tokenStorage.setUser(user);
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
  }

  private tryRestoreSession(): void {
    const token = this.tokenStorage.getAccessToken();
    if (!token) return;

    const payload = this.decodeToken(token);
    const storedUser = this.tokenStorage.getUser();

    if (!payload || this.isTokenExpired(payload)) {
      if (this.tokenStorage.getRefreshToken()) {
        this.refreshToken().subscribe({
          next: (newToken) => {
            const newPayload = this.decodeToken(newToken);
            if (newPayload) {
              this._currentUser.set({
                id: newPayload.userId ?? storedUser?.id ?? 0,
                email: newPayload.sub,
                firstName: storedUser?.firstName ?? '',
                lastName: storedUser?.lastName ?? '',
                roles: newPayload.roles ?? [],
              });
              this._isAuthenticated.set(true);
            }
          },
          error: () => this.clearSession(),
        });
      }
      return;
    }

    this._currentUser.set({
      id: payload.userId ?? storedUser?.id ?? 0,
      email: payload.sub,
      firstName: storedUser?.firstName ?? '',
      lastName: storedUser?.lastName ?? '',
      roles: payload.roles ?? [],
    });
    this._isAuthenticated.set(true);
  }

  private clearSession(): void {
    this.tokenStorage.clear();
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }

  private decodeToken(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as TokenPayload;
    } catch {
      return null;
    }
  }

  private isTokenExpired(payload: TokenPayload): boolean {
    return payload.exp * 1000 <= Date.now() + 30_000;
  }
}
