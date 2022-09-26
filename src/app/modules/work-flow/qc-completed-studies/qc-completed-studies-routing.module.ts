import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';
import { AttorneyStatsComponent } from './attorney-stats/attorney-stats.component';
import { MissingAslComponent } from './missing-asl/missing-asl.component';
import { QcCompletedStudiesComponent } from './qc-completed-studies.component';
 import { QcPendingStudiesComponent } from './qc-pending-studies/qc-pending-studies.component';

const routes: Routes = [
  {
    path: '', component: QcCompletedStudiesComponent, children:[      
      { path: '', redirectTo: 'qc-pending-studies', pathMatch: 'full'},
      { path: 'qc-pending-studies', component: QcPendingStudiesComponent, canActivate:[RoleGuard] },
      { path: 'missing-asl', component: MissingAslComponent },
      { path: 'attorney-stats', component: AttorneyStatsComponent }, 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QcCompletedStudiesRoutingModule { }
