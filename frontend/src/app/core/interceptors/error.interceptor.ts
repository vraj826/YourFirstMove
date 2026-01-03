import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
            errorMessage = 'Session expired. Please login again.';
          } else if (error.status === 403) {
            errorMessage = 'Access denied';
          } else if (error.status === 404) {
            errorMessage = 'Resource not found';
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (error.error?.error?.message) {
            errorMessage = error.error.error.message;
          }
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });

        return throwError(() => error);
      })
    );
  }
}
