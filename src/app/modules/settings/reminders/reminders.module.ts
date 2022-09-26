import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemindersRoutingModule } from './reminders-routing.module';
import { RemindersComponent } from '../reminders/reminders.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [RemindersComponent],
  imports: [
    CommonModule,
    RemindersRoutingModule,
    SharedModule,
    NgxMaskModule.forRoot({ 
    }),
  ]
})
export class RemindersModule { }
