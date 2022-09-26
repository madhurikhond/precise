import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AccoutingService } from 'src/app/services/accouting-service/accouting.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';

@Component({
  selector: 'check-patient-details',
  templateUrl: './check-patient-details.component.html',
  styleUrls: ['./check-patient-details.component.css']
})
export class CheckPatientDetailsComponent implements AfterViewInit {

  checkPatientList: any = [];
  @Input() key: number;
  constructor(private accountingService: AccoutingService,
    private notificationService:NotificationService,
    private commonMethodService: CommonMethodService) { }

    ngAfterViewInit(): void {
    this.accountingService.getCheckPatientDetail(true, this.key).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.checkPatientList = data.response;
      }
      else {
        this.notificationService.showNotification({
          alertHeader : data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

}
