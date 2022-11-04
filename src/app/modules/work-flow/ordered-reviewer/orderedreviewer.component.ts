import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { SettingsService } from 'src/app/services/settings.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
import { DatePipe } from '@angular/common';
import { PatientService } from 'src/app/services/patient/patient.service';
import { ReferrersService } from 'src/app/services/referrers.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';

@Component({
  selector: 'app-orderedreviewer',
  templateUrl: './orderedreviewer.component.html',
  styleUrls: ['./orderedreviewer.component.css'],
  providers: [PatientService, ReferrersService]
})

export class OrderedreviewerComponent implements OnInit {
  a1: any = 20;
  maxDate = new Date();
  @ViewChild('refPatientId', { static: true }) patientIdFilterRef: ElementRef;
  @ViewChild('refLastName', { static: true }) lastNameFilterRef: ElementRef;
  @ViewChild('refFirstName', { static: true }) firstNameFilterRef: ElementRef;
  @ViewChild('refDob', { static: true }) dobFilterRef: ElementRef;
  @ViewChild('dropDown', { static: true }) dropDownFilterRef: ElementRef;
  missingDocument: string = '';
  filterDOB: any;
  editCurrentRowNumber: number;
  editCurrentPatientId: string;
  isFilterApply: boolean = false;
  popUpTittle: string;
  modelValue: string;
  orderedReviewedList: any = [];
  NeedToOrderedReviewList: any = [];
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any;
  currentFilter: any;
  showHeaderFilter: boolean;
  orderedReviewedPageNumber: number = 1;
  orderedReviewedPageSize: number = 50;
  orderedReviewedTotalRecords: number;
  needToOrderedReviewPageNumber: number = 1;
  needToOrderedReviewPageSize: number;
  needToOrderedReviewTotalRecords: number;
  patientInfo: any;
  patientStudyList: any;
  patientHistory: string;
  patientComments: string;
  financialTypeList: any = [];
  //dropdownSettings:any;
  selectedFinancialTypeList = [];
  patientDetailWindowData = {};
  missingRxAndMissingUniqueLienImagePath: any = '';
  rxFile: SafeResourceUrl;
  isRxFileAvailable: boolean = false;
  readonly pageSizeArray=PageSizeArray;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;

