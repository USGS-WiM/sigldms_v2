// ------------------------------------------------------------------------------
// ----- login.component --------------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
// 
// purpose: login/logout logic for the application

import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'app/login/login.service';
import { AuthService } from "app/shared/services/auth.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginErrorModal } from "app/login/error.modal";

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent {
  	@ViewChild('loginErrorModal') loginErrorModal: LoginErrorModal;
	public errorMessage: string;
	public username: string;
	public password: string;
	constructor(public _loginService: LoginService, public _authService: AuthService, public _router: Router, private _mdService: NgbModal) {}

	public login() {
		this._loginService.login(this.username, this.password).subscribe(() => {
			if (this._loginService.isLoggedIn) {
				// Get the redirect URL from our auth service
				// If no redirect has been set, use the default
				let redirect = this._authService.redirectUrl ? this._authService.redirectUrl : '/projects';
				// Redirect the user
				this._router.navigate([redirect]);
			}
		}, (err) => {
			this.errorMessage = err;
			this.loginErrorModal.showErrorModal();
		});
	}

	public LogInErrorDialogResponse(){		
	}
	
	public logout() {
		this._loginService.logout();
	}
}
