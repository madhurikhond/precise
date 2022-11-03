import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { ActionMenuConstant, SubsService } from '../../../services/subs-service/subs.service'
import { RequestSearchDetailComponent } from '../../shared/components/request-search-detail/request-search-detail.component';

@Component({
  selector: 'app-request-search',
  templateUrl: './request-search.component.html',
  styleUrls: ['./request-search.component.css']
})
export class RequestSearchComponent implements OnInit {
  a1: any = 20;
  a2: any = 20;
  a3: any = 20;
  a4: any = 20;
  maxDate = new Date();
  @ViewChild('hiddenButton1', { static: false }) hiddenButton1: ElementRef;
  @ViewChild(RequestSearchDetailComponent) childComponent;
  statusList: any = [{ statusName: 'PICKED UP' },
  { statusName: 'READY FOR PICKUP' },
  { statusName: 'NOT READY' }];
  requestTypeList: any = [{ requestTypeName: 'Medical' },
  { requestTypeName: 'Billing' },
  { requestTypeName: 'Breakdown' },
  { requestTypeName: 'CNR' },
  { requestTypeName: 'Refund Check' },
  { requestTypeName: 'Media Only' }
  ];
  mediaList: any = [{ mediaName: 'Films' },
  { mediaName: 'CD' },
  { mediaName: 'Documents' },
  { mediaName: 'CNR' }];
  actionList: any = [{ actionName: 'Ready for Pickup' },
  { actionName: 'Not Ready for Pickup' },
  { actionName: 'Delete Pickup Confirmation' },
  { actionName: 'Delete Request' },
  { actionName: 'See Notes' },
  { actionName: 'Clear See Notes' }
  ];
  dropDownList: any = [
    { dropDownName: 'Show All' },
    { dropDownName: 'Ready for Pickup' },
    { dropDownName: 'Processing' },
    { dropDownName: 'Picked Up' },
    { dropDownName: 'Picked Up Today' },
    { dropDownName: 'Entered Today' },
    { dropDownName: 'See Notes' }
  ];
  selectedRows: any = [];
  companyList: any = [];
  companyNameModelList: any = [];
  statusModelList: any = [];
  subsGridList: any = [];
  pageNumber: number = 1;
  pageSize: number;
  totalRecords: number;
  requestTypeModelList: any = [];
  mediaNameModelList: any = [];
  lastNameModel: string = '';
  firstNameModel: string = '';
  patientIdModel: string = '';
  dobModel: string = '';
  refModel: string = '';
  checksModel: string = '';
  actionModel: string;
  dropDownNameModel: any = [];
  isReadyForPickUp : string ='';
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  // Grid Properties
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  allMode: string;
  checkBoxesMode: string;
  isShowColumnWithNoData = true;
  readonly pageSizeArray = PageSizeArray;

