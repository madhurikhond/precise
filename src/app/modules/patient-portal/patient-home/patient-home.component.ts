import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { PatientPortalStatusCode } from 'src/app/constants/patient-portal-status-code.enum';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { LanguageOption, PageTitleOption, PatientFinancialTypeName, patientPortalResponseStatus, PatientPortalStatusMessage, PatientPortalURL } from 'src/app/models/patient-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';

@Component({
  selector: 'app-patient-home',
  templateUrl: './patient-home.component.html',
  styleUrls: ['./patient-home.component.css']
})
export class PatientHomeComponent implements OnInit {

  currentLanguage: any = "en";
  setLanguage: boolean = true;
  contactInfoIcon: boolean = false;
  screningInfoIcon: boolean = false;
  showMedicalLien: boolean = false;
  @Input() item:any;
  patient: any;
  isPregnant: boolean = false;
  showPregnantPdf:boolean = false;
  constructor(public translate: TranslateService, public patientService: PatientService, private storageService: StorageService,
    public notificationService: NotificationService, private patientPortalService: PatientPortalService,
    private readonly router: Router, private readonly commonMethodService: CommonMethodService) {
    this.patient = this.patientPortalService.patientDetail;
  }

  ngOnInit(): void {
    this.commonMethodService.setTitle(PageTitleOption.PATIENT_DASHBOARD);
    if (this.patientPortalService.patientRecords == undefined || this.patientPortalService.patientRecords == null || this.patientPortalService.patientRecords.length == 0)
      this.setPatientRecords();
      else{
        this.currentLanguage = this.storageService.getPatientLanguage();
            if (this.patientPortalService.globalPageNumber === PatientPortalStatusCode.PATIENT_EMERGENCY_SCREEN) {
              if (this.patient.financialTypeName !== PatientFinancialTypeName.PERSONAL_INJURY
                || this.patient.financialTypeName !== PatientFinancialTypeName.BROKER)
                this.contactInfoIcon = true;

            }
            if (this.patientPortalService.globalPageNumber === PatientPortalStatusCode.PATIENT_ATTORNEY_SCREEN) {
              if (this.patient.financialTypeName == PatientFinancialTypeName.PERSONAL_INJURY
                || this.patient.financialTypeName == PatientFinancialTypeName.BROKER)
                this.contactInfoIcon = true;
            }

            if (this.patientPortalService.globalPageNumber > PatientPortalStatusCode.PATIENT_ATTORNEY_SCREEN)
              this.contactInfoIcon = true;


            if (this.patientPortalService.remainingStudyCount == 0 || this.storageService.PatientStudy)
              this.screningInfoIcon = true;

            if(this.storageService.PatientPreScreening)
            {
              if(this.storageService.PatientPreScreening == 'true')
              {
                this.screningInfoIcon = true;
              }
              else{
                this.screningInfoIcon = false;
              }
            }

            if (this.currentLanguage == LanguageOption.ES)
              this.setLanguage = false;

            this.translate.use(this.currentLanguage);

            if (this.patientPortalService.isPregnancyWaiverEnable == true)
            {
                  this.isPregnant = true;
            }
            if(this.patientPortalService.isPregnancyWaiverDownloadable == true)
              this.showPregnantPdf = true;
            if (this.patientPortalService.remainingStudyCount > 0)
              this.screningInfoIcon = false;
            else
            this.screningInfoIcon = true;
            if (this.patient.financialTypeName == PatientFinancialTypeName.PERSONAL_INJURY
              || this.patient.financialTypeName == PatientFinancialTypeName.BROKER)
                this.showMedicalLien = true;
      }
  }


