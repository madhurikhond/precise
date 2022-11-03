import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: []
})
export class FacilitiesComponent implements OnInit {
  pageNumber: number = 1;
  pageSize: number;
  totalRecords: number;
  facilityGroupList: any = [];
  modalityList: any = [];
  editForm: FormGroup;
  modelValue1:string='modal';
  submitted1: boolean = false;
  procGroupName: string;

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
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;

    this.commonMethodService.setTitle('Pi Billing');
    this.getAllFacilityGroups();
    this.getModalityNames();
    this.editForm = this.fb.group({
      procGroupId:['', [Validators.required]],
      modalityId:['', [Validators.required]]
    });
  }

  getModalityNames(){
    this.settingsService.getModalityNames(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.modalityList = data.response;
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
    this.getAllFacilityGroups();
  }

  getAllFacilityGroups(){
    this.settingsService.getAllFacilityGroups(true, this.pageNumber, this.pageSize).subscribe((res) => {
      var data: any = res;
      this.totalRecords=res.totalRecords;
      if (data.response != null && data.response.length > 0) {
        this.facilityGroupList = data.response;
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

  getFacilityGroupById(procGroupId){
    this.submitted1 = false;
    this.settingsService.getFacilityGroupById(true, procGroupId).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {        
        this.procGroupName = data.response.ProcGroupName;
        this.editForm.patchValue({
          procGroupId: data.response.ProcGroupId,
          modalityId: (data.response.MasterModalityID == null ? '' : data.response.MasterModalityID)
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

  pageChanged(event){
    this.pageNumber = event;
    this.getAllFacilityGroups();
  }

  onUpdateSubmit(){
    this.submitted1 = true;
    this.modelValue1 = 'modal';
    if (this.editForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.saveFacilityGroup();
  }

  saveFacilityGroup(){
    var data = {
      'procGroupId': this.eForm.procGroupId.value,
      'masterModalityId': this.eForm.modalityId.value
    }
    this.settingsService.saveFacilityGroup(true, data).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getAllFacilityGroups();
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

  get eForm() { return this.editForm.controls; }
}
