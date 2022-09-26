import { Component, OnInit } from '@angular/core';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-complete-study',
  templateUrl: './complete-study.component.html',
  styleUrls: ['./complete-study.component.css']
})
export class CompleteStudyComponent implements OnInit {
  totalRecords: number;
  pageNumber: number =1;
  pageSize : number;
  completeStudyList : any =[];

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  readonly pageSizeArray=PageSizeArray;

  constructor(private settingService: SettingsService, private notificationService:NotificationService, 
    private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;
    
    this.commonMethodService.setTitle('Completed Studies');
    this.getCompletedStudies();
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this. getCompletedStudies();
  }
  getCompletedStudies(){
    this.settingService.getCompletedStudies(this.pageNumber, this.pageSize, true).subscribe((res) => {
      var data: any = res;
      this.totalRecords=res.totalRecords
      if (data.response != null && data.response.length > 0) {
        this.completeStudyList = data.response;
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

  pageChanged(event){
    this.pageNumber = event;
    this.getCompletedStudies();
  }

  isMarkCheck(data, event){
    var status = event.target.checked;
    if(!status){
        data.DoNotCountForBi = status;
      }
      this.saveStudyStatusMark(data);
  }

  doNotCountForBiCheck(data){
    this.saveStudyStatusMark(data);
  }

  saveStudyStatusMark(data){
    this.settingService.saveStudyStatusMark(true, data).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : (res.responseCode === ResponseStatusCode.OK) ? 'Success' : 'Error' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
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
