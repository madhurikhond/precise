import { Component, OnInit } from '@angular/core';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';


@Component({
  selector: 'app-template-mapping',
  templateUrl: './template-mapping.component.html',
  styleUrls: ['./template-mapping.component.css']
})

export class TemplateMappingComponent implements OnInit {
  templateList : any=[]
  reportNameList : any =[]
  FilterfinancialTypeName:string='';
  FilterreportName:string='';
  FilterintakeSettingID:string='';
  FiltertemplateName:string='';
  pageSize:number;
  pageNumber:number=10;
  readonly pageSizeArray=PageSizeArray;

  reminder:string = 'Patient'
  smsLogType:any
  reminderType:string = 'Patient';
  pageNo:number =1
  totalRecords:number;
  reminderList:any =[];
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  
  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService,
    ) { }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.getReportName()
    this.getTemplateSettings()         
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getAllReminderSettings();
  }       
  
  refreshTemplate(){
    this.getTemplateSettings()
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
  
  getTemplateSettings(){
    this.settingsService.getAllTemplateMappings(true).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.templateList = data.response 
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

  CancelChanges(){
    this.getTemplateSettings()
  }

  getReportName(){
    this.settingsService.getAllReports(false).subscribe((res) => {
      var data: any = res;      
      if (res) {
        for (let i = 0; i < data.response.length; i++) {         
          this.reportNameList.push({ reportName: data.response[i]});
        }  
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

  templateChange(index){
  }
  


  saveTemplate(){
    this.settingsService.updateTemplateMapping(true, this.templateList).subscribe((res : any) => {
      if (res) { 
        this.getTemplateSettings()
        
        this.notificationService.showNotification({ 
          alertHeader : 'Success',
          alertMessage: res.message,
          alertType: res.responseCode
        });
      }
    },
    (err : any) => {
      this.notificationService.showNotification({ 
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: ResponseStatusCode.InternalError
      });
    }
    );
  }
  
}
