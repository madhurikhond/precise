import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { FacilityBillingComponent } from './facility-billing.component';
import { FrontDeskComponent } from './front-desk/front-desk.component';
import { RadflowBillingComponent } from './radflow-billing/radflow-billing.component';
import { BillingComponent } from './billing/billing.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
  path: '', component: FacilityBillingComponent, children: [ 
    {
      path:'front-desk-portal',component:FrontDeskComponent, canActivate: [AuthGuard,RoleGuard]
    },
    // {
    //   path:'billing',component:BillingComponent, canActivate: [AuthGuard]
    // },
    // {
    //   path:'radflow-billing',component:RadflowBillingComponent, canActivate: [AuthGuard,RoleGuard]
    // }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilityBillingRoutingModule { }
