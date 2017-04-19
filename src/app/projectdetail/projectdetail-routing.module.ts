import { NgModule }             from '@angular/core';
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

const projectdetailRoutes: Routes = [
  {
    path: 'projectdetail/:id', 
    component: ProjectdetailComponent, 
    children: [       
      { path: 'info',
        component: ProjectinfoComponent
      },
      {//makes this the default start page
        path: '', 
        redirectTo: 'info', 
        pathMatch: 'full'
      },
      {
        path:'cooperators',
        component: ProjectcooperatorComponent
      },
      { path: 'data',
        component: ProjectdataComponent        
      },
      {
        path:'contacts',
        component: ProjectcontactComponent
      },
      {
        path:'publications',
        component: ProjectpublicationComponent
      },
      { path: 'sites',
        component: ProjectsiteComponent,
        children: [
          {
             path: 'sitelist',
             component: ProjectsitelistComponent
          },
          {
             path: 'siteSpreadsheet',
             component: ProjectsitespreadsheetComponent
          }
        ]
      },
      
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
