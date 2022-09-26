import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-ref-study-sum',
  templateUrl: './ref-study-sum.component.html',
  styleUrls: ['./ref-study-sum.component.css']
})
export class RefStudySumComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  a3: any = 20;
  a4: any = 20;
  a5: any = 20;
  a6: any = 20;
  a7: any = 20;
  a8: any = 20;
  modalityList:any=[]
  statusNamesList:any=[]
  financialTypesList:any=[]
  refStudyForm:FormGroup;
  id:number
  tempFinancialList=[]
  tempFinancialList1=[]
  tempFinancialList2=[]
  tempStatusList=[]
  tempStatusList1=[]
  tempStatusList2=[]
  tempStatusList3=[]
  selectedStatusList:any =[];
  selectedStatusList1:any =[];
  selectedStatusList2:any =[];
  selectedStatusList3:any =[];
  selectedFinancialList:any=[]
  selectedFinancialList1:any=[]
  selectedFinancialList2:any=[]
  tempModalityList:any=[]
  selectedModalityList :any =[]
  submitted=false
  readonly dateTimeFormatCustom = DateTimeFormatCustom;

  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.refStudyForm = this.fb.group({
        isRefStudySum: [''],
        studyStatus: ['',[Validators.required]],
        studyMOdality: ['',[Validators.required]],
        cutofDate: ['',[Validators.required]],
        initialReminder: ['',[Validators.required]],
        comment: ['',[Validators.required]],
        cannotScheduleStatus: ['',[Validators.required]],
        appointmentStatus: ['',[Validators.required]],
        scheduledFinacialType: ['',[Validators.required]],
        cannotScheduledFinacialType:['',[Validators.required]],
        cannotCutOff:['',[Validators.required]],
        noShowFinacialType: ['',[Validators.required]],
        noShowStatus: ['',[Validators.required]],
        noShowCutOff: ['',[Validators.required]]
    });
    this.getMasterFinancialTypesList()
    this.getMasterModalityList()
    this.getMasterStatusNamesList()
    this.getAllrefStudySettings()
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

  getAllrefStudySettings(){
    this.settingsService.getAllRefStudySettings(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      if (data.response != null && data.response.length > 0) {
        this.tempFinancialList =data.response[0].scheduledFinacialType.split(',')
        this.selectedFinancialList = this.tempFinancialList.map(function(a) {return a;});

        this.tempFinancialList1 =data.response[0].cannotScheduledFinacialType.split(',')
        this.selectedFinancialList1 = this.tempFinancialList1.map(function(a) {return a;});

        this.tempFinancialList2 =data.response[0].noShowFinacialType.split(',')
        this.selectedFinancialList2 = this.tempFinancialList2.map(function(a) {return a;});

        this.tempStatusList = data.response[0].studyStatus.split(',')
        this.selectedStatusList = this.tempStatusList.map(function(a) {return a;})

        this.tempStatusList1 = data.response[0].cannotScheduleStatus.split(',')
        this.selectedStatusList1 = this.tempStatusList1.map(function(a) {return a;})

        this.tempStatusList2 = data.response[0].noShowStatus.split(',')
        this.selectedStatusList2 = this.tempStatusList2.map(function(a) {return a;})

        this.tempStatusList3 = data.response[0].appointmentStatus.split(',')
        this.selectedStatusList3 = this.tempStatusList3.map(function(a) {return a;})

        this.tempModalityList = data.response[0].studyMOdality.split(',')
        this.selectedModalityList = this.tempModalityList.map(function(a) {return a;})

        this.refStudyForm.patchValue({
          isRefStudySum: data.response[0].isRefStudySum,
          cutofDate: data.response[0].cutofDate,
          initialReminder: data.response[0].initialReminder,
          comment: data.response[0].comment,
          cannotCutOff:data.response[0].cannotCutOff,
          noShowCutOff: data.response[0].noShowCutOff
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
    if(!this.refStudyForm.valid){
     return;
    } 
    else{
    this.updaterefStatusSetting()
    }
  }

  updaterefStatusSetting(){
    var body={
      'id': this.id,
      'isRefStudySum': this.refForm.isRefStudySum.value,
      'studyStatus': this.refForm.studyStatus.value.toString(),
      'studyMOdality': this.refForm.studyMOdality.value.toString(),
      'cutofDate': this.refForm.cutofDate.value,
      'initialReminder': this.refForm.initialReminder.value,
      'comment': this.refForm.comment.value,
      'cannotScheduleStatus': this.refForm.cannotScheduleStatus.value.toString(),
      'appointmentStatus': this.refForm.appointmentStatus.value.toString(),
      'scheduledFinacialType': this.refForm.scheduledFinacialType.value.toString(),
      'cannotScheduledFinacialType': this.refForm.cannotScheduledFinacialType.value.toString(),
      'cannotCutOff': this.refForm.cannotCutOff.value,
      'noShowFinacialType': this.refForm.noShowFinacialType.value.toString(),
      'noShowStatus': this.refForm.noShowStatus.value.toString(),
      'noShowCutOff': this.refForm.noShowCutOff.value,
    }   
    this.settingsService.updateRefStudySetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getAllrefStudySettings()
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
  get refForm() { return this.refStudyForm.controls; }
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
