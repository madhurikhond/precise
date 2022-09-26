import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrescreeningSmallWindowRoutingModule } from './prescreening-small-window-routing.module';
import { PrescreeningSmallWindowComponent } from './prescreening-small-window.component';
import { PrescreengridComponent } from './prescreengrid/prescreengrid.component';
import { NoPatientExistPopupComponent } from './prescreengrid/no-patient-exist-popup/no-patient-exist-popup.component';


@NgModule({
  declarations: [NoPatientExistPopupComponent],
  imports: [
    CommonModule,
    PrescreeningSmallWindowRoutingModule
  ]
})
export class PrescreeningSmallWindowModule { }
