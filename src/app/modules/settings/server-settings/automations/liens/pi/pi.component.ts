 import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

 @Component({
  selector: 'app-pi',
  templateUrl: './pi.component.html',
  styleUrls: ['./pi.component.css']
})
export class PiComponent implements OnInit {
  piAttorneyLiensSettingForm: FormGroup;
  lienWithOutPatientStatusList: any = [];
  hpslstatusList:any=[];
  selectedLienWithOutPatientStatusList:any=[];
  selectedHpslstatusList:any=[];
  id:number;
  submitted = false;
  body:any;
  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly commonService:CommonMethodService,
    private readonly notificationService: NotificationService) { }
  

 ngOnInit(): void {
  
    this.piAttorneyLiensSettingForm = this.fb.group({
      isPatientLienActive: [''],
      firstScheduleTime: [''],
      secondScheduleTime: [''],
      thirdScheduleTime: [''],
      lienWithOutPatient:[''],
      daysAfterDos:[''],
      countingBusinessDays:[''],
      after1stReminder:[''],
      after2ndReminder:[''],
      stopSendingReminder:[''],
      comment: [''],
      hpslStatus: [''],
      hpslAfter1stRem: [''],
      hpslAfter2ndRem: [''],
      hpslContinousRem: [''],
      hpslStopSendingRem: [''],
      email:[''],
      daysFirstRequest: [''],
    });
    this.getMasterStatusNamesList();
    this.getPiAttorneyLienSettings();
  }
  
  getMasterStatusNamesList(){
    this.settingsService.getMasterStatusNames(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.lienWithOutPatientStatusList = data.response;
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

getPiAttorneyLienSettings() {
    this.settingsService.getAttorneyPiLiensSettings(true).subscribe((res)=>{
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.id = data.response[0].attorneyAndLienSettingId
        if(data.response[0].lienWithOutPatient){
        this.selectedLienWithOutPatientStatusList =data.response[0].lienWithOutPatient.split(',').map(function(item) {
          return item.trim();
        });
      }   if(data.response[0].hpslstatus){
        this.selectedHpslstatusList =data.response[0].hpslstatus.split(',').map(function(item) {
          return item.trim();
        });
      }
        this.piAttorneyLiensSettingForm.patchValue({
          isPatientLienActive:data.response[0].ispatientlienactive,
          firstScheduleTime:data.response[0].firstscheduletime,
          secondScheduleTime:data.response[0].secondscheduletime,
          thirdScheduleTime:data.response[0].thirdscheduletime,
          daysAfterDos:data.response[0].daysAfterDos,
          after1stReminder:data.response[0].after1stReminder,
          after2ndReminder:data.response[0].after2ndReminder,
          countingBusinessDays:data.response[0].countingBusinessDays,
          stopSendingReminder:data.response[0].stopSendingReminder,
          comment:data.response[0].comment,
          hpslAfter1stRem:data.response[0].hpslafter1stRem,
          hpslAfter2ndRem:data.response[0].hpslafter2ndRem,
          hpslContinousRem:data.response[0].hpslcontinousRem,
          hpslStopSendingRem:data.response[0].hpslstopSendingRem,
          email:data.response[0].email,
          daysFirstRequest:data.response[0].daysFirstRequest
        });
      }
      else {
        this.showNotification(data);
      }

    },(err : any) => {
      this.showError(err);
    }
    );
  }

  onSubmit()
  {
   this.updatePiAttorneyLienSettings();
  }

  updatePiAttorneyLienSettings()
  {
   this.body={
  'attorneyAndLienSettingId': this.id,
  'lienWithOutPatient': this.selectedLienWithOutPatientStatusList.toString(),
  'daysAfterDos': this.getFromControls.daysAfterDos.value,
  'countingBusinessDays': this.getFromControls.countingBusinessDays.value,
  'after1stReminder': this.getFromControls.after1stReminder.value,
  'after2ndReminder': this.getFromControls.after2ndReminder.value,
  'stopSendingReminder': this.getFromControls.stopSendingReminder.value,
  'email': this.getFromControls.email.value,
  'firstscheduletime': this.getFromControls.firstScheduleTime.value,
  'secondscheduletime': this.getFromControls.secondScheduleTime.value,
  'thirdscheduletime': this.getFromControls.thirdScheduleTime.value,
  'ispatientlienactive': this.getFromControls.isPatientLienActive.value,
  'comment': this.getFromControls.comment.value,
  'daysFirstRequest': this.getFromControls.daysFirstRequest.value,
  'hpslafter1stRem': this.getFromControls.hpslAfter1stRem.value,
  'hpslafter2ndRem': this.getFromControls.hpslAfter2ndRem.value,
  'hpslstopSendingRem': this.getFromControls.hpslStopSendingRem.value,
  'hpslcontinousRem': this.getFromControls.hpslContinousRem.value,
  'hpslstatus': this.selectedHpslstatusList.toString()
    }
    if(this.id)
    {
      this.settingsService.updatePiAttorneyLienSettings(true,this.body).subscribe((res : any) => {
        if (res) { 
            this.getPiAttorneyLienSettings();
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
  get getFromControls() { return this.piAttorneyLiensSettingForm.controls; }
  allowNumberOnly(event:any): boolean
  {
    return this.commonService.alowNumberOnly(event);
  }
}
