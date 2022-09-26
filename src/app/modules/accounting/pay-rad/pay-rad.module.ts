import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayRadRoutingModule } from './pay-rad-routing.module';
import { PayRadComponent } from './pay-rad.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [PayRadComponent],
  imports: [
    CommonModule,
    PayRadRoutingModule,
    SharedModule,

  ]
})
export class PayRadModule { }
