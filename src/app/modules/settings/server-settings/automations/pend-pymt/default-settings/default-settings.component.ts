import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-default-settings',
  templateUrl: './default-settings.component.html',
  styleUrls: ['./default-settings.component.css']
})
export class DefaultSettingsComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  defaultSettingForm:FormGroup
  id:number
  submitted=false
  tempStatusList =[]
  selectedStatusList:any =[];
  statusNamesList:any =[]
  paymentLists:any =[]
  selectedPaymentList:any =[]
  tempPaymentList:any =[]

  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService,
    private readonly settingsService: SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.defaultSettingForm = this.fb.group({
      isactive: [''],
      time: ['',[Validators.required]],
      paymentStatus: ['',[Validators.required]],
      studyStatus: ['',[Validators.required]],
      notes: ['',[Validators.required]]
    })
    this.getMasterPaymentStatusList()
    this.getMasterStatusNamesList()
    this.getDefaultSettings()
  }

  getMasterPaymentStatusList(){
    this.settingsService.getAllPaymentStatus(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.paymentLists = data.response;
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

  getDefaultSettings(){
    this.submitted = false
    this.settingsService.getDefaultSetting(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].defaultSettingId
      if (data.response != null) {

        this.tempStatusList = data.response[0].studyStatus.split(',')
        this.selectedStatusList = this.tempStatusList.map(function(a) {return a;})

        this.tempPaymentList = data.response[0].paymentStatus.split(',')
        this.selectedPaymentList = this.tempPaymentList.map(function(a) {return a;})

        this.defaultSettingForm.patchValue({
          isactive: data.response[0].isactive,
          time: data.response[0].time,
          notes:data.response[0].notes
        });
      }
      else {
        this.notificationService.showNotification({
          alertHeader : '',
          alertMessage: data.Message,
          alertType: data.ResponseCode
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

  onSubmit(){
    this.submitted = true
    if(!this.defaultSettingForm.valid){
     return;
    }  
    this.updateDefaultSetting()
  }

  updateDefaultSetting(){
    var body={
      'defaultSettingId': this.id,
      'isactive': this.dsForm.isactive.value,
      'time': this.dsForm.time.value,
      'paymentStatus': this.dsForm.paymentStatus.value.toString(),
      'studyStatus': this.dsForm.studyStatus.value.toString(),
      'createdOn': new Date().toISOString(),
      'updatedOn': new Date().toISOString(),
      'notes': this.dsForm.notes.value,
    }   
    this.settingsService.updateDefaultSetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getDefaultSettings()
        
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

  get dsForm() { return this.defaultSettingForm.controls; }
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
