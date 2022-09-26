import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutoBillingRoutingModule } from './auto-billing-routing.module';
import { AutoBillingComponent } from './auto-billing.component';
import { AutoBillComponent } from './auto-bill/auto-bill.component';
import { NoAslComponent } from './no-asl/no-asl.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/modules/shared/shared.module';



@NgModule({
  declarations: [AutoBillingComponent, AutoBillComponent, NoAslComponent],
  imports: [
    CommonModule,
    AutoBillingRoutingModule,
    NgSelectModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,

  ]
})
export class AutoBillingModule { }
