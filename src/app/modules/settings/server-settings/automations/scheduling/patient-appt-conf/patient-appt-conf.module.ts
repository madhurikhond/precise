import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientApptConfRoutingModule } from './patient-appt-conf-routing.module';
import { PatientApptConfComponent } from './patient-appt-conf.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { SmsConfirmComponent } from './sms-confirm/sms-confirm.component';


@NgModule({
  declarations: [PatientApptConfComponent, SmsConfirmComponent],
  imports: [
    CommonModule,
    SharedModule,
    PatientApptConfRoutingModule
  ]
})
export class PatientApptConfModule { }
