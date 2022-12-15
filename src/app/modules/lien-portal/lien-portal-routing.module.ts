import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RAuthGuard } from '../core/guards/rauth.guard';
import { LienChangePasswordComponent } from './lien-change-password/lien-change-password.component';
import { LienPortalComponent } from './lien-portal.component';
import { LienProfileComponent } from './lien-profile/lien-profile.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  { path: 'lien-portal', component: LienPortalComponent, canActivate: [RAuthGuard] },
  { path: 'lien-portal-setting', component: SettingComponent, canActivate: [RAuthGuard] },
  { path: 'lien-profile', component: LienProfileComponent, canActivate: [RAuthGuard] },
  { path: 'lien-change-password', component: LienChangePasswordComponent, canActivate: [RAuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LienPortalRoutingModule { }
