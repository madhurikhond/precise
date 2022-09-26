import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulingRoutingModule } from './scheduling-routing.module';
import { SchedulingComponent } from './scheduling.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NoShowSmsComponent } from './no-show-sms/no-show-sms.component';
import { CannotScheduleComponent } from './cannot-schedule/cannot-schedule.component';



@NgModule({
  declarations: [SchedulingComponent,  NoShowSmsComponent, CannotScheduleComponent],
  imports: [
    CommonModule,
    SharedModule,
    SchedulingRoutingModule
  ]
})
export class SchedulingModule { }
