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
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    LoginComponent, AccountComponent, LoginRequestComponent, SubpoenaPickupStatusComponent, ContactUsComponent, ForgotPasswordComponent, UnauthorizeAccessComponent, ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    NgSelectModule,
    SharedModule,
    NgxMaskModule.forRoot({
      // showMaskTyped : true,
      // clearIfNotMatch : true
    }),
  ],
  providers: [DatePipe]
})
export class AccountModule {
  constructor() {
  }
}
