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
        if (localStorage.getItem("creds") && localStorage.getItem('setupTime') !== null) {   
            return true;
        }
        // store the attempted url for redirecting
        this._authService.redirectUrl = url;
        localStorage.clear();
        // navigate to the login page with extras
        this._router.navigate(['/login']);
        return false;
    }
}