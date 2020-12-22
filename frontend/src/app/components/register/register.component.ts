import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
  public loading: boolean;
  public errorMsg: string;

  constructor(private formBuilder: FormBuilder, 
              private auth: AuthService, 
              private router: Router) { }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  // on initialise les données du formulaire d'enregistrement d'un nouvel utilisateur
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required ]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  // on traite la réponse du serveur pour l'enregistrement d'un nouvel utilisateur
  onRegister() {
    let user: User = new User;
    user.firstName = this.registerForm.get('firstName').value;
    user.lastName = this.registerForm.get('lastName').value;
    user.email = this.registerForm.get('email').value;
    user.password = this.registerForm.get('password').value;
    user.imageUrl = '../../../assets/images/';
    user.isAdmin = false;

    this.loading = true;

    this.auth.register(user).then(
      (res: { message: string }) => {
        this.auth.login(user.email, user.password).then(
          () => {
            this.loading = false;
            this.router.navigate(['/forum']);
          }
        ).catch(
          (error) => {
            this.loading = false;
            this.errorMsg = error.error.error;
          }
        );
      }
    ).catch((error) => {
        this.loading = false;
        this.errorMsg = error.error.error;
    });
  }
}