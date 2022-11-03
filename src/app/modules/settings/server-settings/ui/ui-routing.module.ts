import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/modules/core/guards/auth.guard';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { TaskManagementSettingComponent } from './task-management-setting/task-management-setting.component';
import { UiComponent } from './ui.component';

const routes: Routes = [
  { path: '', redirectTo: 'subs', pathMatch: 'full',canActivate:[RoleGuard] },
  { path: 'subs', loadChildren: () => import('./subs/subs.module').then(m => m.SubsModule), canActivate: [AuthGuard,RoleGuard] },
  { path: 'e-sign', loadChildren: () => import('./e-sign/e-sign.module').then(m => m.ESignModule), canActivate: [AuthGuard,RoleGuard] },
  { path: 'task-management-setting', component:TaskManagementSettingComponent , canActivate: [AuthGuard, RoleGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UiRoutingModule { }
