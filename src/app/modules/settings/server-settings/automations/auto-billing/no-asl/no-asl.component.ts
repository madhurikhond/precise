import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-no-asl',
  templateUrl: './no-asl.component.html',
  styleUrls: ['./no-asl.component.css']
})
export class NoAslComponent implements OnInit {
  a1: any = 20;
  financialTypesList:any =[]
  noaslForm:FormGroup;
  id:number
  tempFinancialList:any=[]
  selectedFinancialList:any=[]
  submitted=false

  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.noaslForm = this.fb.group({
      financialType: ['',[Validators.required]],
      days: ['',[
        Validators.required,
        Validators.maxLength(3), 
        Validators.min(1), 
        Validators.max(999),   
        Validators.pattern(/^\d*\.?\d*$/)
    ]],
    });
    this.getMasterFinancialTypesList()
    this.getNoAslDetail()
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

  allowNumberOnly(event:any): boolean{
    return this.commonMethodService.alowNumberOnly(event);
  }

  getNoAslDetail(){
    this.settingsService.getAllNoPslDetailSettings(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].noPsldetailSettingId
      
      if (data.response != null && data.response.length > 0) {
        this.tempFinancialList =data.response[0].financialType.split(',')
        this.selectedFinancialList = this.tempFinancialList.map(function(a) {return a;});
        this.noaslForm.patchValue({
          days: data.response[0].days,
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

  onSubmit(){
    this.submitted = true
    if(!this.noaslForm.valid){
     return;
    } 
     this.updateNoAslDetailSetting()
  }

  updateNoAslDetailSetting(){
    var body={
      'noPsldetailSettingId': this.id,
      'financialType': this.noForm.financialType.value.toString(),
      'days': this.noForm.days.value.toString(),
      'status': null
    }   
    this.settingsService.updateNoPslDetailSetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getNoAslDetail()
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

  get noForm() { return this.noaslForm.controls; }
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
