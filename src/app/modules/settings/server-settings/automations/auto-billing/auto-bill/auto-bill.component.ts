import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-auto-bill',
  templateUrl: './auto-bill.component.html',
  styleUrls: ['./auto-bill.component.css']
})
export class AutoBillComponent implements OnInit {
  id:number;
  autoBillForm:FormGroup
  submitted=false
  setServiceName:string

  constructor(private fb: FormBuilder,private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.autoBillForm = this.fb.group({
      isServiceActive: [''],
      isTimeActive: [''],
      serviceTime: ['',[Validators.required]]
    })
    this.getServiceSettings()
  }

  getServiceSettings(){
    this.settingsService.getAllServiceSettings(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      this.setServiceName = data.response[0].serviceName
      if (data.response != null && data.response.length > 0) {
        this.autoBillForm.patchValue({
          isServiceActive: data.response[0].isServiceActive,
          isTimeActive:data.response[0].isTimeActive,
          serviceTime: data.response[0].serviceTime,
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


  onSubmit(){
    this.submitted = true
    if(!this.autoBillForm.valid){
     return;
    } 
    else{
    this.updateServiceSetting()
    }
  }

  updateServiceSetting(){
    
    var body={
      'id': this.id,
      'serviceName': this.setServiceName,
      'isServiceActive': this.autoForm.isServiceActive.value,
      'isTimeActive': this.autoForm.isTimeActive.value,
      'serviceTime': (this.autoForm.serviceTime.value)
    }   
    this.settingsService.updateServiceSetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getServiceSettings()
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
  get autoForm() { return this.autoBillForm.controls; }
}
