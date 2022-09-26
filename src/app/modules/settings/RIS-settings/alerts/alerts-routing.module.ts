import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertTypeComponent } from './alert-types/alert-type.component';
import { ReasonComponent } from './reason/reason.component';
import {AlertsComponent} from './alerts.component';
import { UnsatisfiedSettingsComponent } from './unsatisfied-settings/unsatisfied-settings.component';


const routes: Routes = [
  {
    path: '', component: AlertsComponent
    , children: [
      {
        path: '', redirectTo: 'type', pathMatch: 'full'
      },
      {
        path:'type',component:AlertTypeComponent
      }
      ,
      {
        path:'reason',component:ReasonComponent
      }
      ,
      {
        path:'settings',component:UnsatisfiedSettingsComponent
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertsRoutingModule { }
