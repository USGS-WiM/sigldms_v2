import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
// import 'rxjs/add/operator/switchMap';
import { IindexProject } from "app/shared/indexProject.interface";
import { ProjectdetailService } from "app/projectdetail/projectdetail.service";

@Component({
  template:`<h2>Project Info</h2>
  <div>Project Id chosen: {{project.name}}</div>
  <button (click)="gotoProjects()">Back</button>`//<router-outlet name="createEditpopup"></router-outlet>
})
export class ProjectinfoComponent implements OnInit {
  public project: IindexProject;  

  private sub: any;
  private parentRouteId: number;

  constructor(private _route: ActivatedRoute, private _router: Router, private _projectDetService: ProjectdetailService) { 
  //  const parentActivatedRoute = _router.routerState.snapshot(_route);// _router.routerState.root(_route);
    this.sub = this._route.parent.params.subscribe(params => {
        this.parentRouteId = +params["id"];
        this.project = this._projectDetService.getProject(this.parentRouteId)[0];
    });
  }
  ngOnInit() {    
    /*The switchMap operator allows you to perform an action with the current value of the Observable, and map it to a new Observable. 
    As with many rxjs operators, switchMap handles an Observable as well as a Promise to retrieve the value they emit. switchMap 
    will also cancel any in-flight requests if the user re-navigates to the route while still retrieving a project. 
    Use the subscribe method to detect id changes and to (re)set the retrieved project.

   this._route.params
      .switchMap((params: Params) => this._projectDetService.getProject(+params['id']))
      .subscribe((proj: Project) => this.project = proj);
      */
  }
  ngOnDestroy() {
    // Clean sub to avoid memory leak
    //this.sub.unsubscribe();
  }
  public gotoProjects(){
    this._router.navigate(['/projects']);
  }
}
