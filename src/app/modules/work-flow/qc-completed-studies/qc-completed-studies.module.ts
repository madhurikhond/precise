import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QcPendingStudiesComponent } from './qc-pending-studies/qc-pending-studies.component';
import { MissingAslComponent } from './missing-asl/missing-asl.component';
import { AttorneyStatsComponent } from './attorney-stats/attorney-stats.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AttorneyDetailComponent } from './missing-asl/attorney-detail/attorney-detail.component';
import { ReadyToBillComponent } from './qc-pending-studies/ready-to-bill/ready-to-bill.component';
import { HardCheckComponent } from './qc-pending-studies/hard-check/hard-check.component';
import { QcCompletedStudiesRoutingModule } from './qc-completed-studies-routing.module';
import { QcCompletedStudiesComponent } from './qc-completed-studies.component';


@NgModule({
  declarations: [ QcCompletedStudiesComponent, QcPendingStudiesComponent, MissingAslComponent, AttorneyStatsComponent, AttorneyDetailComponent, ReadyToBillComponent, HardCheckComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    QcCompletedStudiesRoutingModule
  ]
})
export class QcCompletedStudiesModule { }
