import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PendPymtComponent } from './pend-pymt.component';
import {DefaultSettingsComponent} from './default-settings/default-settings.component'
import{CaseStatusComponent} from './case-status/case-status.component'

const routes: Routes = [
  {
    path:'',component:PendPymtComponent,children:[
      {
        path:'', redirectTo:'defaultsettings',pathMatch:'full'
      },
      {
        path:'defaultsettings',component:DefaultSettingsComponent
      },
      {
        path:'casestatus',component:CaseStatusComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendPymtRoutingModule { }
