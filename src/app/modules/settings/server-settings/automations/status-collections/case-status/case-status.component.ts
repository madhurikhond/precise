import { Component, OnInit } from '@angular/core';
import { FormArray,FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  id:number;
  caseStatusForm:FormGroup;
  submitted = false;
  statusOrderedList:any=[];
  statusNamesList:any=[];
  financialTypeList:any=[];
  copyStatusNameList:any;
  addCaseConditionGridList:any;
  updateCaseConditionGridList:any;
  isGridUpdateError:boolean=false;
  isGridAddError:boolean=false;
  
  
  constructor(private fb: FormBuilder, private readonly commonMethodService: CommonMethodService,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    debugger;
    this.caseStatusForm = this.fb.group({
      caseServiceActive:[''],
      sendStatusTime:['',[Validators.required]],
      caseComment:['',[Validators.required]],
      caseStatusGridForm:this.fb.array([
        this.addCaseStatusGridFormGroup()
        ])
    });
    this.getStatusForStatusOrder();
    this.getMasterFinancialTypesList();
    this.getStatusNames();
    this.getAllPatientStudySchedulingSetting();
    this.getCaseConditionByAssociationId();
  }
  getStatusForStatusOrder(){
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
     
    },(err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }
  getStatusNames(){
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
     
    },(err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }
  getMasterFinancialTypesList() {
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
  getAllPatientStudySchedulingSetting(){
    this.settingsService.getAllPatientStudySchedulingSetting(true).subscribe((res) => {
      var data: any = res;
      this.id = data.response[0].id
      
      if (data.response != null && data.response.length > 0) {
        this.caseStatusForm.patchValue({
          caseServiceActive:data.response[0].caseServiceActive,
          sendStatusTime:data.response[0].sendStatusTime,
          caseComment:data.response[0].caseComment
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
  addCaseStatusGridFormGroup(): FormGroup 
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
  
 

  updatePatientStudySchedulingSetting(){
    var body={
      "id": this.id,
      "caseServiceActive":this.caseStatusFormControl.caseServiceActive.value,
      "sendStatusTime":this.caseStatusFormControl.sendStatusTime.value,
      "caseComment":this.caseStatusFormControl.caseComment.value,
      "tabName": "Case Status"
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
  getCaseConditionByAssociationId()
  {
    
    this.settingsService.getCaseConditionByAssociationId(true,1).subscribe((res)=>{
      var data: any = res;
      this.caseStatusForm.setControl('caseStatusGridForm', this.setGrid(data.response));
     },(err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }
  setGrid(gridArray: any[]): FormArray {
    const formArray = new FormArray([]);
    let i=0;
    gridArray.forEach(s => {
      
      let selectedStatusOrder=s.status.split(',').map(function(item) {
        return item.trim();
      });
      let selectedFinancialType=s.financialtypename.split(',').map(function(item) {
        return item.trim();
      });
      let selectedStatusNames=s.statusOrder.split(',').map(function(item) {
        return item.trim();
      });
      formArray.push(this.fb.group({
        caseConditionID:s.caseConditionID,
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
    let fg = this.addCaseStatusGridFormGroup();
		this.caseStatusGridForm.push(fg);
  }

  deleteGridRow(rowIndex: number) {
    
    if(this.caseStatusGridForm.controls[rowIndex].value.caseConditionID)
    {
      let caseConditionID=this.caseStatusGridForm.controls[rowIndex].value.caseConditionID;
       this.settingsService.deleteCaseConditionById(true,caseConditionID).subscribe((res)=>{
          if(res.response!=null)
          {
            this.successNotification(res);
            this.getAllPatientStudySchedulingSetting();
           this.getCaseConditionByAssociationId();
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
    else{
      this.caseStatusGridForm.removeAt(rowIndex);
    }
  }
  onSubmit(){
    this.submitted = true
    if(!this.caseStatusForm.valid){
     return;
    } 
     //this.updatePatientStudySchedulingSetting()
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
            financialtypename:s.controls.financialtypename.value.toString(),
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
            caseConditionID: 0,
            financialtypename:s.controls.financialtypename.value.toString(),
            status:s.controls.statusOrder.value.toString(),
            isAnd:s.value.andOr=='AND'? true: false,
            isOR:s.value.andOr=='OR'? true: false,
            associationID:'1',
            statusOrder: statusOrderObjList
           }
        )
      }
    });
    var body={
      "id": this.id,
      "caseServiceActive":this.caseStatusFormControl.caseServiceActive.value,
      "sendStatusTime":this.caseStatusFormControl.sendStatusTime.value,
      "caseComment":this.caseStatusFormControl.caseComment.value,
      "tabName": "Case Status"
    } 
    this.settingsService.UpdatePatientStudySchedulingSetting(true,body).subscribe((res)=>{
      if(res.response!=null)
      {
        if(this.updateCaseConditionGridList.length>0)
        {
          this.settingsService.updateCaseCondition(true,this.updateCaseConditionGridList).subscribe((updateGridRes)=>{
            
               if(updateGridRes.response!=null)
               {
                 this.isGridUpdateError=false; 
               }
               else{
                this.isGridUpdateError=true; 
               }
          },(err:any)=>{
            this.isGridUpdateError=true; 
          });
        }
        if(this.addCaseConditionGridList.length>0)
        {
          this.settingsService.addCaseCondition(true,this.addCaseConditionGridList).subscribe((addGridRes)=>{
            
               if(addGridRes.response!=null)
               {
                this.isGridAddError=false;
               }
               else{
                this.isGridAddError=true;
               }
          },(err:any)=>{
            this.isGridAddError=true;
          });
        }
        if(!this.isGridAddError && !this.isGridAddError)
        {
           this.successNotification(res);
           this.getAllPatientStudySchedulingSetting();
           this.getCaseConditionByAssociationId();
        }
        else{
          this.unSuccessNotification(res);
        }
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
