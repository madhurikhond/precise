
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonRegex } from 'src/app/constants/commonregex';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { DatePipe } from '@angular/common';
import { PatientPortalStatusCode } from 'src/app/constants/patient-portal-status-code.enum';
import { PageTitleOption, patientPortalResponseStatus, PatientPortalStatusMessage, PatientPortalURL } from 'src/app/models/patient-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';

@Component({
  selector: 'app-patient-basics-contact-info',
  templateUrl: './patient-basics-contact-info.component.html',
  styleUrls: ['./patient-basics-contact-info.component.css']
})
export class PatientBasicsContactInfoComponent implements OnInit {

  contactInfoForm: FormGroup;
  readonly commonRegex = CommonRegex;
  currentLanguage:any;
  patientInfo: any;
  showFirstName = false;
  showMiddleName = false;
  showLastName = false;
  showDOB = false;
  public event = { date: '' }

  constructor(public translate: TranslateService, private fb: FormBuilder, public notificationService: NotificationService, public datePipe: DatePipe,
    private readonly router: Router, public patientPortalService: PatientPortalService,
    public storageservice: StorageService, private readonly commonMethodService: CommonMethodService) {

    this.patientInfo = this.patientPortalService.patientDetail;

    this.contactInfoForm = this.fb.group({
      firstname: ['', [Validators.required]],
      middlename: [''],
      lastname: ['', [Validators.required]],
      dateofbirth: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.commonMethodService.setTitle(PageTitleOption.PATIENT_BASIC_CONTACT_INFO);
    this.currentLanguage = this.storageservice.getPatientLanguage();
    if (this.patientInfo.firstName) {
      this.contactInfoForm.controls['firstname'].setValue(this.patientInfo.firstName);
      this.showFirstName = true;
    } else {
      this.contactInfoForm.controls['firstname'].setValue('');
    }

    if (this.patientInfo.middleName) {
      this.contactInfoForm.controls['middlename'].setValue(this.patientInfo.middleName);
      this.showMiddleName = true;
    } else {
      this.contactInfoForm.controls['middlename'].setValue('');
    }

    if (this.patientInfo.lastName) {
      this.contactInfoForm.controls['lastname'].setValue(this.patientInfo.lastName);
      this.showLastName = true;
    } else {
      this.contactInfoForm.controls['lastname'].setValue('');
    }

    if (this.patientInfo.dateOfBirth) {
      var date = this.patientInfo.dateOfBirth.split("/");
      this.event.date = date[2] + "-" + date[0] + "-" + date[1] + 'T00:00:00.000Z';
      this.contactInfoForm.controls['dateofbirth'].setValue(this.patientInfo.dateOfBirth);
      this.showDOB = true;
    } else {
      this.contactInfoForm.controls['dateofbirth'].setValue('');
    }
  }

  onSubmit() {
    this.patientPortalService.patientDetail.firstName = this.contactInfoForm.controls['firstname'].value;
    this.patientPortalService.patientDetail.middleName = this.contactInfoForm.controls['middlename'].value;
    this.patientPortalService.patientDetail.lastName = this.contactInfoForm.controls['lastname'].value;
    this.patientPortalService.patientDetail.dateOfBirth = this.contactInfoForm.controls['dateofbirth'].value;
    this.patientPortalService.patientDetail.pageCompleted = PatientPortalStatusCode.PATIENT_BASIC_SCREEN;

    this.patientPortalService.AddPatient(this.patientPortalService.patientDetail).subscribe(res => {
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success) {
          this.router.navigate([PatientPortalURL.PATIENT_ADDRESS_CONTACT_INFO]);
        }
      }
      else
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    );
  }

  dobChanged(event: any) {
    this.event.date = '';
    var updatedDate = '';
    var onlyDate = event.detail.value.split("T")[0];
    var date = onlyDate.split("-");
    updatedDate = date[1] + "/" + date[2] + "/" + date[0];
    var eDate = updatedDate.split("/");
    this.event.date = eDate[2] + "-" + eDate[0] + "-" + eDate[1] + 'T00:00:00.000Z';
    this.contactInfoForm.controls['dateofbirth'].setValue('');
    this.contactInfoForm.controls['dateofbirth'].setValue(updatedDate);

  }

  goBack() {
    this.router.navigate([PatientPortalURL.PATIENT_HOME]);
  }
}


