import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/modules/core/guards/auth.guard';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { BillingDetailComponent } from './billing-detail.component';
import { BrokerBillComponent } from './broker-bill/broker-bill.component';
import { PersonalInjuryBillComponent } from './personal-injury-bill/personal-injury-bill.component';
import { RevisedBillComponent } from './revised-bill/revised-bill.component';

const routes: Routes = [
  {
    path: '',
    component: BillingDetailComponent,
    children: [
      { path: '', redirectTo: 'funding-company-bill', pathMatch: 'full'},
      { path: 'funding-company-bill', component: BrokerBillComponent, canActivate: [AuthGuard,RoleGuard] },
      { path: 'personal-injury-bill', component: PersonalInjuryBillComponent, canActivate: [AuthGuard] },
      { path: 'revised-bill', component: RevisedBillComponent, canActivate: [AuthGuard] },
    ]
  }
  ];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class BillingDetailRoutingModule { }
