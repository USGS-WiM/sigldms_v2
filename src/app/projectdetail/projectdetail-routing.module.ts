// ------------------------------------------------------------------------------
// ----- projectdetail-routing.module -------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping
// purpose: routes for the project details module (parent/children/subchildren)

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectdetailComponent } from "app/projectdetail/projectdetail.component";
import { ProjectcooperatorComponent } from "app/projectdetail/cooperators/projectcoop.component";
import { ProjectdataComponent } from "app/projectdetail/data/projectdata.component";
import { ProjectcontactComponent } from "app/projectdetail/contacts/projectcontact.component";
import { ProjectpublicationComponent } from "app/projectdetail/publications/projectpub.component";
import { ProjectsiteComponent } from "app/projectdetail/sites/projectsite.component";
import { ProjectsitelistComponent } from "app/projectdetail/sites/projectsitelist.component";
import { ProjectsitespreadsheetComponent } from "app/projectdetail/sites/projectsitesheet.component";
import { ProjectinfoComponent } from "app/projectdetail/projectinfo/projectinfo.component";
import { AuthGuard } from "app/shared/services/auth-guard.service";
import { CanDeactivateGuard } from "app/shared/services/candeactivate-guard.service";
import { FullProjectResolve } from "app/projectdetail/fullProject.resolve";
import { ProjectSitesResolve } from "app/projectdetail/projectSites.resolve";

const projectdetailRoutes: Routes = [
  {
    path: 'projectdetail/:id',
    component: ProjectdetailComponent,
    canActivateChild: [ AuthGuard ],
    resolve: {
      fullProject: FullProjectResolve,
      projectSites: ProjectSitesResolve
    },
    children: [
      { path: 'info',
        component: ProjectinfoComponent
      },
      {
        path:'cooperators',
        component: ProjectcooperatorComponent, 
        canDeactivate: [CanDeactivateGuard]
      },
      { path: 'data',
        component: ProjectdataComponent, 
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path:'contacts',
        component: ProjectcontactComponent, 
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path:'publications',
        component: ProjectpublicationComponent, 
        canDeactivate: [CanDeactivateGuard]
      },
      { path: 'sites',
        component: ProjectsiteComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
             path: 'sitelist',
             component: ProjectsitelistComponent
          },
          {
             path: 'siteSpreadsheet',
             component: ProjectsitespreadsheetComponent, 
            canDeactivate: [CanDeactivateGuard]
          }
        ]
      },
      {//makes this the default start page
        path: '', 
        redirectTo: 'info', 
        pathMatch: 'full',
        canActivateChild: [ AuthGuard ]
      }      
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(projectdetailRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProjectDetailRoutingModule { }
