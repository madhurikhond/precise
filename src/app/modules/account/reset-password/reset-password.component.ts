import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, RequiredValidator, PatternValidator } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SchedulingFacilitiesSettingsComponent } from '../../settings/server-settings/scheduling-facilities-settings/scheduling-facilities-settings.component';
import { StorageService } from 'src/app/services/common/storage.service';

export type ResetPasswordFormValue = {
  'token': string,
  'newPassword': string,
  'confirmPassword': string,
};
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})


export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  IsSubmitted: boolean = false;
  strUrl: String = '';
  strToken: String = '';
  NewPassword: String = '';
  strSuccessMessage: String = '';
  checkStatus: boolean = false;
  isValidResetPassword: boolean = true;

  checkTokenValidityStatus: boolean = true;

  constructor(private fb: FormBuilder, private router: Router,
    private readonly accountService: AccountService,
    private readonly commonMethodService: CommonMethodService,
    private readonly notificationService: NotificationService, private readonly storageService: StorageService,) { }

  ngOnInit(): void {
    
    this.resetPasswordForm = this.fb.group({

      newPassword: [null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$')]],
      confirmPassword: [null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$')]],
      token: this.strToken,
    }, {
      validator: this.MustMatch('newPassword', 'confirmPassword')
    }
    );

    this.commonMethodService.setTitle('Reset password');
    this.strUrl = this.router.url;
    this.strToken = '';

    if (this.strUrl != '') {
      this.strToken = this.strUrl.split('reset-password/').slice(1, 37).toString();
    }

    this.strSuccessMessage = "";
    if (this.strToken != '' && this.checkStatus == false) {

      this.checkTokenValidation(this.strToken);
    }


  }
  //CheckResetPasswordTokenValidation
  get rpForm() { return this.resetPasswordForm.controls; }
  //Method used for Token Validation
  checkTokenValidation(token) {

    if (token != null) {
      this.accountService.checkResetPasswordTokenValidation({
        Token: token,
        UserId: 0


      }).subscribe((res: any) => {
        if (res) {
          if (res.responseCode == 200) {

            this.isValidResetPassword = true;

            this.strSuccessMessage = res.message;

          }
          else {
            this.isValidResetPassword = false;

            
            this.strSuccessMessage = res.message;

          }

        }
      },
        (err: any) => {

          this.router.navigate(['login']);
        }
      );

    }
    else {
      return false;
    }
  }

  MustMatch(newPassword: string, confirmPassword: string) {
    return (resetPasswordForm: FormGroup) => {
      const control = resetPasswordForm.controls[newPassword];
      const matchingControl = resetPasswordForm.controls[confirmPassword];
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  onSubmit() {

    this.IsSubmitted = true;
    if (this.resetPasswordForm.valid) {
      var body = {
        newPassword: this.rpForm.newPassword.value,
        confirmPassword: this.rpForm.confirmPassword.value,

        token: this.strToken

      }

      this.IsSubmitted = false;
      if (this.strToken != null) {
        this.accountService.resetPassword({
          newPassword: body.newPassword,
          confrimPassword: body.confirmPassword,
          Token: this.strToken
        }).subscribe((res: any) => {
          if (res) {
            if (res.responseCode === ResponseStatusCode.OK) {
              this.checkStatus = true;
              this.showNotification(res);

              this.IsSubmitted = false;
              this.isValidResetPassword = true;
              this.strSuccessMessage = res.message;
              this.storageService.clearAll();
              localStorage.removeItem('user');
              localStorage.removeItem('roles');
              this.router.navigate(['login']);
              localStorage.removeItem('_cr_u_infor');
              localStorage.removeItem('storage');
            }


            else {
              //  this.errorNotification(res);
              this.strSuccessMessage = res.message;
              this.isValidResetPassword = false;
              this.checkStatus = false;
            }
          }
        }

        );
      }
    }

  }
  // common Notification Method
  showNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  unSuccessNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Error',
      alertMessage: data.message,
      alertType: data.status
    });
  }
  // common Error Method
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.responseCode
    });
  }
  newPassword(formGroup: FormGroup) {
    const { value: newPassword } = formGroup.get('newPassword');
    const { value: confirmPassword } = formGroup.get('confirmPassword');
    return newPassword === confirmPassword ? null : { passwordNotMatch: true };
  }
  get fpForm() { return this.resetPasswordForm.controls; }
}


export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  passwordMatchValidator(control: AbstractControl) {
    const newPassword: string = control.get('newPassword').value; // get password from new password form control
    const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if (newPassword !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
    }
    else {
      control.get('confirmPassword').setErrors({ NoPassswordMatch: false });
    }
  }
}
