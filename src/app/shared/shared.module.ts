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
import { AutosizeDirective } from "app/shared/directives/autosize.directive";// "angular2-autosize";
import { AuthService } from "app/shared/services/auth.service";
import { AtLeast1RequiredModal } from "app/shared/components/atLeast1Req.modal";

import { NgbModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { httpPrefix } from "app/shared/directives/httpprefix.directive";
import { AuthGuard } from "app/shared/services/auth-guard.service";
import { CanDeactivateGuard } from "app/shared/services/candeactivate-guard.service";
import { DialogService } from "app/shared/services/dialog.service";
import { AreYouSureModal } from "app/shared/components/areYouSure.modal";

@NgModule({
  imports: [ PipesModule, NgbModule.forRoot()], 
  declarations: [ AutosizeDirective, httpPrefix, AtLeast1RequiredModal, AreYouSureModal ],
  exports: [AutosizeDirective, httpPrefix,  AtLeast1RequiredModal, AreYouSureModal, NgbTooltip ],
  providers: [ AuthGuard, CanDeactivateGuard, LookupsService, AuthService, DialogService]
})

export class SharedModule {
 }
