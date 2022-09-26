import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderedOutboundDailerRoutingModule } from './ordered-outbound-dailer-routing.module';
import { OrderedOutboundDailerComponent } from './ordered-outbound-dailer.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { CallTimingComponent } from './call-timing/call-timing.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';


@NgModule({
  
  declarations: [
    OrderedOutboundDailerComponent, GeneralSettingsComponent, CallTimingComponent],
  imports: [
    CommonModule,
    SharedModule,
    OrderedOutboundDailerRoutingModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    PopoverModule.forRoot() 
  ],
  exports : []
})
export class OrderedOutboundDailerModule { }
