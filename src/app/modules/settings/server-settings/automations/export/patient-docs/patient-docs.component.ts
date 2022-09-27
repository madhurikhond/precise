import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-patient-docs',
  templateUrl: './patient-docs.component.html',
  styleUrls: ['./patient-docs.component.css']
})
export class PatientDocsComponent implements OnInit {
  selectedDocList:any=[]
  tempDocList=[]
  docTypesList:any =[];
  patientForm:FormGroup;
  id:number;
  submitted=false

  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      sftpTime: ['',[Validators.required]],
      sftpDocType: ['',[Validators.required]],
      sftpActive: ['']
    })
    this.getMasterDocTypesList();
    this.getAllSFTPSettingsList();
  }

  getMasterDocTypesList(){
    this.settingsService.getMasterDocumentTypeList(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.docTypesList = data.response;

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

  getAllSFTPSettingsList(){
    this.settingsService.getAllSFTPSettings(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      
      if (data.response != null && data.response.length > 0) {
        if(data.response[0].sftpDocType){
        this.tempDocList =data.response[0].sftpDocType.split(',')
        this.selectedDocList = this.tempDocList.map(function(a) {return a;});      
      }
      this.patientForm.patchValue({
        sftpTime: data.response[0].sftpTime,
        sftpActive:data.response[0].sftpActive
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

  onChange($event){
    
  }

  onSubmit(){
    this.submitted = true
    if(!this.patientForm.valid){
     return;
    } 
     this.updateSFTpSetting()
  }

  updateSFTpSetting(){
    var body={
      'id': this.id,
      'sftpTime': this.pdForm.sftpTime.value,
      'sftpDocType': this.pdForm.sftpDocType.value.toString(),
      'sftpActive': this.pdForm.sftpActive.value
    }   
    this.settingsService.updateSFTPSetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getAllSFTPSettingsList()
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
  get pdForm() { return this.patientForm.controls; }
}
