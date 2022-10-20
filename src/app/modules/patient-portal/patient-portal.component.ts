import { Component, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { DatePipe } from '@angular/common';
import { PatientPortalStatusCode } from 'src/app/constants/patient-portal-status-code.enum';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { slideInAnimation } from 'src/app/app.animation';
import { PatientFinancialTypeName, patientPortalResponseStatus, PatientPortalStatusMessage, PatientPortalURL } from 'src/app/models/patient-response';

@Component({
  selector: 'app-patient-portal',
  templateUrl: './patient-portal.component.html',
  styleUrls: ['./patient-portal.component.css'],
  animations: [slideInAnimation]
})
export class PatientPortalComponent implements OnInit {

  expanded: boolean = false;
  contactInfo: boolean = false;
  patient: any;
  currentLanguage: string;
  showPregnantPdf:boolean = false;
  isPregnant: boolean = false;

  constructor(private readonly patientPortalService: PatientPortalService, private patientService: PatientService,
    public storageService: StorageService, public notificationService: NotificationService, public datePipe: DatePipe, public translate: TranslateService, private readonly router: Router) {
    var p_detail = localStorage.getItem("p_detail");
    this.currentLanguage = this.storageService.getPatientLanguage();
    if (this.currentLanguage)
      this.translate.use(this.currentLanguage);
    else
      this.router.navigate([PatientPortalURL.PATIENT_PORTAL]);

    if (p_detail) {
      this.patient = JSON.parse(p_detail);
      this.patientPortalService.patientDetail = this.patient;
      this.patientPortalService.patientDetail.pageCompleted = this.patient.pageCompleted;
      this.patientPortalService.globalPageNumber = this.patient.pageCompleted;
      this.patientPortalService.patientDetail.dateOfBirth = this.datePipe.transform(this.patientPortalService.patientDetail.dateOfBirth, 'MM/dd/yyyy');
      this.patientPortalService.patientDetail.dateOfInjury = this.datePipe.transform(this.patientPortalService.patientDetail.dateOfInjury, 'MM/dd/yyyy');
    }
    else {
      this.router.navigate([PatientPortalURL.PATIENT_PORTAL]);
    }
  }

  ngOnInit() {
    if(this.storageService.PatientStudy)
    {
      this.patientPortalService.patientScreeningQuestion = JSON.parse(this.storageService.PatientStudy);
    }

    if (this.patientPortalService.globalPageNumber === PatientPortalStatusCode.PATIENT_EMERGENCY_SCREEN) {
      if (this.patient.financialTypeName !== PatientFinancialTypeName.PERSONAL_INJURY
        || this.patient.financialTypeName !== PatientFinancialTypeName.BROKER)
        this.contactInfo = true;
    }
    if (this.patientPortalService.globalPageNumber === PatientPortalStatusCode.PATIENT_ATTORNEY_SCREEN) {
      if (this.patient.financialTypeName == PatientFinancialTypeName.PERSONAL_INJURY
        || this.patient.financialTypeName == PatientFinancialTypeName.BROKER)
        this.contactInfo = true;
    }
    if (this.patientPortalService.globalPageNumber > PatientPortalStatusCode.PATIENT_ATTORNEY_SCREEN){
        this.contactInfo = true;
    }
    

    if (this.storageService.PatientStudy)
      this.contactInfo = true;

    if (this.storageService.PatientPreScreening)
      this.contactInfo = true;

    if(this.patientPortalService.patientScreeningQuestion)
    {
      if(this.patientPortalService.patientScreeningQuestion.preScreeningQuestion)
      {
        if(this.patientPortalService.patientScreeningQuestion.preScreeningQuestion.isPregnant == 'Yes')
        {
          this.isPregnant = true;
        }
        else{
          this.isPregnant = false;
        }
      }
    }
    if (this.patientPortalService.isPregnancyWaiverEnable == true)
    {
          this.isPregnant = true;
    }

    if(this.patientPortalService.isPregnancyWaiverDownloadable == true)
      this.showPregnantPdf = true;


  }

  menuToggle(){

    if (this.patientPortalService.globalPageNumber === PatientPortalStatusCode.PATIENT_EMERGENCY_SCREEN) {
      if (this.patient.financialTypeName !== PatientFinancialTypeName.PERSONAL_INJURY
        || this.patient.financialTypeName !== PatientFinancialTypeName.BROKER)
        this.contactInfo = true;
    }
    if (this.patientPortalService.globalPageNumber === PatientPortalStatusCode.PATIENT_ATTORNEY_SCREEN) {
      if (this.patient.financialTypeName == PatientFinancialTypeName.PERSONAL_INJURY
        || this.patient.financialTypeName == PatientFinancialTypeName.BROKER)
        this.contactInfo = true;
    }
    if (this.patientPortalService.globalPageNumber > PatientPortalStatusCode.PATIENT_ATTORNEY_SCREEN){
        this.contactInfo = true;
    }
    

    if (this.storageService.PatientStudy)
      this.contactInfo = true;

    if (this.storageService.PatientPreScreening)
      this.contactInfo = true;

    if (this.patientPortalService.isPregnancyWaiverEnable == true)
    {
          this.isPregnant = true;
    }else{
      this.isPregnant = false;
    }

    if(this.patientPortalService.isPregnancyWaiverDownloadable == true)
      this.showPregnantPdf = true;
    
      
    this.expanded = !this.expanded;
  }
  gotoHome() {
    this.expanded = false;
    this.router.navigate([PatientPortalURL.PATIENT_HOME]);
  }

  gotoContact(navigate: string) {
    this.expanded = false;
    if (this.patient.pageCompleted === PatientPortalStatusCode.LIEN_SIGNED)
      this.router.navigate([PatientPortalURL.PATIENT_BASIC_CONTACT_INFO]);
    else if (this.patient.pageCompleted === PatientPortalStatusCode.PATIENT_BASIC_SCREEN)
      this.router.navigate([PatientPortalURL.PATIENT_ADDRESS_CONTACT_INFO]);
    else if (this.patient.pageCompleted === PatientPortalStatusCode.PATIENT_ADDRESS_SCREEN)
      this.router.navigate([PatientPortalURL.PATIENT_CONTACT_INFO]);
    else if (this.patient.pageCompleted === PatientPortalStatusCode.PATIENT_CONTACT_SCREEN)
      this.router.navigate([PatientPortalURL.PATIENT_EMERGENCY_CONTACT_INFO]);
    else if (this.patient.pageCompleted === PatientPortalStatusCode.PATIENT_EMERGENCY_SCREEN) {
      if (this.patient.financialTypeName !== PatientFinancialTypeName.PERSONAL_INJURY ||
        this.patient.financialTypeName !== PatientFinancialTypeName.BROKER)
        this.router.navigate([navigate]);
      else
        this.router.navigate([PatientPortalURL.PATIENT_ATTORNEY_CONTACT_INFO]);
    }
    else
      this.router.navigate([navigate]);
  }

  gotoScreening(navigate: string) {
    this.expanded = false;
    if (this.contactInfo){
      if(this.storageService.PatientStudy)
        this.router.navigate([navigate]);
      else
      {
      if (this.patientPortalService.totalStudyCount > 0 || this.patientPortalService.
        remainingStudyCount > 0)
        this.router.navigate([navigate]);
      }
    }
    else {
      this.patientPortalService.errorNotification(PatientPortalStatusMessage.CONTACT_INFO_REQUIRED_ERROR);
    }
  }

  gotoAppointment(navigate: string) {
    this.expanded = false;
    this.router.navigate([navigate]);
  }

  downloadSignFile() {
    this.expanded = false;
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

  gotoLogout() {
    this.patientPortalService.LogoutPatient();
    this.router.navigate([PatientPortalURL.PATIENT_PORTAL]);
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

  downloadSignPregnancyFile(){
    this.expanded = false;
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

