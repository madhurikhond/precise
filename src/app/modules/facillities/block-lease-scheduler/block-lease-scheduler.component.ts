import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { BlockLeaseSchedulerService } from 'src/app/services/block-lease-scheduler-service/block-lease-scheduler.service';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { textChangeRangeIsUnchanged } from 'typescript';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-block-lease-scheduler',
  templateUrl: './block-lease-scheduler.component.html',
  styleUrls: ['./block-lease-scheduler.component.css']
})
export class BlockLeaseSchedulerComponent implements OnInit {
  @ViewChild('hiddenViewFile', { read: ElementRef }) hiddenViewFile: ElementRef;
  constructor(private readonly blockLeaseSchedulerService: BlockLeaseSchedulerService, private readonly facilityService: FacilityService, private notificationService: NotificationService, private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService,
    private readonly storageService: StorageService,
    private sanitizer: DomSanitizer,  ) {
  }

  facilityParentList: any[] = [];
  selectedParentFacility: Number = 0;
  facilityList: any[] = [];
  facilityLeasesList: any = [];
  facilityID: number = 0;
  leaseMonth: any;
  leaseYear: number = 2022;
  modalityName: any = 'CT';
  leaseStatus: any = 'PAID';
  leasePageNumber: number = 1;
  leasePageSize: number = 20;
  totalLeaseRecords: number;
  selectedFacility: any;
  scheduleStatusList: any[] = [];
  selectedScheduleStatus: string = '0';
  modalityList: any[] = [];
  selectedModality: any = [];
  pageNumber: number = 1;
  pageSize: number = 50;
  readonly pageSizeArray = PageSizeArray;
  setUserEsignSetting: boolean = true;
  totalRecord: number;
  SelectedsLeaseStatus: string = '0';
  blockLeaseGridList: [] = [];
  selectedPaid: any = 'ALL';
  apiUrl: any;
  fileData: SafeResourceUrl;
  AllBlockLeaseList: any = [];
  ngOnInit(): void {
    this.getFacilityParentList();
    this.getModalityList();
    this.getScheduleStatusList();
    this.applyFilter();
  }

