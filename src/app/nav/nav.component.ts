import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wim-navbar',
  template: `
    <div class="navbar">    
        <a class="navbar-brand" href="http://www.usgs.gov"><img src="assets/img/usgs-logo.png"></a>
        <span class="app-name">{{title}}</span>
        <nav>
         <!--   <a routerLink="/projectlist" routerLinkActive="active">Home</a>
            <a routerLink="/settings" routerLinkActive="active">Settings</a>
            <a routerLink="/account" routerLinkActive="active">Your account</a>
            <a routerLink="/faq" routerLinkActive="active">FAQs/Help</a> -->
        </nav>
    </div>
  `,
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
