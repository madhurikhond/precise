import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingComponent } from './accounting.component';
import { PaymentTypeComponent } from './ar/ar-settings/payment-type/payment-type.component';
import { PaymentBankComponent } from './ar/ar-settings/payment-bank/payment-bank.component';
import { QbAccountComponent } from './ar/ar-settings/qb-account/qb-account.component';
import { PayeeComponent } from './ar/ar-settings/payee/payee.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [AccountingComponent, PaymentTypeComponent, PaymentBankComponent, QbAccountComponent, PayeeComponent],
  imports: [
    CommonModule,
    AccountingRoutingModule,
    SharedModule
  ]
})
export class AccountingModule { }
