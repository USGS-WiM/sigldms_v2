// ------------------------------------------------------------------------------
// ----- app.component ----------------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: main app shell component

import { Component } from '@angular/core';
// import { ModalDirective } from "ngx-bootstrap/modal";

import { LookupsService } from "app/shared/services/lookups.service";
import { AuthService } from "app/shared/services/auth.service";
import { LoginService } from "app/login/login.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public title: string;
  public subTitle: string;
  public loggedIn: boolean;
  public loggedInRole: string;
  constructor(public _authService: AuthService, public _loginService: LoginService, public _lookupService: LookupsService) {}
  
  ngOnInit() {
    this._lookupService.getLookups();
    this.title = "SiGL";
    this.subTitle = "Data Management System (DMS)";
    this.loggedIn = localStorage.getItem('creds') !== null ? true : false;
    this.loggedInRole = localStorage.getItem('loggedInRole');

    this._authService.loggedInID().subscribe((id: number)=> {
      this.loggedIn = localStorage.getItem('creds') !== null ? true : false;      
    });
    this._authService.loggedInRole().subscribe((role: string)=> {
      this.loggedInRole = localStorage.getItem('loggedInRole');
    });
    
  }  
  /*ngAfterViewInit(){
    if (this.loggedIn) 
      this._lookupService.getLookups();
  }
*/
  logout() {
    this._loginService.logout();
  }
}
