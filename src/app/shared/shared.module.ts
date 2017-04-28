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
import { ModalModule } from "ngx-bootstrap/modal";
import { httpPrefix } from "app/shared/directives/httpprefix.directive";

@NgModule({
  imports: [ PipesModule, ModalModule.forRoot()  ],
  declarations: [ AutosizeDirective, httpPrefix, AtLeast1RequiredModal ],
  exports: [AutosizeDirective, httpPrefix,  AtLeast1RequiredModal ],
  providers: [ LookupsService, AuthService]
})

export class SharedModule {
 }
