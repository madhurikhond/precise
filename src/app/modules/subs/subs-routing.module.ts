import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { BiComponent } from './bi/bi.component';
import { CopyservicemanagementComponent } from './copy service management/copyservicemanagement.component';
import { RequestSearchComponent } from './request-search/request-search.component';

const routes: Routes = [
  { path:'copy-service-management', component: CopyservicemanagementComponent, canActivate: [AuthGuard,RoleGuard] },
  { path:'bi', component: BiComponent, canActivate: [AuthGuard,RoleGuard] },
  { path:'request-search', component: RequestSearchComponent, canActivate: [AuthGuard,RoleGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubsRoutingModule { }
