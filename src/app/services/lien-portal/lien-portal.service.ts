import { Injectable } from '@angular/core';
import { LienPortalAPIEndpoint, LienPortalResponse, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { HttpLienPortalRequestService } from '../common/http-lienportal-request.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { NotificationService } from '../common/notification.service';
import { StorageService } from '../common/storage.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { RADIOLOGIST_TYPE } from 'src/app/constants/route.constant';

@Injectable({
  providedIn: 'root'
})
export class LienPortalService {

  isDefaultSignature :boolean = false;
  defaultSignature : string;

  constructor(private readonly _httpService: HttpLienPortalRequestService,
    private readonly notificationService: NotificationService,private readonly route:Router,
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
      data.jwtToken = this.storageService.LienJWTToken;
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

  convertDateFormat(date, isDefaultDate = false) {
    return date ? moment(date).format('MM/DD/YYYY') : isDefaultDate ? moment(new Date()).format('MM/DD/YYYY') : '';
  }


  refreshLienToken() {
    this.GetLienPartnerToken().subscribe((res: any) => {
      if (res) {
        if (res.status == LienPortalResponseStatus.Success) {
          this.storageService.PartnerId = res.result.partnerId;
          this.storageService.LienJWTToken = res.result.jwtToken;
          if(this.storageService.user.UserType === RADIOLOGIST_TYPE)
          {
            this.route.navigate(['lien-portal']);
          }
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

  _base64ToArrayBuffer(base64:any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  FilePreview(data){
    let ArrayBuff = this._base64ToArrayBuffer(data);
    let file = new Blob([ArrayBuff], { type: 'application/pdf' });
    window.open(URL.createObjectURL(file), '_blank');
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
}
