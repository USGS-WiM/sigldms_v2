import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectlistComponent } from './projectlist.component';
import { ProjectdetailComponent } from "app/projectdetail/projectdetail.component";

const projectsRoutes: Routes = [
  { path: 'projects', component: ProjectlistComponent },
  { path: 'projectdetail/:id', component: ProjectdetailComponent },
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
