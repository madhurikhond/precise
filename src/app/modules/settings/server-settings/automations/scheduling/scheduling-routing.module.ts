import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CannotScheduleComponent } from './cannot-schedule/cannot-schedule.component';
import { NoShowSmsComponent } from './no-show-sms/no-show-sms.component';
import { SchedulingComponent } from './scheduling.component';

const routes: Routes = [
  {
    path:'',component:SchedulingComponent,children:[
      {
        path:'',redirectTo:'scheduler',loadChildren: () => import('./scheduler/scheduler.module').then(m => m.SchedulerModule)
      },
      {
        path:'scheduler',loadChildren: () => import('./scheduler/scheduler.module').then(m => m.SchedulerModule)
      },
      {
        path:'patientapptconf',loadChildren: () => import('./patient-appt-conf/patient-appt-conf.module').then(m => m.PatientApptConfModule)
      },
      {
        path:'cannotschedule',component:CannotScheduleComponent
      },
      {
        path:'noshowsms',component:NoShowSmsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulingRoutingModule { }
