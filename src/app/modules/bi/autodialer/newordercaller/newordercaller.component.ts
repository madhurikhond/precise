import { Component, OnInit } from '@angular/core';
import { AutodialerService } from 'src/app/services/autodialer.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';


@Component({
  selector: 'app-newordercaller',
  templateUrl: './newordercaller.component.html',
  styleUrls: ['./newordercaller.component.css']
})
export class NewordercallerComponent implements OnInit {
 callHistoryForYesterday:any={};
 callHistoryForLast30Days:any={};
 callHistoryForLast90Days:any={};
 callHistoryForLast365Days:any={};
  constructor(
    private readonly commonService:CommonMethodService,
    private readonly notificationService: NotificationService,private readonly autodialerService: AutodialerService) { }

  ngOnInit(): void {
    this.commonService.setTitle('Auto Dialer');
    this.getTwilioCallingHistory();
  }
  getTwilioCallingHistory() {
    this.autodialerService.getTwilioCallingHistory(true).subscribe((res)=>{
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.callHistoryForLast30Days=data.response[0];
        this.callHistoryForLast90Days=data.response[1];
        this.callHistoryForLast365Days=data.response[2];
        this.callHistoryForYesterday=data.response[3];
      }
      else {
        this.showNotification(data);
      }

    },(err : any) => {
      this.showError(err);
    }
    );
  }
// common Notification Method
showNotification(data: any) {
  this.notificationService.showNotification({
        alertHeader : data.statusText,
        alertMessage: data.message,
        alertType: data.responseCode
      });
}
// common Error Method
showError(err: any) {
  this.notificationService.showNotification({
      alertHeader : err.statusText,
      alertMessage:err.message,
      alertType: err.status
    });
}

}
