import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PatientPortalDateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import * as confetti from 'canvas-confetti';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { DatePipe } from '@angular/common';
import { CommonRegex } from 'src/app/constants/commonregex';
import { PatientPortalStatusCode } from 'src/app/constants/patient-portal-status-code.enum';
import { PageTitleOption, patientPortalResponseStatus, PatientPortalStatusMessage, PatientPortalURL } from 'src/app/models/patient-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';

@Component({
  selector: 'app-patient-attorney-contact-info',
  templateUrl: './patient-attorney-contact-info.component.html',
  styleUrls: ['./patient-attorney-contact-info.component.css']
})
export class PatientAttorneyContactInfoComponent implements OnInit {

  AttorneyContactForm: FormGroup;
  patientContactInfo: any;
  showAttornyName = false;
  showDOI = false;
  showDriverName = false;
  showCarrier = false;
  showClaimNo = false;
  currentLanguage: any;
  readonly commonRegex = CommonRegex;
  public event = {
    date: ''
  }

  readonly dateTimeFormatCustom = PatientPortalDateTimeFormatCustom;
  public clicked = false;

  constructor(public translate: TranslateService, private fb: FormBuilder, private readonly router: Router, private renderer2: Renderer2,
    private elementRef: ElementRef, public patientPortalService: PatientPortalService, public storageService: StorageService,
    public notificationService: NotificationService, public datePipe: DatePipe,private readonly commonMethodService: CommonMethodService) {
    this.patientContactInfo = this.patientPortalService.patientDetail;
    this.AttorneyContactForm = this.fb.group({
      attorneyname: [''],
      dateofinjury: [''],
      drivername: [''],
      carrier: [''],
      claimno: [''],
    });
  }

  ngOnInit() {

    this.commonMethodService.setTitle(PageTitleOption.PATIENT_ATTORNEY_CONTACT_INFO);
    this.currentLanguage = this.storageService.getPatientLanguage();
    if (this.patientContactInfo.attorneyName) {
      this.AttorneyContactForm.controls['attorneyname'].setValue(this.patientContactInfo.attorneyName);
      this.showAttornyName = true;
    } else {
      this.AttorneyContactForm.controls['attorneyname'].setValue('');
    }
    if (this.patientContactInfo.dateOfInjury) {
      var date = this.patientContactInfo.dateOfInjury.split("/");
      this.event.date = date[2] + "-" + date[0] + "-" + date[1] + 'T00:00:00.000Z';
      this.AttorneyContactForm.controls['dateofinjury'].setValue(this.patientContactInfo.dateOfInjury);
      this.showDOI = true;
    } else {
      this.AttorneyContactForm.controls['dateofinjury'].setValue('');
    }
    if (this.patientContactInfo.driverName) {
      this.AttorneyContactForm.controls['drivername'].setValue(this.patientContactInfo.driverName);
      this.showDriverName = true;
    } else {
      this.AttorneyContactForm.controls['drivername'].setValue('');
    }
    if (this.patientContactInfo.autoInsuranceCarrier) {
      this.AttorneyContactForm.controls['carrier'].setValue(this.patientContactInfo.autoInsuranceCarrier);
      this.showCarrier = true;
    } else {
      this.AttorneyContactForm.controls['carrier'].setValue('');
    }
    if (this.patientContactInfo.autoInsuranceClaimNumber) {
      this.AttorneyContactForm.controls['claimno'].setValue(this.patientContactInfo.autoInsuranceClaimNumber);
      this.showClaimNo = true;
    } else {
      this.AttorneyContactForm.controls['claimno'].setValue('');
    }
  }
  get lgform() { return this.AttorneyContactForm.controls; }

  onSubmit() {
    this.patientPortalService.patientDetail.attorneyName = this.AttorneyContactForm.controls['attorneyname'].value;
    this.patientPortalService.patientDetail.dateOfInjury = this.AttorneyContactForm.controls['dateofinjury'].value;
    this.patientPortalService.patientDetail.driverName = this.AttorneyContactForm.controls['drivername'].value;
    this.patientPortalService.patientDetail.autoInsuranceCarrier = this.AttorneyContactForm.controls['carrier'].value;
    this.patientPortalService.patientDetail.autoInsuranceClaimNumber = this.AttorneyContactForm.controls['claimno'].value;
    this.patientPortalService.patientDetail.pageCompleted = PatientPortalStatusCode.PATIENT_ATTORNEY_SCREEN;
    this.patientPortalService.AddPatient(this.patientPortalService.patientDetail).subscribe(res => {
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success) {
          this.surprise();
          setTimeout(() => {
            this.patientPortalService.globalPageNumber = PatientPortalStatusCode.PATIENT_ATTORNEY_SCREEN;
            this.router.navigate([PatientPortalURL.PATIENT_HOME]);
          }, 1500);
        }
      }
    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    );
  }

  public surprise(): void {
    const canvas = this.renderer2.createElement('canvas');
    this.renderer2.appendChild(this.elementRef.nativeElement, canvas);
    const myConfetti = confetti.create(canvas, {
      resize: true
    });
    myConfetti({
      startVelocity: 10,
      zIndex: 9999,
      spread: 180,
    });
    this.clicked = true;
  }

  DOIChanged(event: any) {
    this.event.date = '';
    var updatedDate = '';
    var onlyDate = event.detail.value.split("T")[0];
    var date = onlyDate.split("-");
    updatedDate = date[1] + "/" + date[2] + "/" + date[0];
    var eDate = updatedDate.split("/");
    this.event.date = eDate[2] + "-" + eDate[0] + "-" + eDate[1] + 'T00:00:00.000Z';
    this.AttorneyContactForm.controls['dateofinjury'].setValue('');
    this.AttorneyContactForm.controls['dateofinjury'].setValue(updatedDate);
  }

  goBack() {
    this.router.navigate([PatientPortalURL.PATIENT_EMERGENCY_CONTACT_INFO]);
  }
}
