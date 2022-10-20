import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonRegex } from 'src/app/constants/commonregex';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PatientPortalStatusCode } from 'src/app/constants/patient-portal-status-code.enum';
import { PageTitleOption, patientPortalResponseStatus, PatientPortalStatusMessage, PatientPortalURL } from 'src/app/models/patient-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
@Component({
  selector: 'app-patient-contact-info',
  templateUrl: './patient-contact-info.component.html',
  styleUrls: ['./patient-contact-info.component.css']
})
export class PatientContactInfoComponent implements OnInit {

  contactInfoForm: FormGroup;
  currentLanguage: any;
  patientContactInfo: any;
  readonly commonRegex = CommonRegex;
  showHomePhone = false;
  showCellPhone = false;
  showEmail = false;

  constructor(public translate: TranslateService, private fb: FormBuilder, private readonly router: Router, public patientPortalService: PatientPortalService,
    public storageService: StorageService, public notificationService: NotificationService, private readonly commonMethodService: CommonMethodService) {
    this.patientContactInfo = this.patientPortalService.patientDetail;

    this.contactInfoForm = this.fb.group({
      homephone: ['',],
      cellphone: ['', [Validators.required, Validators.pattern(this.commonRegex.PhoneRegex)]],
      email: ['', [Validators.required, Validators.pattern(this.commonRegex.EmailRegex)]],
    });
  }

  ngOnInit() {
    this.commonMethodService.setTitle(PageTitleOption.PATIENT_CONTACT_INFO);
    this.currentLanguage = this.storageService.getPatientLanguage();

    if (this.patientContactInfo.homePhone) {
      this.contactInfoForm.controls['homephone'].setValue(this.patientContactInfo.homePhone);
      this.showHomePhone = true;
    } else {
      this.contactInfoForm.controls['homephone'].setValue('');
    }
    if (this.patientContactInfo.cellPhone) {
      this.contactInfoForm.controls['cellphone'].setValue(this.patientContactInfo.cellPhone);
      this.showCellPhone = true;
    } else {
      this.contactInfoForm.controls['cellphone'].setValue('');
    }
    if (this.patientContactInfo.email) {
      this.contactInfoForm.controls['email'].setValue(this.patientContactInfo.email);
      this.showEmail = true;
    } else {
      this.contactInfoForm.controls['email'].setValue('');
    }
  }

  get lgform() { return this.contactInfoForm.controls; }

  onSubmit() {

    this.patientPortalService.patientDetail.homePhone = this.contactInfoForm.controls['homephone'].value;
    this.patientPortalService.patientDetail.cellPhone = this.contactInfoForm.controls['cellphone'].value;
    this.patientPortalService.patientDetail.email = this.contactInfoForm.controls['email'].value;
    this.patientPortalService.patientDetail.pageCompleted = PatientPortalStatusCode.PATIENT_CONTACT_SCREEN;

    this.patientPortalService.AddPatient(this.patientPortalService.patientDetail).subscribe(res => {
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success) {
          this.router.navigate([PatientPortalURL.PATIENT_EMERGENCY_CONTACT_INFO]);
        }
      }
    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    );

  }

  goBack() {
    this.router.navigate([PatientPortalURL.PATIENT_ADDRESS_CONTACT_INFO]);
  }
}
