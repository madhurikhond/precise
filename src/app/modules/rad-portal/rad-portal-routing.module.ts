import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PAuthGuard } from '../core/guards/pauth.guard';
import { RadPortalComponent } from './rad-portal.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [

  {path: 'radportal', component: RadPortalComponent,pathMatch:'full'},
  {path: 'radsetting', component: SettingComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RadPortalRoutingModule { }
