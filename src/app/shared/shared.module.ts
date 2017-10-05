// ------------------------------------------------------------------------------
// ----- projectlist.module -----------------------------------------------------
// ------------------------------------------------------------------------------

// copyright:   2016 WiM - USGS
//
// authors:  Tonia Roddick USGS Wisconsin Internet Mapping             
//
// purpose: module for the sharing of global stuff 

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
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
import { OrganizationModal } from "app/shared/components/organization/organization.modal";
import { phoneFormat } from "app/shared/directives/phone.directive";
import { ToasterModule } from 'angular2-toaster/angular2-toaster';

@NgModule({
  declarations: [ Autosize, httpPrefix, phoneFormat,  AtLeast1RequiredModal, AreYouSureModal, OrganizationModal, validateDates ],
  exports: [Autosize, httpPrefix, phoneFormat, AtLeast1RequiredModal, AreYouSureModal, OrganizationModal, validateDates, MultiselectDropdownModule, DataTableModule, NgbModule, ToasterModule],
  imports: [CommonModule, FormsModule, PipesModule, NgbModule.forRoot(), MultiselectDropdownModule, DataTableModule, ToasterModule]
  
  //providers: [ ]// AuthGuard, CanDeactivateGuard, LookupsService, AuthService, NgbActiveModal] //DialogService
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [AuthGuard, CanDeactivateGuard, LookupsService, AuthService, NgbActiveModal, DialogService]
    }
  }

}
