// ------------------------------------------------------------------------------
// ----- projectlist-routing.module ---------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: routing for getting projectList and lazyloading projectdetail when project is clicked

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectlistComponent } from './projectlist.component';
import { ProjectdetailComponent } from "app/projectdetail/projectdetail.component";
import { AuthGuard } from "app/auth-guard.service";
import { ProjectListResolve } from "app/projectlist/projectList.resolve";

const projectsRoutes: Routes = [
  { 
    path: 'projects', 
    component: ProjectlistComponent, 
    canActivate: [AuthGuard],
    resolve: {
      projectList: ProjectListResolve
    }
  },
  {
    path: 'projectdetail/:id',
    component: ProjectdetailComponent,
//    loadChildren: 'app/projectdetail/projectdetail.module#ProjectdetailModule', //lazyloaded when project clicked
    canLoad: [AuthGuard]   
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(projectsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProjectListRoutingModule { }
