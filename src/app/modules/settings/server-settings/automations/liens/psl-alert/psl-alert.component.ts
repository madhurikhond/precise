import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonRegex } from 'src/app/constants/commonregex';

import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-psl-alert',
  templateUrl: './psl-alert.component.html',
  styleUrls: ['./psl-alert.component.css']
})
export class PslAlertComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  a3: any = 20;
  pslAlertFormSettings: FormGroup;
  statusList:any=[];
  financialTypeList:any=[];
  selectedMatchStatus:any=[];
  selectedDoNotMatchStatus:any=[];
  selectedFinancialType:any=[];
  pslEmail:any=[];
  id:number;
  body:any;
  IsSubmitted:boolean=false;
  modelValue:string;
  readonly commonRegex=CommonRegex;
  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService) { }
    
  ngOnInit(): void {
    this.pslAlertFormSettings = this.fb.group({
      isPslAlert: [''],
      pslServiceTime: [''],
      pslNote: [''],
      pslEmail1: ['',[Validators.pattern(this.commonRegex.EmailRegex )]],     
      pslEmail2: ['',[Validators.pattern(this.commonRegex.EmailRegex )]],     
      pslEmail3: ['',[Validators.pattern(this.commonRegex.EmailRegex )]],     
      pslEmail4: ['',[Validators.pattern(this.commonRegex.EmailRegex )]],     
      pslEmail5: ['',[Validators.pattern(this.commonRegex.EmailRegex )]],          
      matchPslStatus:[''],
      pslDoNotMatch:[''],
      pslFinancial:['']
    });
    this.getMasterStatusNamesList();
    this.getPslAlertSetting();
    this.getMasterFinancialType();
    
  }
  getMasterStatusNamesList(){
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

  getMasterFinancialType()
  {
    this.settingsService.getMasterFinancialTypes(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.financialTypeList = data.response;
      }
      else {
        this.financialTypeList='';
        this.showNotification(data);
      }
     
    },(err : any) => {
      this.showError(err);
    }
    );
  }
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

  getPslAlertSetting()
  {
    this.settingsService.GetAllPatientStudySchedulingSetting(true).subscribe((res)=>{
      var data=res;
      if (data.response != null && data.response.length > 0) {
        this.id=data.response[0].id;
        if(data.response[0].matchPslStatus)
        {
          this.selectedMatchStatus =data.response[0].matchPslStatus.split(',').map(function(item) {
            return item.trim();
          });
        }
        if(data.response[0].pslDoNotMatch)
        {
        this.selectedDoNotMatchStatus =data.response[0].pslDoNotMatch.split(',').map(function(item) {
          return item.trim();
        });
      }
      if(data.response[0].pslFinancial)
        {
        this.selectedFinancialType =data.response[0].pslFinancial.split(',').map(function(item) {
          return item.trim();
        });
      }
        this.pslEmail=data.response[0].pslEmail.split(',');
        this.pslAlertFormSettings.patchValue({
          isPslAlert:data.response[0].isPslAlert,
          pslServiceTime:data.response[0].pslServiceTime,
          pslNote:data.response[0].pslNote,
          pslEmail1:this.pslEmail[0].trim(),
          pslEmail2:this.pslEmail[1].trim(),
          pslEmail3:this.pslEmail[2].trim(),
          pslEmail4:this.pslEmail[3].trim(),
          pslEmail5:this.pslEmail[4].trim(),
        });
      }
      else{
        this.showNotification(data);
      }
      },(err : any) => {
        this.showError(err);
      });
  }
  get getFromControls() { return this.pslAlertFormSettings.controls; }
  onSubmit()
  {
 this.updatePslAlertSettings();
  }
  updatePslAlertSettings()
  {
    this.IsSubmitted=true;
    this.modelValue="modal";
    if (this.pslAlertFormSettings.invalid) {
      this.modelValue="";
      return;
    }
  
    this.body={
      "id": this.id,
      "isPslAlert": this.getFromControls.isPslAlert.value,
      "pslServiceTime": this.getFromControls.pslServiceTime.value,
      "pslNote": this.getFromControls.pslNote.value,
      "pslEmail":this.getFromControls.pslEmail1.value+","+this.getFromControls.pslEmail2.value+","+this.getFromControls.pslEmail3.value+","+this.getFromControls.pslEmail4.value+","+this.getFromControls.pslEmail5.value,
      "matchPslStatus":this.selectedMatchStatus.toString(), 
      "pslDoNotMatch":this.selectedDoNotMatchStatus.toString(),
      "pslFinancial":this.selectedFinancialType.toString(),
      "tabName":'PSL Alert'
        }
        if(this.id)
        {
          this.settingsService.UpdatePatientStudySchedulingSetting(true,this.body).subscribe((res : any) => {
            if (res) { 
                this.getPslAlertSetting();
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
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
