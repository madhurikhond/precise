import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-patient-schedule-setting',
  templateUrl: './patient-schedule-setting.component.html',
  styleUrls: ['./patient-schedule-setting.component.css']
})
export class PatientScheduleSettingComponent implements OnInit {
  id:number;
  patientForm:FormGroup
  submitted = false

  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      firstpatientscheduletime: ['',[Validators.required]],
      secondpatientscheduletime:['',[Validators.required]],
      ispatientstudyactive: [''],
      comment: ['',[Validators.required]],
      rxNotificationEmail: ['',[Validators.required, Validators.email]],
    })
    this.getAllPatientStudySchedulingSetting()
    
  }

  getAllPatientStudySchedulingSetting(){
    this.settingsService.getAllPatientStudySchedulingSetting(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      
      if (data.response != null && data.response.length > 0) {
        this.patientForm.patchValue({
          firstpatientscheduletime: data.response[0].firstpatientscheduletime,
          secondpatientscheduletime: data.response[0].secondpatientscheduletime,
          ispatientstudyactive: data.response[0].ispatientstudyactive,
          comment: data.response[0].comment,
          rxNotificationEmail: data.response[0].rxNotificationEmail,
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
    if(!this.patientForm.valid){
     return;
    } 
     this.updatePatientStudySchedulingSetting()
  }

  updatePatientStudySchedulingSetting(){
    var body={
      'id': this.id,
      'firstpatientscheduletime': this.psForm.firstpatientscheduletime.value,
      'secondpatientscheduletime': this.psForm.secondpatientscheduletime.value,
      'ispatientstudyactive': this.psForm.ispatientstudyactive.value,
      'comment': this.psForm.comment.value,
      'rxNotificationEmail': this.psForm.rxNotificationEmail.value,
      'tabName': 'Patient Schedule Setting'
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

  get psForm() { return this.patientForm.controls; }
}
