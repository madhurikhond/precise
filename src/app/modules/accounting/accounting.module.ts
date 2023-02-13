import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountingRoutingModule } from './accounting-routing.module';
import { CollectionmanagementComponent } from './collection management/collectionmanagement.component';
import { SharedModule } from '../shared/shared.module';
import { DxDataGridModule} from 'devextreme-angular';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { CheckPatientDetailsComponent } from './payment-history/check-patient-details/check-patient-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReceivePaymentComponent } from './receive-payment/receive-payment.component';
import { PatientDetailGroupComponent } from './receive-payment/detail-group/detail-group.component';
import { SettleAndMinimumAmountComponent } from './receive-payment/settle-and-minimum-amount/settle-and-minimum-amount.component';
import { StudyNotCompletedComponent } from './receive-payment/study-not-completed/study-not-completed.component';
import { SelectStudyComponent } from './receive-payment/select-study/select-study.component';
import { BottomGridDetailComponent } from './receive-payment/bottom-grid-detail/bottom-grid-detail.component';

@NgModule({
  declarations: [CollectionmanagementComponent, PaymentHistoryComponent, CheckPatientDetailsComponent, ReceivePaymentComponent,
    PatientDetailGroupComponent,
    SettleAndMinimumAmountComponent,
    StudyNotCompletedComponent,
    SelectStudyComponent,
    BottomGridDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    DxDataGridModule,
    AccountingRoutingModule
  ]
})
export class AccountingModule { }