  setPatientRecords() {

    this.storageService.removePatientPreScreening();

    this.storageService.removePatientPregnancy();
    var data = {
      mobileNumber: this.patient.cellPhone == null ? this.patient.homePhone : this.patient.cellPhone
    }
    if(this.storageService.PatientStudy)
    {
      this.patientPortalService.patientScreeningQuestion = JSON.parse(this.storageService.PatientStudy);
    }

    this.patientPortalService.GetPatientsByNumber(data, true).subscribe((res: any) => {
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success && res.result.length > 0) {
          if (res.result[0].patientPreferredLanguage)
            this.storageService.fullLanguageName = res.result[0].patientPreferredLanguage.toString().toLowerCase();

          this.patientPortalService.patientRecords = res.result;
          var singlePatient = res.result.filter(x => x.patientId == this.patientPortalService.patientDetail.patientId);
          this.patientPortalService.uniqueId = singlePatient[0].uniqueId;
          this.patientPortalService.remainingStudyCount = singlePatient[0].remainingStudyCount;
          this.patientPortalService.totalStudyCount = singlePatient[0].totalStudyCount;
          this.patientPortalService.isPregnancyWaiverEnable = singlePatient[0].isPregnancyWaiverEnable;
          this.patientPortalService.isPregnancyWaiverDownloadable = singlePatient[0].isPregnancyWaiverDownloadable;
          this.patientPortalService.globalPageNumber = singlePatient[0].pageCompleted;

          if (singlePatient[0].patientPreferredLanguage)
            this.storageService.fullLanguageName = singlePatient[0].patientPreferredLanguage.toString().toLowerCase();

            this.currentLanguage = this.storageService.getPatientLanguage();
            if (this.patientPortalService.globalPageNumber === PatientPortalStatusCode.PATIENT_EMERGENCY_SCREEN) {
              if (this.patient.financialTypeName !== PatientFinancialTypeName.PERSONAL_INJURY
                || this.patient.financialTypeName !== PatientFinancialTypeName.BROKER)
                this.contactInfoIcon = true;

            }
            if (this.patientPortalService.globalPageNumber === PatientPortalStatusCode.PATIENT_ATTORNEY_SCREEN) {
              if (this.patient.financialTypeName == PatientFinancialTypeName.PERSONAL_INJURY
                || this.patient.financialTypeName == PatientFinancialTypeName.BROKER)
                this.contactInfoIcon = true;
            }

            if (this.patientPortalService.globalPageNumber > PatientPortalStatusCode.PATIENT_ATTORNEY_SCREEN)
              this.contactInfoIcon = true;

            if (this.patientPortalService.remainingStudyCount == 0 || this.storageService.PatientStudy)
              this.screningInfoIcon = true;

            if(this.storageService.PatientPreScreening)
            {
              if(this.storageService.PatientPreScreening == 'true')
              {
                this.screningInfoIcon = true;
              }
              else{
                this.screningInfoIcon = false;
              }
            }

            if (this.currentLanguage == LanguageOption.ES)
              this.setLanguage = false;

            this.translate.use(this.currentLanguage);

            if (this.patientPortalService.isPregnancyWaiverEnable == true)
            {
                  this.isPregnant = true;
            }
            if(this.patientPortalService.isPregnancyWaiverDownloadable == true)
              this.showPregnantPdf = true;
            if (this.patientPortalService.remainingStudyCount > 0)
              this.screningInfoIcon = false;

            if (this.patient.financialTypeName == PatientFinancialTypeName.PERSONAL_INJURY
              || this.patient.financialTypeName == PatientFinancialTypeName.BROKER)
                this.showMedicalLien = true;
        }
        else
          this.router.navigate([PatientPortalURL.PATIENT_PORTAL]);
      }

    },
      (err: any) => {
        this.patientPortalService.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    );
  }

  languageChange(lang: any) {
    this.storageService.setPatientLanguage(lang);
    this.currentLanguage = lang;
    this.translate.use(lang);
  }

  gotoContact(navigate: string) {
    if (this.patient.pageCompleted === PatientPortalStatusCode.LIEN_SIGNED)
      this.router.navigate([PatientPortalURL.PATIENT_BASIC_CONTACT_INFO]);
    else if (this.patient.pageCompleted === PatientPortalStatusCode.PATIENT_BASIC_SCREEN)
      this.router.navigate([PatientPortalURL.PATIENT_ADDRESS_CONTACT_INFO]);
    else if (this.patient.pageCompleted === PatientPortalStatusCode.PATIENT_ADDRESS_SCREEN)
      this.router.navigate([PatientPortalURL.PATIENT_CONTACT_INFO]);
    else if (this.patient.pageCompleted === PatientPortalStatusCode.PATIENT_CONTACT_SCREEN)
      this.router.navigate([PatientPortalURL.PATIENT_EMERGENCY_CONTACT_INFO]);
    else if (this.patient.pageCompleted === PatientPortalStatusCode.PATIENT_EMERGENCY_SCREEN) {
      if (this.patient.financialTypeName !== PatientFinancialTypeName.PERSONAL_INJURY
        || this.patient.financialTypeName !== PatientFinancialTypeName.BROKER)
        this.router.navigate([navigate]);
      else
        this.router.navigate([PatientPortalURL.PATIENT_ATTORNEY_CONTACT_INFO]);
    }
    else
      this.router.navigate([navigate]);
  }

  gotoScreening(navigate: string) {
    if (this.contactInfoIcon) {
      if(this.storageService.PatientStudy)
        this.router.navigate([navigate]);
      else
      {
      if (this.patientPortalService.totalStudyCount > 0 || this.patientPortalService.remainingStudyCount > 0){
          this.router.navigate([navigate]);
      }
      }
    }
    else
      this.patientPortalService.errorNotification(PatientPortalStatusMessage.CONTACT_INFO_REQUIRED_ERROR);
  }

  gotoAppointment(navigate: string) {
    this.router.navigate([navigate]);
  }


  downloadSignFile() {
    this.patientService.download(this.patientPortalService.patientDetail.patientId, this.patientPortalService.patientDetail.firstName, 'esignrequest').subscribe((res) => {
      if (res.responseCode === 200) {
        let response = JSON.parse(res.response);
        this.downloadFile(response['FileName'], response['filebytes'])
        this.successNotification(res);
      } else {
        this.error(res);
      }
    }, (err: any) => {
      this.error(err);
    });
  }

  downloadSignPregnancyFile(){
    if(this.showPregnantPdf)
    {
      var request = {
        patientId: this.patientPortalService.patientDetail.patientId
      }
      this.patientPortalService.GetPregnancyWaiverDocument(request).subscribe((res) => {
        if (res.result) {
          this.downloadFile(res.result.fileName,res.result.fileBytes)
          this.patientPortalService.successNotification(PatientPortalStatusMessage.PREGNANACY_LEAN_DOWNLOADED);
        } else {
          this.error(res);
        }
      }, (err: any) => {
        this.error(err);
      });
    }
    else{
        if(this.isPregnant == true)
        {
          if(this.currentLanguage == 'es')
          {
            this.router.navigate([PatientPortalURL.PREGNANCY_WAIVERS]);
          }
          else{
            this.router.navigate([PatientPortalURL.PREGNANCY_WAIVER])
          }
        }
      }
  }

  downloadFile(fileName, fileData) {
    var source;
    let fileExtension = fileName.split('.').pop();
    const link = document.createElement('a');
    if (fileName.match(/.(jpg|jpeg|png|gif)$/i)) {
      source = 'data:image/' + fileExtension + ';base64,' + fileData;
    }
    else if (fileName.match(/.(pdf)$/i)) {
      source = 'data:application/pdf;base64,' + fileData;
    }
    link.href = source;
    link.download = `${fileName}`
    link.click();
  }

  successNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }

  CodeErrorNotification(msg: string) {
    this.notificationService.showNotification({
      alertHeader: 'Error',
      alertMessage: msg,
      alertType: 400
    });
  }

  error(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
}
