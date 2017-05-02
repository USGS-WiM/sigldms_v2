// ------------------------------------------------------------------------------
// ----- app-routing ------------------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
// 
// purpose: the main application routing. Projectlist is the default page after login

import { NgModule }              from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from "app/not-found/not-found.component";
// import { CanDeactivateGuard } from "app/candeactivate-guard.service";

const appRoutes: Routes = [
   { path: '', redirectTo: '/projects', pathMatch: 'full'}, //makes this the default start page
   { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers:[ ]// CanDeactivateGuard] // ?? 'so the Router can inject it during the naviation process' (works without this) 
})
export class AppRoutingModule {}

