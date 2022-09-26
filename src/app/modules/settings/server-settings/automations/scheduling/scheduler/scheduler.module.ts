import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerRoutingModule } from './scheduler-routing.module';
import { SchedulerComponent } from './scheduler.component';
import { PendPiAcceptLiabComponent } from './pend-pi-accept-liab/pend-pi-accept-liab.component';
import { OrderedSmsComponent } from './ordered-sms/ordered-sms.component';
import { OrderedReviewComponent } from './ordered-review/ordered-review.component';
import { OrderedShedulerComponent } from './ordered-sheduler/ordered-sheduler.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [SchedulerComponent, PendPiAcceptLiabComponent, 
    OrderedSmsComponent, OrderedReviewComponent, OrderedShedulerComponent],
  imports: [
    CommonModule,
    SharedModule,
    SchedulerRoutingModule
  ]
})
export class SchedulerModule { }
