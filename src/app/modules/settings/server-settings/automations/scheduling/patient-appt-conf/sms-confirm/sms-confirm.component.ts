import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-sms-confirm',
  templateUrl: './sms-confirm.component.html',
  styleUrls: ['./sms-confirm.component.css']
})
export class SmsConfirmComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  statusNamesList: any = [];
  selectedStatusList:any =[];
  tempStatusList=[]
  smsConfirmForm:FormGroup;
  id:number;
  submitted = false
  modalityList:any=[]
  tempModalityList =[]
  selectedModalityList:any=[];

  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.smsConfirmForm = this.fb.group({
      firstReminderDays: ['',[
        Validators.required,
        Validators.maxLength(3), 
        Validators.min(1), 
        Validators.max(999),   
        Validators.pattern(/^\d*\.?\d*$/)
    ]],
      secondReminderDays: ['',[
        Validators.required,
        Validators.maxLength(3), 
        Validators.min(1), 
        Validators.max(999),   
        Validators.pattern(/^\d*\.?\d*$/)
    ]],
      thirdReminderDays: ['',[
        Validators.required,
        Validators.maxLength(3), 
        Validators.min(1), 
        Validators.max(999),   
        Validators.pattern(/^\d*\.?\d*$/)
    ]],
      fourthReminderDays:['',[
        Validators.required,
        Validators.maxLength(3), 
        Validators.min(1), 
        Validators.max(999),   
        Validators.pattern(/^\d*\.?\d*$/)
    ]],
      firstAppointment: ['',[Validators.required]],
      initialAppointment: ['',[Validators.required]],
      secondAppointment:['',[Validators.required]],
      thirdAppointment: ['',[Validators.required]],
      fourthAppointment: ['',[Validators.required]],
      status: ['',[Validators.required]],
      scheduledmodality:['',[Validators.required]],
      isPatientReminder: [''],
      comment:['',[Validators.required]]
    });
    this.getMasterStatusNamesList()
    this.getMasterModalityList()
    this.getSmsSettings()
  }

  getMasterModalityList() {
    this.settingsService.getMasterModalities(false).subscribe((res)=>{
    var data:any=res;
    if (data.response != null && data.response.length > 0) {
      this.modalityList = data.response;
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

  getMasterStatusNamesList(){
    this.settingsService.getMasterStatusNames(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.statusNamesList = data.response;
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

  onChange($event){
    
  }

  getSmsSettings(){
    this.settingsService.getAllSMSSettings(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      if (data.response != null && data.response.length > 0) {
        this.tempStatusList = data.response[0].status.split(',')
        this.selectedStatusList = this.tempStatusList.map(function(a) {return a;})
        this.tempModalityList = data.response[0].scheduledmodality.split(',')
        this.selectedModalityList = this.tempModalityList.map(function(a) {return a;})
        this.smsConfirmForm.patchValue({
          firstReminderDays: data.response[0].firstReminderDays,
          secondReminderDays:data.response[0].secondReminderDays,
          thirdReminderDays: data.response[0].thirdReminderDays,
          fourthReminderDays:data.response[0].fourthReminderDays,
          firstAppointment: data.response[0].firstAppointment,
          initialAppointment: data.response[0].initialAppointment,
          secondAppointment:data.response[0].secondAppointment,
          thirdAppointment: data.response[0].thirdAppointment,
          fourthAppointment: data.response[0].fourthAppointment,
          isPatientReminder: data.response[0].isPatientReminder,
          comment: data.response[0].comment
        });
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

  onSubmit(){
    this.submitted = true
    if(!this.smsConfirmForm.valid){
     return;
    } 
    else{
    this.updateSmsSetting()
    }
  }

  updateSmsSetting(){
    var body={
      'id': this.id,
      'reminderType': 'PatientReminder',
      'firstReminderDays': parseInt(this.scForm.firstReminderDays.value),
      'secondReminderDays':parseInt(this.scForm.secondReminderDays.value),
      'thirdReminderDays': parseInt(this.scForm.thirdReminderDays.value),
      'fourthReminderDays': parseInt(this.scForm.fourthReminderDays.value),
      'firstAppointment': this.scForm.firstAppointment.value,
      'initialAppointment': this.scForm.initialAppointment.value,
      'secondAppointment': this.scForm.secondAppointment.value,
      'thirdAppointment': this.scForm.thirdAppointment.value,
      'fourthAppointment': this.scForm.fourthAppointment.value,
      'status': this.scForm.status.value.toString(),
      'scheduledmodality': this.scForm.scheduledmodality.value.toString(),
      'isPatientReminder': this.scForm.isPatientReminder.value,
      'comment': this.scForm.comment.value,
      'tabName': 'SMS Confirm'
    }   
    this.settingsService.updateSmsSetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getSmsSettings()
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
  get scForm() { return this.smsConfirmForm.controls; }

  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
