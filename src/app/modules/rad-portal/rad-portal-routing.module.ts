import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RAuthGuard } from '../core/guards/rauth.guard';
import { RadPortalComponent } from './rad-portal.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  { path: 'radportal', component: RadPortalComponent, canActivate: [RAuthGuard] },
  { path: 'radsetting', component: SettingComponent, canActivate: [RAuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RadPortalRoutingModule { }
