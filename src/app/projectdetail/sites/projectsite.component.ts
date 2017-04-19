import { Component, OnInit } from '@angular/core';

@Component({
  template:`
    <h2>Project Sites</h2>
    <router-outlet></router-outlet>`//<router-outlet name="createEditpopup"></router-outlet> accessed thru <a [routerLink]="[{ outlets: { createEditpopup: ['pathname'] } }]">Contact</a>
})
export class ProjectsiteComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
