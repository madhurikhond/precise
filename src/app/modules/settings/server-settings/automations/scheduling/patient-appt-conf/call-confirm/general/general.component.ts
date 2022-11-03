import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  financialTypesList:any=[]
  statusNamesList:any=[]
  id:number
  tempFinancialList=[]
  tempStatusList=[]
  selectedStatusList:any =[];
  selectedFinancialList:any=[]
  callSettingForm:FormGroup;
  submitted=false;
  script:string
  scriptText:string
  // body:any

  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.callSettingForm =  this.fb.group({
      isActive: [''],
      status: ['', [Validators.required]],
      financialType: ['', [Validators.required]],
      comment: ['', [Validators.required]],
    });
    this.getMasterFinancialTypesList()
    this.getMasterStatusNamesList()
    this.getAllCallConfirmSettings()
  }

  getMasterFinancialTypesList(){
    this.settingsService.getMasterFinancialTypes(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.financialTypesList = data.response;

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

  getAllCallConfirmSettings(){
    this.settingsService.getAllCallConfirmSettings(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      this.script = data.response[0].script
      this.scriptText = data.response[0].scriptText

      if (data.response != null && data.response.length > 0) {
        this.tempFinancialList = data.response[0].financialType.split(',')
        this.selectedFinancialList = this.tempFinancialList.map(function(a) {return a;});
        this.tempStatusList = data.response[0].status.split(',')
        this.selectedStatusList = this.tempStatusList.map(function(a) {return a;})
        this.callSettingForm.patchValue({
          isActive: data.response[0].isActive,
          comment: data.response[0].comment,
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

  updateCallConfirmSetting(){
    var body={
      'id': this.id,
      'isActive': this.csForm.isActive.value,
      'status': this.csForm.status.value.toString(),
      'financialType': this.csForm.financialType.value.toString(),
      'comment': this.csForm.comment.value,
      'script': this.script,
      'scriptText': this.scriptText
    }   
    this.settingsService.updateCallConfirmSetting(true, body).subscribe((res : any) => {
      if (res) { 
        
        this.notificationService.showNotification({ 
          alertHeader : 'Success',
          alertMessage: res.message,
          alertType: res.responseCode
        });
        this.getAllCallConfirmSettings()
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

  get csForm() { return this.callSettingForm.controls; }
  
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
