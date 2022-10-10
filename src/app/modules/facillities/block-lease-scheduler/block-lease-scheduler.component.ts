import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { BlockLeaseSchedulerService } from 'src/app/services/block-lease-scheduler-service/block-lease-scheduler.service';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { textChangeRangeIsUnchanged } from 'typescript';

@Component({
  selector: 'app-block-lease-scheduler',
  templateUrl: './block-lease-scheduler.component.html',
  styleUrls: ['./block-lease-scheduler.component.css']
})
export class BlockLeaseSchedulerComponent implements OnInit {

  constructor(private readonly blockLeaseSchedulerService: BlockLeaseSchedulerService, private readonly facilityService: FacilityService, private notificationService: NotificationService, private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService,
    private readonly storageService: StorageService) {
  }
  facilityParentList: any[] = [];
  selectedParentFacility: Number=0;
  facilityList: any[] = [];
  selectedFacility: any;
  scheduleStatusList: any[] = [];
  selectedscheduleStatus: any;
  modalityList: any[] = [];
  selectedModality: any = [];
  pageNumber: number = 1;
  pageSize: number = 50;
  readonly pageSizeArray = PageSizeArray;

  totalRecord: number;
  SelectedsLeaseStatus: string = '0';
  blockLeaseGridList: [] = [];

  ngOnInit(): void {
    this.getFacilityParentList();
    //this.getFacilityList();
    this.getModalityList();
    this.getScheduleStatusList();
    this.applyFilter();
  }

  getFacilityParentList() {
    this.facilityParentList = [];
    this.facilityList=[];
    this.blockLeaseSchedulerService.getDashboardFacilityDropDownData(true, this.selectedParentFacility).subscribe((res) => {
      console.log(res.response[0]);
      if (res.response) {
        this.facilityParentList = res.response[0].ParentFacilities;
        if(this.selectedParentFacility){
          this.facilityList = res.response[0].Facilities;
        }
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
    // this.facilityService.getFacilityParentNames(true).subscribe((res) => {
    //   if (res.response != null) {
    //     this.facilityParentList = res.response;
    //   }
    // }, (err: any) => {
    //   this.errorNotification(err);
    // });
  }
  // getFacilityList() {
  //   this.facilityList = [];
  //   this.facilityService.getActiveFacilityList(true).subscribe((res) => {
  //     if (res.response != null) {
  //       this.facilityList = res.response;
  //     }
  //   }, (err: any) => {
  //     this.errorNotification(err);
  //   });
  // }
  getScheduleStatusList() {
    this.scheduleStatusList = [];
    this.blockLeaseSchedulerService.getScheduleStatusList(true).subscribe((res) => {
      if (res.response != null) {
        this.scheduleStatusList = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getCalendarSchedulerWindowById(row: any) {
    console.log(row.data);
    let body = {
      'FacilityID': row.data.FacilityID,
      'FacilityParentID': row.data.FacilityParentID,
      'FacilityName': row.data.FacilityName
    }
    this.blockLeaseSchedulerService.sendDataToCalendarSchedulerWindow(body);
  }
  getModalityList() {
    this.modalityList = [];
    this.facilityService.getMasterModalities(true).subscribe((res) => {
      if (res.response != null) {
        this.modalityList = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  clearApplyFilter() {
    this.selectedParentFacility = null;
    this.selectedFacility = null;
    this.selectedModality = null;
    this.getAllBlockLeaseFacility(this.getApplyFilter('', '', ''));
  }
  applyFilter() {
    debugger;
    let selectedFacility = this.selectedFacility ? this.selectedFacility.toString() : '';
    let selectedParentFacility = this.selectedParentFacility ? this.selectedParentFacility.toString() : '';
    let selectedModality = this.selectedModality ? this.selectedModality.toString() : '';
    this.getAllBlockLeaseFacility(this.getApplyFilter(selectedFacility, selectedParentFacility, selectedModality));
  }
  getApplyFilter(facilityName: any, parentCompanyName: any,
    modality: any): any {
    return {
      'facilityName': facilityName,
      'parentCompanyName': parentCompanyName,
      'modality': modality
    }
  }
  changed(FacilityParentID: any) {  
    this.selectedParentFacility =  FacilityParentID.FacilityParentID;
    this.getFacilityParentList();
    alert(this.selectedParentFacility);
  }
  getAllBlockLeaseFacility(filterBody: any) {
    this.blockLeaseSchedulerService.getBlockLeaseSchedulerFilterData(true, filterBody, this.pageNumber, this.pageSize).subscribe((res) => {
      this.blockLeaseGridList = [];
      if (res.response != null) {
        this.totalRecord = res.totalRecords;
        this.blockLeaseGridList = res.response;
      }
      else {
        this.blockLeaseGridList = [];
        this.totalRecord = 1;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  unSuccessNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Something went wrong.',
      alertMessage: '',
      alertType: data.responseCode
    });
  }

}
