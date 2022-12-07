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
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';


@Component({
  selector: 'app-block-lease-scheduler',
  templateUrl: './block-lease-scheduler.component.html',
  styleUrls: ['./block-lease-scheduler.component.css']
})
export class BlockLeaseSchedulerComponent implements OnInit {
  @ViewChild('hiddenViewFile', { read: ElementRef }) hiddenViewFile: ElementRef;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  constructor(private readonly blockLeaseSchedulerService: BlockLeaseSchedulerService, private readonly facilityService: FacilityService, private notificationService: NotificationService, private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService,
    private readonly storageService: StorageService,
    private sanitizer: DomSanitizer,) {
    this.commonMethodService.leaseSaveObserver.subscribe((res) => {
      if (res) {
        this.applyFilter();
      }
    }, (err: any) => {
    });
  }

  facilityParentList: any[] = [];
  selectedParentFacility: Number = 0;
  facilityList: any[] = [];
  facilityLeasesList: any = [];
  facilityID: number = 0;
  leaseMonth: any;
  leaseYear: Number;
  modalityName: any;
  leaseStatus: any;
  leasePageNumber: number = 1;
  leasePageSize: number = 20;
  totalLeaseRecords: number;
  selectedFacility: any=[];
  scheduleStatusList: any[] = [];
  selectedScheduleStatus: any = -1;
  modalityList: any[] = [];
  selectedModality: any = [];
  pageNumber: number = 1;
  pageSize: number = 50;
  readonly pageSizeArray = PageSizeArray;
  setUserEsignSetting: boolean = true;
  totalRecords: number;
  SelectedsLeaseStatus: any = -1;
  blockLeaseGridList: [] = [];
  selectedPaid: any = -1;
  apiUrl: any;
  fileData: SafeResourceUrl;
  AllBlockLeaseList: any = [];
  LeasesOfFacilityData: any;
  ngOnInit(): void {
    // let elementO = {};
    // var arr: any = [];
    // elementO['FacilityID'] = '';
    // this.AllBlockLeaseList.push(elementO);
    // for (var j = 0; j < 12; j++) {
    //   elementO[`MonthLabels${j}`] = 'Nov 2022';     
    //   arr.push(elementO);
    //   elementO = {};
    // }
    // this.AllBlockLeaseList = arr;   
    this.getFacilityParentList();
    this.modalityList = this.selectAllModalityDdl();
    //this.getModalityList();
    this.getScheduleStatusList();
    this.applyFilter();
  }
  getFacilityParentList() {
    this.facilityParentList = [];
    this.facilityList = [];
    this.blockLeaseSchedulerService.getDashboardFacilityDropDownData(true, this.selectedParentFacility).subscribe((res) => {
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
  checkUndefiend(HeaderTxt: string) {
    if (this.AllBlockLeaseList[0] === undefined) {
      return ''
    } else {
      if (this.AllBlockLeaseList[0][HeaderTxt] === undefined) {
        return ''
      } else {
        return this.AllBlockLeaseList[0][HeaderTxt];
      }
    }
  }

  getCalendarSchedulerWindowById(row: any) {
    let body = {
      'FacilityID': row.data.FacilityID,
      'FacilityParentID': row.data.FacilityParentID,
      'FacilityName': row.data.Facilityname
    }
    this.blockLeaseSchedulerService.sendDataToCalendarSchedulerWindow(body);
  }
  // getModalityList() {
  //   this.modalityList = [];
  //   this.facilityService.getMasterModalities(true).subscribe((res) => {
  //     if (res.response != null) {
  //       this.modalityList = res.response;
  //     }
  //   }, (err: any) => {
  //     this.errorNotification(err);
  //   });
  // }
  clearApplyFilter() {
    this.selectedFacility = null;
    this.selectedParentFacility = null;
    this.selectedModality = null;
    this.selectedPaid = -1;
    this.selectedScheduleStatus = -1;
    this.SelectedsLeaseStatus = -1;
    this.getAllBlockLeaseFacility(this.getApplyFilter(0, null, '', null, null, null, this.pageNumber, this.pageSize));
  }

  applyFilter() {
    let selectedFacility = this.selectedFacility ? this.selectedFacility : 0;
    let selectedParentFacility = this.selectedParentFacility ? this.selectedParentFacility : null;
    let selectedModality = this.selectedModality ? this.selectedModality.toString() : '';
    let selectedScheduleCreated = this.selectedScheduleStatus !== -1 ? this.selectedScheduleStatus : null;
    let SelectedsLeaseStatus = this.SelectedsLeaseStatus !== -1 ? this.SelectedsLeaseStatus : null
    let paidStatus = this.selectedPaid !== -1 ? this.selectedPaid : null
    // let paidStatus = this.selectedPaid !  == -1 ? this.selectedPaid : null;
    this.getAllBlockLeaseFacility(this.getApplyFilter(selectedFacility, selectedParentFacility, selectedModality, selectedScheduleCreated, paidStatus, SelectedsLeaseStatus, this.pageNumber, this.pageSize));
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

          FacilityData = Months[j].FacilityData[0];
          element[`IsScheduledComplete${j}`] = FacilityData['IsScheduledComplete'];
          element[`IsPaid${j}`] = FacilityData['IsPaid'];
          element[`IsUnpaid${j}`] = FacilityData['IsUnpaid'];
          element[`PaidYear${j}`] = FacilityData['PaidYear'];

          let MriTotal = 0, CtTotal = 0;
          let IsFacilityNotSign = false, IsFacilitySign = false;
          for (var data = 0; data < Months[j].FacilityData.length; data++) {
            if (Months[j].FacilityData[data]['MRI'])
              MriTotal += parseFloat(Months[j].FacilityData[data]['MRI']);
            if (Months[j].FacilityData[data]['CT'])
              CtTotal += parseFloat(Months[j].FacilityData[data]['CT']);

            if (!Months[j].FacilityData[data]['IsFacilitySign']) {
              IsFacilityNotSign = true;
            } else if (Months[j].FacilityData[data]['IsFacilitySign']) {
              IsFacilitySign = true;
            }
          }
          element[`MRI${j}`] = Math.trunc(MriTotal);
          element[`CT${j}`] = Math.trunc(CtTotal);
          element[`IsFacilitySign${j}`] = IsFacilitySign;
          element[`IsFacilityNotSign${j}`] = IsFacilityNotSign;
        } else {
          //  element[`IsFacilitySign${j}`] = null;
          element[`IsScheduledComplete${j}`] = null;
          element[`IsPaid${j}`] = null;
          element[`IsUnpaid${j}`] = null;
          element[`MRI${j}`] = null;
          element[`CT${j}`] = null;
          element[`IsFacilitySign${j}`] = null;
          element[`IsFacilityNotSign${j}`] = null;
        }
      }
      arr.push(element);
      element = {};
    }
    this.AllBlockLeaseList = arr;
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
      'IsFacilityNotSign': column.row.data[`IsFacilityNotSign${index}`],
      'IsScheduledComplete': column.row.data[`IsScheduledComplete${index}`],
      'IsPaid': column.row.data[`IsPaid${index}`],
      'CT': column.row.data[`CT${index}`],
      'IsCtService': column.row.data['IsCtService'],
      'IsMriService': column.row.data['IsMriService'],
      'IsUnpaid': column.row.data[`IsUnpaid${index}`]
    })

    return retArray

  }
  getApplyFilter(facilityName: any, parentCompanyName: any,
    modality: any, schedululeCreated: any, paidStatus: any, SelectedsLeaseStatus: number, PageNumber: Number, PageSize: Number): any {
    return {
      'FacilityId': facilityName,
      'parentCompanyName': parentCompanyName,
      'Modality': modality,
      'schedululeCreated': schedululeCreated,
      'LeaseStatus': SelectedsLeaseStatus,
      'IsPaid': paidStatus,
      'PageNumber': PageNumber,
      'PageSize': PageSize
    }
  }
  changed(FacilityParentID: any) {
    this.selectedParentFacility = FacilityParentID.FacilityParentID;
    this.getFacilityParentList();
  }
  getAllBlockLeaseFacility(filterBody: any) {
    setTimeout(() => {
      this.blockLeaseSchedulerService.getBlockLeaseSchedulerFilterData(true, filterBody).subscribe((res) => {
        this.blockLeaseGridList = [];
        if (res.response != null) {
          this.totalRecords = res.response[0].totalRecords;
          this.blockLeaseGridList = res.response;
          this.convertDataTomodel();
        }
        else {
          this.blockLeaseGridList = [];
          this.totalRecords = 1;
        }
      });
    }, 500);

  }
  getAllLeasesOfFacilityByStatus(FacilityID: any, data: any, IsClicked: boolean = true, Status: any = 'PAID') {
    if (IsClicked) {
      this.leasePageNumber = 1;
    }
    this.LeasesOfFacilityData = data;
    this.facilityID = FacilityID;
    this.leaseStatus = Status;
    this.getMonthByDataField(data);
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
  selectAllModalityDdl() {
    return [
      { value: '0', ModalityName: 'MRI' },    
      { value: '1', ModalityName: 'CT' },             
    ];
  }
  pageChanged(event) {
    this.leasePageNumber = event;
    this.getAllLeasesOfFacilityByStatus(this.facilityID, this.LeasesOfFacilityData, false, this.leaseStatus);
  }
  pageChangedForAllLeases(event) {
    (event == 0) ? this.pageNumber = 1 : this.pageNumber = event;
    this.applyFilter();
  }
  getLeaseAggrementDetail(path: any, fileData: any) {
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
    if (facilityId) {
      let body = {
        'facilityId': facilityId,
        'type': type
      }
      this.facilityService.sendDataToPatientFacilityWindow(body);
    }
    else {
      var data = {
        'responseCode': 404
      }
      this.unSuccessNotification(data);
    }
  }

  getMonthByDataField(column: any) {
    this.modalityName = column.column.caption;
    let index = 0;
    if (column.column.caption == 'MRI')
      index = (Number(Number(column.columnIndex) - 1) / 2);
    else
      index = (Number(Number(column.columnIndex) - 2) / 2);
    this.leaseMonth = column.row.data[`MonthLabels${index}`];
    this.leaseYear = column.row.data[`PaidYear${index}`];
  }
}


