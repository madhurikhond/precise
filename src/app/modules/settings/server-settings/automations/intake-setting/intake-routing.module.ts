import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntakeComponent } from './intake.component';
import { TemplateMappingComponent } from './template-mapping/template-mapping.component';
import { PatientScheduleSettingComponent } from './patient-schedule-setting/patient-schedule-setting.component';
import { DailySummaryComponent } from './daily-summary/daily-summary.component';
import { MissingRxComponent } from './missing-rx/missing-rx.component';
//DailySummaryComponent, MissingRxComponent, PatientScheduleSettingComponent, TemplateMappingComponent
const routes: Routes = [
  
  {
    path: '', component: IntakeComponent, children: [
      {
        path: '', redirectTo: 'templatemapping', pathMatch: 'full'
      },
      {
        path:'templatemapping',component:TemplateMappingComponent
      },
     
      {
        path:'patientschedulesetting',component:PatientScheduleSettingComponent
      },
      {
        path:'dailysummary',component:DailySummaryComponent
      }
      ,
      {
        path:'missingrx',component:MissingRxComponent
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
