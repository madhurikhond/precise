import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-psl-reminder',
  templateUrl: './psl-reminder.component.html',
  styleUrls: ['./psl-reminder.component.css']
})
export class PslReminderComponent implements OnInit {
  id:number;
  pslreminderForm:FormGroup
  submitted = false
  financialTypesList:any=[]
  statusNamesList:any=[]
  tempFinancialList=[]
  tempStatusList=[]
  selectedStatusList:any =[];
  selectedFinancialList:any=[]
  modalityList:any=[]
  tempModalityList =[]
  selectedModalityList:any=[];

  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.pslreminderForm = this.fb.group({
      isPSLSummary:[''],
      missingPSLScheduling:['',[Validators.required]],
      missingPSLFinanType:['',[Validators.required]],
      missingPSLStatus:['',[Validators.required]],
      missingPSLModality:['',[Validators.required]],
      pslFromDays:['',[
        Validators.required,
        Validators.maxLength(3), 
        Validators.min(1), 
        Validators.max(999),   
        Validators.pattern(/^\d*\.?\d*$/)
    ]],
      pslToDays:['',[
        Validators.required,
        Validators.maxLength(3), 
        Validators.min(1), 
        Validators.max(999),   
        Validators.pattern(/^\d*\.?\d*$/)
    ]],
      missingPSLNote:['',[Validators.required]],
      missingWeekDays:['',[Validators.required]]
    });
    this.getMasterStatusNamesList()
    this.getMasterModalityList()
    this.getMasterFinancialTypesList();
    this.getAllPatientStudySchedulingSetting()
  }

  getAllPatientStudySchedulingSetting(){
    this.settingsService.getAllPatientStudySchedulingSetting(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      
      if (data.response != null && data.response.length > 0) {
        this.tempFinancialList =data.response[0].missingPSLFinanType.split(',')
        this.selectedFinancialList = this.tempFinancialList.map(function(a) {return a;});
        this.tempStatusList = data.response[0].missingPSLStatus.split(',')
        this.selectedStatusList = this.tempStatusList.map(function(a) {return a;})
        this.tempModalityList = data.response[0].missingPSLModality.split(',')
        this.selectedModalityList = this.tempModalityList.map(function(a) {return a;})
        this.pslreminderForm.patchValue({
          isPSLSummary:data.response[0].isPSLSummary,
          missingPSLScheduling:data.response[0].missingPSLScheduling,
          pslFromDays:data.response[0].pslFromDays,
          pslToDays:data.response[0].pslToDays,
          missingPSLNote:data.response[0].missingPSLNote,
          missingWeekDays:data.response[0].missingWeekDays
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
  allowNumberOnly(event:any): boolean
  {
    return this.commonMethodService.alowNumberOnly(event);
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

  onSubmit(){
    this.submitted = true
    if(!this.pslreminderForm.valid){
     return;
    } 
     this.updatePatientStudySchedulingSetting()
  }

  updatePatientStudySchedulingSetting(){
    var body={
      'id': this.id,
      'isPSLSummary': this.pslForm.isPSLSummary.value,
      'missingPSLScheduling': this.pslForm.missingPSLScheduling.value,
      'missingPSLStatus':this.pslForm.missingPSLStatus.value.toString(),
      'missingPSLNote':this.pslForm.missingPSLNote.value,
      'missingPSLModality': this.pslForm.missingPSLModality.value.toString(),
      'missingPSLFinanType': this.pslForm.missingPSLFinanType.value.toString(),
      'pslFromDays': this.pslForm.pslFromDays.value,
      'pslToDays':this.pslForm.pslToDays.value,
      'missingWeekDays': this.pslForm.missingWeekDays.value,
      'tabName': 'PSL Reminder'
    }   
    this.settingsService.updatePatientStudySchedulingSetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getAllPatientStudySchedulingSetting()
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

  getMasterModalityList() {
    this.settingsService.getMasterModalities(false).subscribe((res)=>{
    var data:any=res;
    if (data.response != null && data.response.length > 0) {
      this.modalityList = data.response;
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

  get pslForm() { return this.pslreminderForm.controls; }
}
