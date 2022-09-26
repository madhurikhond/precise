import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-functionality',
  templateUrl: './functionality.component.html',
  styleUrls: ['./functionality.component.css']
})
export class FunctionalityComponent implements OnInit {
  id:number;
  functionalityForm:FormGroup
  submitted = false
  
  constructor(private fb: FormBuilder, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

    
  ngOnInit(): void {
    this.functionalityForm = this.fb.group({
      isFunctional: [''],
      functionalServiceTime:['',[Validators.required]],
      functionalEmails: ['',[Validators.required, Validators.email]],
      functionalNote: ['',[Validators.required]],
    })
    this.getAllPatientStudySchedulingSetting()
  }
  getAllPatientStudySchedulingSetting(){
    this.settingsService.getAllPatientStudySchedulingSetting(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      
      if (data.response != null && data.response.length > 0) {
        this.functionalityForm.patchValue({
          isFunctional: data.response[0].isFunctional,
          functionalServiceTime:data.response[0].functionalServiceTime,
          functionalEmails: data.response[0].functionalEmails,
          functionalNote: data.response[0].functionalNote
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
    if(!this.functionalityForm.valid){
     return;
    } 
     this.updatePatientStudySchedulingSetting()
  }

  updatePatientStudySchedulingSetting(){
    var body={
      'id': this.id,
      'isFunctional': this.functionForm.isFunctional.value,
      'functionalServiceTime': this.functionForm.functionalServiceTime.value,
      'functionalEmails':this.functionForm.functionalEmails.value ,
      'functionalNote':this.functionForm.functionalNote.value ,      
      'tabName': 'Functionality'
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

  get functionForm() { return this.functionalityForm.controls; }
}
