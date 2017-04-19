import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title: string;
  public subTitle: string;

  ngOnInit() {
    this.title = "SiGL";
    this.subTitle = "Data Management System (DMS)";
  }  
}
