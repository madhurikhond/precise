import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertTypeComponent } from './alert-types/alert-type.component';
import { ReasonComponent } from './reason/reason.component';
import {AlertsComponent} from './alerts.component';
import { UnsatisfiedSettingsComponent } from './unsatisfied-settings/unsatisfied-settings.component';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';


const routes: Routes = [
  {
    path: '', component: AlertsComponent
    , children: [
      {
        path: '', redirectTo: 'type', pathMatch: 'full'
      },
      {
        path:'type',component:AlertTypeComponent,canActivate:[RoleGuard]
      }
      ,
      {
        path:'reason',component:ReasonComponent,canActivate:[RoleGuard]
      }
      ,
      {
        path:'settings',component:UnsatisfiedSettingsComponent,canActivate:[RoleGuard]
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertsRoutingModule { }
