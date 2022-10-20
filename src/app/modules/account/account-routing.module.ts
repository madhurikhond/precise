import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { LoginRequestComponent } from './login-request/login-request.component';
import { SubpoenaPickupStatusComponent } from './subpoena-pickup-status/subpoena-pickup-status.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { UnauthorizeAccessComponent } from './unauthorize-access/unauthorize-access.component';
import { PatientLoginComponent } from './patient-login/patient-login.component';
import { PatientCodeVerificationComponent } from './patient-code-verification/patient-code-verification.component';
import { PAuthGuard } from '../core/guards/pauth.guard';
import { MultipleRecordComponent } from './multiple-record/multiple-record.component';

const routes: Routes = [
  {
    path: '', component: AccountComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login-request', component: LoginRequestComponent },
      { path: 'subpoena-pickup-status', component: SubpoenaPickupStatusComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'unauthorize-access', component: UnauthorizeAccessComponent },
      { path: 'patient-portal', component: PatientLoginComponent },
      { path: 'patient-code-verification', component: PatientCodeVerificationComponent,canActivate: [PAuthGuard]  },
      { path: 'multiple-record-found', component: MultipleRecordComponent,canActivate: [PAuthGuard]  },
      //{ path: 'reset-password/:id/:code', component: ResetPasswordComponent },
      //{ path: 'activate-account/:uid/:code', component: ActivateAccountComponent }

    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule {
  constructor() {}
 }
