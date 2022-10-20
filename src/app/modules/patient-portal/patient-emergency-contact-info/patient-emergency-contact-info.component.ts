import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonRegex } from 'src/app/constants/commonregex';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PatientPortalStatusCode } from 'src/app/constants/patient-portal-status-code.enum';
import * as confetti from 'canvas-confetti';
import { PageTitleOption, PatientFinancialTypeName, patientPortalResponseStatus, PatientPortalStatusMessage, PatientPortalURL } from 'src/app/models/patient-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';

@Component({
  selector: 'app-patient-emergency-contact-info',
  templateUrl: './patient-emergency-contact-info.component.html',
  styleUrls: ['./patient-emergency-contact-info.component.css']
})
export class PatientEmergencyContactInfoComponent implements OnInit {

  EmergencyContactForm: FormGroup;
  currentLanguage: any;
  IsPI = false;
  patientContactInfo: any;
  showEmergencyContactName = false;
  showEmergencyContactNumber = false;
  readonly commonRegex = CommonRegex;
  public clicked = false;

  constructor(public translate: TranslateService, private fb: FormBuilder,
    private renderer2: Renderer2, private elementRef: ElementRef,
    private readonly router: Router, public patientPortalService: PatientPortalService,
    public storageService: StorageService, public notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService) {
    this.patientContactInfo = this.patientPortalService.patientDetail;
    this.currentLanguage = this.storageService.getPatientLanguage();
    this.EmergencyContactForm = this.fb.group({
      emergencycntphone: ['', [Validators.required, Validators.pattern(this.commonRegex.PhoneRegex)]],
      emergencycntname: ['', [Validators.required]],
    });

  }

  ngOnInit() {
    this.commonMethodService.setTitle(PageTitleOption.PATIENT_EMERGENCY_CONTACT_INFO);

    if (this.patientContactInfo.financialTypeName === PatientFinancialTypeName.PERSONAL_INJURY ||
      this.patientContactInfo.financialTypeName === PatientFinancialTypeName.BROKER) {
      this.IsPI = true;
    }
    if (this.patientContactInfo.emergencyContactName) {
      this.EmergencyContactForm.controls['emergencycntname'].setValue(this.patientContactInfo.emergencyContactName);
      this.showEmergencyContactName = true;
    } else {
      this.EmergencyContactForm.controls['emergencycntname'].setValue('');
    }
    if (this.patientContactInfo.emergencyContactPhone) {
      this.EmergencyContactForm.controls['emergencycntphone'].setValue(this.patientContactInfo.emergencyContactPhone);
      this.showEmergencyContactNumber = true;
    } else {
      this.EmergencyContactForm.controls['emergencycntphone'].setValue('');
    }
  }

  get lgform() { return this.EmergencyContactForm.controls; }

  onSubmit() {

    this.patientPortalService.patientDetail.emergencyContactName = this.EmergencyContactForm.controls['emergencycntname'].value;
    this.patientPortalService.patientDetail.emergencyContactPhone = this.EmergencyContactForm.controls['emergencycntphone'].value;
    this.patientPortalService.patientDetail.pageCompleted = PatientPortalStatusCode.PATIENT_EMERGENCY_SCREEN;

    this.patientPortalService.AddPatient(this.patientPortalService.patientDetail).subscribe(res => {
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success && (this.patientContactInfo.financialTypeName === PatientFinancialTypeName.PERSONAL_INJURY || this.patientContactInfo.financialTypeName === PatientFinancialTypeName.BROKER)) {
          this.router.navigate([PatientPortalURL.PATIENT_ATTORNEY_CONTACT_INFO]);
        }
        else {
          this.surprise();
          setTimeout(() => {
            this.patientPortalService.globalPageNumber = PatientPortalStatusCode.PATIENT_EMERGENCY_SCREEN;
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

  goBack() {
    this.router.navigate([PatientPortalURL.PATIENT_CONTACT_INFO]);
  }
}
