import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientPortalRoutingModule } from './patient-portal-routing.module';
import { PatientPortalComponent } from './patient-portal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";
import { HttpClient } from '@angular/common/http';
import { NgbProgressbarModule, NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DxProgressBarModule } from 'devextreme-angular';
import { PatientAddressContactInfoComponent } from './patient-address-contact-info/patient-address-contact-info.component';
import { PatientBasicsContactInfoComponent } from './patient-basics-contact-info/patient-basics-contact-info.component';
import { PatientContactInfoComponent } from './patient-contact-info/patient-contact-info.component';
import { PatientEmergencyContactInfoComponent } from './patient-emergency-contact-info/patient-emergency-contact-info.component';
import { PatientAttorneyContactInfoComponent } from './patient-attorney-contact-info/patient-attorney-contact-info.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PatientHomeComponent } from './patient-home/patient-home.component';
import { PreScreeningQuestionComponent } from './pre-screening-question/pre-screening-question.component';
import { ExamQuestionsComponent } from './exam-questions/exam-questions.component';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { PAuthGuard } from '../core/guards/pauth.guard';
import { ExamQuestionsForUsComponent } from './exam-questions-for-us/exam-questions-for-us.component';
import { ExamQuestionsForCtCrComponent } from './exam-questions-for-ct-cr/exam-questions-for-ct-cr.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { PregnancyWaiverComponent } from './pregnancy-waiver/pregnancy-waiver.component';
import { PregnancyWaiversComponent } from './pregnancy-waivers/pregnancy-waivers.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new MultiTranslateHttpLoader(httpClient, [
      { prefix: './assets/translate/', suffix: '.json' }
    ])
  }

@NgModule({
  declarations: [PatientPortalComponent, PatientAddressContactInfoComponent, PatientBasicsContactInfoComponent,PatientContactInfoComponent, PatientEmergencyContactInfoComponent, PatientAttorneyContactInfoComponent, PatientHomeComponent, PreScreeningQuestionComponent, ExamQuestionsComponent, MyAppointmentsComponent,ExamQuestionsForUsComponent,ExamQuestionsForCtCrComponent,PregnancyWaiverComponent,PregnancyWaiversComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    SharedModule,
    PatientPortalRoutingModule,
    NgbProgressbarModule,
    DxProgressBarModule,
    BsDatepickerModule,
    SignaturePadModule,
    NgbTooltipModule,
    TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ],
  providers:[PAuthGuard]
})
export class PatientPortalModule { }
