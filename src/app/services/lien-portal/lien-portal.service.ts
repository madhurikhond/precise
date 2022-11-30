import { Injectable } from '@angular/core';
import { LienPortalAPIEndpoint, LienPortalResponse, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { HttpLienPortalRequestService } from '../common/http-lienportal-request.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { NotificationService } from '../common/notification.service';
import { StorageService } from '../common/storage.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class LienPortalService {

  constructor(private readonly _httpService: HttpLienPortalRequestService,
    private readonly notificationService: NotificationService,
    public storageService: StorageService) { }

  GetLienPartnerToken(showGlobalLoader: boolean = true) {
    const param = 'partnerApiKey=' + environment.apiKey;
    return this._httpService.postByPass('Partner/GetRefreshToken?' + param, '', showGlobalLoader).pipe(
      map((res: LienPortalResponse) => res)
    );
  }

  PostAPI(data: any, method: LienPortalAPIEndpoint, showGlobalLoader: boolean = true) {
    try {
      data.loggedPartnerId = this.storageService.PartnerId;
      data.jwtToken = this.storageService.PartnerJWTToken;
      data.userId = parseInt(this.storageService.user.UserId);
      return this._httpService.post(method.toString(), data, showGlobalLoader).pipe(
        map((res: LienPortalResponse) => res)
        );
    } catch (error) {
      this.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }
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

  convertDateFormat(date){
    return date ? moment(date).format('MM/DD/YYYY') : moment(new Date()).format('MM/DD/YYYY');
  }

  refreshLienToken() {
    this.GetLienPartnerToken().subscribe((res: any) => {
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
