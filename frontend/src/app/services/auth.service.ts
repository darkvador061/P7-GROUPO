import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/User.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  // on instancie un subject de type "User" à la valeur null
  public userSubject = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, 
              private router: Router) { }

  // renvoie le token d'authentification de l'utilisateur
  public getToken() {
    return localStorage.getItem('token');
  }

  // renvoie le numéro d'identification de l'utilisateur
  public getUserId() {
    return JSON.parse(localStorage.getItem('userId'));
  }

  // renvoie l'utilisateur depuis le serveur
  public getUserServerId(id: number) {
    this.http.get('http://localhost:3000/api/profile/'+id).subscribe(
      (res: User) => {
        this.setUser(res);
      }, 
      (error) => {
        console.error(error);
      }
    );
  }

  // contrôle la présence du token d'authentification
  public loggedIn() {
    return !!localStorage.getItem('token');
  }

  // envoie une requête d'enregistrement d'un nouvel utilisateur
  public register(user: User) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/auth/register', {
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        password: user.password, 
        imageUrl: user.imageUrl,
        isAdmin: user.isAdmin
      }).subscribe(
        (res: { message: string }) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // envoie une requête de connexion pour un utilisateur existant
  public login(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      this.http.post('http://localhost:3000/api/auth/login', {email: email, password: password}).subscribe(
        (res: {userId: string, token: string}) => {
          
          // on stock le token d'authentification dans le localStorage
          localStorage.setItem('token', res.token);

          // on stock le numéro d'identification de l'utilisateur dans le localStorage
          localStorage.setItem('userId', res.userId);
          
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // déconnecte l'utilisateur
  public logout() {
    // on efface le localStorage
    localStorage.clear();

    // on recharge la page pour effacer les données d'une session précédente
    window.location.reload();

    // redirige l'utilisateur vers la page de connexion
    this.router.navigate(['/home']);
  }

  // envoie une requête au serveur pour la modification du profile utilisateur
  public editUserProfile(id: number, image: File): Observable<Object> {
    const formData = new FormData();
    formData.append('image', image);
    
    return this.http.put<Object>('http://localhost:3000/api/profile/edit/'+id, formData);
  }

  // envoie une requête au serveur pour la suppression du profile utilisateur
  public deleteUserProfile(id: number): Observable<Object> {    
    return this.http.delete<Object>('http://localhost:3000/api/profile/delete/'+id);
  }

  // on transforme le subject "User" en observable
  public getUser(): Observable<User> {
    return this.userSubject.asObservable();
  }

  // on met à jour le subject "User"
  public setUser(user: User) {
    this.userSubject.next(user);
  }
}
