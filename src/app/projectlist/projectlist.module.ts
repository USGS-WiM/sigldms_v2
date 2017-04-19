import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProjectlistComponent } from "app/projectlist/projectlist.component";
import { ProjectListRoutingModule } from "app/projectlist/projectlist-routing.module";
import { ProjectlistService } from "app/projectlist/projectlist.service";

@NgModule({
  imports: [ CommonModule, FormsModule, ProjectListRoutingModule ],
  declarations: [ProjectlistComponent],
  exports: [ProjectlistComponent],
  providers: [ProjectlistService]
})

export class ProjectlistModule { }
