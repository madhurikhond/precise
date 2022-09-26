import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-daily-summary',
  templateUrl: './daily-summary.component.html',
  styleUrls: ['./daily-summary.component.css']
})
export class DailySummaryComponent implements OnInit {
  financialTypesList:any=[]
  statusNamesList:any=[]
  dailySummaryForm : FormGroup
  submitted=false
  id:number
  selectedStatusList:any =[];
  selectedFinancialList:any=[]
  tempFinancialList=[]
  tempStatusList=[]

  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.dailySummaryForm = this.fb.group({
      isDailySummary: [''],
      dailySummaryScheduling: ['',[Validators.required]],
      dailyStatus: ['',[Validators.required]],
      dailyFinancialType: ['',[Validators.required]],
      dailySummaryNote: ['',[Validators.required]],
    })
    this.getMasterFinancialTypesList()
    this.getMasterStatusNamesList()
    this.getAllPatientStudySchedulingSetting()
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

  getAllPatientStudySchedulingSetting(){
    this.settingsService.getAllPatientStudySchedulingSetting(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      
      if (data.response != null && data.response.length > 0) {
        this.tempFinancialList =data.response[0].dailyFinancialType.split(',')
        this.selectedFinancialList = this.tempFinancialList.map(function(a) {return a;});
        this.tempStatusList = data.response[0].dailyStatus.split(',')
        this.selectedStatusList = this.tempStatusList.map(function(a) {return a;})
        this.dailySummaryForm.patchValue({
          isDailySummary: data.response[0].isDailySummary,
          dailySummaryScheduling: data.response[0].dailySummaryScheduling,
          dailySummaryNote: data.response[0].dailySummaryNote,
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
    if(!this.dailySummaryForm.valid){
     return;
    } 
     this.updatePatientStudySchedulingSetting()
  }

  updatePatientStudySchedulingSetting(){
    var body={
      'id': this.id,
      'isDailySummary': this.dsForm.isDailySummary.value,
      'dailySummaryScheduling': this.dsForm.dailySummaryScheduling.value,
      'dailyStatus': this.dsForm.dailyStatus.value.toString(),
      'dailyFinancialType': this.dsForm.dailyFinancialType.value.toString(),
      'dailySummaryNote': this.dsForm.dailySummaryNote.value,
      'tabName': 'Daily Summary'
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
  
  onChange($event){
    
  }

  get dsForm() { return this.dailySummaryForm.controls; }
}
