import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutoBillComponent } from './auto-bill/auto-bill.component';
import { AutoBillingComponent } from './auto-billing.component';
import { NoAslComponent } from './no-asl/no-asl.component';

const routes: Routes = [
  {
    path: '', component: AutoBillingComponent, children: [
      {
        path: '', redirectTo: 'autobill', pathMatch: 'full'
      },
      {
        path:'autobill',component:AutoBillComponent
      },
     
      {
        path:'noasl',component:NoAslComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutoBillingRoutingModule { }
