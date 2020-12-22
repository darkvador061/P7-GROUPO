import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menu = false;

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  // appel la méthode de déconnexion de l'utilisateur
  onLogout() {
    this.auth.logout();
  }

  // active/désactive le menu de la barre de navigation en mode responsive
  public toggleMenu() {
    this.menu = !this.menu;
  }

}
