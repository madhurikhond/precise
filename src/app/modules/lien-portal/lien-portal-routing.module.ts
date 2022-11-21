import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RAuthGuard } from '../core/guards/rauth.guard';
import { LienPortalComponent } from './lien-portal.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  { path: 'lien-portal', component: LienPortalComponent, canActivate: [RAuthGuard] },
  { path: 'lien-portal-setting', component: SettingComponent, canActivate: [RAuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LienPortalRoutingModule { }
