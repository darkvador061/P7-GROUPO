import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {}

  // intercepte la requête HTTP pour injecter le token d'authentification dans le header "Authorization"
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const authService = this.injector.get(AuthService);
    const newRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authService.getToken()}`)
    });
    return next.handle(newRequest);
  }
}
