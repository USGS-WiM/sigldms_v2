// ------------------------------------------------------------------------------
// ----- projectdetail.module ---------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: handles all the project's details (info, contacts, data, cooperators, publications, and sites)

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyFilterPipe } from "app/shared/pipes/filter.pipe";
import { ArraySortPipe } from "app/shared/pipes/order.pipe";

@NgModule({
  imports: [ CommonModule],
  declarations: [ MyFilterPipe, ArraySortPipe],
  exports: [MyFilterPipe, ArraySortPipe],
  providers: []
})
export class PipesModule { }
