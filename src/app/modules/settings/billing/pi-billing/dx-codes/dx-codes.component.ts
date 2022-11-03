import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-dx-codes',
  templateUrl: './dx-codes.component.html',
  styleUrls: []
})
export class DxCodesComponent implements OnInit {
  id: number;
  modelValue1:string='modal';
 bodypartList: any = [];
 lateralitieslist:any = [];
 pageNumber:number = 1;
  pageSize:number;
  totalRecords:number;
  dxList:any=[];
  editForm:FormGroup;
  dxForm:FormGroup;
  submitted=false;
  submitted1=false;

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  readonly pageSizeArray=PageSizeArray;
  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService: SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;
    
    this.commonMethodService.setTitle('Pi Billing');
    this.dxForm = this.fb.group({
      dxcode: ['',[Validators.required]],
      bodyPart: ['',[Validators.required]],
      laterlity: ['',[Validators.required]]
      });
      this.editForm = this.fb.group({
        dxcode: ['',[Validators.required]],
        bodyPart: ['',[Validators.required]],
        laterlity: ['',[Validators.required]]
        });
    this.getBodyPartList()
    this.getLateralitiesList()
    this.getDXCodeList()
  }

  getBodyPartList(){
    this.settingsService.getAllBodyPart1(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.bodypartList = data.response;
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

  getLateralitiesList(){
    this.settingsService.getAllLateralitieslist(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.lateralitieslist = data.response;
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
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getDXCodeList();
  }
  getDXCodeList(){
    this.submitted=false;
    this.settingsService.getAllDXCodes(true, this.pageNumber, this.pageSize).subscribe((res) => {
      var data: any = res;
      this.totalRecords = data.totalRecords;
      if (data.response != null && data.response.length > 0) {
        this.dxList = data.response;
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
    this.cancelChanges()

  }

  pageChanged(event){
    this.pageNumber = event;
    this.getDXCodeList()
  }

  onSubmit(){
    this.submitted = true
    if(!this.dxForm.valid){
     return;
    } 
    this.saveDXCode()
  }

  onUpdateSubmit(){
    this.submitted1 = true;
    this.modelValue1 = 'modal';
    if (this.editForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.saveDXCode();
  }

  saveDXCode(){ 
    if(this.id == null){
      var body={
        'dxcodeId': 0,
        'dxcode': this.codeForm.dxcode.value,
        'bodyPart': this.codeForm.bodyPart.value,
        'laterlity': this.codeForm.laterlity.value
      }
      this.settingsService.addDXCode(true, body).subscribe((res) =>{
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success',
            alertMessage: res.message,
            alertType: res.responseCode
          });
          this.getDXCodeList();
          this.submitted = false;
          this.dxForm.reset();
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
    else{
      var body={
        'dxcodeId': this.id,
        'dxcode': this.eForm.dxcode.value,
        'bodyPart': this.eForm.bodyPart.value,
        'laterlity': this.eForm.laterlity.value
      }
      this.settingsService.updateDXCode(true, body).subscribe((res) =>{
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success',
            alertMessage: res.message,
            alertType: res.responseCode
          });
          this.id= null;
          this.getDXCodeList();
          this.submitted1 = false;
          this.editForm.reset();
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
  }

  cancelChanges(){
    this.submitted=false;
      this.codeForm.dxcode.setValue(''),
      this.codeForm.bodyPart.setValue(''),
      this.codeForm.laterlity.setValue('')
  }

  edit(id){
    this.submitted1 = false;
    this.editForm.reset();
    this.id = id;
    this.getDXCodeById(id);
  }

  getDXCodeById(id){
    this.settingsService.getDXCodeById(true, id).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.editForm.patchValue({
          dxcode: data.response.DXCode,
          bodyPart: data.response.BodyPart,
          laterlity: data.response.Laterlity
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

  get codeForm() { return this.dxForm.controls; }
  get eForm() { return this.editForm.controls; }

  refreshDx(){
    this.getDXCodeList()
  }
}
