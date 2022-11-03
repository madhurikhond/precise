import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-missing-rx',
  templateUrl: './missing-rx.component.html',
  styleUrls: ['./missing-rx.component.css']
})
export class MissingRxComponent implements OnInit {
  a1: any = 20;
  missingRxForm:FormGroup
  submitted=false;
  id:number
  dayList:any=[]
  tempDayList : any =[]
  selectedDayList :any =[]

  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.missingRxForm =this.fb.group({
      isMissingRX: [''],
      missingRXServiceTime: ['',[Validators.required]],
      missingRXNote: ['',[Validators.required]],
      missingRXWeekDays: ['',[Validators.required]],
    });
    this.getDayofWeeks()
    this.getAllPatientStudySchedulingSetting()
  }

  getAllPatientStudySchedulingSetting(){
    this.settingsService.getAllPatientStudySchedulingSetting(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      
      if (data.response != null && data.response.length > 0) {
        this.tempDayList = data.response[0].missingRXWeekDays.split(',')
        this.selectedDayList = this.tempDayList.map(function(a) {return a;});
        this.missingRxForm.patchValue({
          isMissingRX:  data.response[0].isMissingRX,
          missingRXServiceTime:  data.response[0].missingRXServiceTime,
          missingRXNote:  data.response[0].missingRXNote,
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
    if(!this.missingRxForm.valid){
     return;
    } 
     this.updatePatientStudySchedulingSetting()
  }

  getDayofWeeks(){
    this.dayList = this.commonMethodService.getWeekDays()
  }

  onChange($event){
    
  }

  updatePatientStudySchedulingSetting(){
    var body={
      'id': this.id,
      'isMissingRX': this.mrxForm.isMissingRX.value,
      'missingRXServiceTime': this.mrxForm.missingRXServiceTime.value,
      'missingRXNote': this.mrxForm.missingRXNote.value,
      'missingRXWeekDays': this.mrxForm.missingRXWeekDays.value.toString(),
      'tabName': 'Missing RX'
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

  get mrxForm() { return this.missingRxForm.controls; }

  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
