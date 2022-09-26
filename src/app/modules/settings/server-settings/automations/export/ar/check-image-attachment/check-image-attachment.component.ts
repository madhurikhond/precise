import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonRegex } from 'src/app/constants/commonregex';

import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-check-image-attachment',
  templateUrl: './check-image-attachment.component.html',
  styleUrls: ['./check-image-attachment.component.css']
})
export class CheckImageAttachmentComponent implements OnInit {
  checkImageForm:FormGroup
  id:number
  submitted=false
  readonly commonRegex=CommonRegex;
  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.checkImageForm =this.fb.group({
      isActive: [''],
      runServiceTime: ['', [Validators.required]],
      checkImageEmail: ['', [Validators.required, Validators.pattern(this.commonRegex.EmailRegex )]],
      checkImageEmailSubs: ['', [Validators.required, Validators.pattern(this.commonRegex.EmailRegex )]]
    });
    this.getCheckImageSettingList()
  }

  getCheckImageSettingList(){
    this.settingsService.getAllCheckImageSettings(true).subscribe((res) =>{
      var data: any = res;
      this.id = data.response[0].id
      if (data.response != null && data.response.length > 0) {
        this.checkImageForm.patchValue({
          isActive: data.response[0].isActive,
          runServiceTime: data.response[0].runServiceTime,
          checkImageEmail: data.response[0].checkImageEmail,
          checkImageEmailSubs: data.response[0].checkImageEmailSubs
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
    if(!this.checkImageForm.valid){
     return;
    } 
    this.updateCheckImageSetting()
  }

  updateCheckImageSetting(){
    var body={
      'id': this.id,
      'isActive': this.ciForm.isActive.value,
      'runServiceTime': this.ciForm.runServiceTime.value,
      'checkImageEmail': this.ciForm.checkImageEmail.value,
      'checkImageEmailSubs': this.ciForm.checkImageEmailSubs.value
    }   
    this.settingsService.updateCheckImageSetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getCheckImageSettingList()
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
  get ciForm() {return this.checkImageForm.controls;}
}
