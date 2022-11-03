import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { AutoBillComponent } from './auto-bill/auto-bill.component';
import { AutoBillingComponent } from './auto-billing.component';
import { NoAslComponent } from './no-asl/no-asl.component';

const routes: Routes = [
  {
    path: '', component: AutoBillingComponent, children: [
      {
        path: '', redirectTo: 'autobill', pathMatch: 'full',canActivate:[RoleGuard]
      },
      {
        path:'autobill',component:AutoBillComponent,canActivate:[RoleGuard]
      },
     
      {
        path:'noasl',component:NoAslComponent,canActivate:[RoleGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutoBillingRoutingModule { }
