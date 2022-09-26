import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { CannotScheduleComponent } from './cannot-schedule/cannot-schedule.component';
import { NoShowSmsComponent } from './no-show-sms/no-show-sms.component';
import { SchedulingComponent } from './scheduling.component';

const routes: Routes = [
  {
    path:'',component:SchedulingComponent,children:[
      {
        path:'',redirectTo:'scheduler',loadChildren: () => import('./scheduler/scheduler.module').then(m => m.SchedulerModule),canActivate:[RoleGuard]
      },
      {
        path:'scheduler',loadChildren: () => import('./scheduler/scheduler.module').then(m => m.SchedulerModule),canActivate:[RoleGuard]
      },
      {
        path:'patientapptconf',loadChildren: () => import('./patient-appt-conf/patient-appt-conf.module').then(m => m.PatientApptConfModule),canActivate:[RoleGuard]
      },
      {
        path:'cannotschedule',component:CannotScheduleComponent,canActivate:[RoleGuard]
      },
      {
        path:'noshowsms',component:NoShowSmsComponent,canActivate:[RoleGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulingRoutingModule { }
