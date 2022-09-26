import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-cannot-schedule',
  templateUrl: './cannot-schedule.component.html',
  styleUrls: ['./cannot-schedule.component.css']
})
export class CannotScheduleComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  a3: any = 20;
  a4: any = 20;
  cannotScheduleForm : FormGroup
  id:number;
  submitted = false
  statusNamesList:any=[]
  selectedStatusList:any =[];
  tempStatusList=[]
  selectedStatusList1:any =[];
  tempStatusList1=[]
  selectedStatusList2:any =[];
  tempStatusList2=[]
  masterNameList:any=[]
  tempPriorityList=[]
  selectedPriorityList=[]

  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.cannotScheduleForm = this.fb.group({
      isScheduleActive: [''],
      statusSchedule: ['',[Validators.required]],
      secondCriteriaSchedule: [''],
      statusSecondSchedule: ['',[Validators.required]],
      prioritySchedule: ['',[Validators.required]],
      initialreminderAfterSchedule: ['',[Validators.required]],
      firstreminderDaysSchedule: ['',[
        Validators.required,
        Validators.maxLength(3), 
        Validators.min(1), 
        Validators.max(999),   
        Validators.pattern(/^\d*\.?\d*$/)
    ]],
      secondreminderDaysSchedule: ['',[
        Validators.required,
        Validators.maxLength(3), 
        Validators.min(1), 
        Validators.max(999),   
        Validators.pattern(/^\d*\.?\d*$/)
    ]],
      thirdreminderDaysSchedule: ['',[
        Validators.required,
        Validators.maxLength(3), 
        Validators.min(1), 
        Validators.max(999),   
        Validators.pattern(/^\d*\.?\d*$/)
    ]],
      fourthreminderDaysSchedule: ['',[
        Validators.required,
        Validators.maxLength(3), 
        Validators.min(1), 
        Validators.max(999),   
        Validators.pattern(/^\d*\.?\d*$/)
    ]],
      firstreminderAfterSchedule: ['',[Validators.required]],
      secondreminderAfterSchedule: ['',[Validators.required]],
      thirdreminderAfterSchedule: ['',[Validators.required]],
      fourthreminderAfterSchedule: ['',[Validators.required]],
      feIsActive: [''],
      faxEmailStatus: ['',[Validators.required]],
      faxEmailInitialAppointment: ['',[Validators.required]],
      comment:['',[Validators.required]]
    });
    this.getMasterStatusNamesList()
    this.getMasterPriorityNamesList()
    this.getSmsSettings()
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

  getMasterPriorityNamesList(){
    this.settingsService.getMasterPriorityNames(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.masterNameList = data.response;
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

  getSmsSettings(){
    this.settingsService.getAllSMSSettings(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[1].id
      if (data.response != null && data.response.length > 0) {
        this.tempStatusList = data.response[1].statusSchedule.split(',')
        this.selectedStatusList = this.tempStatusList.map(function(a) {return a;})
        this.tempStatusList1 = data.response[1].statusSecondSchedule.split(',')
        this.selectedStatusList1 = this.tempStatusList1.map(function(a) {return a;})
        this.tempStatusList2 = data.response[1].faxEmailStatus.split(',')
        this.selectedStatusList2 = this.tempStatusList2.map(function(a) {return a;})
        this.tempPriorityList = data.response[1].prioritySchedule.split(',')
        this.selectedPriorityList = this.tempPriorityList.map(function(a) {return a;})
        this.cannotScheduleForm.patchValue({
          isScheduleActive: data.response[1].isScheduleActive,
          secondCriteriaSchedule: data.response[1].secondCriteriaSchedule,
          initialreminderAfterSchedule: data.response[1].initialreminderAfterSchedule,
          firstreminderDaysSchedule: data.response[1].firstreminderDaysSchedule,
          secondreminderDaysSchedule: data.response[1].secondreminderDaysSchedule,
          thirdreminderDaysSchedule: data.response[1].thirdreminderDaysSchedule,
          fourthreminderDaysSchedule: data.response[1].fourthreminderDaysSchedule,
          firstreminderAfterSchedule: data.response[1].firstreminderAfterSchedule,
          secondreminderAfterSchedule: data.response[1].secondreminderAfterSchedule,
          thirdreminderAfterSchedule: data.response[1].thirdreminderAfterSchedule,
          fourthreminderAfterSchedule: data.response[1].fourthreminderAfterSchedule,
          feIsActive: data.response[1].feIsActive,
          faxEmailInitialAppointment: data.response[1].faxEmailInitialAppointment,
          comment:data.response[1].comment
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

  allowNumberOnly(event:any): boolean
  {
    return this.commonMethodService.alowNumberOnly(event);
  }

  onSubmit(){
    this.submitted = true
    if(!this.cannotScheduleForm.valid){
     return;
    } 
    else{
    this.updateSmsSetting()
    }
  }

  updateSmsSetting(){
    var body={
      'id': this.id,
      'reminderType': 'CannotSchedule',
      'isScheduleActive': this.csForm.isScheduleActive.value,
      'statusSchedule': this.csForm.statusSchedule.value.toString(),
      'secondCriteriaSchedule': this.csForm.secondCriteriaSchedule.value,
      'statusSecondSchedule': this.csForm.statusSecondSchedule.value.toString(),
      'prioritySchedule': this.csForm.prioritySchedule.value.toString(),
      'initialreminderAfterSchedule': this.csForm.initialreminderAfterSchedule.value,
      'firstreminderDaysSchedule': parseInt(this.csForm.firstreminderDaysSchedule.value),
      'secondreminderDaysSchedule': parseInt(this.csForm.secondreminderDaysSchedule.value),
      'thirdreminderDaysSchedule': parseInt(this.csForm.thirdreminderDaysSchedule.value),
      'fourthreminderDaysSchedule': parseInt(this.csForm.fourthreminderDaysSchedule.value),
      'firstreminderAfterSchedule': this.csForm.firstreminderAfterSchedule.value,
      'secondreminderAfterSchedule': this.csForm.secondreminderAfterSchedule.value,
      'thirdreminderAfterSchedule': this.csForm.thirdreminderAfterSchedule.value,
      'fourthreminderAfterSchedule': this.csForm.fourthreminderAfterSchedule.value,
      'feIsActive': this.csForm.feIsActive.value,
      'faxEmailStatus': this.csForm.faxEmailStatus.value.toString(),
      'faxEmailInitialAppointment': this.csForm.faxEmailInitialAppointment.value,
      'comment': this.csForm.comment.value,
      'tabName': 'Cannot Schedule'
    }   
    this.settingsService.updateSmsSetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getSmsSettings()
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
  get csForm() { return this.cannotScheduleForm.controls; }
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
