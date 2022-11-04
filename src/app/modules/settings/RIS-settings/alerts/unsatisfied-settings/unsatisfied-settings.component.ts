import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ckeConfig } from 'src/app/constants/Ckeditor';

@Component({
  selector: 'app-unsatisfied-settings',
  templateUrl: './unsatisfied-settings.component.html',
  styleUrls: ['./unsatisfied-settings.component.css']
})
export class UnsatisfiedSettingsComponent implements OnInit {

  unsatisfiedForm: FormGroup
  id:number
  readonly CkeConfig = ckeConfig;
  name = 'ng2-ckeditor';
    //ckeConfig: CKEDITOR.config;
    ckeConfig:any;
    ckConfig:any;
    mycontent: string;
    log: string = '';
  constructor(private fb: FormBuilder,
              private settingsService:SettingsService,
              private notificationService:NotificationService,
              private readonly commonMethodService :CommonMethodService
             ) { }

  ngOnInit(): void {
    this.unsatisfiedForm = this.fb.group({
      patientTime: [''],
      unsatisfiedSubject: [''],
      unsatisfiedBody: ['']
    })
    this.getUnsatisfiedSetting()
    this.commonMethodService.setTitle('Settings');
  }
  onChange($event: any): void {
    //this.log += new Date() + "<br />";
  }
  
  onPaste($event: any): void {
    //this.log += new Date() + "<br />";
  }
  getUnsatisfiedSetting(){
    this.settingsService.getAlertsUnsatisfiedSetting(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response.id
      if (data.response != null) {
        this.unsatisfiedForm.patchValue({
          patientTime: data.response.patientTime,
          unsatisfiedSubject: data.response.unsatisfiedSubject,
          unsatisfiedBody:data.response.unsatisfiedBody
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

  updateUnsatisfiedSetting(){
    var body={
      'id': this.id,
      'patientTime': this.ustForm.patientTime.value,
      'unsatisfiedSubject': this.ustForm.unsatisfiedSubject.value,
      'unsatisfiedBody': this.ustForm.unsatisfiedBody.value
    }
    this.settingsService.updateAlertUnsatisfiedSetting(true, body).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getUnsatisfiedSetting();   
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

  get ustForm() { return this.unsatisfiedForm.controls; }

}
