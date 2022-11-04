import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-pend-pi-accept-liab',
  templateUrl: './pend-pi-accept-liab.component.html',
  styleUrls: ['./pend-pi-accept-liab.component.css']
})
export class PendPiAcceptLiabComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
   pendPiAcceptLiabWithoutGridForm:FormGroup;
   body:any;
   caseConditionID:number;
   createdDateTime:any;
   updatedDateTime:any;
   statusList:any=[]
   selectedStatusList:any=[];
   financialTypeList:any=[];
   selectedFinancialTypeList:any=[];
   modalityList:any=[];
   modalityCountList:any=[0, 1, 2, 3, 4, 5, 6, 7,8, 9, 10, 11,12, 13, 14, 15,16, 17,18, 19, 20];
   alertTypeList:any=[];
   reasonList:any=[];
   selectedAlertType:any;
   gridItemsUpdateList:any;
   gridItemsAddList:any;
   isGridUpdateError:boolean=false;
   isGridAddError:boolean=false
   submitted:boolean=false;
   rowIndex: any;
   constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly commonService:CommonMethodService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.pendPiAcceptLiabWithoutGridForm = this.fb.group({
      isActive: [''],
      timeToRun:[''],
      financialType: [''],
      radiusStatus: [''],
      alertType: [''],
      alertReason:[''],
      notes:[''],
      pendPiAcceptLiabWithGridForm:this.fb.array([
      //this.addPendPiAcceptLiabWithGridFormGroup()
      ]),
    });
    this.getMasterStatusNamesList();
    this.getMasterFinancialTypesList();
    this.getMasterModality();
    this.GetAllAlertTypes();
    this.getPendPiAcceptLiabWithoutGridSetting();
  }
  
  getMasterStatusNamesList(){
    this.settingsService.getMasterStatusNames(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.statusList = data.response;
      }
      else {
       this.unSuccessNotification(data);
      }
     
    },(err : any) => {
      this.errorNotification(err);
    });
  }
  getMasterModality()
  {
    this.settingsService.getMasterModalities(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.modalityList = data.response;
      }
      else {
        this.unSuccessNotification(data);
      }
    }, 
    (err : any) => {
      this.errorNotification(err);
    });
  }
  GetAllAlertTypes()
  {
    
    this.settingsService.getAlertTypes(false,1,-1).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.alertTypeList = data.response; 
      }
      else {
     //   this.unSuccessNotification(data);
      }
    }, 
    (err : any) => {
      this.errorNotification(err);
    });
  }
  getMasterFinancialTypesList() {
    this.settingsService.getMasterFinancialTypes(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.financialTypeList = data.response;
      }
      else {
        this.unSuccessNotification(data);
      }
    }, 
    (err : any) => {
      this.errorNotification(err);
    });
  }
  getPendPiAcceptLiabWithoutGridSetting()
  {
    this.settingsService.getPendPiAcceptLiabWithoutGridSetting(true).subscribe((res)=>{
      var data: any = res;
      
      if (data.response != null && data.response.length > 0) {
        this.caseConditionID = data.response[0].caseConditionID;
        this.createdDateTime = data.response[0].createdTime
        this.updatedDateTime = data.response[0].updatedTime
        this.selectedStatusList =data.response[0].radiusStatus.split(',').map(function(item) {
          return item.trim();
        });
        this.selectedFinancialTypeList =data.response[0].financialType.split(',').map(function(item) {
          return item.trim();
        });
        
        this.pendPiAcceptLiabWithoutGridForm.patchValue({
          isActive:data.response[0].isActive,
          alertType:data.response[0].alertType,
          alertReason:data.response[0].alertReason,
          notes:data.response[0].notes
        });
        if(data.response[0].alertType!='')
        {
          this.getAlertReasonsByAlertType(data.response[0].alertType);
        }
        this.getPendPiAcceptLiabWithGridSetting();
      }
      else{
        this.unSuccessNotification(data);
      }
     },(err : any) => {
      this.errorNotification(err);
    });
  }
  addPendPiAcceptLiabWithGridFormGroup(): FormGroup {
    return this.fb.group({
      id:[''],
      modalityCount: ['',[Validators.required]],
      modality: ['',[Validators.required]],
      andOrCondtion: ['',[Validators.required]],
    });
  }
  getPendPiAcceptLiabWithGridSetting()
  {
    this.settingsService.getPICreateAlertSettingGrid(true).subscribe((res)=>{
      
      if(res.response!=null)
      {
        this.pendPiAcceptLiabWithoutGridForm.setControl('pendPiAcceptLiabWithGridForm', this.setGrid(res.response));
      }
     },(err : any) => {
      this.errorNotification(err);
    });
  }
  setGrid(gridArray: any[]): FormArray {
    
    const formArray = new FormArray([]);
    gridArray.forEach(s => {
      formArray.push(this.fb.group({
        id:s.id,
        modalityCount: s.modalityCount,
        modality: s.modality,
        andOrCondtion: s.andOr
      }));
    });
    return formArray;
  }
  addGridRow(): void {
    this.pendPiAcceptLiabWithGridForm.push(this.addPendPiAcceptLiabWithGridFormGroup());
  }
  deleteGridRow(rowIndex:any){  
    
    this.rowIndex = rowIndex;
  } 

  deleteModality(){
    let id=this.pendPiAcceptLiabWithGridForm.controls[this.rowIndex].value.id;
  if(id)
  {
    this.settingsService.deletePICreateAlertSettingGridById(true,id).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.successNotification(data);
        this.getPendPiAcceptLiabWithGridSetting();
      }
      else {
        this.unSuccessNotification(data);
        this.getPendPiAcceptLiabWithGridSetting();
      }
    }, 
    (err : any) => {
      this.errorNotification(err);
    });
  }
  else{
    this.pendPiAcceptLiabWithGridForm.removeAt(this.rowIndex);
  }
  }
  
  onChangeAlertTypeDropDown(alertType:string)
  {
    
    this.getAlertReasonsByAlertType(alertType);
    
  }
  getAlertReasonsByAlertType(alertType:string)
  {
    
    this.settingsService.getAlertReasonsByAlertType(true,alertType).subscribe((res) => {
      var data: any = res;
      this.reasonList=[];
      if (data.response != null && data.response.length > 0) {
        this.reasonList = data.response;
        
      }
      else {
        this.notificationService.showNotification({
          alertHeader : '',
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
    if(!this.pendPiAcceptLiabWithoutGridForm.valid){
     return;
    } 
    this.gridItemsUpdateList=[];
    this.gridItemsAddList=[];
    let formGroupsArray:any=this.pendPiAcceptLiabWithGridForm.controls;
    formGroupsArray.forEach(s => {
      if(s.value.id)
      {
        this.gridItemsUpdateList.push(
          {
               id:s.value.id,
              modality: s.value.modality,
               modalityCount: parseInt(s.value.modalityCount),
               andOr: s.value.andOrCondtion
           }
        )
      }
      else{
        this.gridItemsAddList.push(
          {
               id: 0,
               modality: s.value.modality,
               modalityCount: parseInt(s.value.modalityCount),
               andOr: s.value.andOrCondtion
           }
        )
      }
    });
    let body=
    {
      caseConditionID:this.caseConditionID,
      // createdTime:this.createdDateTime,
      // updatedTime:this.updatedDateTime,
      radiusStatus:this.selectedStatusList.toString(),
      financialType:this.selectedFinancialTypeList.toString(),
      isActive:this.pendPiAcceptLiabWithoutGridFormControl.isActive.value,
      alertType:this.pendPiAcceptLiabWithoutGridFormControl.alertType.value,
      alertReason:this.pendPiAcceptLiabWithoutGridFormControl.alertReason.value,
      notes:this.pendPiAcceptLiabWithoutGridFormControl.notes.value
    }
    this.settingsService.updatePICreateAlertSetting(true,body).subscribe((res)=>{
       if(res.response!=null)
       {
          if(this.gridItemsUpdateList.length>0)  ////// update grid items
          {
            this.settingsService.updatePICreateAlertSettingGrid(true,this.gridItemsUpdateList).subscribe((gridUpdateRes)=>{
              if(gridUpdateRes.response!=null)
              {
                this.isGridUpdateError=false;
              }
              else
              {
                this.isGridUpdateError=true;
              }
            },(err:any)=>{
              
              this.isGridUpdateError=true;
            });
          }
          if(this.gridItemsAddList.length>0)  /////// add grid items
          {
            this.settingsService.addPICreateAlertSettingGrid(true,this.gridItemsAddList).subscribe((gridAddRes)=>{
              if(gridAddRes.response!=null)
              {
                this.isGridAddError=false;
              }
              else
              {
                this.isGridAddError=true;
              }
            },(err:any)=>{
              
              this.isGridAddError=true;
            });
          }
          if(!this.isGridUpdateError && !this.isGridAddError)
        {
           this.successNotification(res);
           this.getPendPiAcceptLiabWithoutGridSetting();
           this.getPendPiAcceptLiabWithGridSetting();
        }
        else{
          this.unSuccessNotification(res);
        }
       }
       else
       {
        this.unSuccessNotification(res);
       }
    },(err:any)=>{
      this.errorNotification(err);
    });
  }

  //// common notificaion method
  errorNotification(err:any)
  {
    this.notificationService.showNotification({
      alertHeader : err.statusText,
      alertMessage:err.message,
      alertType: err.status
    });
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
  
  get pendPiAcceptLiabWithGridForm(): FormArray {
		return this.pendPiAcceptLiabWithoutGridForm.get('pendPiAcceptLiabWithGridForm') as FormArray;
  }
  get pendPiAcceptLiabWithoutGridFormControl() { return this.pendPiAcceptLiabWithoutGridForm.controls; }
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
  }

