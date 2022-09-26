import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, RequiredValidator, PatternValidator } from '@angular/forms';
import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { MyprofileService } from 'src/app/services/myprofile/myprofile.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})

export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  IsSubmitted: boolean = false;
  error_messages = {
    'password': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password length.' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'password is required.' }
    ],
  }
  formBuilder: any;

  constructor(private fb: FormBuilder, private readonly notificationService: NotificationService,
    private readonly myprofileService: MyprofileService, private readonly storageService: StorageService,
    private readonly commonMethodService: CommonMethodService ) {
  }
  ngOnInit(): void {
    this.commonMethodService.setTitle('Change Password');
    this.changePasswordForm = this.fb.group({
      currentPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-z0-9])[A-Za-z\d].{8,}')]],
      confirmPassword: [null, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-z0-9])[A-Za-z\d].{8,}')]]
    }, {
      validator: this.MustMatch('newPassword', 'confirmPassword')
    }
    );
  }

  MustMatch(Password: string, confirmPassword: string) {
    return (changePasswordForm: FormGroup) => {
      const control = changePasswordForm.controls[Password];
      const matchingControl = changePasswordForm.controls[confirmPassword];
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
   //console.log(this.changePasswordForm)
   this.IsSubmitted = true;
    if (this.changePasswordForm.valid) {
      var body = {
        currentPassword: this.getFromControls.currentPassword.value,
        newPassword: this.getFromControls.newPassword.value,
        userId: this.storageService.user.UserId
      }
      this.changePasswordForm.reset();
      this.IsSubmitted = false;
      if (this.storageService.user.UserId) {
        this.changePassword(body);
      }
    }
  }

  clearFields(){
    this.changePasswordForm.reset();
    this.IsSubmitted = false;
  }

  changePassword(body: any) {
    this.myprofileService.updatePassword(true, body.currentPassword, body.newPassword, body.userId).subscribe((res) => {
      if (res.response != null) {
        this.showNotification(res);
      }
      else {
        this.unSuccessNotification(res)
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
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

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmPassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  get getFromControls() { return this.changePasswordForm.controls; }

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
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
    }
    else {
      control.get('confirmPassword').setErrors({ NoPassswordMatch: false });
    }
  }
}
