import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-bulk-billing-email',
  templateUrl: './bulk-billing-email.component.html',
  styleUrls: ['./bulk-billing-email.component.css']
})
export class BulkBillingEmailComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  id:number;
  bulkBillingForm:FormGroup
  submitted = false
  financialTypesList:any =[]
  docTypesList:any =[]
  selectedFinancialList:any=[]
  tempFinancialList=[]
  selectedDocList:any=[]
  tempDocList=[]

  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.bulkBillingForm = this.fb.group({
      bulkBillingPatientFinancialType: ['',[Validators.required]],
      bulkBillingCommentBox: ['',[Validators.required]],
      bulkBillingDays:['',[
        Validators.required,
        Validators.maxLength(3), 
        Validators.min(1), 
        Validators.max(999),   
        Validators.pattern(/^\d*\.?\d*$/)
    ]],
      bulkBillerServiceTime: ['',[Validators.required]],
      bulkBilllerWeekDays:['',[Validators.required]],
      isbulkBiller: [''],
      bulkBillerDocType:['',[Validators.required]]
    })
    this.getMasterFinancialTypesList()
    this.getMasterDocTypesList()
    this.getAllPatientStudySchedulingSetting()
  }

  getAllPatientStudySchedulingSetting(){
    this.settingsService.getAllPatientStudySchedulingSetting(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      
      if (data.response != null && data.response.length > 0) {
        this.tempFinancialList =data.response[0].bulkBillingPatientFinancialType.split(',')
        this.selectedFinancialList = this.tempFinancialList.map(function(a) {return a;});
        this.tempDocList =data.response[0].bulkBillerDocType.split(',')
        this.selectedDocList = this.tempDocList.map(function(a) {return a;});
        this.bulkBillingForm.patchValue({
          bulkBillingCommentBox: data.response[0].bulkBillingCommentBox,
          bulkBillingDays:data.response[0].bulkBillingDays,
          bulkBillerServiceTime: data.response[0].bulkBillerServiceTime,
          bulkBilllerWeekDays:data.response[0].bulkBilllerWeekDays,
          isbulkBiller: data.response[0].isbulkBiller
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

  getMasterDocTypesList(){
    this.settingsService.getMasterDocumentTypeList(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.docTypesList = data.response;

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
    if(!this.bulkBillingForm.valid){
     return;
    } 
     this.updatePatientStudySchedulingSetting()
  }

  updatePatientStudySchedulingSetting(){
    var body={
      "id": this.id,
      "bulkBillingPatientFinancialType": this.bbForm.bulkBillingPatientFinancialType.value.toString(),
      "bulkBillingCommentBox": this.bbForm.bulkBillingCommentBox.value,
      "bulkBillingDays": this.bbForm.bulkBillingDays.value,
      "bulkBillerServiceTime": this.bbForm.bulkBillerServiceTime.value,
      "bulkBilllerWeekDays":this.bbForm.bulkBilllerWeekDays.value,
      "isbulkBiller": this.bbForm.isbulkBiller.value,
      "bulkBillerDocType":this.bbForm.bulkBillerDocType.value.toString(),
      "tabName": "Bulk Billing Email"
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
  allowNumberOnly(event: number):boolean{
    return this.commonMethodService.alowNumberOnly(event)
  }

  get bbForm() { return this.bulkBillingForm.controls; }
  
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
