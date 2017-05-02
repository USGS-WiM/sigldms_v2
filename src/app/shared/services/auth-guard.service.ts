// ------------------------------------------------------------------------------
// ----- auth-guard.service -----------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: routers use the authguard to check if user is logged in before accessing route

import { Injectable } from '@angular/core';
import { CanActivate, Route, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, NavigationExtras, CanLoad } from '@angular/router';
import { AuthService } from "app/shared/services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
    constructor(private _authService: AuthService, private _router: Router){}
    /* The ActivatedRouteSnapshot contains the future route that will be activated
    the RouterStateSnapshot contains the future RouterState of the application, should you pass through the guard check.*/
    canActivate(_route:ActivatedRouteSnapshot, _state: RouterStateSnapshot):boolean {
        let url: string = _state.url; 
        console.log('AuthGuard#canActivate called');
        return this.checkLogin(url);        
    }

    canActivateChild(_actRoute: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
        return this.canActivate(_actRoute, _state);
    }

    // use this for admin sections only (lookups, all data managers) 
    /* { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule', canLoad: [AuthGuard] },*/
    canLoad(_route: Route): boolean {
        let url = `/${_route.path}`;
        return this.checkLogin(url);
    }

    checkLogin(url: string):boolean {
        if (localStorage.getItem("creds") && localStorage.getItem('setupTime') !== null && !this.checkSetupTime()) {   
            return true;
        }
        // store the attempted url for redirecting
        this._authService.redirectUrl = url;
        this._authService.removeUserInfo();
        localStorage.clear();
        // navigate to the login page with extras
        this._router.navigate(['/login']);
        return false;
    }
    // need to find out if localstorage item 'setupTime' is more than 12 hours ago
    private checkSetupTime(): boolean {
        let tooOld: boolean = false;

        let twentyFourHours: number = 12*60*60*1000;
        let now: number = new Date().getTime();
        let setupTime: number = Number(localStorage.getItem('setupTime'));
        if((now - setupTime) > twentyFourHours) { // is it greater than 12 hours
            tooOld = true;
            this._authService.removeUserInfo();
        }

        return tooOld;
    }
}