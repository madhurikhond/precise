import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-call-timing',
  templateUrl: './call-timing.component.html',
  styleUrls: ['./call-timing.component.css']
})
export class CallTimingComponent implements OnInit {
callingList:any=[]
stringifiedData:any
number = '^[1-9][0-9]?$|^100$'

  constructor(
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService: SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getAllCallingSettingsList()
  }
  
  getAllCallingSettingsList(){
    this.settingsService.getAllCallingSettings(true).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.callingList = data.response;
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

  allowNumberOnly(event:any): boolean
  {
    return this.commonMethodService.alowNumberOnly(event);
  }

  updateCallTiming(){
    var obj = this.callingList
    this.stringifiedData = JSON.stringify(obj);  
    var body ={
      'json': this.stringifiedData
    }
    this.settingsService.updateCallSetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getAllCallingSettingsList()
        
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
