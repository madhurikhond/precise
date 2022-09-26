import { Injectable } from '@angular/core';
import { DefaultGlobalConfig, ToastrService } from 'ngx-toastr';
import { Notification } from '../../models/notification';
import { ResponseStatusCode } from '../../constants/response-status-code.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _toastr : ToastrService) { }
  showToaster(notification: Notification){
 
    this._toastr.clear();
    this._toastr.show(`Text '${notification.alertMessage}' copied to clipboard.`, notification.alertHeader ? notification.alertHeader : null, {
      closeButton: false,
      progressBar: false,
      enableHtml: true,
      timeOut: 2000,
      messageClass: 'custom-toast-message',
      positionClass: 'toast-bottom-center'
    });
  }

  showNotification(notification : Notification){
    this._toastr.clear();
    if(notification.alertHeader){
      if(notification.alertHeader.toLowerCase() === 'unknown error'){
        notification.alertHeader = 'Error';
        notification.alertMessage = 'Network error';
      }
    }
   

    switch(notification.alertType){
      case ResponseStatusCode.OK:
      case ResponseStatusCode.Accepted:
      case ResponseStatusCode.Created:{
        this._toastr.success(notification.alertMessage, notification.alertHeader ? notification.alertHeader : null, {
          closeButton: true,
          progressBar: true,
          progressAnimation:'increasing'
        });
        break;
      }
      case ResponseStatusCode.NotFound:{
        this._toastr.info(notification.alertMessage, notification.alertHeader ? notification.alertHeader : null, {
          closeButton: true,
          progressBar: true,
          progressAnimation:'increasing'
        });
        break;
      }
      case ResponseStatusCode.Unauthorized:{
        this._toastr.warning('Sorry, you are not authorized. Session timeout is expired.<br>Please login again.', 'Session Expired', {
          closeButton: true,
          progressBar: true,
          enableHtml: true,
          progressAnimation:'increasing'
        });
        break;
      }
      case ResponseStatusCode.BadRequest:
      case ResponseStatusCode.InternalError:{
        this._toastr.error(notification.alertMessage, notification.alertHeader ? notification.alertHeader : null, {
          closeButton: true,
          progressBar: true,
          progressAnimation:'increasing'
        });
        break;
      }
      default:{
        this._toastr.error(notification.alertMessage, notification.alertHeader ? notification.alertHeader : null, {
          closeButton: true,
          progressBar: true,
          progressAnimation:'increasing'
        });
        break;
      }
    }
  }
}
