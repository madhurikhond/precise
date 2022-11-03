import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';


@Component({
  selector: 'app-pi-accept-liability',
  templateUrl: './pi-accept-liability.component.html',
  styleUrls: ['./pi-accept-liability.component.css']
})
export class PiAcceptLiabilityComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  a3: any = 20;
  a4: any = 20;
  a5: any = 20;
  a6: any = 20;
  a7: any = 20;
  a8: any = 20;
  a9: any = 20;
  piAcceptLiabilitySettingForm:FormGroup;
  selectedStatusList:any=[];
  statusList: any = [];
  modalityList:any=[];
  selectedModalityList:any=[];
  financialTypeList:any=[];
  selectedFinancialTypeList:any=[];
  selectedPersistentStatus:any=[];
  selectedPersistentModality:any=[];
  selectedPersistentFinancial:any=[];
  selectedSecondAcceptLiabilityStatus2:any[];
  selectedSecondLiabilityModality2:any[];
  selectedSecondFinancialTypes2:any[];
  id:number;
  submitted = false;
  body:any;
  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly commonService:CommonMethodService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.piAcceptLiabilitySettingForm = this.fb.group({
      status: [''],
      modality: [''],
      initialReminder: [''],
      isActive: [''],
      financialType:[''],
      persistentIsActive:[''],
      persistentStatus:[''],
      persistentModality:[''],
      persistentFinancial:[''],
      persistentEveryDays:[''],
      persistentStopAfter: [''],
      initialReminderPersistent: [''],
      isSecondCriteriaForLiability: [''],
      secondAcceptLiabilityStatus2: [''],
      secondLiabilityModality2: [''],
      secondFinancialTypes2: [''],
      comment:['']
    });
    this.getMasterStatusNamesList();
    this.getMasterModalities();
    this.getMasterFinancialType();
    this.getPiAcceptLiabilitySetting();
  }
  getMasterStatusNamesList() {
    this.settingsService.getMasterStatusNames(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.statusList = data.response;
      }
      else {
        this.showNotification(data);
      }
     
    },(err : any) => {
      this.showError(err);
    }
    );
  }
  getMasterModalities()
  {
    this.settingsService.getMasterModalities(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.modalityList = data.response;
      }
      else {
        this.showNotification(data);
      }
     
    },(err : any) => {
      this.showError(err);
    }
    );
  }
  getMasterFinancialType()
  {
    this.settingsService.getMasterFinancialTypes(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.financialTypeList = data.response;
      }
      else {
        this.showNotification(data);
      }
     
    },(err : any) => {
      this.showError(err);
    }
    );
  }
  getPiAcceptLiabilitySetting()
  {
    this.settingsService.getAllAcceptLiabilitySetting(true).subscribe((res)=>{
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.id = data.response[0].id
        if(data.response[0].status){
        this.selectedStatusList=data.response[0].status.split(',').map(function(item) {
          return item.trim();
        });}
        if(data.response[0].modality){this.selectedModalityList=data.response[0].modality.split(',').map(function(item) {
          return item.trim();
        });}
        if(data.response[0].financialType){this.selectedFinancialTypeList=data.response[0].financialType.split(',').map(function(item) {
          return item.trim();
        });}
        if(data.response[0].persistentStatus){this.selectedPersistentStatus=data.response[0].persistentStatus.split(',').map(function(item) {
          return item.trim();
        });}
        if(data.response[0].persistentModality){this.selectedPersistentModality=data.response[0].persistentModality.split(',').map(function(item) {
          return item.trim();
        });}
        if(data.response[0].persistentFinancial){this.selectedPersistentFinancial=data.response[0].persistentFinancial.split(',').map(function(item) {
          return item.trim();
        });}
        if(data.response[0].secondAcceptLiabilityStatus2){this.selectedSecondAcceptLiabilityStatus2=data.response[0].secondAcceptLiabilityStatus2.split(',').map(function(item) {
          return item.trim();
        });}
        if(data.response[0].secondLiabilityModality2){this.selectedSecondLiabilityModality2=data.response[0].secondLiabilityModality2.split(',').map(function(item) {
          return item.trim();
        });}
        if(data.response[0].secondFinancialTypes2){this.selectedSecondFinancialTypes2=data.response[0].secondFinancialTypes2.split(',').map(function(item) {
          return item.trim();
        });}       
        this.piAcceptLiabilitySettingForm.patchValue({
          initialReminder:data.response[0].initialreminder,
          isActive:data.response[0].isActive,
          persistentIsActive:data.response[0].persistentIsActive,
          persistentEveryDays:data.response[0].persistentEveryDays,
          persistentStopAfter:data.response[0].persistentStopAfter,
          initialReminderPersistent:data.response[0].initialreminderPersistent,
          isSecondCriteriaForLiability:data.response[0].isSecondCriteriaForLiability,
          comment:data.response[0].comment,
        });
        
      }
      else {
        this.showNotification(data);
      }

    },(err : any) => {
      this.showError(err);
    }
    );
  }
  // common Notification Method
showNotification(data: any) {
  this.notificationService.showNotification({
        alertHeader : data.statusText,
        alertMessage: data.message,
        alertType: data.responseCode
      });
}
// common Error Method
showError(err: any) {
  this.notificationService.showNotification({
      alertHeader : err.statusText,
      alertMessage:err.message,
      alertType: err.status
    });
}
onSubmit()
{

  this.getUpdateAcceptLiabilitySetting();

}
getUpdateAcceptLiabilitySetting()
{
  
   this.body={
  'id': this.id,
  'status': this.selectedStatusList.toString(),
  'modality': this.selectedModalityList.toString(),
  'initialreminder': this.getFromControls.initialReminder.value,
  'isActive': this.getFromControls.isActive.value,
  'financialType': this.selectedFinancialTypeList.toString(),
  'persistentIsActive': this.getFromControls.persistentIsActive.value,
  'persistentStatus': this.selectedPersistentStatus.toString(),
  'persistentModality': this.selectedModalityList.toString(),
  'persistentFinancial': this.selectedFinancialTypeList.toString(),
  'persistentEveryDays': this.getFromControls.persistentEveryDays.value,
  'persistentStopAfter': this.getFromControls.persistentStopAfter.value,
  'initialreminderPersistent': this.getFromControls.initialReminderPersistent.value,
  'isSecondCriteriaForLiability': this.getFromControls.isSecondCriteriaForLiability.value,
  'secondAcceptLiabilityStatus2': this.selectedSecondAcceptLiabilityStatus2.toString(),
  'secondLiabilityModality2': this.selectedSecondLiabilityModality2.toString(),
  'secondFinancialTypes2': this.selectedSecondFinancialTypes2.toString(),
  'comment': this.getFromControls.comment.value,
    }
    if(this.id)
    {
      this.settingsService.updatePiAcceptLiabilitySetting(true,this.body).subscribe((res : any) => {
        if (res) { 
            this.getPiAcceptLiabilitySetting();
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
}
hideShowSecondCriteriaSetting(checkBox:any)
{
  if(checkBox.target.checked)
  this.piAcceptLiabilitySettingForm.controls['isSecondCriteriaForLiability'].setValue(checkBox.target.checked);
}
hideShowpersistentIsActive(checkBox:any)
{ 
  if(checkBox.target.checked)
  this.piAcceptLiabilitySettingForm.controls['persistentIsActive'].setValue(checkBox.target.checked);
}
allowNumberOnly(event:any): boolean
  {
    return this.commonService.alowNumberOnly(event);
  }
  get getFromControls() { return this.piAcceptLiabilitySettingForm.controls; }
  
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
