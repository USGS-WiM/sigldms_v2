import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing';

import { ProjectlistModule } from './projectlist/projectlist.module';
import { ProjectdetailModule } from './projectdetail/projectdetail.module';
import { PageNotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [ AppComponent, PageNotFoundComponent ],
  imports: [
    BrowserModule, FormsModule, HttpModule, ProjectdetailModule, ProjectlistModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
