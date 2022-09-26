import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilitiesRoutingModule } from './facilities-routing.module';
import { FacilitiesComponent } from './facilities.component';
import { PslReminderComponent } from './psl-reminder/psl-reminder.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';



@NgModule({
  declarations: [FacilitiesComponent,PslReminderComponent],
  imports: [
    CommonModule,
    FacilitiesRoutingModule,
    SharedModule
  ]
})
export class FacilitiesModule { }
