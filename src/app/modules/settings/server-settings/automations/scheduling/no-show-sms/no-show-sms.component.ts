import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-no-show-sms',
  templateUrl: './no-show-sms.component.html',
  styleUrls: ['./no-show-sms.component.css']
})
export class NoShowSmsComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  noShowSmsFormSetting: FormGroup;
  statusList:any=[];
  selectedStatusList:any[];
  noShowAppointmentStatusList:any[];
  selectedNoShowStatusList:any[];
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  id:number;
  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService
    ) { }
  ngOnInit(): void 
  {
    this.noShowSmsFormSetting = this.fb.group({
      isActive: [''],
      runServiceTime: [''],
      noShowSmsCutOff: [''],
      radiusStatus:[''],
      noShowStatus:['']
    });
    this.getMasterStatusNamesList();
    this.getMasterNoShowStatusNamesList();
    this.GetAllNoShowSmsSettings();
  }
  getMasterNoShowStatusNamesList(){
    this.settingsService.getMasterAAppointmentStatuses(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.noShowAppointmentStatusList = data.response;
      }
      else {
        this.showNotification(data);
      }
     
    },(err : any) => {
      this.showError(err);
    }
    );
  }
  getMasterStatusNamesList(){
    this.settingsService.getMasterStatusNames(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.statusList = data.response;
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
GetAllNoShowSmsSettings()
{
  this.settingsService.GetAllNoShowSmsSettings(true).subscribe((res)=>{
   let data:any=res;
   if (data.response != null && data.response.length > 0) {
    this.id=data.response[0].noShowSmsSettingId;
    this.selectedStatusList =data.response[0].radiusStatus.split(',').map(function(item) {
      return item.trim();
    });
    this.selectedNoShowStatusList =data.response[0].noShowStatus.split(',').map(function(item) {
      return item.trim();
    });
    this.noShowSmsFormSetting.patchValue({
      isActive:data.response[0].isActive,
      runServiceTime:data.response[0].runServiceTime,
      noShowSmsCutOff:data.response[0].noShowSmsCutOff,
    });
   }
   else{
    this.showNotification(data);
   }
  },(err : any) => {
    this.showError(err);
  }
  );
}
onSubmit()
{
 this.updateNoShowSetting();
}
updateNoShowSetting()
{
  let body=
    {
      'noShowSmsSettingId': this.id,
      'isActive': this.noShowSmsFormSetting.controls.isActive.value,
      'runServiceTime': this.noShowSmsFormSetting.controls.runServiceTime.value,
      'radiusStatus': this.selectedStatusList.toString(),
      'noShowStatus': this.selectedNoShowStatusList.toString(),
      'noShowSmsCutOff': this.noShowSmsFormSetting.controls.noShowSmsCutOff.value
    }
    if(this.id)
    {
       this.settingsService.updateNoShowSettingSetting(true,body).subscribe((res : any) => {
        if (res) { 
          this.GetAllNoShowSmsSettings()
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
get getFormControl()
{
 return this.noShowSmsFormSetting.controls;
}
ValidateMultiSelectTextLength(id, a)
{
  a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
return a;
}
}
