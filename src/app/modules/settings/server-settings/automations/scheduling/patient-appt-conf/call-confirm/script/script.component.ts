import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ckeConfig } from 'src/app/constants/Ckeditor';
import { HtmlParser } from '@angular/compiler';

@Component({
  selector: 'app-script',
  templateUrl: './script.component.html',
  styleUrls: ['./script.component.css']
})
export class ScriptComponent implements OnInit {
  callSettingForm:FormGroup;
  id:number
  isActive: any
  status: any
  financialType: any
  comment: any
  submitted = false
  
  selectedScript:string
  text:string
  hidden1:string
  name = 'ng2-ckeditor';
  //ckeConfig: CKEDITOR.config;
  ckeConfig:any;
  ckConfig:any;
  mycontent: string;
  log: string = '';

  readonly CkeConfig = ckeConfig;
  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getAllCallConfirmSettings()
    this.callSettingForm =  this.fb.group({
      script: ['', [Validators.required]],
    });
    
  }
  onChange($event: any): void {
    //this.log += new Date() + "<br />";
  }
  
  onPaste($event: any): void {
    //this.log += new Date() + "<br />";
  }
  getAllCallConfirmSettings(){
    this.settingsService.getAllCallConfirmSettings(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      this.isActive = data.response[0].isActive
      this.status = data.response[0].status
      this.financialType = data.response[0].financialType
      this.comment = data.response[0].comment

      if (data.response != null && data.response.length > 0) {
        this.callSettingForm.patchValue({
          script: data.response[0].script,
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
    if(!this.callSettingForm.valid){
     return;
    } 
    this.updateCallConfirmSetting()
  }
  
  func(){
    const element = document.getElementById('abc');
    this.text = element.innerText || element.textContent; 
    element.innerHTML = this.text;
  }

  updateCallConfirmSetting(){
    this.hidden1 = this.csForm.script.value
    var emp = this.hidden1.replace(/<[^>]*>/g , '');

    var body={
      'id': this.id,
      'isActive': this.isActive,
      'status': this.status,
      'financialType': this.financialType,
      'comment': this.comment,
      'scriptText':emp.toString(),
      'script': this.csForm.script.value,      
    }  
    this.settingsService.updateCallConfirmSetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getAllCallConfirmSettings()
        
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

  get csForm() { return this.callSettingForm.controls; }

}
