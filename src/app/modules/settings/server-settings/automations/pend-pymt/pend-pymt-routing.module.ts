import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PendPymtComponent } from './pend-pymt.component';
import {DefaultSettingsComponent} from './default-settings/default-settings.component'
import{CaseStatusComponent} from './case-status/case-status.component'
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';

const routes: Routes = [
  {
    path:'',component:PendPymtComponent,children:[
      {
        path:'', redirectTo:'defaultsettings',pathMatch:'full',canActivate:[RoleGuard]
      },
      {
        path:'defaultsettings',component:DefaultSettingsComponent,canActivate:[RoleGuard]
      },
      {
        path:'casestatus',component:CaseStatusComponent,canActivate:[RoleGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendPymtRoutingModule { }
