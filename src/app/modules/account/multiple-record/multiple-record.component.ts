import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { LanguageOption, PageTitleOption, PatientFinancialTypeName, patientPortalResponseStatus, PatientPortalStatusMessage, PatientPortalURL } from 'src/app/models/patient-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';

@Component({
  selector: 'app-multiple-record',
  templateUrl: './multiple-record.component.html',
  styleUrls: ['./multiple-record.component.css']
})
export class MultipleRecordComponent implements OnInit {

  multipleRecordForm : FormGroup;
  currentLanguage: any = 'en';
  setLanguage :boolean = true;
  submitted = false;
  patientRecords:any;
  mobileNumber:any;
  uniqueId:string;

  constructor(public translate: TranslateService,
    private patientPortalService: PatientPortalService,
    private storageService:StorageService,
    private readonly router: Router,private fb: FormBuilder,private readonly commonMethodService: CommonMethodService) {
      this.patientRecords = this.patientPortalService.patientRecords;
      this.mobileNumber = this.patientPortalService.mobileNumber.substring(0,3) +'-'+this.patientPortalService.mobileNumber.substring(3,6)+'-'+this.patientPortalService.mobileNumber.substring(6,10);
    }

  ngOnInit() {
    this.commonMethodService.setTitle(PageTitleOption.MULTIPLE_RECORD_FOUND);
    this.currentLanguage = this.storageService.getPatientLanguage();
    if(this.currentLanguage == LanguageOption.ES)
      this.setLanguage = false;

    this.translate.use(this.currentLanguage);
    this.multipleRecordForm = this.fb.group({
      code1: ['', [Validators.required]],
      code2: ['', [Validators.required]],
      code3: ['', [Validators.required]],
      code4: ['', [Validators.required]],
      code5: ['', [Validators.required]],
      code6: ['', [Validators.required]],
    });
  }

  onSubmit(){
    this.submitted = true;
    this.router.navigate([PatientPortalURL.MULTIPLE_RECORD_FOUND]);
  }

  languageChange(lang:any){
    this.storageService.setPatientLanguage(lang);
    this.currentLanguage = lang;
    this.translate.use(lang);
  }

  redirectToPrevious(){
    this.router.navigate([PatientPortalURL.PATIENT_PORTAL]);
  }

  getPatientByPatientId(patient:any){
    var request = {
      patientId: patient.patientId
    }
    this.patientPortalService.GetPatientByPatientId(request, true).subscribe((res: any) => {
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success) {
          this.patientPortalService.patientDetail = res.result;
          this.patientPortalService.patientDetail.pageCompleted = patient.pageCompleted;
          this.patientPortalService.uniqueId = patient.uniqueId;
          this.patientPortalService.globalPageNumber = patient.pageCompleted;
          this.patientPortalService.remainingStudyCount = patient.remainingStudyCount;
          this.patientPortalService.totalStudyCount = patient.totalStudyCount;
          this.patientPortalService.isPregnancyWaiverEnable = patient.isPregnancyWaiverEnable;
          this.patientPortalService.isPregnancyWaiverDownloadable = patient.isPregnancyWaiverDownloadable;
          this.storageService.setItem("p_detail",this.patientPortalService.patientDetail);
          if( patient.redPSL == "False" && patient.techPSL == "False" && patient.pageCompleted === 0 &&
          (this.patientPortalService.patientDetail.financialTypeName == PatientFinancialTypeName.PERSONAL_INJURY || this.patientPortalService.patientDetail.financialTypeName == PatientFinancialTypeName.BROKER))
          {
            if(this.currentLanguage == "es")
              this.router.navigate([PatientPortalURL.ESIGN_REQUESTS], { queryParams:
              { patientid: patient.patientId,Token: patient.uniqueId} });
            else
              this.router.navigate([PatientPortalURL.ESIGN_REQUEST], { queryParams:
                { patientid: patient.patientId,Token: patient.uniqueId} });
          }
          else
              this.router.navigate([PatientPortalURL.PATIENT_HOME]);
        }
      }
    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    );
  }

}
