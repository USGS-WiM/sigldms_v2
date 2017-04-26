// ------------------------------------------------------------------------------
// ----- login.component --------------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
// 
// purpose: login/logout logic for the application

import { Component }   from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'app/login/login.service';
import { AuthService } from "app/shared/services/auth.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls:  ['./login.component.css']
})

export class LoginComponent {
  public message: string;
  public username: string;
  public password: string;
  constructor(public _loginService: LoginService, public _authService: AuthService, public _router: Router) {
    this.setMessage();
  }

  public setMessage() {
    this.message = 'Logged ' + (this._loginService.isLoggedIn ? 'in' : 'out');
  }

  public login() {
    this.message = 'Trying to log in ...';
    this._loginService.login(this.username,this.password).subscribe(() => {
      this.setMessage();
      if (this._loginService.isLoggedIn) {
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect = this._authService.redirectUrl ? this._authService.redirectUrl : '/projects';
        // Redirect the user
        this._router.navigate([redirect]);
      }
    });
  }

  public logout() {
    this._loginService.logout();
    this.setMessage();
  }
}
