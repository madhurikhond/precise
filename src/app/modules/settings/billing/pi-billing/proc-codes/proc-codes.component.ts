import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-proc-codes',
  templateUrl: './proc-codes.component.html',
  styleUrls: []
})
export class ProcCodesComponent implements OnInit {
  modelValue:string='modal';
  modelValue1:string='modal';
  editForm: FormGroup;
  bulkAssignForm: FormGroup;
  totalRecords: number;
  pageNumber: number =1;
  pageSize : number;
  procCodeList : any = [];
  procGroupList: any = [];
  submitted = false;
  submitted1 = false;
  id: number;

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  selectedRows: number[];
  readonly pageSizeArray=PageSizeArray;

  constructor(private fb: FormBuilder, private settingService: SettingsService, 
    private notificationService: NotificationService, private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;

    this.commonMethodService.setTitle('Proc. Codes');
    this.getAllProcGroups();
    this.getAllProcCodes();

    this.editForm = this.fb.group({
      procCodeName: [''],
      description: [''],
      procGroup: [0],
      dxOverride: [''],
      isXrayPrescreen: [''],
      isNoPIBillFee: [''],
      doNotRequirePayment: ['']
    });
    this.bulkAssignForm = this.fb.group({
      procGroup: [null, Validators.required],
    });
  }
  
 onPageSizeChange(event) {
  this.pageSize = event;
  this.pageNumber = 1;
  this.getAllProcCodes();
}
  getAllProcGroups(){
    this.settingService.getAllProcGroups(true).subscribe((res) => {
      var data: any = res;      
      if (data.response != null && data.response.length > 0) {
        this.procGroupList = data.response;
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

  getAllProcCodes(){
    this.settingService.getAllProcCodes(this.pageNumber, this.pageSize, true).subscribe((res) => {
      var data: any = res;
      this.totalRecords = res.totalRecords;
      if (data.response != null && data.response.length > 0) {
        this.procCodeList = data.response;
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

  getProcCodeById(id){
    this.settingService.getProcCodeById(true, id).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.editForm.patchValue({
          procCodeName: data.response.ProcCodeName,
          description: data.response.Description,
          procGroup: (data.response.ProcGroupId) ? data.response.ProcGroupId : 0,
          dxOverride: data.response.DxOverride,
          isXrayPrescreen: data.response.IsXrayPrescreen,
          isNoPIBillFee: data.response.IsNoPIBillFee,
          doNotRequirePayment: data.response.DoNotRequirePayment
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

  saveProcCode(){
    var data = {
      'procCodeId': this.id,
      'procGroupId': (this.eForm.procGroup.value === '0') ? null : this.eForm.procGroup.value,
      'dxOverride': this.eForm.dxOverride.value,
      'isXrayPrescreen': this.eForm.isXrayPrescreen.value,
      'isNoPIBillFee': this.eForm.isNoPIBillFee.value,
      'doNotRequirePayment': this.eForm.doNotRequirePayment.value
    }
    this.updateProcCode(data);
  }

  updateProcCode(data){
    this.settingService.updateProcCode(true, data).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        });
      }
      this.getAllProcCodes();
      this.submitted1 = false;
      this.editForm.reset();
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

  onUpdateSubmit(){
    this.submitted1 = true;
    this.modelValue1 = 'modal';
    if (this.editForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.saveProcCode();
  }

  onBulkAssignSubmit(){
    this.submitted = true;
    if (this.bulkAssignForm.invalid) {
      return;
    }
    if(!this.selectedRows || this.selectedRows.length == 0){
      this.notificationService.showNotification({ 
        alertHeader : null,
        alertMessage: 'Please select at least one record from the below table.',
        alertType: ResponseStatusCode.BadRequest
      });
    }
    else{
      this.assignBulkProcCode();
    }
  }

  assignBulkProcCode(){
    var data = {
      'procGroupId': this.baForm.procGroup.value,
      'procCodeIds': this.selectedRows.toString()
    }
    this.settingService.assignBulkProcCode(true, data).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        });
      }
      this.submitted = false;
      this.getAllProcCodes();
      this.bulkAssignForm.reset();
      this.selectedRows = null;
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
    this.getAllProcCodes()
  }

  edit(id){
    this.submitted1 = false;
    this.editForm.reset();
    this.id = id;
    this.getProcCodeById(id);
  }

  onRowUpdated(e) {
    var data = {
      'procCodeId': e.data.ProcCodeId,
      'procGroupId': e.data.ProcGroupId,
      'dxOverride': e.data.DxOverride,
      'isXrayPrescreen': e.data.IsXrayPrescreen,
      'isNoPIBillFee': e.data.IsNoPIBillFee,
      'doNotRequirePayment': e.data.DoNotRequirePayment,
    }
    this.updateProcCode(data);
  }

  get eForm() { return this.editForm.controls; }
  get baForm() { return this.bulkAssignForm.controls; }
}
