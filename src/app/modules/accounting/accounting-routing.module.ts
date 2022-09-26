import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { CollectionmanagementComponent } from './collection management/collectionmanagement.component';
import { PayRadComponent } from './pay-rad/pay-rad.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { ReceivePaymentComponent } from './receive-payment/receive-payment.component';

const routes: Routes = [
    { path: 'collection-management', component: CollectionmanagementComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'payment-history', component: PaymentHistoryComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'receive-payment', component: ReceivePaymentComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'pay-rad', component: PayRadComponent, canActivate: [AuthGuard, RoleGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
