import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { MyFacilityComponent } from './my-facility/my-facility.component';
import { BlockLeaseSchedulerComponent } from './block-lease-scheduler/block-lease-scheduler.component';
import { FacilityEsignComponent } from './block-lease-scheduler/facility-esign/facility-esign.component';
import { CoreComponent } from '../core/core.component';
const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard], component: CoreComponent, children: [
      { path: 'myfacility', component: MyFacilityComponent },
      { path: 'facility-management', loadChildren: () => import('./facility-management/facility-management.module').then(m => m.FacilityManagementModule), canActivate: [AuthGuard] },
      { path: '', loadChildren: () => import('./facility-billing/facility-billing.module').then(m => m.FacilityBillingModule), canActivate: [AuthGuard] },
      { path: '3p-block-lease-scheduler', component: BlockLeaseSchedulerComponent, canActivate: [AuthGuard] },
    ]
  },  
  
  { path: '3p-block-lease-scheduler/facility-esign/:BLS', component: FacilityEsignComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacillitiesRoutingModule { }
