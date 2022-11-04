import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-case-status',
  templateUrl: './case-status.component.html',
  styleUrls: ['./case-status.component.css']
})
export class CaseStatusComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  a3: any = 20;
  caseStatusForm:FormGroup;
  id:number
  submitted=false
  statusOrderedList:any=[];
  statusNamesList:any=[];
  financialTypeList:any=[];
  copyStatusNameList:any;
  addCaseConditionGridList:any;
  updateCaseConditionGridList:any;
  isGridUpdateError:boolean=false;
  isGridAddError:boolean=false;

  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService: SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    
    this.caseStatusForm = this.fb.group({
      arafterDay: ['', 
        [
          Validators.required,
          Validators.maxLength(3), 
          Validators.min(1), 
          Validators.max(999),   
          Validators.pattern(/^\d*\.?\d*$/)
      ]],
      areveryDay: ['', 
        [
          Validators.required,
          Validators.maxLength(3), 
          Validators.min(1), 
          Validators.max(999),   
          Validators.pattern(/^\d*\.?\d*$/)
      ]],
      arstopAfter: ['', 
        [
          Validators.required,
          Validators.maxLength(3), 
          Validators.min(1), 
          Validators.max(999),   
          Validators.pattern(/^\d*\.?\d*$/)
      ]],
      active: ['', [Validators.required]],
      sendReportAt: ['', [Validators.required]],
      pendPytmComment: ['', [Validators.required]],
      pymtSendDay1: ['', 
        [
          Validators.required,
          Validators.maxLength(3), 
          Validators.min(1), 
          Validators.max(999),   
          Validators.pattern(/^\d*\.?\d*$/)
      ]],
      pymtSendDay2: ['', 
        [
          Validators.required,
          Validators.maxLength(3), 
          Validators.min(1), 
          Validators.max(999),   
          Validators.pattern(/^\d*\.?\d*$/)
      ]],
      caseStatusGridForm:this.fb.array([
        //this.addPendPiAcceptLiabWithGridFormGroup()
        ]),
    }); 
    this.getMasterFinancialTypesList()
    this.getMasterStatusForStatusList()
    this.getMasterStatusNamesList()
    this.getCasePaymentSettings()  
    this.getCasePaymentSettingsGrid()
  }

  getCasePaymentSettings(){
    this.submitted = false
    this.settingsService.getAllCasePaymentSettings(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].paymentSettingId
      if (data.response != null) {
        this.caseStatusForm.patchValue({
          arafterDay: data.response[0].arafterDay,
          areveryDay: data.response[0].areveryDay,
          arstopAfter: data.response[0].arstopAfter,
          active: data.response[0].active,
          sendReportAt: data.response[0].sendReportAt,
          pendPytmComment: data.response[0].pendPytmComment,
          pymtSendDay1: data.response[0].pymtSendDay1,
          pymtSendDay2: data.response[0].pymtSendDay2
        });
      }
      else {
        this.notificationService.showNotification({
          alertHeader : '',
          alertMessage: data.Message,
          alertType: data.ResponseCode
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
    addCaseStatusWithGridFormGroup(): FormGroup 
  {
      return this.fb.group({
        caseConditionID:[''],
        financialtypename:['',[Validators.required]],
        statusOrder: ['',[Validators.required]],
        andOr:  ['',[Validators.required]],
        statusNames:  ['',[Validators.required]],
        associationID:  [''],
      });
  }

  getMasterFinancialTypesList(){
    this.settingsService.getMasterFinancialTypes(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.financialTypeList = data.response;

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

  getMasterStatusForStatusList(){
    this.settingsService.getStatusForStatusOrder(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.statusOrderedList = data.response;

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

  getCasePaymentSettingsGrid(){
    this.submitted = false
    this.settingsService.getAllArPaymentCaseCondtitionsGrid(true).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.caseStatusForm.setControl('caseStatusGridForm', this.setGrid(data.response));
      }
      else {
        this.notificationService.showNotification({
          alertHeader : '',
          alertMessage: data.Message,
          alertType: data.ResponseCode
        });
        const arr = <FormArray>this.caseStatusForm.controls.caseStatusGridForm;
        arr.controls = [];
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

  allowNumberOnly(event:number):boolean{
    return this.commonMethodService.alowNumberOnly(event)
  }

  onSubmit(){
    this.submitted = true
    if(!this.caseStatusForm.valid){
     return;
    }  
    this.updatePaymentCaseSetting()
  }

  updatePaymentCaseSetting(){
    var body={
      'paymentSettingId': this.id,
      'arafterDay': this.caseStatusFormControl.arafterDay.value.toString(),
      'areveryDay': this.caseStatusFormControl.areveryDay.value.toString(),
      'arstopAfter': this.caseStatusFormControl.arstopAfter.value.toString(),
      'arupdate': new Date().toISOString(),
      'active': this.caseStatusFormControl.active.value,
      'sendReportAt': this.caseStatusFormControl.sendReportAt.value,
      'pendPytmComment': this.caseStatusFormControl.pendPytmComment.value.toString(),
      'pymtSendDay1': this.caseStatusFormControl.pymtSendDay1.value.toString(),
      'pymtSendDay2': this.caseStatusFormControl.pymtSendDay2.value.toString()
    }   
    this.settingsService.updatePaymentCaseSetting(true, body).subscribe((res : any) => {
      if (res) { 
        this.getCasePaymentSettings()
        this.updatePaymentCaseSettingGrid();
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

  updatePaymentCaseSettingGrid(){
    this.updateCaseConditionGridList=[];
    this.addCaseConditionGridList=[];
    let formGroups:any=this.caseStatusGridForm.controls;    
    formGroups.forEach(s => {
      let statusOrderObjList=[];
          s.value.statusNames.forEach(p=>{
            this.copyStatusNameList=[];
            this.copyStatusNameList=this.statusNamesList;
          let item= this.copyStatusNameList.find(i => i.status === p);
          statusOrderObjList.push(item);
         });
      if(s.value.caseConditionID)
      {
        this.updateCaseConditionGridList.push(
          {
            caseConditionID: s.value.caseConditionID,
            financialType:s.controls.financialtypename.value.toString(),
            status:s.controls.statusOrder.value.toString(),
            isAnd:s.value.andOr=='AND'? true: false,
            isOR:s.value.andOr=='OR'? true: false,
            associationID:'1',
            statusOrder: statusOrderObjList
           }
        )
      }
      else{
        this.addCaseConditionGridList.push(
          {
            caseConditionID: s.value.caseConditionID,
            financialType:s.controls.financialtypename.value.toString(),
            status:s.controls.statusOrder.value.toString(),
            isAnd:s.value.andOr=='AND'? true: false,
            isOR:s.value.andOr=='OR'? true: false,
            associationID:'1',
            statusOrder: statusOrderObjList,
            playerType : '',
            ConditionId : '',
            AssociationId : '1',
            ConditionQuery : '',
            ArexportActive : '',
            ArexportServer : ''
           }
        )
      }
    });
    if(this.updateCaseConditionGridList.length > 0){
      this.settingsService.updateArPaymentCaseCondtitionGrid(true, this.updateCaseConditionGridList).subscribe((res : any) => {
        if (res) { 
         // this.getCasePaymentSettingsGrid()
          
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
    if(this.addCaseConditionGridList.length > 0){
      this.settingsService.addArPaymentCaseCondtitionGrid(true, this.addCaseConditionGridList).subscribe((res : any) => {
        if (res) { 
         // this.getCasePaymentSettingsGrid()
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
    this.getCasePaymentSettingsGrid();
  }

  deleteGridRow(rowIndex: number) {
    if(this.caseStatusGridForm.controls[rowIndex].value.caseConditionID)
    {
      let caseConditionID=this.caseStatusGridForm.controls[rowIndex].value.caseConditionID;
       this.settingsService.deleteARPaymentCaseConditionById(true,caseConditionID).subscribe((res)=>{
          if(res.response!=null)
          {
            this.successNotification(res);
          }
          else{
            this.unSuccessNotification(res);
          }
       },(err:any)=>{
        this.notificationService.showNotification({
          alertHeader : err.statusText,
          alertMessage:err.message,
          alertType: err.status
        });
      });
    }
      this.caseStatusGridForm.removeAt(rowIndex);
  }

  setGrid(gridArray: any[]): FormArray {
   
    const formArray = new FormArray([]);
    let i=0;
    gridArray.forEach(s => {
      
      let selectedStatusOrder=s.status.split(',').map(function(item) {
        return item.trim();
      });
      let selectedFinancialType=s.financialType.split(',').map(function(item) {
        return item.trim();
      });
      let selectedStatusNames=s.statusorder.split(',').map(function(item) {
        return item.trim();
      });
      formArray.push(this.fb.group({
        caseConditionID:s.caseConditionId,
        financialtypename:'',
        statusOrder:'',
        andOr:s.isAnd==1 ? 'AND': 'OR',
        statusNames:'',
        associationID:s.associationID
      }));
     let fb= <FormGroup>formArray.controls[i];
     fb.controls.financialtypename.setValue(selectedFinancialType);
     fb.controls.statusOrder.setValue(selectedStatusOrder);
     fb.controls.statusNames.setValue(selectedStatusNames);
     i=i+1;
    }
   );
    return formArray;
  }

  successNotification(res:any)
  {
    
    this.notificationService.showNotification({
      alertHeader : 'Success',
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }
  unSuccessNotification(res:any)
  {
    this.notificationService.showNotification({
      alertHeader : 'Something went wrong.',
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }

  addGridRow(): void {
    this.caseStatusGridForm.push(this.addCaseStatusWithGridFormGroup());
  }

  get caseStatusFormControl() { return this.caseStatusForm.controls; }
  get caseStatusGridForm(): FormArray {
    return this.caseStatusForm.get('caseStatusGridForm') as FormArray;
  }
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
