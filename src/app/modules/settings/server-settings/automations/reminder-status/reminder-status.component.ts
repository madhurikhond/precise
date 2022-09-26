import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-reminder-status',
  templateUrl: './reminder-status.component.html',
  styleUrls: ['./reminder-status.component.css']
})
export class ReminderStatusComponent implements OnInit {
  reminder:string = 'Patient'
  smsLogType:any
  reminderType:string = 'Patient';
  pageNo:number =1
  pageSize:number=100
  totalRecords:number;
  reminderList:any =[];
  pageNumber:number;
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  readonly pageSizeArray=PageSizeArray;

  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
  this.getAllReminderSettings()
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getAllReminderSettings();
    
  }

  getAllReminderSettings(){ 
    this.reminderType = 'Patient'
    this.pageNo = 1
    this.pageSize = this.pageSize;
    this.settingsService.getAllReminderStatus(true, this.reminderType, this.pageNo,this.pageSize).subscribe((res) => {
      var data: any = res;
      this.totalRecords = data.response[0].totalRecords
      this.reminderList = data.response
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
    this.pageNo = event;
    this.settingsService.getAllReminderStatus(true, this.reminderType, this.pageNo,this.pageSize).subscribe((res) => {
      var data: any = res;
      this.reminderList = data.response 
    }, 
    
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

  reminderTypeChange(reminder){
    if(reminder === 'Patient'){
      this.reminderType = 'Patient'
      this.pageNo = 1
      this.settingsService.getAllReminderStatus(true, this.reminderType, this.pageNo,this.pageSize).subscribe((res) => {
        var data: any = res;
        this.totalRecords = data.response[0].totalRecords
        this.reminderList = data.response
        
      }, 
      (err : any) => {
        this.notificationService.showNotification({
          alertHeader : err.statusText,
          alertMessage:err.message,
          alertType: err.status
        });
      });
    }
    else{
      this.reminderType = 'Cannot'
      this.pageNo = 1
      this.settingsService.getAllReminderStatus(true, this.reminderType, this.pageNo,this.pageSize).subscribe((res) => {
        
        var data: any = res;
        this.totalRecords = data.response[0].totalRecords
        this.reminderList = data.response
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

refreshReminderStatus(){
  this.getAllReminderSettings()
}

}