  getFacilityParentList() {
    this.facilityParentList = [];
    this.facilityList = [];
    this.blockLeaseSchedulerService.getDashboardFacilityDropDownData(true, this.selectedParentFacility).subscribe((res) => {
      console.log(res.response[0]);
      if (res.response != null && res.response.length > 0) {
          this.facilityList = res.response[0].Facilities;
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
    let body = {
      'FacilityID': row.data.FacilityID,
      'FacilityParentID': row.data.FacilityParentID,
      'FacilityName': row.data.Facilityname
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
    this.getAllBlockLeaseFacility(this.getApplyFilter('', '', '', ''));
  }
  applyFilter() {

    let selectedFacility = this.selectedFacility ? this.selectedFacility.toString() : '';
    let selectedParentFacility = this.selectedParentFacility ? this.selectedParentFacility.toString() : '';
    let selectedModality = this.selectedModality ? this.selectedModality.toString() : '';
    let paidStatus = this.selectedPaid ? this.selectedPaid.toString() : '';
    this.getAllBlockLeaseFacility(this.getApplyFilter(selectedFacility, selectedParentFacility, selectedModality, paidStatus));
  }
  convertDataTomodel() {
    var arr: any = [];
    let element = {}
    arr = [];
    for (var i = 0; i < this.blockLeaseGridList.length; i++) {
      var Months = []; var FacilityData = [];
      element['FacilityID'] = this.blockLeaseGridList[i]['FacilityID'];
      element['Facilityname'] = this.blockLeaseGridList[i]['FacilityName'];
      element['IsCtService'] = this.blockLeaseGridList[i]['IsCtService'];
      element['IsMriService'] = this.blockLeaseGridList[i]['IsMriService'];
      Months = this.blockLeaseGridList[i]['Months'];
      for (var j = 0; j < Months.length; j++) {
        element[`MonthLabels${j}`] = Months[j].MonthLabels;
        if (Months[j].FacilityData) {
          FacilityData = Months[j].FacilityData[0];// JSON.parse(Months[j].FacilityData);
          element[`IsFacilitySign${j}`] = FacilityData['IsFacilitySign'];
          element[`IsScheduledComplete${j}`] = FacilityData['IsScheduledComplete'];
          element[`IsPaid${j}`] = FacilityData['IsPaid'];
          element[`MRI${j}`] = FacilityData['MRI'];
          element[`CT${j}`] = FacilityData['CT'];
        } else {
          element[`IsFacilitySign${j}`] = null;
          element[`IsScheduledComplete${j}`] = null;
          element[`IsPaid${j}`] = null;
          element[`MRI${j}`] = null;
          element[`CT${j}`] = null;
        }
      }
      arr.push(element);
      element = {};
    } 
   
    this.AllBlockLeaseList = arr;
    console.log(this.AllBlockLeaseList);  
  }

  getColumnByDataField(column: any) {
    var retArray = [];
    let index = 0;
    if (column.column.caption == 'MRI')
      index = (Number(Number(column.columnIndex) - 1) / 2);
    else
      index = (Number(Number(column.columnIndex) - 2) / 2);
    retArray.push({
      'MRI': column.row.data[`MRI${index}`],
      'IsFacilitySign': column.row.data[`IsFacilitySign${index}`],
      'IsScheduledComplete': column.row.data[`IsScheduledComplete${index}`],
      'IsPaid': column.row.data[`IsPaid${index}`],
      'CT': column.row.data[`CT${index}`],
      'IsCtService': column.row.data['IsCtService'],
      'IsMriService': column.row.data['IsMriService']
    })
    // console.log(retArray);
    return retArray

  }  
  getApplyFilter(facilityName: any, parentCompanyName: any,
    modality: any, paidStatus: any): any {
    return {
      'facilityName': facilityName,
      'parentCompanyName': parentCompanyName,
      'modality': modality,
      'paidStatus': paidStatus
    }
  }
  changed(FacilityParentID: any) {
    this.selectedParentFacility = FacilityParentID.FacilityParentID;
    this.getFacilityParentList();   
  }
  getAllBlockLeaseFacility(filterBody: any) {
    this.blockLeaseSchedulerService.getBlockLeaseSchedulerFilterData(true, filterBody, this.pageNumber, this.pageSize).subscribe((res) => {
      this.blockLeaseGridList = [];
      if (res.response != null) {
        this.totalRecord = res.totalRecords;
        this.blockLeaseGridList = res.response;
        console.log(this.blockLeaseGridList);
        this.convertDataTomodel();
      }
      else {
        this.blockLeaseGridList = [];
        this.totalRecord = 1;
      }
    });
  }
  getAllLeasesOfFacilityByStatus(facilityID: any, IsClicked: boolean = true, Status: any = 'PAID') {
    if (IsClicked) {
      this.leasePageNumber = 1;
    }
    this.facilityID = facilityID;
    this.leaseStatus = Status;
    let body =
    {
      'FacilityId': this.facilityID,
      'LeaseMonth': this.leaseMonth,
      'LeaseYear': this.leaseYear,
      'Modality': this.modalityName,
      'LeaseStatus': this.leaseStatus,
      'PageNumber': this.leasePageNumber,
      'PageSize': this.leasePageSize

    }
    this.blockLeaseSchedulerService.getAllLeasesOfFacilityByStatus(body, true).subscribe((res) => {
      if (res.response !== null) {
        this.facilityLeasesList = res.response;
        this.totalLeaseRecords = res.response[0]["totalCount"];
      }
      else {
        this.facilityLeasesList = [];
        this.totalLeaseRecords = 1;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  pageChanged(event) {
    this.leasePageNumber = event;
    this.getAllLeasesOfFacilityByStatus(this.facilityID, false, this.leaseStatus);
  }
  getLeaseAggrementDetail(path: any,fileData: any) {
    this.apiUrl = `${environment.baseUrl}/v${environment.currentVersion}/`;
    fileData = this.apiUrl + 'BlockLeaseScheduler/OpenAgreement?path=' + path;
    this.fileData = this.sanitizer.bypassSecurityTrustResourceUrl(fileData);
    this.hiddenViewFile.nativeElement.click();
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

  getFacilityDetail(facilityId: any, type: any) {
    if(facilityId){
    let body = {
      'facilityId': facilityId,
      'type': type
    }
    this.facilityService.sendDataToPatientFacilityWindow(body);
  }
  else{
    var data = {
      'responseCode': 404
    }
    this.unSuccessNotification(data);
  }
  }
}


