import { NgModule } from '@angular/core';


import { WorkflowRoutingModule } from './workflow-routing.module';
import { SharedModule } from '../shared/shared.module';
import { OrderedreviewerComponent } from './ordered-reviewer/orderedreviewer.component';
import { DatePipe } from '@angular/common';
import { CKEditorModule } from 'ng2-ckeditor';
import { CallPatientScheduleComponent } from './call-patient-schedule/call-patient-schedule.component';
import { PatientDetailsComponent } from './call-patient-schedule/patient-details/patient-details.component';
import { OrderedSchedulerComponent } from './ordered-scheduler/ordered-scheduler.component';
import { SchedulingFacillitiesComponent } from '../work-flow/scheduling-facillities/scheduling-facillities.component';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { ActionNeededComponent } from './action-needed/action-needed.component';
import { PatientService } from 'src/app/services/patient/patient.service';
import { PatientDetailGroupComponent } from './ordered-scheduler/patient-detail-group/patient-detail-group.component';
import { DxAutocompleteModule, DxButtonModule, DxContextMenuModule } from 'devextreme-angular';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { FacillitiesModule } from '../facillities/facillities.module';

@NgModule({
  declarations: [SchedulingFacillitiesComponent, OrderedreviewerComponent, CallPatientScheduleComponent, PatientDetailsComponent, OrderedSchedulerComponent, ActionNeededComponent, PatientDetailGroupComponent,
   ],
  imports: [
    SharedModule,
    CKEditorModule,
    WorkflowRoutingModule,
    DxButtonModule,
    DxAutocompleteModule,
    FacillitiesModule,
    FormsModule,
    DxContextMenuModule,
    NgxMaskModule.forRoot({
      // showMaskTyped : true,
      // clearIfNotMatch : true
    }),
  ],
  providers: [FacilityService, DatePipe, PatientService]
})
export class WorkflowModule { }
