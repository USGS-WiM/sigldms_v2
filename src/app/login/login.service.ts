// ------------------------------------------------------------------------------
// ----- login.service -----------------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: login/logout service

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { IDatamanager } from "app/shared/interfaces/settings/datamanager.interface";
// import { Router } from "@angular/router"; , public _router: Router
import { AuthService } from "app/shared/services/auth.service";
import { CONFIG } from "app/shared/services/CONFIG";

@Injectable()
export class LoginService {
	public isLoggedIn: boolean = false;

	constructor(private _http: Http, public _authService: AuthService) { }

	// log in user
	public login(username: string, pw: string) {
		let headers: Headers = new Headers();
		let creds: string = "Basic " + btoa(username + ":" + pw);
		headers.append("Authorization", creds);
		headers.append("Accept", "application/json");
		headers.append("Content-Type", "application/json");

		return this._http.get(CONFIG.LOGIN_URL, { headers: headers })
			.map((response: Response) => {
				// login successful if there's a jwt token in the response
				let user = response.json();
				if (user) {
					this.isLoggedIn = true;
					// store user creds in localStorage and details in service for retrieval
					localStorage.setItem('creds', creds);
					this._authService.storeUserInfo(user);
				}
			})
			.catch((err) => this.handleError(err));
	}

	public logout(): void {
		this.isLoggedIn = false;
		localStorage.clear();
		this._authService.removeUserInfo();
	}

	private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
} // end LoginService