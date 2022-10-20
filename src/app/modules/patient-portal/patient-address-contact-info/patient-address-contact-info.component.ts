import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PatientPortalStatusCode } from 'src/app/constants/patient-portal-status-code.enum';
import { PageTitleOption, patientPortalResponseStatus, PatientPortalStatusMessage, PatientPortalURL } from 'src/app/models/patient-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
@Component({
  selector: 'app-patient-address-contact-info',
  templateUrl: './patient-address-contact-info.component.html',
  styleUrls: ['./patient-address-contact-info.component.css']
})
export class PatientAddressContactInfoComponent implements OnInit {

  addressInfoForm: FormGroup;
  currentLanguage: any;
  stateList: any;
  patientAddressDetails: any;
  showStreetAdd = false;
  showCity = false;
  showState = false;
  showZip = false;

  constructor(public translate: TranslateService, private fb: FormBuilder, private readonly router: Router,
    public patientPortalService: PatientPortalService, public storageService: StorageService,
    public notificationService: NotificationService, private readonly commonMethodService: CommonMethodService) {
    this.patientAddressDetails = this.patientPortalService.patientDetail;
    this.currentLanguage = this.storageService.getPatientLanguage();
    this.addressInfoForm = this.fb.group({
      stressadd: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.pattern(/([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}/)]],
    });
    this.GetStateList();
  }

  ngOnInit() {
    this.commonMethodService.setTitle(PageTitleOption.PATIENT_ADDRESS_CONTACT_INFO);

    if (this.patientAddressDetails.streetAddress) {
      this.addressInfoForm.controls['stressadd'].setValue(this.patientAddressDetails.streetAddress);
      this.showStreetAdd = true;
    } else {
      this.addressInfoForm.controls['stressadd'].setValue('');
    }
    if (this.patientAddressDetails.city) {
      this.addressInfoForm.controls['city'].setValue(this.patientAddressDetails.city);
      this.showCity = true;
    } else {
      this.addressInfoForm.controls['city'].setValue('');
    }
    if (this.patientAddressDetails.state) {
      this.addressInfoForm.controls['state'].setValue(this.patientAddressDetails.state);
      this.showState = true;
    } else {
      this.addressInfoForm.controls['state'].setValue('');
    }
    if (this.patientAddressDetails.zipcode) {
      this.addressInfoForm.controls['zip'].setValue(this.patientAddressDetails.zipcode);
      this.showZip = true;
    } else {
      this.addressInfoForm.controls['zip'].setValue('');
    }
  }

  get lgform() { return this.addressInfoForm.controls; }

  onSubmit() {
    this.patientPortalService.patientDetail.streetAddress = this.addressInfoForm.controls['stressadd'].value;
    this.patientPortalService.patientDetail.city = this.addressInfoForm.controls['city'].value;
    this.patientPortalService.patientDetail.state = this.addressInfoForm.controls['state'].value;
    this.patientPortalService.patientDetail.zipcode = this.addressInfoForm.controls['zip'].value;
    this.patientPortalService.patientDetail.pageCompleted = PatientPortalStatusCode.PATIENT_ADDRESS_SCREEN;


    this.patientPortalService.AddPatient(this.patientPortalService.patientDetail).subscribe(res => {
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success)
          this.router.navigate([PatientPortalURL.PATIENT_CONTACT_INFO]);
      }
      else
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    );
  }

  getState() {
    this.addressInfoForm.get('state');
  }

  GetStateList() {
    var request = {};
    this.patientPortalService.GetStateList(request).subscribe(res => {
      if (res) {
        if (res.result)
          this.stateList = res.result;
      }
    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      })
  }

  goBack() {
    this.router.navigate([PatientPortalURL.PATIENT_BASIC_CONTACT_INFO]);
  }
}

