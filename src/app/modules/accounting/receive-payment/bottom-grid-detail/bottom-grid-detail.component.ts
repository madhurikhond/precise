import { AccoutingService } from 'src/app/services/accouting-service/accouting.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bottom-grid-detail',
  templateUrl: './bottom-grid-detail.component.html',
  styleUrls: ['./bottom-grid-detail.component.css']
})
export class BottomGridDetailComponent implements AfterViewInit {
  bottomGridDetail : any = [];
  @Input() key : number;
  columnResizingMode: string;
  resizingModes: string[] = ['widget', 'nextColumn'];
  constructor(private accountingService: AccoutingService,
    private notificationService:NotificationService) { }

    ngAfterViewInit(): void {
      this.columnResizingMode = this.resizingModes[0];
      this.accountingService.getARBottomGridDetail(true, this.key).subscribe((res) => {
        var data: any = res;
        if (data.response != null && data.response.length > 0) {
          this.bottomGridDetail = data.response;
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
