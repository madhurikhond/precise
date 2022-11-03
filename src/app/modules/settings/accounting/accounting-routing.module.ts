import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { AccountingComponent } from './accounting.component';
import { PayeeComponent } from './ar/ar-settings/payee/payee.component';
import { PaymentBankComponent } from './ar/ar-settings/payment-bank/payment-bank.component';
import { PaymentTypeComponent } from './ar/ar-settings/payment-type/payment-type.component';
import { QbAccountComponent } from './ar/ar-settings/qb-account/qb-account.component';

const routes: Routes = [
  {
    path: '', component: AccountingComponent, children:[      
      { path: '', redirectTo: 'defaults', pathMatch: 'full'},
      { path: 'defaults', loadChildren: () => import('../accounting/ar/ar-settings/defaults/defaults.module').then(m => m.DefaultsModule), canActivate: [AuthGuard,RoleGuard] },
      { path: 'payment-type', component: PaymentTypeComponent, canActivate: [AuthGuard,RoleGuard] },
      { path: 'payment-bank', component: PaymentBankComponent, canActivate: [AuthGuard,RoleGuard] },
      { path: 'qb-account', component: QbAccountComponent, canActivate: [AuthGuard,RoleGuard] },
      { path: 'payee', component: PayeeComponent, canActivate: [AuthGuard,RoleGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
