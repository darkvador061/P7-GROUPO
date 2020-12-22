import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, 
              private router: Router) { }

  // on vérifie si l'utilisateur est connecté par la présence du token d'authentification
  canActivate(): boolean {
    if (this.auth.loggedIn()) {
      return true;
    } else {
      // on redirige l'utilisateur vers la page de connexion
      this.router.navigate(['/home']);
      return false;
    }
  }
}

