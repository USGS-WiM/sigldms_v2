// ------------------------------------------------------------------------------
// ----- projectlist.module -----------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: module for the sharing of global stuff 

import { NgModule, ModuleWithProviders } from '@angular/core';
import { LookupsService } from "app/shared/services/lookups.service";
import { PipesModule } from "app/shared/pipes/pipes.module";
import { Autosize } from 'angular2-autosize';
import { AuthService } from "app/shared/services/auth.service";
import { AtLeast1RequiredModal } from "app/shared/components/atLeast1Req.modal";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { httpPrefix } from "app/shared/directives/httpprefix.directive";
import { AuthGuard } from "app/shared/services/auth-guard.service";
import { CanDeactivateGuard } from "app/shared/services/candeactivate-guard.service";
import { DialogService } from "app/shared/services/dialog.service";
import { AreYouSureModal } from "app/shared/components/areYouSure.modal";
import { DataTableModule } from "angular2-datatable";
import { validateDates } from "app/shared/directives/validDates.validator";

@NgModule({
  imports: [ PipesModule, NgbModule.forRoot(), MultiselectDropdownModule, DataTableModule], 
  declarations: [ Autosize, httpPrefix, AtLeast1RequiredModal, AreYouSureModal, validateDates ],
  exports: [Autosize, httpPrefix,  AtLeast1RequiredModal, AreYouSureModal, validateDates, MultiselectDropdownModule, DataTableModule, NgbModule],
  providers: [ AuthGuard, CanDeactivateGuard, LookupsService, AuthService, DialogService, NgbActiveModal]
})

export class SharedModule {
 }
