import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IindexProject } from '../shared/indexProject.interface';
import { ProjectlistService } from "app/projectlist/projectlist.service";
// import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.css']
})
export class ProjectlistComponent implements OnInit {
  public projectList: Array<IindexProject>;
  private selectedId:number;
  constructor(private _router: Router, private _projectListService: ProjectlistService ) { }

  ngOnInit() {
    this.projectList = this._projectListService.getProjects();      
  } // end onInit()

  public onSelect(proj: IindexProject) {
    this._router.navigate(['/projectdetail', proj.project_id]);
  }

}
