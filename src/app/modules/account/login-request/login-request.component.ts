import { computeDecimalDigest } from '@angular/compiler/src/i18n/digest';
import { AfterContentInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getTime } from 'ngx-bootstrap/chronos/utils/date-getters';
import { CommonRegex } from 'src/app/constants/commonregex';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { AccountService } from 'src/app/services/account.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
declare const $: any;
@Component({
  selector: 'app-login-request',
  templateUrl: './login-request.component.html',
  styleUrls: ['./login-request.component.css']
})
export class LoginRequestComponent implements OnInit {
  isFirstTab: boolean;
  requestLoginForm: FormGroup;
  userTypeList: any;
  stateList: any = [];
  isNextClicked = false;
  submitted = false;
  redirectLinkWithPermission:any;
  //isWorkEmailRequired:boolean=false;
  isPasswordRequired:Boolean=false;
  showDropdownLoader = true;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  dbaText = ''
  maxDate = new Date();
  myclose = false;
  constructor(private fb: FormBuilder, private readonly commonMethodService: CommonMethodService,
    private readonly accountService: AccountService,
    private readonly storageService: StorageService,
    private readonly notificationService: NotificationService, private router: Router) { }
    readonly commonRegex = CommonRegex;

  ngOnInit(): void {

    if (this.checkIsLoggedIn()) {
      this.redirectLinkWithPermission = this.redirectLinkPremission(this.storageService.UserRole)
      this.router.navigate((this.storageService.LastPageURL === null || this.storageService.LastPageURL === '') ? [this.redirectLinkWithPermission] : [this.storageService.LastPageURL]);
    }
    this.getStateList();
    this.isFirstTab = true;
    this.commonMethodService.setTitle('Request a Login');

    this.requestLoginForm = this.fb.group({
      UserType: ['', [Validators.required]],
      DBA: ['', [Validators.required]],
      LicenseNumber: ['', [Validators.required]],
      NPI: ['', [Validators.required]],
      CompanyName: ['', [Validators.required]],
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      City: ['', [Validators.required]],
      State: ['', [Validators.required]],
      Zip: ['', [Validators.required, Validators.minLength(5)]],
      CellPhoneMask: ['', [Validators.required, Validators.pattern(this.commonRegex.PhoneRegex)]],
      HomePhoneMask: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      FaxMask: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      CellPhone: [''],
      HomePhone: [''],
      Fax: [''],
      WorkEmail: ['', [Validators.required,
      Validators.email,
      Validators.pattern(this.commonRegex.EmailRegex)]],
      PersonalEmail: ['', [Validators.required]],
      Password: ['', [Validators.required,
      this.patternValidator(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, { hasNumber: true })]],
      ConfirmPassword: ['', [Validators.required]],
      DateOfBirth: ['', [Validators.required]],
      EmergencyContactName1: ['', [Validators.required]],
      EmergencyContactName2: ['', [Validators.required]],
      EmergencyContactPhone1: ['', [Validators.required]],
      EmergencyContactPhone2: ['', [Validators.required]]
    }, {
      validator: MustMatch('Password', 'ConfirmPassword'),
    });

    this.userTypeList = [{
      Name: 'Please Select User Type',
      Value: ''
    }, {
      Name: 'Attorney',
      Value: 'Attorney'
    }, {
      Name: 'Doctor',
      Value: 'Doctor'
    }, {
      Name: 'Funding Company',
      Value: 'Funding Company'
    }, {
      Name: 'Facility',
      Value: 'Facility'
    }, 
    // {
    //   Name: 'Patient',
    //   Value: 'Patient'
    // }, 
    {
      Name: 'Precise Imaging Employee',
      Value: 'Precise Imaging Employee'
    }, {
      Name: 'Reading Radiologist',
      Value: 'Reading Radiologist'
    },]



    this.requestLoginForm.get('PersonalEmail').valueChanges.subscribe(obj => {
      if (this.requestLoginForm.get('PersonalEmail').value && this.requestLoginForm.get('WorkEmail').value) {
        if (this.requestLoginForm.get('PersonalEmail').value.toLowerCase() === this.requestLoginForm.get('WorkEmail').value.toLowerCase()) {
          this.requestLoginForm.get('WorkEmail').setErrors({ dontMatch: true });
        }
        else {
          this.requestLoginForm.get('WorkEmail').setErrors({ dontMatch: false });
        }
      }
    });

  }
  checkIsLoggedIn() {
    if (this.storageService.user != null) {
      var tokenExpiry = new Date(this.storageService.user.exp * 1000);
      var today = new Date();
      if (tokenExpiry < today) {
        this.router.navigate(['login']);
        this.storageService.clearAll();
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }
  switchTab(value) {
    this.submitted = false;
    this.isNextClicked = true;
    if (this.requestLoginForm.controls['UserType'].value === '') {
      return
    }
    this.isFirstTab = value;
  }

  get lgform() { return this.requestLoginForm.controls; }

  setRequired() {
    return [Validators.required];
    
  }

  //method to submit form
  onSubmit(): any {
    this.submitted = true;
    if (this.requestLoginForm.invalid)
      return false

    this.requestLoginForm.patchValue({
      HomePhone: this.requestLoginForm.get('HomePhoneMask').value ? this.requestLoginForm.get('HomePhoneMask').value.replace(/[^\d]/g, '') : '',
      CellPhone: this.requestLoginForm.get('CellPhoneMask').value ? this.requestLoginForm.get('CellPhoneMask').value.replace(/[^\d]/g, '') : '',
      Fax: this.requestLoginForm.get('FaxMask').value ? this.requestLoginForm.get('FaxMask').value.replace(/[^\d]/g, '') : ''
    })

    this.accountService.requestLogin(JSON.stringify(JSON.stringify(this.requestLoginForm.value)), true).subscribe((res) => {
      var data: any = res;
      if (data?.response && data.response[0].Status) {
        this.showNotificationOnSucess(data.response[0].Message);
        this.router.navigate(['/login'])
      }
      else {
        this.showNotification(data.response[0].Message);
      }

    }, (err: any) => {
      this.showError(err);
    }
    );
  }
  //method to get state list
  getStateList() {
    this.accountService.getServiceStateList().subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.stateList = data.response;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
          
        });
      }
      this.showDropdownLoader = false;
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: ResponseStatusCode.InternalError
        });
        this.showDropdownLoader = false;
      });
  }
  redirectLinkPremission(data: any)
  {
    var valReturn: any;
    let list: any = [];
    let responseHierarchy = JSON.parse(data);
        if (responseHierarchy && responseHierarchy.length) {
          responseHierarchy.forEach((value) => {
            if (value && value.hierarchy) {
              value.hierarchy = JSON.parse(value.hierarchy);
            }
          });
        }
        for (let i = 0; i < responseHierarchy.length; i++) {
          list.push(responseHierarchy[i].hierarchy);
          if(list[0].Url!=='')
          {
            valReturn=list[0].Url
          }
          else if(list[0].Url=='' && list[0].Children)
          {
            valReturn=list[0].Children[0].Url
          }
        }
        return valReturn;
  }
  //Method To change user type
  onChangeUserType(event): any {
    let valuex = event.target.value;
    this.requestLoginForm.reset();
    this.requestLoginForm.patchValue({
      UserType: valuex
    });

    if (valuex === 'Attorney') {
      this.dbaText = 'Firm Name or DBA'
    }
    else if (valuex === 'Doctor' || valuex === 'Reading Radiologist') {
      this.dbaText = 'Practice or DBA Name'
    }
    else {
      this.dbaText = ''
    }
    if (valuex === 'Attorney') {
      this.requestLoginForm.controls.CompanyName.setValidators(null);
      this.requestLoginForm.controls.NPI.setValidators(null);
      this.requestLoginForm.controls.DateOfBirth.setValidators(null);
      this.requestLoginForm.controls.PersonalEmail.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactName1.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactPhone1.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactName2.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactPhone2.setValidators(null);

      this.requestLoginForm.controls.DBA.setValidators(this.setRequired());
      this.requestLoginForm.controls.LicenseNumber.setValidators(this.setRequired());
    }
    else if (valuex === 'Doctor' || valuex === 'Reading Radiologist') {
      this.requestLoginForm.controls.LicenseNumber.setValidators(null);
      this.requestLoginForm.controls.CompanyName.setValidators(null);
      this.requestLoginForm.controls.DateOfBirth.setValidators(null);
      this.requestLoginForm.controls.PersonalEmail.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactName1.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactPhone1.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactName2.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactPhone2.setValidators(null);

      this.requestLoginForm.controls.DBA.setValidators(this.setRequired());
      this.requestLoginForm.controls.NPI.setValidators(this.setRequired());
    }
    else if (valuex === 'Funding Company') {
      this.requestLoginForm.controls.LicenseNumber.setValidators(null);
      this.requestLoginForm.controls.DBA.setValidators(null);
      this.requestLoginForm.controls.NPI.setValidators(null);
      this.requestLoginForm.controls.PersonalEmail.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactName1.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactPhone1.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactName2.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactPhone2.setValidators(null);
      this.requestLoginForm.controls.DateOfBirth.setValidators(null);

      this.requestLoginForm.controls.CompanyName.setValidators(this.setRequired());
      //this.requestLoginForm.controls.DateOfBirth.setValidators(this.setRequired());
    }
    else if (valuex === 'Facility') {
      this.requestLoginForm.controls.LicenseNumber.setValidators(null);
      this.requestLoginForm.controls.DBA.setValidators(null);
      this.requestLoginForm.controls.NPI.setValidators(null);
      this.requestLoginForm.controls.DateOfBirth.setValidators(null);
      this.requestLoginForm.controls.PersonalEmail.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactName1.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactPhone1.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactName2.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactPhone2.setValidators(null);

      this.requestLoginForm.controls.CompanyName.setValidators(this.setRequired());
    }
    else if (valuex === 'Patient') {
      this.requestLoginForm.controls.LicenseNumber.setValidators(null);
      this.requestLoginForm.controls.CompanyName.setValidators(null);
      this.requestLoginForm.controls.DBA.setValidators(null);
      this.requestLoginForm.controls.NPI.setValidators(null);
      this.requestLoginForm.controls.DateOfBirth.setValidators(null);
      this.requestLoginForm.controls.PersonalEmail.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactName1.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactPhone1.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactName2.setValidators(null);
      this.requestLoginForm.controls.EmergencyContactPhone2.setValidators(null);

      this.requestLoginForm.controls.DateOfBirth.setValidators(this.setRequired());
    }
    else if (valuex === 'Precise Imaging Employee') {
      this.requestLoginForm.controls.LicenseNumber.setValidators(null);
      this.requestLoginForm.controls.CompanyName.setValidators(null);
      this.requestLoginForm.controls.DBA.setValidators(null);
      this.requestLoginForm.controls.NPI.setValidators(null);
                    
      this.requestLoginForm.controls.DateOfBirth.setValidators(this.setRequired());
      this.requestLoginForm.controls.PersonalEmail.setValidators(this.setRequired());
      this.requestLoginForm.controls.EmergencyContactName1.setValidators(this.setRequired());
      this.requestLoginForm.controls.EmergencyContactPhone1.setValidators(this.setRequired());
      this.requestLoginForm.controls.EmergencyContactName2.setValidators(this.setRequired());
      this.requestLoginForm.controls.EmergencyContactPhone2.setValidators(this.setRequired());

    }
    if (valuex === 'Precise Imaging Employee') {
      this.requestLoginForm.controls.WorkEmail.setValidators(null);
      this.requestLoginForm.get('WorkEmail').updateValueAndValidity();
      this.requestLoginForm.controls.WorkEmail.setValidators(
        [
          Validators.email,
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@(?:precisemri|PRECISEMRI).com'),
          DontMatch.dontMatch(this.requestLoginForm.get('PersonalEmail'))
        ]
      );

      this.requestLoginForm.controls.PersonalEmail.setValidators(
        [Validators.required,
        Validators.email,
        Validators.pattern(this.commonRegex.EmailRegex)])

      // this.requestLoginForm.controls.PersonalEmail.setValidators([
      //   Validators.compose([
      //     Validators.required, Validators.email,
      //     Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')
      //   ])
      // ]);


    }
    else {
      this.requestLoginForm.controls.WorkEmail.setValidators(
        [Validators.required,
        Validators.email,
        Validators.pattern(this.commonRegex.EmailRegex)])
        this.requestLoginForm.controls.PersonalEmail.setValidators(null);
    }
    this.requestLoginForm.get('LicenseNumber').updateValueAndValidity();
    this.requestLoginForm.get('CompanyName').updateValueAndValidity();
    this.requestLoginForm.get('DBA').updateValueAndValidity();
    this.requestLoginForm.get('NPI').updateValueAndValidity();
    this.requestLoginForm.get('DateOfBirth').updateValueAndValidity();
    this.requestLoginForm.get('PersonalEmail').updateValueAndValidity();
    this.requestLoginForm.get('EmergencyContactName1').updateValueAndValidity();
    this.requestLoginForm.get('EmergencyContactPhone1').updateValueAndValidity();
    this.requestLoginForm.get('EmergencyContactName2').updateValueAndValidity();
    this.requestLoginForm.get('EmergencyContactPhone2').updateValueAndValidity();
   // this.requestLoginForm.get('WorkEmail').updateValueAndValidity();

  }
  // common Notification Method
  showNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Error',
      alertMessage: data,
      alertType: 500
    });
  }
  //Method to show Notification
  showNotificationOnSucess(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data,
      alertType: 200
    });
  }
  // common Error Method
  showError(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }



  patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
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
}
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

export class DontMatch {

  static dontMatch(otherInputControl: AbstractControl): ValidatorFn {

    return (inputControl: AbstractControl): { [key: string]: boolean } | null => {
      if (inputControl.value
        && inputControl.value.trim() != ''
        && inputControl.value === otherInputControl.value) {
        return { 'dontMatch': true };
      }

      return null;
    };
  }
}
