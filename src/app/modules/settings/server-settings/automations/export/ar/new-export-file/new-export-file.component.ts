import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-new-export-file',
  templateUrl: './new-export-file.component.html',
  styleUrls: ['./new-export-file.component.css']
})
export class NewExportFileComponent implements OnInit {
  newExportForm:FormGroup
  id:number
  submitted=false
  
  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.newExportForm =this.fb.group({
      isActive: [''],
      runningServiceTime: ['', [Validators.required]],
      newExportEmail: ['', [Validators.required, Validators.email]],
      note: ['', [Validators.required]]
    });
    this.getNewExportSettingList()
  }

  getNewExportSettingList(){
    this.settingsService.getAllNewExportSttings(true).subscribe((res) =>{
      var data: any = res;
      this.id = data.response[0].id
      if (data.response != null && data.response.length > 0) {
        this.newExportForm.patchValue({
          isActive:data.response[0].isActive,
          runningServiceTime:data.response[0].runningServiceTime,
          newExportEmail: data.response[0].newExportEmail,
          note: data.response[0].note
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
    if(!this.newExportForm.valid){
     return;
    } 
    this.updateNewExportSetting()
  }

  updateNewExportSetting(){
    var body={
      'id': this.id,
      'isActive': this.neForm.isActive.value,
      'runningServiceTime': this.neForm.runningServiceTime.value,
      'newExportEmail': this.neForm.newExportEmail.value,
      'note': this.neForm.note.value
    }   
    this.settingsService.updateExportSetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getNewExportSettingList()
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
  get neForm() {return this.newExportForm.controls;}

}
