import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PiBillingRoutingModule } from './pi-billing-routing.module';
import { ProcGroupsComponent } from './proc-groups/proc-groups.component';
import { ProcCodesComponent } from './proc-codes/proc-codes.component';
import { PiInvoicePricingComponent } from './pi-invoice-pricing/pi-invoice-pricing.component';
import { FacilitiesComponent } from './facilities/facilities.component';
import { DxCodesComponent } from './dx-codes/dx-codes.component';
import { PreNegRatesComponent } from './pre-neg-rates/pre-neg-rates.component';
import { BpartComponent } from './bpart/bpart.component';
import { StudyDescriptionComponent } from './study-description/study-description.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {DxTagBoxModule } from 'devextreme-angular';



@NgModule({
  declarations: [
    ProcGroupsComponent, 
    ProcCodesComponent, 
    PiInvoicePricingComponent, 
    FacilitiesComponent, 
    DxCodesComponent, 
    PreNegRatesComponent, 
    BpartComponent, 
    StudyDescriptionComponent,  
    ],
  imports: [
    CommonModule,
    NgSelectModule,
    PiBillingRoutingModule,
    SharedModule,    
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    DxTagBoxModule
  ],
  providers: [],
  bootstrap: [PiBillingRoutingModule]
})
export class PiBillingModule { }
