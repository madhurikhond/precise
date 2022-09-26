import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { MyFacilityComponent } from './my-facility/my-facility.component';
const routes: Routes = [
  {path:'myfacility',component:MyFacilityComponent, canActivate: [AuthGuard]},
  {path:'facility-management',loadChildren: () => import('./facility-management/facility-management.module').then(m => m.FacilityManagementModule), canActivate: [AuthGuard]},
  {path:'',loadChildren: () => import('./facility-billing/facility-billing.module').then(m => m.FacilityBillingModule), canActivate: [AuthGuard]} 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacillitiesRoutingModule { }
  