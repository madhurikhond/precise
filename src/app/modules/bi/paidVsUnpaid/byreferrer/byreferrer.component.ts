import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PaidVsUnpaidService } from 'src/app/services/paid-vs-unpaid.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-byreferrer',
  templateUrl: './byreferrer.component.html',
  styleUrls: ['./byreferrer.component.css']
})
export class ByreferrerComponent implements OnInit {
  totalRecords: number
  referrerPaidUnpaidStudiesList:any =[]
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  playerType:string='1';
  pageNumber: number = 1;
  pageSize : number =20;
  
  constructor(
    private readonly notificationService: NotificationService,private readonly paidVsUnpaidService:PaidVsUnpaidService) { }

  ngOnInit(): void {
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately'
    }, {
      key: 'onClick',
      name: 'On Button Click'
    }];
    this.columnResizingMode = this.resizingModes[0];
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showFilterRow = true;
    this.showHeaderFilter = false;
   this.getReferrerPaidUnpaidStudies();
  }
  getReferrerPaidUnpaidStudies() {
    this.paidVsUnpaidService.getAttorneyReferrerPaidUnpaidStudies(true,this.playerType ,this.pageNumber, this.pageSize).subscribe((res)=>{
      var data:any=res;
      this.totalRecords = res.totalRecords
    if (res.response != null && res.response.length > 0) {   
      this.referrerPaidUnpaidStudiesList=res.response;  
    }
    else{
      this.notificationService.showNotification({
        alertHeader : data.statusText,
        alertMessage: data.message,
        alertType: data.responseCode
      });
    }
    },(err : any) => {
      this.showError(err);
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

  pageChanged(event){
    this.pageNumber = event;
    this.getReferrerPaidUnpaidStudies();
  }

}
