import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientPortalComponent } from './patient-portal.component';
import { PatientBasicsContactInfoComponent } from './patient-basics-contact-info/patient-basics-contact-info.component';
import { PatientAddressContactInfoComponent } from './patient-address-contact-info/patient-address-contact-info.component';
import { PatientEmergencyContactInfoComponent } from './patient-emergency-contact-info/patient-emergency-contact-info.component';
import { PatientAttorneyContactInfoComponent } from './patient-attorney-contact-info/patient-attorney-contact-info.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';
import { PreScreeningQuestionComponent } from './pre-screening-question/pre-screening-question.component';
import { ExamQuestionsComponent } from './exam-questions/exam-questions.component';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { PatientContactInfoComponent } from './patient-contact-info/patient-contact-info.component';
import { PAuthGuard } from '../core/guards/pauth.guard';
import { ExamQuestionsForUsComponent } from './exam-questions-for-us/exam-questions-for-us.component';
import { ExamQuestionsForCtCrComponent } from './exam-questions-for-ct-cr/exam-questions-for-ct-cr.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { PregnancyWaiverComponent } from './pregnancy-waiver/pregnancy-waiver.component';
import { PregnancyWaiversComponent } from './pregnancy-waivers/pregnancy-waivers.component';

const routes: Routes = [
{
  path: '', component: PatientPortalComponent,
  children: [
    { path: 'patient-basic-contact-info', component: PatientBasicsContactInfoComponent,canActivate: [PAuthGuard]  },
     // { path: '', redirectTo: 'patient-basic-contact-info', pathMatch: 'full' },
    { path: 'patient-dashboard', component:PatientHomeComponent },
    { path: 'patient-address-contact-info', component: PatientAddressContactInfoComponent,canActivate: [PAuthGuard]  },
    { path: 'patient-contact-info', component: PatientContactInfoComponent,canActivate: [PAuthGuard]  },
    { path: 'patient-emergency-contact-info', component: PatientEmergencyContactInfoComponent,canActivate: [PAuthGuard]  },
    { path: 'patient-attorney-contact-info', component:PatientAttorneyContactInfoComponent,canActivate: [PAuthGuard]  },
    { path: 'patient-home', component:PatientHomeComponent,canActivate: [PAuthGuard]  },
    { path: 'pre-screening-question', component:PreScreeningQuestionComponent,canActivate: [PAuthGuard] },
    { path: 'exam-question', component:ExamQuestionsComponent,canActivate: [PAuthGuard] },
    { path: 'exam-question-for-us', component:ExamQuestionsForUsComponent,canActivate: [PAuthGuard]},
    { path: 'exam-question-for-ct-cr', component:ExamQuestionsForCtCrComponent,canActivate: [PAuthGuard]},
    { path: 'my-appointment', component:MyAppointmentsComponent,canActivate: [PAuthGuard] },
    { path: 'pregnancy-waiver', component:PregnancyWaiverComponent,canActivate: [PAuthGuard] },
    { path: 'pregnancy-waivers', component:PregnancyWaiversComponent,canActivate: [PAuthGuard] }
  ]
},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientPortalRoutingModule { }
