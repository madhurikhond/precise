import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnyMxRecord } from 'dns';
import { map } from 'rxjs/operators';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { LanguageOption, patientPortalResponseStatus, PatientPortalStatusMessage, patientResponse } from 'src/app/models/patient-response';
import { PatientScreeningQuestion } from 'src/app/models/pre-screeing-question';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../common/http-request.service';
import { NotificationService } from '../common/notification.service';
import { StorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root'
})
export class PatientPortalService {

  patientRecords: any;
  mobileNumber: string;
  verificationId: number;

  uniqueId: string;
  patientDetail: any;
  remainingStudyCount: number;
  totalStudyCount: number = 0;
  isPregnancyWaiverEnable: boolean = false;
  internalStudyIdDetails: any;
  patientScreeningQuestion: PatientScreeningQuestion;
  scheduledModality: any;
  questionScreenTypes: any;
  globalPageNumber: Number;
  isPregnancyWaiverDownloadable:boolean = false;

  constructor(private readonly _httpService: HttpRequestService,
    private readonly notificationService: NotificationService,
    public storageService: StorageService) { }

  GetPartnerToken(showGlobalLoader: boolean = true) {
    const param = 'partnerApiKey=' + environment.apiKey;
    return this._httpService.postByPass('Partner/GetRefreshToken?' + param, '', showGlobalLoader).pipe(
      map((res: patientResponse) => res)
    );
  }

  GetPatientsByNumber(data: any, showGlobalLoader: boolean = true) {
    this.setCommonData(data);
    return this._httpService.post('Patient/GetPatientsByNumber', data, showGlobalLoader).pipe(
      map((res: patientResponse) => res)
    );
  }

  GetMobileNumber(data: any, showGlobalLoader: boolean = true) {
    this.setCommonData(data);
    return this._httpService.post('Patient/GetMobileNumber', data, showGlobalLoader,).pipe(
      map((res: patientResponse) => res)
    );
  }

  SendVerificationCode(data: any, showGlobalLoader: boolean = true) {
    this.setCommonData(data);
    return this._httpService.post('Patient/SendVerificationCode', data, showGlobalLoader,).pipe(
      map((res: patientResponse) => res)
    );
  }

  VerifyVerificationCode(data: any, showGlobalLoader: boolean = true) {
    this.setCommonData(data);
    return this._httpService.post('Patient/VerifyVerificationCode', data, showGlobalLoader,).pipe(
      map((res: patientResponse) => res)
    );
  }

  GetPatientByPatientId(data: any, showGlobalLoader: boolean = true) {
    this.setCommonData(data);
    return this._httpService.post('Patient/GetPatientByPatientId', data, showGlobalLoader).pipe(
      map((res: patientResponse) => res)
    );
  }

  UpdatePatientPageCompleted(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post('Patient/UpdatePatientPageCompleted', data, showGlobalLoader).pipe(
      map((res: patientResponse) => res)
    );
  }

  AddPatient(data: any, showGlobalLoader: boolean = true) {
    this.setCommonData(data);
    return this._httpService.post('Patient/AddPatient', data, showGlobalLoader).pipe(
      map((res: patientResponse) => res)
    );
  }

  GetStateList(data: any, showGlobalLoader: boolean = true) {
    this.setCommonData(data);
    return this._httpService.post('Patient/StateList', data, showGlobalLoader).pipe(
      map((res: patientResponse) => res)
    );
  }

  GetStudyModalityByPatientId(data: any, showGlobalLoader: boolean = true) {
    this.setCommonData(data);
    return this._httpService.post('Patient/GetStudyModalityByPatientId', data, showGlobalLoader).pipe(
      map((res: patientResponse) => res)
    );
  }

  GetPreScreeningQuestions(data: any, showGlobalLoader: boolean = true) {
    this.setCommonData(data);
    return this._httpService.post('Patient/GetPreScreeningQuestions', data, showGlobalLoader).pipe(
      map((res: patientResponse) => res)
    );
  }

  AddPreScreeningQuestions(data: any, showGlobalLoader: boolean = true) {
    this.setCommonData(data);
    return this._httpService.post('Patient/AddPreScreeningQuestionsAnswers', data, showGlobalLoader).pipe(
      map((res: patientResponse) => res)
    );
  }