  constructor(private readonly subsService: SubsService, private readonly notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService, private readonly storageService: StorageService) {
  }
  ngOnInit(): void {
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.commonMethodService.reqSearchClose.subscribe((value: any) => {
      if (value) {
        this.applyFilter();
      }
    })
    this.setPageTitle();
    this.setGridSetting();
    this.getAllCopyServiceCompany();
    this.dropDownNameModel = 'Show All';
    this.applyFilter();
  }
  setPageTitle() {
    this.commonMethodService.setTitle('Request Search');
  }
  setGridSetting() {
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always'
    this.showFilterRow = true;
    this.showHeaderFilter = false;
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately'
    }, {
      key: 'onClick',
      name: 'On Button Click'
    }];
    this.columnResizingMode = this.resizingModes[1];
    this.currentFilter = this.applyFilterTypes[0].key;
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.clearFilter();
  }

  onCellPrepared(e) {
    if (e.rowType == 'data') {          
      if (e.data.SeeNotes) {
          e.cellElement.style.backgroundColor = "#f8c9278c";
        }   
    } 
  }
  getAllCopyServiceCompany() {
    this.companyList = [];
    this.subsService.getAllCopyServiceCompany(false).subscribe((res) => {
      if (res.response != null) {
        this.companyList = res.response;
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }

  clearFilter() {
    this.companyNameModelList = [];
    this.statusModelList = [];
    this.requestTypeModelList = [];
    this.mediaNameModelList = [];
    this.subsGridList = [];
    this.lastNameModel = '';
    this.firstNameModel = '';
    this.patientIdModel = '';
    this.dobModel = '';
    this.refModel = '';
    this.checksModel = '';
    this.actionModel = null;
    this.pageNumber = 1;
    this.dropDownNameModel = 'Show All';
    this.applyFilter();
  }

  applyFilter() {
    let body = {
      'lastName': this.lastNameModel,
      'firstName': this.firstNameModel,
      'dob': this.dobModel,
      'patientID': this.patientIdModel,
      'refNumber': this.refModel,
      'companyName': this.companyNameModelList.toString(),
      'status': this.statusModelList.toString(),
      'requestType': this.requestTypeModelList.toString(),
      'media': this.mediaNameModelList.toString(),
      'allChecks': this.checksModel.toString(),
      'filterDropDown': this.dropDownNameModel == null ? '' : this.dropDownNameModel.toString()
    }
    this.subsService.getSubsDataByFilter(true, body, this.pageNumber, this.pageSize).subscribe((res) => {
      
      this.totalRecords = 1;
      if (res.response != null) {
        this.subsGridList = res.response;
        this.totalRecords = res.totalRecords;
        this.isShowColumnWithNoData = true;
      }
      else {
        this.subsGridList = [];
        this.totalRecords = 1;
        this.isShowColumnWithNoData = false;
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }
  getSubsDetail(row: any) {
    if (row.data.SubsID) {
      let body: any = { 'subsId': row.data.SubsID, 'patientId': row.data.PATIENTID }
      this.subsService.sendDataToRequestSearchDetailPage(body);
    }
  }
  filterDropDownOnChange() {
    this.applyFilter();
  }
  pageChanged(event) {
    this.pageNumber = event;
    this.applyFilter();
  }
  goButtonClick() {
    if (this.selectedRows.length > 0) {
      if (this.actionModel == ActionMenuConstant.readyforPickup) {
        this.subsReadyForPickup();
      }
      else if (this.actionModel == ActionMenuConstant.notReadyforPickup) {
        this.subsNotReadyForPickup();
      }
      else if (this.actionModel == ActionMenuConstant.deletePickupConfirmation) {                                                                           // Use For Cancel Pick Up
        this.subsDeletePickupConfirmation();
      }
      else if (this.actionModel == ActionMenuConstant.deleteRequest) {
        this.subsDeleteRequest();
      }
      else if (this.actionModel == ActionMenuConstant.seeNotes) {
        this.subsSeeNotes();
      }
      else if (this.actionModel == ActionMenuConstant.clearSeeNotes) {
        this.subsClearNotes();
      }
      this.applyFilter();
    }
    else {
      this.notificationService.showNotification({
        alertHeader: 'Error',
        alertMessage: 'No Records are Selected',
        alertType: 402
      });
    }
  }
  subsClearNotes() {
    this.subsService.subsClearSeeNotes(true, this.selectedRows.toString(), Number(this.storageService.user.UserId)).subscribe((res) => {
      if (res.response != null) {
        this.sucessMessage(res);
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }
  subsSeeNotes() {
    this.subsService.subsSeeNotes(true, this.selectedRows.toString(), Number(this.storageService.user.UserId)).subscribe((res) => {
      if (res.response != null) {
        this.sucessMessage(res);
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }
  subsDeleteRequest() {

    this.subsService.subsDeleteRequest(true, this.selectedRows.toString()).subscribe((res) => {
      if (res.responseCode == 200) {
        this.sucessMessage(res);
        this.applyFilter();
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }
  subsDeletePickupConfirmation() {
    this.subsService.subsDeletePickupConfirmation(true, this.selectedRows.toString(), Number(this.storageService.user.UserId)).subscribe((res) => {
      if (res.response != null) {
        this.sucessMessage(res);
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }
  subsNotReadyForPickup() {
    this.subsService.subsNotReadyForPickup(true, this.selectedRows.toString(), Number(this.storageService.user.UserId)).subscribe((res) => {
      if (res.response != null) {
        this.sucessMessage(res);
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }
  subsReadyForPickup() {
    this.subsService.subsReadyForPickup(true, this.selectedRows.toString(), Number(this.storageService.user.UserId)).subscribe((res) => {
      if (res.response != null) {
        this.sucessMessage(res);
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }

  receiveMessageFromChild($event) {
    if ($event) {
      this.applyFilter();
    }
  }
  selectionChangedHandler() {

  }
  resetDetailPageForm() {

    this.childComponent.resetDetailPageForm();
  }
  // common Notification Method
  recordNotFoundMessage(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Record not found.',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  sucessMessage(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  // common Error Method
  errorMessage(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}

