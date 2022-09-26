import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notificationUser: FormGroup;
  submitted = false;
  isDisabled = true;													
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  
  constructor(private fb: FormBuilder, private settingService: SettingsService, 
    private notificationService: NotificationService, private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Notifications');
    this.notificationUser = this.fb.group({
      notificationTitle: ['',[Validators.required]],
      notificationTitleDropDown: ['',[Validators.required]],
      embeddedDropDown: ['',[Validators.required]],
      contentScrollDropDown: ['',[Validators.required]],
      isNotificationLater:[false],
      notificationDate:[''],
      notificationTime:[''],
      notificationNote:['',[Validators.required]]
    })
  }

  onSubmit(){
    this.submitted = true;
    if(!this.notificationUser.valid){
     return;
    }
    var data = {
      'notificationTitle': this.notificationForm.notificationTitle.value,
      'notificationTitleDropDown': this.notificationForm.notificationTitleDropDown.value,
      'embeddedDropDown': this.notificationForm.embeddedDropDown.value,
      'contentScrollDropDown': this.notificationForm.contentScrollDropDown.value,
      'isNotificationLater': this.notificationForm.isNotificationLater.value,
      'notificationDate': this.notificationForm.notificationDate.value,
      'notificationTime': this.notificationForm.notificationTime.value,
      'notificationNote': this.notificationForm.notificationNote.value
    }     
    this.settingService.saveNotification(true, data).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        });
        this.submitted = false;
        this.clearnotificationUser();      
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

  clearnotificationUser(){
    this.notificationUser.patchValue({
      notificationTitle: '',
      notificationTitleDropDown: '',
      embeddedDropDown: '',
      contentScrollDropDown: '',
      isNotificationLater:false,
      notificationDate:'',
      notificationTime:'',
      notificationNote:''
    });
  }

  checkSendLater() {
    const notificationDateControl = this.notificationUser.get('notificationDate');
    const notificationTimeControl = this.notificationUser.get('notificationTime');
    if(this.notificationUser.get('isNotificationLater').value){
      notificationDateControl.setValidators([Validators.required]);
      notificationTimeControl.setValidators([Validators.required]);
    }
    else{
      notificationDateControl.setValidators(null);
      notificationTimeControl.setValidators(null);
    }
    notificationDateControl.updateValueAndValidity();
    notificationTimeControl.updateValueAndValidity();
  }

  get notificationForm() { return this.notificationUser.controls; }

}
