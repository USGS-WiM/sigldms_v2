import { Component, OnInit } from '@angular/core';

@Component({
  template:`
    <div id="body-wrapper" class="sigl-section">
      <h2>Project parts</h2>
      <router-outlet></router-outlet>
    </div>`,// './projectdetail.component.html',
  styleUrls: ['./projectdetail.component.css']
})
export class ProjectdetailComponent { }
