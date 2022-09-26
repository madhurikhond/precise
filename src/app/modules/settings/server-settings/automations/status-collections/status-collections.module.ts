import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusCollectionsRoutingModule } from './status-collections-routing.module';
import { PslPatientComponent } from './psl-patient/psl-patient.component';
import { CaseStatusComponent } from './case-status/case-status.component';
import { BulkBillingEmailComponent } from './bulk-billing-email/bulk-billing-email.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { StatusCollectionsComponent } from './status-collections.component';
import { PersonellComponent } from './personell/personell.component';


@NgModule({
  declarations: [StatusCollectionsComponent,PslPatientComponent, CaseStatusComponent, BulkBillingEmailComponent,PersonellComponent],
  imports: [
    CommonModule,
    SharedModule,
    StatusCollectionsRoutingModule,
  ]
})
export class StatusCollectionsModule { }
