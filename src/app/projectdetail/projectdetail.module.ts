import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProjectdetailComponent } from "app/projectdetail/projectdetail.component";
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";
import { ProjectinfoComponent } from "app/projectdetail/projectinfo/projectinfo.component";
import { ProjectcontactComponent } from "app/projectdetail/contacts/projectcontact.component";
import { ProjectsiteComponent } from "app/projectdetail/sites/projectsite.component";
import { ProjectcooperatorComponent } from "app/projectdetail/cooperators/projectcoop.component";
import { ProjectdataComponent } from "app/projectdetail/data/projectdata.component";
import { ProjectsitelistComponent } from "app/projectdetail/sites/projectsitelist.component";
import { ProjectsitespreadsheetComponent } from "app/projectdetail/sites/projectsitesheet.component";
import { ProjectDetailRoutingModule } from "app/projectdetail/projectdetail-routing.module";
import { ProjectpublicationComponent } from "app/projectdetail/publications/projectpub.component";

@NgModule({
  imports: [ CommonModule, FormsModule, ProjectDetailRoutingModule],
  declarations: [ProjectdetailComponent, ProjectinfoComponent, ProjectcontactComponent, ProjectcooperatorComponent, ProjectdataComponent, ProjectpublicationComponent,
                 ProjectsiteComponent, ProjectsitelistComponent, ProjectsitespreadsheetComponent ],
  exports: [ProjectdetailComponent],
  providers: [ProjectdetailService]
})
export class ProjectdetailModule { }
