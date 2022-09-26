import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingDetailRoutingModule } from './billing-detail-routing.module';
import { BillingDetailComponent } from './billing-detail.component';
import { BrokerBillComponent } from './broker-bill/broker-bill.component';
import { PersonalInjuryBillComponent } from './personal-injury-bill/personal-injury-bill.component';
import { RevisedBillComponent } from './revised-bill/revised-bill.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [BillingDetailComponent, BrokerBillComponent, PersonalInjuryBillComponent, RevisedBillComponent],
  imports: [
    CommonModule,
    BillingDetailRoutingModule,
    SharedModule,    
    NgxPaginationModule,
  ]
})
export class BillingDetailModule { }
