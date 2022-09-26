import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntakeRoutingModule } from './intake-routing.module';
import { SharedModule } from '../../../../shared/shared.module';
import { IntakeComponent } from './intake.component';
import { DailySummaryComponent } from './daily-summary/daily-summary.component';
import { MissingRxComponent } from './missing-rx/missing-rx.component';
import { PatientScheduleSettingComponent } from './patient-schedule-setting/patient-schedule-setting.component';
import { TemplateMappingComponent } from './template-mapping/template-mapping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [IntakeComponent, DailySummaryComponent, MissingRxComponent, PatientScheduleSettingComponent, TemplateMappingComponent],
  imports: [
    CommonModule,
    IntakeRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule
  ]
})
export class IntakeModule { }
