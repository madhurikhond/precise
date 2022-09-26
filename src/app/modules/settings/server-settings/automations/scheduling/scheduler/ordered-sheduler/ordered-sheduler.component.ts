import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-ordered-sheduler',
  templateUrl: './ordered-sheduler.component.html',
  styleUrls: ['./ordered-sheduler.component.css']
})
export class OrderedShedulerComponent implements OnInit {
  financialTypesList:any=[]
  statusNamesList:any=[]
  id:number;
  orderSchedulerForm:FormGroup
  submitted = false;
  selectedStatusList:any =[];
  selectedFinancialList:any=[]
  tempFinancialList=[]
  tempStatusList=[]

  constructor(private fb: FormBuilder,
 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.orderSchedulerForm = this.fb.group({
      isOrderScheduler: [''],
      orderedSchedulerTimeToCheck: ['',[Validators.required]],
      orderedSchedulerFinancialType: ['',[Validators.required]],
      orderedSchedulerStatus: ['',[Validators.required]],
      orderedShedulerNote: ['',[Validators.required]]
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

  onChange($event){
    
  }
  getAllPatientStudySchedulingSetting(){
    this.settingsService.getAllPatientStudySchedulingSetting(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      
      if (data.response != null && data.response.length > 0) {
        this.tempFinancialList =data.response[0].orderedSchedulerFinancialType.split(',')
        this.selectedFinancialList = this.tempFinancialList.map(function(a) {return a;});
        this.tempStatusList = data.response[0].orderedSchedulerStatus.split(',')
        this.selectedStatusList = this.tempStatusList.map(function(a) {return a;})
        this.orderSchedulerForm.patchValue({
          isOrderScheduler: data.response[0].isOrderScheduler,
          orderedSchedulerTimeToCheck: data.response[0].orderedSchedulerTimeToCheck,
          orderedShedulerNote: data.response[0].orderedShedulerNote
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
    if(!this.orderSchedulerForm.valid){
     return;
    } 
     this.updatePatientStudySchedulingSetting()
  }

  updatePatientStudySchedulingSetting(){
    var body={
      'id': this.id,
      'isOrderScheduler': this.osForm.isOrderScheduler.value,
      'orderedSchedulerTimeToCheck': this.osForm.orderedSchedulerTimeToCheck.value,
      'orderedSchedulerFinancialType':this.osForm.orderedSchedulerFinancialType.value.toString(),
      'orderedSchedulerStatus':this.osForm.orderedSchedulerStatus.value.toString(), 
      'orderedShedulerNote': this.osForm.orderedShedulerNote.value,
      'tabName': 'Ordered Sheduler'
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

  get osForm() { return this.orderSchedulerForm.controls; }

}
