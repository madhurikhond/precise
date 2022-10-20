import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account.component';
import { LoginRequestComponent } from './login-request/login-request.component';
import { SubpoenaPickupStatusComponent } from './subpoena-pickup-status/subpoena-pickup-status.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { UnauthorizeAccessComponent } from './unauthorize-access/unauthorize-access.component';
import { PatientLoginComponent } from './patient-login/patient-login.component';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";
import { HttpClient } from '@angular/common/http';
import { PatientCodeVerificationComponent } from './patient-code-verification/patient-code-verification.component';
import { MultipleRecordComponent } from './multiple-record/multiple-record.component';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { PAuthGuard } from '../core/guards/pauth.guard';


export function HttpLoaderFactory(httpClient: HttpClient) {
  return new MultiTranslateHttpLoader(httpClient, [
    { prefix: './assets/translate/', suffix: '.json' }
  ])
}

@NgModule({
  declarations: [
    LoginComponent, AccountComponent, LoginRequestComponent, SubpoenaPickupStatusComponent, ContactUsComponent, ForgotPasswordComponent, UnauthorizeAccessComponent, PatientLoginComponent,PatientCodeVerificationComponent,MultipleRecordComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    NgSelectModule,
    SharedModule,
    MatInputModule,
    NgxMaskModule.forRoot({
      // showMaskTyped : true,
      // clearIfNotMatch : true
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [DatePipe,PAuthGuard]
})
export class AccountModule {
  constructor() {
  }
}
