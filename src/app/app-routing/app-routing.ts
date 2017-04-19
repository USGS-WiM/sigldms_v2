import { NgModule }              from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from "app/not-found/not-found.component";

const appRoutes: Routes = [
   { path: '', redirectTo: '/projects', pathMatch: 'full' }, //makes this the default start page
   { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

