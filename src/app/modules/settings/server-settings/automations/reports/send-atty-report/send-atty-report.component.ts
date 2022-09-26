import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-send-atty-report',
  templateUrl: './send-atty-report.component.html',
  styleUrls: ['./send-atty-report.component.css']
})
export class SendAttyReportComponent implements OnInit {
  id:number;
  reportForm:FormGroup
  submitted=false
  setServiceName:string

  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      isServiceActive: [''],
      isTimeActive: [''],
      serviceTime: ['',[Validators.required]]
    })
    this.getServiceSettings()
  }

  getServiceSettings(){
    this.settingsService.getAllServiceSettings(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[1].id
      this.setServiceName = data.response[1].serviceName
      if (data.response != null && data.response.length > 0) {
        this.reportForm.patchValue({
          isServiceActive: data.response[1].isServiceActive,
          isTimeActive:data.response[1].isTimeActive,
          serviceTime: data.response[1].serviceTime,
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
    if(!this.reportForm.valid){
     return;
    } 
    else{
    this.updateServiceSetting()
    }
  }

  updateServiceSetting(){
    
    var body={
      "id": this.id,
      "serviceName": this.setServiceName,
      "isServiceActive": this.rForm.isServiceActive.value,
      "isTimeActive": this.rForm.isTimeActive.value,
      "serviceTime": (this.rForm.serviceTime.value)
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
  get rForm() { return this.reportForm.controls; }
}
