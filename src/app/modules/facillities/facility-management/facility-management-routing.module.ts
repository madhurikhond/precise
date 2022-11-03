import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { FacilityManagementComponent } from './facility-management.component';
import { ParentCompComponent } from './parent-comp/parent-comp.component';
import { SchdFacilitiesComponent } from './schd-facilities/schd-facilities.component';

const routes: Routes = [
  {
    path: '', component: FacilityManagementComponent, children: [
      {
        path: '', redirectTo: 'schd-facilities', pathMatch: 'full', canActivate: [AuthGuard,RoleGuard]
      },
      {
        path:'schd-facilities',component:SchdFacilitiesComponent, canActivate: [AuthGuard,RoleGuard]
      }
      ,
      {
        path:'parent-comp',component:ParentCompComponent, canActivate: [AuthGuard,RoleGuard]
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilityManagementRoutingModule { }
