import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  selectedTab: string;

  registerForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  regErrMessage: string;
  loginErrMessage: string;

  subscriptions$: Subscription[] = [];

  constructor(
    private AuthService: AuthService,
    private CookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedTab = 'register';
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach((s) => s.unsubscribe());
  }

  register() {
    const { name, email, password } = this.registerForm.value;
    this.subscriptions$.push(
      this.AuthService.register(name, email, password).subscribe(
        (response: any) => {
          this.registerForm.reset();
          this.CookieService.set(
            'user',
            JSON.stringify({
              id: response.user.id,
              name: response.user.name,
              email: response.user.email,
              accessToken: response.access_token,
            })
          );
          this.router.navigateByUrl('/clients');
        }
      )
    );
  }

  login() {
    const { email, password } = this.loginForm.value;
    this.subscriptions$.push(
      this.AuthService.login(email, password).subscribe(
        (response: any) => {
          this.registerForm.reset();
          this.CookieService.set(
            'user',
            JSON.stringify({
              id: response.user.id,
              name: response.user.name,
              email: response.user.email,
              accessToken: response.access_token,
            })
          );
          this.router.navigateByUrl('/clients');
        },
        (error) => {
          this.updateErrorMessage(error.status);
        }
      )
    );
  }

  private updateErrorMessage(status) {
    switch (status) {
      case 400:
        this.loginErrMessage = 'Invalid email/password.';
        break;
    }
  }
}
