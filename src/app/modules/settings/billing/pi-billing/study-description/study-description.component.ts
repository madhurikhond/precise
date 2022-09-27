import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-study-description',
  templateUrl: './study-description.component.html',
  styleUrls: []
})
export class StudyDescriptionComponent implements OnInit {
  pageNumber:number = 1;
  totalRecords:number;
  studyTypeList =[]
  studyTypeForm : FormGroup;
  submitted = false
  modelValue:string='modal';
  studyTypeId:number = 0;
  pageSize:number;
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  readonly pageSizeArray=PageSizeArray;
  
  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;
    
    this.commonMethodService.setTitle('Study Description');
    this.studyTypeForm = this.fb.group({
    studytypecode: ['',[Validators.required]],
    description: ['',[Validators.required]],
    isAllowMultiple: ['']
    });
    
    this.getAllStudTypeAllowMultiples()
  }
  
 onPageSizeChange(event) {
  this.pageSize = event;
  this.pageNumber = 1;
  this.getAllStudTypeAllowMultiples();
}

  getAllStudTypeAllowMultiples(){
    this.settingsService.getAllStudyTypeAllowMultiple(true, this.pageNumber, this.pageSize).subscribe((res) => {
      var data: any = res;
      this.clearRecords();
      this.totalRecords = data.totalRecords;
      if (data.response != null && data.response.length > 0) {
        this.studyTypeList = data.response;
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

  refreshSd(){
    this.getAllStudTypeAllowMultiples();
  }

  getStudyTypeById(id){
    this.submitted=false;
    this.studyTypeId = id;
    this.settingsService.geStudyTypeAllowMultipleById(true, id).subscribe((res) =>{
      this.studyTypeForm.setValue({
        studytypecode: res.response.STUDYTYPECODE,
        description: res.response.DESCRIPTION,
        isAllowMultiple: res.response.IsAllowMultiple
      })
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

  pageChanged(event){
    this.pageNumber = event;
    this.getAllStudTypeAllowMultiples()
  }

  onSubmit(){
    this.submitted = true;
    this.modelValue='modal';
    if (this.studyTypeForm.invalid) {
      this.modelValue='';
      return;
    }
    if (this.studyTypeId != null)
    this.updateStudyDescription();
    else{
      this.addStudyDescription();
    }
  }
  clearRecords(){
    this.stForm.studytypecode.setValue(''),
    this.stForm.description.setValue(''),
    this.stForm.isAllowMultiple.setValue('')
    this.studyTypeId = null
  }
  
  addStudyDescription(){ 
    var temp;
    if(this.stForm.isAllowMultiple.value === true){
      temp = true;
    }
    else{
      temp =false;
    }
    var body={
      'studyTypeId': 0,
      'studytypecode': this.stForm.studytypecode.value,
      'description': this.stForm.description.value,
      'isAllowMultiple': temp
    }
    this.settingsService.addStudyTypeAllowMultipleSetting(true, body).subscribe((res) =>{
      if (res) {
        this.getAllStudTypeAllowMultiples()
        this.notificationService.showNotification({ 
          alertHeader : 'Success',
          alertMessage: res.message,
          alertType: res.responseCode
        });
      } 
    }, 
    (err : any) => {
      this.clearRecords();
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    }); 
  }

  updateStudyDescription(){     
    var body={
      studyTypeId: this.studyTypeId,
      studytypecode: this.stForm.studytypecode.value,
      description: this.stForm.description.value,
      isAllowMultiple: this.stForm.isAllowMultiple.value
    }
    this.settingsService.updateStudyTypeAllowMultiple(true, body).subscribe((res) =>{
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success',
          alertMessage: res.message,
          alertType: res.responseCode
        })
        this.getAllStudTypeAllowMultiples();
      } 
    }, 
    (err : any) => {
      this.clearRecords();
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });

  }

  addSd(){
    this.submitted=false;
  }

  get stForm() { return this.studyTypeForm.controls; }

}
