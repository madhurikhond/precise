import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-personell',
  templateUrl: './personell.component.html',
  styleUrls: ['./personell.component.css']
})
export class PersonellComponent implements OnInit {
  personellForm:FormGroup;
  patientDropDownValue:string;
  isFormSubmitted:boolean=false;
  statusOrderedList:any=[];
  financialTypeList:any=[];
  addPersonellGridList:any;
  updatePersonellGridList:any;
  isGridUpdateError:boolean=false;
  isGridAddError:boolean=false;
  constructor(private fb: FormBuilder,
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.personellForm = this.fb.group({
      id:[''],
      callAttAfterDay: [''],
      callAttEveryDay:[''],
      callRefDocAfterDay: [''],
      callPatAfterDay: [''],
      callPatDrop: [''],
      casePersonellComment:[''],
      personellGridForm:this.fb.array([
        //this.addPersonellGridFormGroup()
        ]),
      
    });
    this.getStatusForStatusOrder();
    this.getMasterFinancialTypesList();
    this.getPersonell();
    this.getCaseConditionByAssociationId();
  }
  getStatusForStatusOrder(){
    this.settingsService.getStatusForStatusOrder(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.statusOrderedList = data.response;
      }
      else {
        this.recordNotFoundNotification(data);
      }
     
    },(err : any) => {
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
        this.recordNotFoundNotification(data);
      }
    }, 
    (err : any) => {
      this.errorNotification(err);
    });
  }
  getPersonell()
  {
    this.settingsService.GetAllPatientStudySchedulingSetting(true).subscribe((res)=>{
      
      if(res.response[0]!=null)
      {
        this.patientDropDownValue=res.response[0].callPatDrop
        this.personellForm.patchValue({
          id:res.response[0].id,
          callAttAfterDay:res.response[0].callAttAfterDay,
          callAttEveryDay:res.response[0].callAttEveryDay,
          callRefDocAfterDay:res.response[0].callRefDocAfterDay,
          callPatAfterDay:res.response[0].callPatAfterDay,
          casePersonellComment:res.response[0].casePersonellComment,
        });
      }
      else{
        this.recordNotFoundNotification(res);
      }
     },(err : any) => {
      this.errorNotification(err);
    });
  }
  
  getCaseConditionByAssociationId()
  {
    this.settingsService.getCaseConditionByAssociationId(true,2).subscribe((res)=>{
      var data: any = res;
      this.personellForm.setControl('personellGridForm', this.setGrid(data.response));
     },(err : any) => {
      this.errorNotification(err);
    });
  }
  addGridRow(): void {
    let fg = this.addPersonellGridFormGroup();
		this.personellGridForm.push(fg);
  }
  deleteGridRow(rowIndex: number) {
    if(this.personellGridForm.controls[rowIndex].value.caseConditionID)
    {
      let caseConditionID=this.personellGridForm.controls[rowIndex].value.caseConditionID;
       this.settingsService.deleteCaseConditionById(true,caseConditionID).subscribe((res)=>{
          if(res.response!=null)
          {
            this.successNotification(res);
            this.getPersonell();
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
      this.personellGridForm.removeAt(rowIndex);
    }
  }
  addPersonellGridFormGroup(): FormGroup 
  {
      return this.fb.group({
        caseConditionID:[''],
        financialtypename:['',[Validators.required]],
        status: ['',[Validators.required]],
        andOr:  ['',[Validators.required]],
        associationID:  [''],
      });
  }
  setGrid(gridArray: any[]): FormArray {
    
    const formArray = new FormArray([]);
    let i=0;
    gridArray.forEach(s => {
      
      let selectedStatus=s.status.split(',').map(function(item) {
        return item.trim();
      });
      let selectedFinancialType=s.financialtypename.split(',').map(function(item) {
        return item.trim();
      });
      formArray.push(this.fb.group({
        caseConditionID:s.caseConditionID,
        financialtypename:'',
        status:'',
        andOr:s.isAnd==1 ? 'AND': 'OR',
        associationID:s.associationID
      }));
     let fb= <FormGroup>formArray.controls[i];
     fb.controls.financialtypename.setValue(selectedFinancialType);
     fb.controls.status.setValue(selectedStatus);
      i=i+1;
    }
   );
    return formArray;
  }

  onChangedPatientDropDown(value:any)
  {
    this.patientDropDownValue = value;
  }

  onSubmit(){
    this.isFormSubmitted = true
    if(!this.personellForm.valid){
     return;
    }
    this.updatePersonellGridList=[];
    this.addPersonellGridList=[];
    let formGroups:any=this.personellGridForm.controls;
    formGroups.forEach(s => {
      if(s.value.caseConditionID)
      {
        this.updatePersonellGridList.push(
          {
            caseConditionID: s.value.caseConditionID,
            financialtypename:s.controls.financialtypename.value.toString(),
            status:s.controls.status.value.toString(),
            isAnd:s.value.andOr=='AND'? true: false,
            isOR:s.value.andOr=='OR'? true: false,
            associationID:'2'
           }
        )
      }
      else{
        this.addPersonellGridList.push(
          {
            caseConditionID: 0,
            financialtypename:s.controls.financialtypename.value.toString(),
            status:s.controls.status.value.toString(),
            isAnd:s.value.andOr=='AND'? true: false,
            isOR:s.value.andOr=='OR'? true: false,
            associationID:'2'
           }
        )
      }
    });
    let body=
    {
      id:this.personellFormControl.id.value,
      callAttAfterDay: this.personellFormControl.callAttAfterDay.value,
      callAttEveryDay:this.personellFormControl.callAttEveryDay.value,
      callRefDocAfterDay: this.personellFormControl.callRefDocAfterDay.value,
      callPatAfterDay: this.personellFormControl.callPatAfterDay.value,
      callPatDrop: this.patientDropDownValue.toString(),
      casePersonellComment:this.personellFormControl.casePersonellComment.value,
      tabName:"Personall"
    }
     
    this.settingsService.UpdatePatientStudySchedulingSetting(true,body).subscribe((res)=>{
      
      if(res.response!=null)
      {
        if(this.updatePersonellGridList.length>0)
        {
          this.settingsService.updateCaseCondition(true,this.updatePersonellGridList).subscribe((updateGridRes)=>{
            
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
        if(this.addPersonellGridList.length>0)
        {
          this.settingsService.addCaseCondition(true,this.addPersonellGridList).subscribe((addGridRes)=>{
            
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
        if(!this.isGridAddError && !this.isGridUpdateError)
        {
           this.successNotification(res);
           this.getPersonell();
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
       this.errorNotification(err);
     });
  }



  ///// common Notification
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
  recordNotFoundNotification(res:any)
  {
    this.notificationService.showNotification({
      alertHeader : 'record Not Found',
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }
  get personellFormControl() { return this.personellForm.controls; }
  get personellGridForm(): FormArray {
	return this.personellForm.get('personellGridForm') as FormArray;
  }
  
}
