import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { SchedulingFacillitiesComponent } from '../work-flow/scheduling-facillities/scheduling-facillities.component';
import { ActionNeededComponent } from './action-needed/action-needed.component';
import { CallPatientScheduleComponent } from './call-patient-schedule/call-patient-schedule.component';
import { OrderedreviewerComponent } from './ordered-reviewer/orderedreviewer.component';
import { OrderedSchedulerComponent } from './ordered-scheduler/ordered-scheduler.component';

const routes: Routes = [
  { path: 'scheduling-facilities', component: SchedulingFacillitiesComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'ordered-reviewer', component: OrderedreviewerComponent, canActivate: [AuthGuard,RoleGuard] },
  { path: 'ordered-scheduler', component: OrderedSchedulerComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'comm-failure', loadChildren: () => import('./comm-failure/comm-failure.module').then(m => m.CommFailureModule), canActivate: [AuthGuard,RoleGuard] },
  { path: 'call-patient-confirmation', component: CallPatientScheduleComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'qc-completed-studies', loadChildren: () => import('./qc-completed-studies/qc-completed-studies.module').then(m => m.QcCompletedStudiesModule), canActivate: [AuthGuard,RoleGuard] },
  { path: 'action-needed', component: ActionNeededComponent, canActivate: [AuthGuard, RoleGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }
