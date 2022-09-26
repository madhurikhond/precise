import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { CommonRegex } from 'src/app/constants/commonregex';


export type ForgotPasswordFormValue = {
  'email': string
};

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  submitted = false;
  readonly commonRegex=CommonRegex;
  constructor(private fb: FormBuilder,
    private readonly accountService: AccountService,
    private readonly commonMethodService: CommonMethodService,
    private readonly notificationService: NotificationService) {}

    ngOnInit(): void {
      this.forgotPasswordForm = this.fb.group({
        email: ['', [Validators.required, Validators.pattern(this.commonRegex.EmailRegex )]]});
        this.commonMethodService.setTitle('Forgot password');
    }

    get fpForm() { return this.forgotPasswordForm.controls; }

  // forget password submission form 
    onSubmit() {
      this.submitted = true;
  
      if (this.forgotPasswordForm.invalid) {
        return;
      }
  
      const { email } = this.forgotPasswordForm.value as (ForgotPasswordFormValue);
      this.accountService.forgotPassword({
          Email: email
      }).subscribe((res : any) => {        
        if (res) {
          if(res.responseCode === ResponseStatusCode.OK){
            this.submitted = false;
            this.forgotPasswordForm.reset();
          }
          this.notificationService.showNotification({
            alertHeader : (res.responseCode === ResponseStatusCode.OK || res.responseCode === ResponseStatusCode.Created || res.responseCode === ResponseStatusCode.Accepted) ? 'Success' : 'Error',
            alertMessage: res.message,
            alertType: res.responseCode
          });
        }
      },
      (err : any) => {
        this.notificationService.showNotification({
          alertHeader : err.statusText,
          alertMessage:err.message,
          alertType: ResponseStatusCode.InternalError
        })
      }
      );
    }
}
