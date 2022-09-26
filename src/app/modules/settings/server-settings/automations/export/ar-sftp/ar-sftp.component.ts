import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-ar-sftp',
  templateUrl: './ar-sftp.component.html',
  styleUrls: ['./ar-sftp.component.css']
})
export class ArSftpComponent implements OnInit {
  a1: any = 20;
  arSftpForm:FormGroup
  id:number
  submitted=false
  sftpList : any =[]
  tempSftpList =[]
  selectedsftpList=[]

  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService,private readonly commonService: CommonMethodService) { }

  ngOnInit(): void {
    this.arSftpForm = this.fb.group({
      profileName:['',[Validators.required]],
      isActive: ['']
    });
    this.getMasterSftpList()
    this.getArsftpSettingList()
  }

  getMasterSftpList(){
    this.settingsService.getAllMasterSftpSettings(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.sftpList = data.response;

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

  getArsftpSettingList(){
    this.settingsService.getAllARSFTPSettings(true).subscribe((res) =>{
      var data: any = res;
      this.id = data.response[0].id
      if (data.response != null && data.response.length > 0) {
        this.tempSftpList =data.response[0].profileName.split(',')
        this.selectedsftpList = this.tempSftpList.map(function(a) {return a;});
        this.arSftpForm.patchValue({
          isActive:data.response[0].isActive
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
    if(!this.arSftpForm.valid){
     return;
    } 
    this.updateCheckImageSetting()
  }

  updateCheckImageSetting(){
    var body={
      'id': this.id,
      'profileName': this.arsForm.profileName.value.toString(),
      'isActive': this.arsForm.isActive.value
    }   
    this.settingsService.updateARSFTPSetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getArsftpSettingList()
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

  onChange($event){
    
  }

  get arsForm() {return this.arSftpForm.controls;}
 
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
