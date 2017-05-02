// ------------------------------------------------------------------------------
// ----- login-routing ----------------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
// 
// purpose: routing for the login page (if no creds, defaults here)

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login.component';
import { AuthGuard } from 'app/shared/services/auth-guard.service';
import { LoginService } from 'app/login/login.service';

const loginRoutes: Routes = [
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(loginRoutes) ],
  exports: [ RouterModule],
  providers: [ AuthGuard, LoginService ]
})

export class LoginRoutingModule {}
