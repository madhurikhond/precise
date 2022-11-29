import { Injectable } from '@angular/core';
import { LienPortalResponse, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { HttpLienPortalRequestService } from '../common/http-lienportal-request.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { NotificationService } from '../common/notification.service';
import { StorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LienPortalService {

  constructor(private readonly _httpService: HttpLienPortalRequestService,
    private readonly notificationService: NotificationService,
    public storageService: StorageService) { }

  // Login API
  GetPartnerToken(showGlobalLoader: boolean = true) {
    const param = 'partnerApiKey=' + environment.apiKey;
    return this._httpService.postByPass('Partner/GetRefreshToken?' + param, '', showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }

  // Radiologist API
  GetPendingToBill(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post('LienPortal/GetPendingToBill', data, showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }


  GetAssignedARUnpaid(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post('LienPortal/GetAssignedARUnpaid', data, showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }

  GetAssignedARPaid(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post('LienPortal/GetAssignedARPaid', data, showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }


  GetReferrerByUser(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post('LienPortal/GetReferrerByUser', data, showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }

  GetCPTGroupList(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post('LienPortal/GetCPTGroupList', data, showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }

  GetRetainUnpaid(data: any, showGlobalLoader: boolean = true){
    return this._httpService.post('LienPortal/GetRetainedUnPaid', data, showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }

  GetRetainedPaid(data: any, showGlobalLoader: boolean = true){
    return this._httpService.post('LienPortal/GetRetainedArPaidList', data, showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }

  AssignARStudiesToRadiologist(data: any, showGlobalLoader: boolean = true){
    return this._httpService.post('LienPortal/AssignARStudiesToRadiologist', data, showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }

  GetFundingCompanyByUser(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post('LienPortal/GetFundingCompanyByUser', data, showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }

  RetainARStudies(data: any, showGlobalLoader: boolean = true){
    return this._httpService.post('LienPortal/RetainARStudies', data, showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }

  AddRadiologistDefaultSign(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post('LienPortal/AddRadDefaultSign', data, showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }

  GetFundingCompanyList(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post('LienPortal/GetFundingCompanyList', data, showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }

  GetRadiologistFundingCompanyInfo(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post('LienPortal/GetRadiologistFundingCompanyInfo', data, showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }

  UpsertFundingCompanyInfo(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post('LienPortal/UpsertFundingCompanyInfo', data, showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
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

  LogoutLienPortal() {
    this.storageService.LogoutLienPortal();
  }

  refreshToken() {
    this.GetPartnerToken().subscribe((res: any) => {
      if (res) {
        if (res.responseStatus == LienPortalResponseStatus.Success) {
          this.storageService.PartnerId = res.result.partnerId;
          this.storageService.PartnerJWTToken = res.result.jwtToken;
        }
      }
      else {
        this.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      }
    },
      (err: any) => {
        this.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      }
    );
  }
}
