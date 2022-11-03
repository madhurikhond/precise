import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';

import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-ordered-review',
  templateUrl: './ordered-review.component.html',
  styleUrls: ['./ordered-review.component.css']
})
export class OrderedReviewComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  a3: any = 20;
  selectedStatusList:any =[];
  selectedFinancialList:any=[]
  selectedUserList:any=[]
  financialTypesList: any = [];
  statusNamesList: any = [];
  usersList:any = []
  tempFinancialList=[]
  tempStatusList=[]
  tempUserList=[]
  orderReviewForm:FormGroup;
  id:number
  submitted=false

  constructor(private fb: FormBuilder, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.orderReviewForm = this.fb.group({
      orderedReviewIsActive: [''],
      orderedReviewServiceRunFirstTime: ['', [Validators.required]],
      orderedReviewServiceRunSecondTime: ['', [Validators.required]],
      orderedReviewFinancialType: ['', [Validators.required]],
      orderedReviewStatus: ['', [Validators.required]],
      orderedReviewUserList: ['', [Validators.required]],
      orderedReviewNotes: ['', [Validators.required]]
    });
    this.getMasterFinancialTypesList()
    this.getMasterStatusNamesList()
    this.getAllUserList()
    this.getOrderReviewSettings()
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

  getAllUserList(){
    this.settingsService.getAllUserList(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.usersList = data.response;
      }
      else {
        this.usersList =[];
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

  getOrderReviewSettings(){
    this.settingsService.getAllOrderReviewSettings(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      if (data.response != null && data.response.length > 0) {
        this.tempFinancialList =data.response[0].orderedReviewFinancialType.split(',')
        this.selectedFinancialList = this.tempFinancialList.map(function(a) {return a;});
        this.tempStatusList = data.response[0].orderedReviewStatus.split(',')
        this.selectedStatusList = this.tempStatusList.map(function(a) {return a;})
        this.tempUserList = data.response[0].orderedReviewUserList.split(',')
        this.selectedUserList = this.tempUserList.map(function(a) {return a;})
        this.orderReviewForm.patchValue({
          orderedReviewIsActive: data.response[0].orderedReviewIsActive,
          orderedReviewServiceRunFirstTime: data.response[0].orderedReviewServiceRunFirstTime,
          orderedReviewServiceRunSecondTime: data.response[0].orderedReviewServiceRunSecondTime,
          orderedReviewNotes: data.response[0].orderedReviewNotes
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
    if(!this.orderReviewForm.valid){
     return;
    } 
    this.updateOrderReviewSetting()
  }

  updateOrderReviewSetting(){
    var body={
      'id': this.id,
      'orderedReviewIsActive': this.orForm.orderedReviewIsActive.value,
      'orderedReviewServiceRunFirstTime': this.orForm.orderedReviewServiceRunFirstTime.value,
      'orderedReviewServiceRunSecondTime': this.orForm.orderedReviewServiceRunSecondTime.value,
      'orderedReviewFinancialType': this.orForm.orderedReviewFinancialType.value.toString(),
      'orderedReviewStatus': this.orForm.orderedReviewStatus.value.toString(),
      'orderedReviewUserList': this.orForm.orderedReviewUserList.value.toString(),
      'orderedReviewNotes': this.orForm.orderedReviewNotes.value
    }   
    this.settingsService.updateOrderedReviewSetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getOrderReviewSettings()
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
  get orForm() { return this.orderReviewForm.controls; }

  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