  constructor(private fb: FormBuilder, private readonly notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService,
    private readonly workFlowService: WorkflowService, private readonly settingsService: SettingsService,
    private storageService: StorageService, private datePipe: DatePipe,
    private readonly patientService: PatientService, private readonly referrersService: ReferrersService,
    private sanitizer: DomSanitizer) {
    this.isRxFileAvailable = false;
  }
  ngOnInit(): void {
    this.needToOrderedReviewPageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately'
    }, {
      key: 'onClick',
      name: 'On Button Click'
    }];

    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;
    this.commonMethodService.setTitle('Ordered Reviewer');
    this.clearFilter();
    this.getFinancialType();
    this.onNeedToReviewedTabClicked();
  }
  getFinancialType() {
    this.settingsService.getMasterFinancialTypes().subscribe((res) => {

      if (res.response != null) {
        this.financialTypeList = res.response;
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  onNeedToReviewedTabClicked() {
    
    this.needToOrderedReviewPageNumber = 1;
    this.NeedToOrderedReviewList = null;
    this.getAllNeedsToBeReviewedStudies();
  }
  getAllNeedsToBeReviewedStudies() {
    this.workFlowService.getAllNeedsToBeReviewedStudies(true, this.needToOrderedReviewPageNumber, this.needToOrderedReviewPageSize).subscribe((res) => {
      if (res.response != null) {
        this.needToOrderedReviewTotalRecords = res.totalRecords;
        this.NeedToOrderedReviewList = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getNeedToReviewRowCurrentDetail(row: any) {

    let patientId = row.data.PatientId;
    this.editCurrentRowNumber = row.data.RowNumber;
    this.editCurrentPatientId = row.data.PatientId;
    if (patientId != '') {
      this.getPatientPersonalInfo(patientId);
      this.getPatientStudyDetailByPatientId(patientId);
      this.getPatientCommentsAndHistoryByPatientId(patientId);
      this.checkRXOrBrokerLienExistByPatientId(patientId);
      this.GetRxDocumentByPatientId(patientId);
    }
  }
  GetRxDocumentByPatientId(patientId: any) {
    this.isRxFileAvailable = false;
    this.workFlowService.GetRxDocumentByPatientId(true, patientId).subscribe((res) => {
      if (res != null) {
        let fileData = '';
        if (res.response.fileName.match(/.(jpg|jpeg|png|gif)$/i)) {
          fileData = 'data:image/png;base64,' + res.response.fileBase64;
        }
        else if (res.response.fileName.match(/.(pdf)$/i)) {
          fileData = 'data:application/pdf;base64,' + res.response.fileBase64;
        }
        this.isRxFileAvailable = true;
        this.rxFile = this.sanitizer.bypassSecurityTrustResourceUrl(fileData);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getPatientPersonalInfo(patientId: any) {
    this.workFlowService.getPatientDetailByPatientId(true, patientId).subscribe((patientInfoResponse) => {
      
      this.popUpTittle = '';
      this.patientDetailWindowData = {};
      if (patientInfoResponse.response != null) {
        this.patientInfo = patientInfoResponse.response;
        this.popUpTittle = patientInfoResponse.response.PATIENTID + ', ' + patientInfoResponse.response.FAMILYNAME + ' ' + patientInfoResponse.response.GIVENNAME;
        this.patientDetailWindowData = {
          'internalPatientId': this.patientInfo.INTERNALPATIENTID,
          'internalStudyId': this.patientInfo.INTERNALSTUDYID,
          'hasAlert': this.patientInfo.HasAlert == true ? 1 : 0
        }
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  openPatientDetailWindow() {
    
    //alert(JSON.stringify(this.patientDetailWindowData));
    this.patientService.sendDataToPatientDetailWindow(this.patientDetailWindowData);
  }
  getPatientStudyDetailByPatientId(patientId: any) {
    this.workFlowService.getPatientStudyDetailByPatientId(true, patientId).subscribe((patientStudyResponse) => {
      
      if (patientStudyResponse.response != null) {
        this.patientStudyList = patientStudyResponse.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  OpenAttorneyWindow(attorenyName: any, attorenyId: any) {
    let body = { 'title': attorenyName, 'referrerId': attorenyId };
    this.referrersService.sendDataToReferrerDetailWindow(body);
  }
  OpenReferrerWindow(referrerName: any, ReferrerId: any) {
    let body = { 'title': referrerName, 'referrerId': ReferrerId };
    this.referrersService.sendDataToReferrerDetailWindow(body);
  }
  getPatientCommentsAndHistoryByPatientId(patientId: any) {
    this.workFlowService.getPatientCommentsAndHistoryByPatientId(true, patientId).subscribe((patientStudyResponse) => {

      if (patientStudyResponse.response != null) {
        this.patientHistory = patientStudyResponse.response.History;
        this.patientComments = patientStudyResponse.response.Comments;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  checkRXOrBrokerLienExistByPatientId(patientId: any) {
    this.workFlowService.checkRXOrBrokerLienExistByPatientId(true, patientId).subscribe((missingDocumentRes) => {
      this.missingDocument = '';
      if (missingDocumentRes.response != null) {
        this.missingDocument = missingDocumentRes.response.MissingDocument;
        if (this.missingDocument == 'MISSING RX') {
          this.missingRxAndMissingUniqueLienImagePath = 'assets/images/MissingRx.png';
        }
        else if (this.missingDocument == 'MISSING UNIQUE LIEN') {
          this.missingRxAndMissingUniqueLienImagePath = 'assets/images/MissingUniqueLien.png';
        }
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  onReviewedTabClicked() {
    this.getOrderReviewedStudy();
  }
  getOrderReviewedStudy() {
    this.workFlowService.getOrderReviewedStudy(true, this.orderedReviewedPageNumber, this.orderedReviewedPageSize).subscribe((res) => {
      if (res.response != null) {
        this.orderedReviewedTotalRecords = res.totalRecords;
        this.orderedReviewedList = res.response;
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  orderedReviewedPageChanged(event: any) {
    this.orderedReviewedPageNumber = event;
    this.getOrderReviewedStudy();
  }
  NeedToOrderedReviewPageChanged(event: any) {
    this.needToOrderedReviewPageNumber = event;
    if (this.isFilterApply) {
      this.applyFilter();
    }
    else {
      this.getAllNeedsToBeReviewedStudies();
    }
  }
  onPageSizeChange(pageSize: any) {
    
    this.needToOrderedReviewPageSize = pageSize;
    this.orderedReviewedPageSize = pageSize;
    if (this.isFilterApply) {
      this.applyFilter();
    }
    else {
      this.getAllNeedsToBeReviewedStudies();
    }
   
  }
  clearFilter() {

    this.patientIdFilterRef.nativeElement.value = '';
    this.lastNameFilterRef.nativeElement.value = '';
    this.firstNameFilterRef.nativeElement.value = '';
    this.filterDOB = '';
    //this.dobFilterRef.nativeElement.value='';
    this.selectedFinancialTypeList = [];
    this.isFilterApply = false;
    this.onNeedToReviewedTabClicked();
  }
  //// Common Method Start
  unSuccessNotification(res: any) {

    this.notificationService.showNotification({
      alertHeader: 'No record found.',
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }
  successNotification(res: any) {

    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  recordNotFoundNotification(msg: string) {
    this.notificationService.showNotification({
      alertHeader: 'UnSuccess',
      alertMessage: msg,
      alertType: 400
    });
  }
  ///// Common Method End

  applyFilter(patientId?: any, lastName?: any, firstName?: any, dob?: any) {

    this.isFilterApply = true;
    //let NewFinList=this.selectedFinancialTypeList.map(m=>m.financialtypename).toString();
    let filterDOB = this.datePipe.transform(this.filterDOB, this.dateTimeFormatCustom.Date);
    let body = {
      'patientId': this.patientIdFilterRef.nativeElement.value,
      'lastName': this.lastNameFilterRef.nativeElement.value,
      'firstName': this.firstNameFilterRef.nativeElement.value,
      'financialTypeName': this.selectedFinancialTypeList.toString(),
      'birthDate': filterDOB == null ? '' : filterDOB,
      'rowNumber': '',
      'pageSize': this.needToOrderedReviewPageSize,
      'PageNumber': this.needToOrderedReviewPageNumber,
    };
    this.workFlowService.applyFilterForNeedsToBeReviewedTab(true, body).subscribe((res) => {
      this.needToOrderedReviewTotalRecords = 0;
      this.NeedToOrderedReviewList = [];
      if (res.response != null) {

        this.needToOrderedReviewTotalRecords = res.totalRecords;
        this.NeedToOrderedReviewList = res.response;
      }
      else {
        //this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getPreviousPatient() {

    let previousRow = this.editCurrentRowNumber - 1;
    let previousRowItem = this.NeedToOrderedReviewList
      .filter((f) => f.RowNumber === previousRow);
    if (previousRowItem.length > 0) {
      let previousPatientId = previousRowItem[0].PatientId;
      this.editCurrentPatientId = previousPatientId;
      this.editCurrentRowNumber = previousRow;
      this.getPatientPersonalInfo(previousPatientId);
      this.getPatientStudyDetailByPatientId(previousPatientId);
      this.getPatientCommentsAndHistoryByPatientId(previousPatientId);
      this.checkRXOrBrokerLienExistByPatientId(previousPatientId);
      this.GetRxDocumentByPatientId(previousPatientId);
    }
    else {
      this.recordNotFoundNotification('No More Record Exist For Previous, Please Do Next.')
    }
  }
  getNextPatient() {

    let nextRow = this.editCurrentRowNumber + 1;
    let NextRowItem = this.NeedToOrderedReviewList
      .filter((f) => f.RowNumber === nextRow);
    if (NextRowItem.length > 0) {
      let nextPatientId = NextRowItem[0].PatientId;
      this.editCurrentPatientId = nextPatientId;
      this.editCurrentRowNumber = nextRow;
      this.getPatientPersonalInfo(nextPatientId);
      this.getPatientStudyDetailByPatientId(nextPatientId);
      this.getPatientCommentsAndHistoryByPatientId(nextPatientId);
      this.checkRXOrBrokerLienExistByPatientId(nextPatientId);
      this.GetRxDocumentByPatientId(nextPatientId);
    }
    else {
      this.recordNotFoundNotification('No More Record Exist For Next, Please Do Previous Or Go Next Page.')
    }
  }
  getPreviousPatient2() {

    let previousRow = this.editCurrentRowNumber - 1;
    let previousRowItem = this.NeedToOrderedReviewList
      .filter((f) => f.RowNumber === previousRow);
    if (previousRowItem.length > 0) {
      let previousPatientId = previousRow[0].PatientId;
      this.editCurrentPatientId = previousPatientId;
      this.editCurrentRowNumber = previousRow;
      this.getPatientPersonalInfo(previousPatientId);
      this.getPatientStudyDetailByPatientId(previousPatientId);
      this.getPatientCommentsAndHistoryByPatientId(previousPatientId);
      this.checkRXOrBrokerLienExistByPatientId(previousPatientId);
    }
    else {
      document.getElementById('btnCancel').click();
    }
  }

  getNextPatient2() {
    let nextRow = this.editCurrentRowNumber + 1;
    let NextRowItem = this.NeedToOrderedReviewList
      .filter((f) => f.RowNumber === nextRow);
    if (NextRowItem.length > 0) {
      let nextPatientId = NextRowItem[0].PatientId;
      this.editCurrentPatientId = nextPatientId;
      this.editCurrentRowNumber = nextRow;
      this.getPatientPersonalInfo(nextPatientId);
      this.getPatientStudyDetailByPatientId(nextPatientId);
      this.getPatientCommentsAndHistoryByPatientId(nextPatientId);
      this.checkRXOrBrokerLienExistByPatientId(nextPatientId);
      this.GetRxDocumentByPatientId(nextPatientId);
    }
    else {
      this.getPreviousPatient2();
    }
  }
  reviewedPatient() {

    let currentRow = this.editCurrentRowNumber;
    let currentRowItem = this.NeedToOrderedReviewList
      .filter((f) => f.RowNumber === currentRow);
    if (currentRowItem.length > 0) {
      let userName = this.storageService.user.FullName;
      let joinInternalStudyId = this.patientStudyList.map((f) => f.INTERNALSTUDYID).toString();
      let patientId = this.patientStudyList.map((f) => f.PATIENTID)[0];
      let body = {
        'patientId': patientId,
        'joinInternalStudyId': joinInternalStudyId,
        'reviewedOn': '',
        'reviewedBy': userName
      }
      this.workFlowService.reviewedCurrentPatient(true, body).subscribe((reviewedRes) => {
        if (reviewedRes.response != null) {
          this.successNotification(reviewedRes);
          this.getNextPatient2();
        }
        else {
          this.unSuccessNotification(reviewedRes);
        }
      }, (err: any) => {
        this.errorNotification(err);
      });
    }
    else {
      this.recordNotFoundNotification('No More Record.')
    }

  }

  cancel() {

    if (this.isFilterApply) {
      this.applyFilter();
    }
    else {
      this.getAllNeedsToBeReviewedStudies();
    }
  }
  showDocManager(patientId: any) {
    this.commonMethodService.sendDataToDocumentManager(patientId);
  }
  getPatientDetailById(data) { 
    let body = {
      'internalPatientId': data.data.INTERNALPATIENTID,
      'internalStudyId': data.data.InternalStudyId,
      'hasAlert': data.data.HasAlert,
    }
    this.patientService.sendDataToPatientDetailWindow(body);
  }
 
  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