  GetPatientModalityTemplate(data: any, showGlobalLoader: boolean = true) {
    this.setCommonData(data);
    return this._httpService.post('Patient/GetPatientModalityTemplate', data, showGlobalLoader).pipe(
      map((res: patientResponse) => res)
    );
  }

  InsertUpdatePatientModalityTemplate(data: any, showGlobalLoader: boolean = true) {
    this.setCommonData(data);
    return this._httpService.post('Patient/InsertUpdatePatientModalityTemplate', data, showGlobalLoader).pipe(
      map((res: patientResponse) => res)
    );
  }

    GetAppointmentDetails(data:any,showGlobalLoader : boolean = true){
      this.setCommonData(data);
      return this._httpService.post('Patient/AppointmentDetail',data,showGlobalLoader).pipe(
        map((res:patientResponse) => res)
      );
    }

    GetESignPregnancyWavier(data:any,showGlobalLoader : boolean = true){
      this.setCommonData(data);
      return this._httpService.post('Patient/GetESignPregnancyWaiver',data,showGlobalLoader).pipe(
        map((res:patientResponse) => res)
      );
    }

    AddPregnancyWaiverESignLien(data:any,showGlobalLoader : boolean = true){
      this.setCommonData(data);
      return this._httpService.post('Patient/AddPregnancyWaiverESignLien',data,showGlobalLoader).pipe(
        map((res:patientResponse) => res)
      );
    }

    GetPatientDetailsCompare(data:any,showGlobalLoader : boolean = true){
      this.setCommonData(data);
      return this._httpService.post('Patient/GetPatientDetailsCompare',data,showGlobalLoader).pipe(
        map((res:patientResponse) => res)
      );
    }

    PatientStatusChecked(data:any,showGlobalLoader : boolean = true){
      this.setCommonData(data);
      return this._httpService.post('Patient/PatientStatusChecked',data,showGlobalLoader).pipe(
        map((res:patientResponse) => res)
      );
    }

    GetPregnancyWaiverDocument(data:any,showGlobalLoader : boolean = true){
      this.setCommonData(data);
      return this._httpService.post('Patient/GetPregnancyWaiverDocument',data,showGlobalLoader).pipe(
        map((res:patientResponse) => res)
      );
    }

    getPatientPortalLink(data:any ,showGlobalLoader : boolean = true ){
      this.setCommonData(data);
      return this._httpService.post(`Patient/GeneratePatientLink`,data,showGlobalLoader).pipe(
        map((res: patientResponse)=> res)
      );
    }

  LogoutPatient() {
    this.storageService.LogoutPatient();
  }

  setCommonData(data: any) {
      var lang = this.storageService.getPatientLanguage();
      if(lang === LanguageOption.ES)
        this.storageService.fullLanguageName = 'spanish';
      else
        this.storageService.fullLanguageName = 'english';
      data.loggedPartnerId = this.storageService.PartnerId;
      data.jwtToken = this.storageService.PartnerJWTToken;
      data.patientPreferredLanguage = this.storageService.fullLanguageName;
      return data;
  }

  successNotification(msg: string) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: msg,
      alertType: ResponseStatusCode.OK
    });
  }

  WarningNotification(msg: string) {
    this.notificationService.showNotification({
      alertHeader: 'Warning',
      alertMessage: msg,
      alertType: ResponseStatusCode.Unauthorized
    });
  }

  errorNotification(msg: string) {
    this.notificationService.showNotification({
      alertHeader: "Error",
      alertMessage: msg,
      alertType: ResponseStatusCode.InternalError
    });
  }

  refreshToken() {
    this.GetPartnerToken().subscribe((res: any) => {
      if (res) {
        if (res.responseStatus == patientPortalResponseStatus.Success) {
          this.storageService.PartnerId = res.result.partnerId;
          this.storageService.PartnerJWTToken = res.result.jwtToken;
          this.storageService.fullLanguageName = "english";
        }
      }
      else{
        this.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    },
      (err: any) => {
        this.errorNotification(PatientPortalStatusMessage.COMMON_ERROR);
      }
    );
  }
}
