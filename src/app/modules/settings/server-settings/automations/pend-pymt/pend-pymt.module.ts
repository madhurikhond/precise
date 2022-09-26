import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendPymtRoutingModule } from './pend-pymt-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DefaultSettingsComponent } from './default-settings/default-settings.component';
import { CaseStatusComponent } from './case-status/case-status.component';
import { PendPymtComponent } from './pend-pymt.component';


@NgModule({
  declarations: [PendPymtComponent,DefaultSettingsComponent, CaseStatusComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgSelectModule,
    PendPymtRoutingModule
  ]
})
export class PendPymtModule { }
