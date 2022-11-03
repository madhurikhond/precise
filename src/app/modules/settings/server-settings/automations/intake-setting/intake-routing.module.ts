import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntakeComponent } from './intake.component';
import { TemplateMappingComponent } from './template-mapping/template-mapping.component';
import { PatientScheduleSettingComponent } from './patient-schedule-setting/patient-schedule-setting.component';
import { DailySummaryComponent } from './daily-summary/daily-summary.component';
import { MissingRxComponent } from './missing-rx/missing-rx.component';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
//DailySummaryComponent, MissingRxComponent, PatientScheduleSettingComponent, TemplateMappingComponent
const routes: Routes = [
  
  {
    path: '', component: IntakeComponent, children: [
      {
        path: '', redirectTo: 'templatemapping', pathMatch: 'full',canActivate:[RoleGuard]
      },
      {
        path:'templatemapping',component:TemplateMappingComponent,canActivate:[RoleGuard]
      },
     
      {
        path:'patientschedulesetting',component:PatientScheduleSettingComponent,canActivate:[RoleGuard]
      },
      {
        path:'dailysummary',component:DailySummaryComponent,canActivate:[RoleGuard]
      }
      ,
      {
        path:'missingrx',component:MissingRxComponent,canActivate:[RoleGuard]
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntakeRoutingModule {
 }
