import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public loading: boolean;
  public errorMsg: string;

  constructor(private formBuilder: FormBuilder, 
              private auth: AuthService, 
              private router: Router) {              
  }
  
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
            


  ngOnInit(): void {

    if (this.auth.loggedIn()) {
      this.router.navigate(['/forum']);
    } else {
      this.router.navigate(['/login']);
    };
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }  

  onLogin() {
    this.loading = true;
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    this.auth.login(email, password).then(
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
}
