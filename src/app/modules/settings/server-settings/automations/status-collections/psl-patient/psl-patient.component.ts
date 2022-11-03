import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-psl-patient',
  templateUrl: './psl-patient.component.html',
  styleUrls: ['./psl-patient.component.css']
})
export class PslPatientComponent implements OnInit {
  a1: any = 20;
  id:number;
  pslForm:FormGroup
  submitted = false
  selectedFinancialList:any=[]
  tempFinancialList=[]
  financialTypesList:any=[]

  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.pslForm = this.fb.group({
      pslPatientFinancialType: ['',[Validators.required]],
      showCompleteStudy:['',[
        Validators.required,
        Validators.maxLength(3), 
        Validators.min(1), 
        Validators.max(999),   
        Validators.pattern(/^\d*\.?\d*$/)
    ]],
    removeCompleteStudy:['',[
        Validators.required,
        Validators.maxLength(3), 
        Validators.min(1), 
        Validators.max(999),   
        Validators.pattern(/^\d*\.?\d*$/)
    ]],
    completeStudyMissingLienNote: ['',[Validators.required]]
  });
  this.getMasterFinancialTypesList()
  this.getAllPatientStudySchedulingSetting()
  }

  getAllPatientStudySchedulingSetting(){
    this.settingsService.getAllPatientStudySchedulingSetting(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      
      if (data.response != null && data.response.length > 0) {
        this.tempFinancialList =data.response[0].pslPatientFinancialType.split(',')
        this.selectedFinancialList = this.tempFinancialList.map(function(a) {return a;});
        this.pslForm.patchValue({
          showCompleteStudy:data.response[0].showCompleteStudy,
          removeCompleteStudy:data.response[0].removeCompleteStudy,
          completeStudyMissingLienNote:data.response[0].completeStudyMissingLienNote,
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

  onSubmit(){
    this.submitted = true
    if(!this.pslForm.valid){
     return;
    } 
     this.updatePatientStudySchedulingSetting()
  }

  allowNumberOnly(event:number):boolean{

    return this.commonMethodService.alowNumberOnly(event)
  }

  updatePatientStudySchedulingSetting(){
    var body={
      "id": this.id,
      "showCompleteStudy": this.ppForm.showCompleteStudy.value,
      "removeCompleteStudy": this.ppForm.removeCompleteStudy.value,
      "pslPatientFinancialType": this.ppForm.pslPatientFinancialType.value.toString(),
      "completeStudyMissingLienNote": this.ppForm.completeStudyMissingLienNote.value,
      "tabName": "PSL Patient"
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

  get ppForm() { return this.pslForm.controls; }
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
