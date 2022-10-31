import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad';
import { PatientPortalScreeningStatusCode, PatientPortalStatusCode } from 'src/app/constants/patient-portal-status-code.enum';
import { patientPortalResponseStatus, PatientPortalStatusMessage, PatientPortalURL } from 'src/app/models/patient-response';
import { StorageService } from 'src/app/services/common/storage.service';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';

@Component({
  selector: 'app-pregnancy-waiver',
  templateUrl: './pregnancy-waiver.component.html',
  styleUrls: ['./pregnancy-waiver.component.scss']
})
export class PregnancyWaiverComponent implements OnInit {
  currentDate:Date = new Date();
  btnText:boolean = false;
  @ViewChild('hiddenSignPopUp', { static: false }) hiddenSignPopUp: ElementRef;
  @ViewChild('f', { static: true }) f: NgForm | any;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  patient: any;
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 750,
    canvasHeight: 200
  };
  
  pregnancyDetail:any = {};
  constructor(private readonly patientPortalService: PatientPortalService,
    private readonly storageService: StorageService,
    private readonly router: Router) {
      this.patient = this.patientPortalService.patientDetail;
   }

  ngOnInit() {
    
    this.getEsignPregnancyWaiver();
  }

  submitSign(isItemSign: boolean) {
    if (this.pregnancyDetail.patientSignature === '') {
      return;
    }
    if (this.f.valid) {
      let data = {
        patientId: this.pregnancyDetail.patientId,
        patientSignature: this.pregnancyDetail.patientSignature,
        patientSignatureName: this.pregnancyDetail.firstName +' '+this.pregnancyDetail.lastName,
        firstName: this.pregnancyDetail.firstName,
        lastName: this.pregnancyDetail.lastName,
        pregncyInWeeks: this.pregnancyDetail.pregnancyWeeks.toString(),
        dateOfBirth: this.pregnancyDetail.birthDate,
        pageCompleted: PatientPortalStatusCode.PATIENT_EXAM_QUESTIONS_SCREEN,
      }
      this.patientPortalService.AddPregnancyWaiverESignLien(data).subscribe((res) => {
        if (res.responseStatus === patientPortalResponseStatus.Success) {
          this.hiddenSignPopUp.nativeElement.click();
          this.storageService.PatientPregnancy = 'true';
          this.patientPortalService.isPregnancyWaiverDownloadable = true;
          this.patientPortalService.successNotification("Signed Successfully");
          this.router.navigate([PatientPortalURL.PATIENT_HOME]);    
        } else {
          this.patientPortalService.errorNotification("Failed To Sign");
        }
      },
        (err: any) => {
          this.patientPortalService.errorNotification("Failed To Sign");
        });
      this.f.submitted = false;
    }
  }

  clearSign(): void {
    this.signaturePad.clear();
    this.pregnancyDetail.patientSignature = '';
  }

  signConfirm(isConfirmSign: boolean) {
    //this.emailSendForm.reset();
    this.signaturePad.clear();
    this.pregnancyDetail.patientSignature = '';

  }

  getEsignData(fromSign = true) {
    
      this.hiddenSignPopUp.nativeElement.click();
  }

  drawComplete() {
    this.pregnancyDetail.patientSignature = this.signaturePad.toDataURL();
  }

  getEsignPregnancyWaiver(){
    var request = {
      patientId: this.patient.patientId
    }
    this.patientPortalService.GetESignPregnancyWavier(request).subscribe(res=>{
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success) {
          this.pregnancyDetail = res.result;
        }
      }
      else
      this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
    })
  }

  goBack() {
      this.router.navigate([PatientPortalURL.PATIENT_HOME]);
  }
}
