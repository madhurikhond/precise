import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SubsService } from 'src/app/services/subs-service/subs.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StorageService } from 'src/app/services/common/storage.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { CommonRegex } from 'src/app/constants/commonregex';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';

declare const $: any;

@Component({
  selector: 'app-request-search-detail',
  templateUrl: './request-search-detail.component.html',
  styleUrls: ['./request-search-detail.component.css'],
  providers: [DatePipe]

})
export class RequestSearchDetailComponent implements OnInit {
  @ViewChild('buttonEmailConfirmationPopUp', { static: false }) emailPopUp: ElementRef;
  @ViewChild('buttonemailCustodianRecordsPopUp', { static: false }) HiddenemailCustodianRecords: ElementRef;
  @ViewChild('mainPopCloseButton', { static: false }) mainPopCloseButton: ElementRef;
  @Output() messageChildToParent = new EventEmitter<boolean>();
  @Output() messageToPatientDetail = new EventEmitter<boolean>();
  @ViewChild('hiddenViewFile', { static: false }) hiddenViewFile: ElementRef;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent

  // Form Fields
  requestDetailForm: FormGroup;
  custodianRecordsForm: FormGroup;
  checkDetailForm: FormGroup;
  emailCustodianRecordsForm: FormGroup;
  // Grid Properties
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  allMode: string;
  checkBoxesMode: string;
  tabId: string = '1'
  isShowDocTab: boolean = false;
  requestAndProvidedTypeList: any = [{ Name: 'Medical' },
  { Name: 'Billing' },
  { Name: 'Breakdown' },
  { Name: 'CNR' },
  { Name: 'Refund Check' },
  { Name: 'Media Only' }
  ];

  mediaList: any = [{ mediaName: 'Films' },
  { mediaName: 'CD' },
  { mediaName: 'Documents' },
  { mediaName: 'CNR' }];

  companyList: [] = [];
  repNameList: any = [];
  notesListForNotesTab: any = [];
  logListForLogTab: any = [];
  logListForLogTabPagging = [];
  editPatientId: string = '';
  selectedCompanyIDModel: any;
  selectedRapIDModel: any;
  selectedRequestedTypeList: any = [];
  selectedMediaList: any = [];
  selectedProvidedTypeList: any = [];
  selectedCompanyIDCheck1: any;
  selectedCompanyIDCheck2: any;
  selectedCompanyIDCheck3: any;
  selectedCompanyIDCheck4: any;
  selectedCompanyIDCheck5: any;
  breakdownAndLabelsList: any = [];
  imageSignature: any;
  subsNotesModel: string = '';
  subsId: number;
  isSeeNotes: boolean = false;
  seeAndClearNotesPopUpMessage: string = '';
  popUpTitle: string = 'Create New Sub';
  exportCheckConfirmationMessage: string = '';
  qbExportCurrentCheckBoxValue: boolean = false
  currentFormControlNameForQBCheck: string = '';
  isNewSubsCreatedButtonClick: boolean = false;
  isSubsPageInEditMode: boolean = false;
  tempRepName: any;
  isrequestDetailFormSubmitted: boolean = false; fileName: string;
  fileData: SafeResourceUrl;
  modelValue: string;
  pageNumberLog: any = 1;
  pageSizeLog: any = 20;
  totalRecords: any = 1;
  requestDetailForRequestDetailTab: any;
  companyEmailChecked: boolean;
  isemailCustodianSubmitted: boolean = false;
  modalValue: string = 'modal';
  tabType: string = '';
  selectedStudyID: any = [];
  selectedLabelStudyID: any = [];
  requestPayloadData: any;
  status :string = '';
 
  disabledInsertUpdate : boolean;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  readonly commonRegex=CommonRegex;
  CheckDetailFile: string = ''; CheckDetailFile2: string = ''; CheckDetailFile3: string = ''; CheckDetailFile4: string = ''; CheckDetailFile5: string = '';
  filename: string = ''; filename2: string = ''; filename3: string = ''; filename4: string = ''; filename5: string = '';
  constructor(private fb: FormBuilder, private readonly subsService: SubsService,
    private readonly notificationService: NotificationService
    , private readonly storageService: StorageService, private datePipe: DatePipe,
    private commonMethodService: CommonMethodService, private sanitizer: DomSanitizer, private decimalPipe: DecimalPipe) {
  }
  ngOnInit(): void {
    this.setGridSetting();
    this.createRequestDetailFormForRequestDetailTab();
    this.createCustodianRecordsFormForCustodianRecordsFormTab();
    this.createCheckDetailFormForCheckDetailTab();
    this.getAllCopyServiceCompany();
    //this.resetSubsFormAndProperties();
    this.emailCustodianRecordsFormInit();
    this.subsService.sendAndRecieveDataForRequestSearchDetailPage.subscribe((res: any) => {
      this.updateTabId('1');
      if (res != null) {
        this.isSubsPageInEditMode = true;
        this.requestPayloadData = res;
        this.getSubsDetailById(res);
      }
    });

  }
  resetSubsFormAndProperties() {
    this.updateTabId('1');
    this.isShowDocTab = false;
    this.notesListForNotesTab = [];
    this.requestDetailForm.reset();
    this.custodianRecordsForm.reset();
    this.checkDetailForm.reset();
    this.selectedCompanyIDModel = null;
    this.selectedRapIDModel = null;
    this.selectedRequestedTypeList = [];
    this.selectedMediaList = [];
    this.selectedProvidedTypeList = [];
    this.selectedCompanyIDCheck1 = null;
    this.selectedCompanyIDCheck2 = null;
    this.selectedCompanyIDCheck3 = null;
    this.selectedCompanyIDCheck4 = null;
    this.selectedCompanyIDCheck5 = null;
    this.subsId = null;
    this.popUpTitle = 'Create New Sub';
    this.isSubsPageInEditMode = false;
    this.editRestCheckBox();
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
  updateTabId(tabName: string) {
    this.tabId = tabName;
    if (tabName === '4') {
      const patientId = this.editPatientId.toLowerCase().includes('pre') ? this.editPatientId : 'PRE' + this.editPatientId;
      this.commonMethodService.sendDataToDocumentManager(patientId);
    }
  }
  showDocManager() {
    const patientId = this.editPatientId.toLowerCase().includes('pre') ? this.editPatientId : 'PRE' + this.editPatientId;
    this.commonMethodService.sendDataToDocumentManager(patientId);
  }
  createRequestDetailFormForRequestDetailTab() {
    this.requestDetailForm = this.fb.group({
      patientId: [''],
      familyName: [''],
      givenName: [''],
      lastNameCnr: ['', Validators.required],
      firstNameCnr: ['', Validators.required],
      birthDate: [''],
      birthDateCnr: [''],
      companyID: [''],
      repID: [''],
      status: [''],
      refNum: ['', Validators.required],
      secondaryRefNum: [''],
      requestType: [''],
      providedType: [''],
      media: [''],
      dateRequested: [null, []],
      dateEntered: [''],
      dateReady: [''],
      isMailedChecked: [''],
      mailedDateTime: [''],
      pickupCost: ['', Validators.required],
      datePickedUp: [''],
      pickedUpBy: [''],
      signature: [''],
    });
  }
  createCustodianRecordsFormForCustodianRecordsFormTab() {
    this.custodianRecordsForm = this.fb.group({
      copiedRecords: false,
      copiedRecordsBilling: false,
      copiedRecordsMedical: false,
      copiedRecordsBreakdown: false,
      copiedRecordsOther: false,
      copiedRecordsOtherDesc: '',
      noRecords: false,
      noRecordsBilling: false,
      noRecordsMedical: false,
      noRecordsLost: false,
      noRecordsDestroyed: false,
      noRecordsOther: false,
      noRecordsOtherDesc: ''
    });
  }
  emailCustodianRecordsFormInit() {
    this.emailCustodianRecordsForm = this.fb.group({
      isActiveCompanyEmail: ['false'],
      emailAddressFirst: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      emailAddressSec: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      emailAddressThird: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      Subject: [''],
      emailBody: ['']
    })
  }
  editRestCheckBox() {
    this.custodianRecordsForm.patchValue({
      copiedRecords: false,
      copiedRecordsBilling: false,
      copiedRecordsMedical: false,
      copiedRecordsBreakdown: false,
      copiedRecordsOther: false,
      copiedRecordsOtherDesc: '',
      noRecords: false,
      noRecordsBilling: false,
      noRecordsMedical: false,
      noRecordsLost: false,
      noRecordsDestroyed: false,
      noRecordsOther: false,
      noRecordsOtherDesc: ''
    });
  }
  createCheckDetailFormForCheckDetailTab() {
    this.checkDetailForm = this.fb.group({
      check1CompanyID: [''],
      check1Num: [''],
      check1Date: [''],
      check1Amount: [''],
      check1QBExp: [''],
      check1QBExpDate: [''],

      check2CompanyID: [''],
      check2Num: [''],
      check2Date: [''],
      check2Amount: [''],
      check2QBExp: [''],
      check2QBExpDate: [''],

      check3CompanyID: [''],
      check3Num: [''],
      check3Date: [''],
      check3Amount: [''],
      check3QBExp: [''],
      check3QBExpDate: [''],

      check4CompanyID: [''],
      check4Num: [''],
      check4Date: [''],
      check4Amount: [''],
      check4QBExp: [''],
      check4QBExpDate: [''],

      check5CompanyID: [''],
      check5Num: [''],
      check5Date: [''],
      check5Amount: [''],
      check5QBExp: [''],
      check5QBExpDate: [''],
    });
  }
  fillTabType(tab: string, from: string = '') {
    this.tabType = tab;
    this.setEmailCustodianRecords();
    if (tab == 'Breakdown') {
      if (this.selectedStudyID.length != 0) {
        if (from == 'email') {
          this.HiddenemailCustodianRecords.nativeElement.click();
        } else {
          this.printCustodianRecords();
        }
      } else {
        this.notificationService.showNotification({
          alertHeader: null,
          alertMessage: 'No studies are selected',
          alertType: 400
        });
        return false;
      }
    } else if (tab == 'Label') {
      if (this.selectedLabelStudyID.length != 0) {
        this.printCustodianRecords();
      } else {
        this.notificationService.showNotification({
          alertHeader: null,
          alertMessage: 'No studies are selected',
          alertType: 400
        });
        return false;
      }
    }

  }

  selectionChanged(data: any) {
    this.selectedStudyID = data.selectedRowsData;
  }
  selectionLabelChanged(data: any) {
    this.selectedLabelStudyID = data.selectedRowsData;
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
  resetEmailCustodianRecordsForm() {
    this.emailCustodianRecordsForm.reset();
    this.emailCustodianRecordsForm.clearValidators();
    this.emailCustodianRecordsFormInit();
    //this.setEmailCustodianRecords();

  }
  setEmailCustodianRecords() {
    if (this.requestDetailForRequestDetailTab.CompanyEmail)
      this.companyEmailChecked = true;
    else
      this.companyEmailChecked = false;

    this.emailCustodianRecordsForm.patchValue({
      isActiveCompanyEmail: this.companyEmailChecked,
      Subject: (this.tabType == 'Custodian') ? `Custodian Record Document from Precise Imaging REF# ${this.requestDetailForRequestDetailTab.RefNum}` : `Breakdown Summary from Precise Imaging REF# ${this.requestDetailForRequestDetailTab.RefNum}`,
      emailBody: `Reference #: ${this.requestDetailForRequestDetailTab.RefNum} \nRecords Company: [[ ${this.requestDetailForRequestDetailTab.CompanyName} ]] \nPatient ID: {{ ${this.requestDetailForRequestDetailTab.PATIENTID} }}            
        \nPlease see the attached file. Any question please email subs@precisemri.com            
        \nCheck status of your request online @ subs.precisemri.com               
        \n\nThank You \nPrecise Imaging`
    });

  }
  sendEmail(type: string) {
    this.isemailCustodianSubmitted = true;
    this.modalValue = 'modal';
    if (this.emailCustodianRecordsForm.invalid) {
      this.modalValue = '';
      return;
    }
    if (!this.emailCustodianFormControls.isActiveCompanyEmail.value && this.emailCustodianFormControls.emailAddressFirst.value == '' && this.emailCustodianFormControls.emailAddressSec.value == '' && this.emailCustodianFormControls.emailAddressThird.value == '') {
      this.notificationService.showNotification({
        alertHeader: 'Error',
        alertMessage: 'Add atleast one email address',
        alertType: 400
      });
      return;
    }
    let inputEmails = [];
    if (this.emailCustodianFormControls.isActiveCompanyEmail.value)
      inputEmails.push(this.requestDetailForRequestDetailTab.CompanyEmail)
    if (this.emailCustodianFormControls.emailAddressFirst.value != '')
      inputEmails.push(this.emailCustodianFormControls.emailAddressFirst.value)
    if (this.emailCustodianFormControls.emailAddressSec.value != '')
      inputEmails.push(this.emailCustodianFormControls.emailAddressSec.value)
    if (this.emailCustodianFormControls.emailAddressThird.value != '')
      inputEmails.push(this.emailCustodianFormControls.emailAddressThird.value)
    var body: any;
    if (this.tabType == 'Custodian') {
      body = {
        'SubsId': this.subsId,
        'PatientId': this.requestDetailForRequestDetailTab.PATIENTID,
        'LastName': this.requestDetailForRequestDetailTab.FAMILYNAME,
        'FirstName': this.requestDetailForRequestDetailTab.GIVENNAME,
        'UserId': this.storageService.user.UserId,
        'RefNum': this.requestDetailForRequestDetailTab.RefNum,
        'Subject': this.emailCustodianFormControls.Subject.value,
        'Body': this.emailCustodianFormControls.emailBody.value,
        'EmailTo': inputEmails.toString(),
        'Status': this.requestDetailForRequestDetailTab.Status,
        'CopiedRecords': this.custodianRecordsFormControls.copiedRecords.value,
        'CopiedRecordsBilling': this.custodianRecordsFormControls.copiedRecordsBilling.value,
        'CopiedRecordsMedical': this.custodianRecordsFormControls.copiedRecordsMedical.value,
        'CopiedRecordsBreakdown': this.custodianRecordsFormControls.copiedRecordsBreakdown.value,
        'CopiedRecordsOther': this.custodianRecordsFormControls.copiedRecordsOther.value,
        'CopiedRecordsOtherDesc': this.custodianRecordsFormControls.copiedRecordsOtherDesc.value,
        'NoRecords': this.custodianRecordsFormControls.noRecords.value,
        'NoRecordsBilling': this.custodianRecordsFormControls.noRecordsBilling.value,
        'NoRecordsMedical': this.custodianRecordsFormControls.noRecordsMedical.value,
        'NoRecordsLost': this.custodianRecordsFormControls.noRecordsLost.value,
        'NoRecordsDestroyed': this.custodianRecordsFormControls.noRecordsDestroyed.value,
        'NoRecordsOther': this.custodianRecordsFormControls.noRecordsOther.value,
        'NoRecordsOtherDesc': this.custodianRecordsFormControls.noRecordsOtherDesc.value,
      }
    } else if (this.tabType == 'Breakdown') {
      var checkedInternalStudyid = [];
      for (let i = 0; i < this.selectedStudyID.length; i++) {
        checkedInternalStudyid.push(this.selectedStudyID[i].InternalStudyID)
      }
      body = {
        'SubsId': this.subsId,
        'PatientId': this.requestDetailForRequestDetailTab.PATIENTID,
        'LastName': this.requestDetailForRequestDetailTab.FAMILYNAME,
        'FirstName': this.requestDetailForRequestDetailTab.GIVENNAME,
        'UserId': this.storageService.user.UserId,
        'RefNum': this.requestDetailForRequestDetailTab.RefNum,
        'Subject': this.emailCustodianFormControls.Subject.value,
        'Body': this.emailCustodianFormControls.emailBody.value,
        'EmailTo': inputEmails.toString(),
        'Status': this.requestDetailForRequestDetailTab.Status,
        'InternalStudyId': checkedInternalStudyid.toString()
      }
    }
    this.sendDataForEmail(body, type);

    //

  }
  sendDataForEmail(body: any, type: string) {
    if (type == 'Finalize') {
      if (this.tabType == 'Custodian') {
        this.subsService.emailFinalizeCustodianRecords(true, body).subscribe((res) => {
          if (res.responseCode == 200) {
            this.sucessMessage(res);
          }
        }, (err: any) => {
          this.errorMessage(err);
        });
      } else if (this.tabType == 'Breakdown') {
        this.subsService.emailFinalizeBreakDownRecords(true, body).subscribe((res) => {
          if (res.responseCode == 200) {
            this.sucessMessage(res);
            this.deSelectRows();
          }
        }, (err: any) => {
          this.errorMessage(err);
        });
      }
    }
    else {
      if (this.tabType == 'Custodian') {
        this.subsService.emailCustodianRecords(true, body).subscribe((res) => {
          if (res.responseCode == 200) {
            this.sucessMessage(res);
          }
        }, (err: any) => {
          this.errorMessage(err);
        });
      } else if (this.tabType == 'Breakdown'){
        this.subsService.emailBreakDownRecords(true, body).subscribe((res) => {
          if (res.responseCode == 200) {
            this.sucessMessage(res);
            this.deSelectRows();
          }
        }, (err: any) => {
          this.errorMessage(err);
        });
      }
    }
  }
  deSelectRows() {
    $('.dx-command-select[role="columnheader"]').find('.dx-select-checkbox[aria-checked="mixed"').trigger('click')
    $('.dx-command-select[role="columnheader"]').find('.dx-select-checkbox[aria-checked="true"').trigger('click')
  }


  printCustodianRecords() {
    var body: any;
    if (this.tabType == 'Custodian') {
      body = {
        'SubsId': this.subsId,
        'PatientId': this.requestDetailForRequestDetailTab.PATIENTID,
        'LastName': this.requestDetailForRequestDetailTab.LastNameCNR,
        'FirstName': this.requestDetailForRequestDetailTab.FirstNameCNR,
        'UserId': this.storageService.user.UserId,
        'RefNum': this.requestDetailForRequestDetailTab.RefNum,
        'Subject': '',
        'Body': '',
        'EmailTo': '',
        'Status': this.requestDetailForRequestDetailTab.Status,
        'CopiedRecords': this.custodianRecordsFormControls.copiedRecords.value,
        'CopiedRecordsBilling': this.custodianRecordsFormControls.copiedRecordsBilling.value,
        'CopiedRecordsMedical': this.custodianRecordsFormControls.copiedRecordsMedical.value,
        'CopiedRecordsBreakdown': this.custodianRecordsFormControls.copiedRecordsBreakdown.value,
        'CopiedRecordsOther': this.custodianRecordsFormControls.copiedRecordsOther.value,
        'CopiedRecordsOtherDesc': this.custodianRecordsFormControls.copiedRecordsOtherDesc.value,
        'NoRecords': this.custodianRecordsFormControls.noRecords.value,
        'NoRecordsBilling': this.custodianRecordsFormControls.noRecordsBilling.value,
        'NoRecordsMedical': this.custodianRecordsFormControls.noRecordsMedical.value,
        'NoRecordsLost': this.custodianRecordsFormControls.noRecordsLost.value,
        'NoRecordsDestroyed': this.custodianRecordsFormControls.noRecordsDestroyed.value,
        'NoRecordsOther': this.custodianRecordsFormControls.noRecordsOther.value,
        'NoRecordsOtherDesc': this.custodianRecordsFormControls.noRecordsOtherDesc.value,
      }
      this.subsService.printCustodianRecords(true, body).subscribe((res) => {
        if (res.response != null) {
          //this.sucessMessage(res);
          this.displayFile(res.response[0].fileName, res.response[0].file)
        }
      }, (err: any) => {
        this.errorMessage(err);
      });
    }
    else if (this.tabType == 'Breakdown' || this.tabType == 'Label') {
      var checkedInternalStudyid = [];
      if (this.tabType == 'Breakdown') {
        for (let i = 0; i < this.selectedStudyID.length; i++) {
          checkedInternalStudyid.push(this.selectedStudyID[i].InternalStudyID)
        }
      } else {
        for (let i = 0; i < this.selectedLabelStudyID.length; i++) {
          checkedInternalStudyid.push(this.selectedLabelStudyID[i].InternalStudyID)
        }
      }

      body = {
        'SubsId': this.subsId,
        'PatientId': this.requestDetailForRequestDetailTab.PATIENTID,
        'LastName': this.requestDetailForRequestDetailTab.FAMILYNAME,
        'FirstName': this.requestDetailForRequestDetailTab.GIVENNAME,
        'UserId': this.storageService.user.UserId,
        'RefNum': this.requestDetailForRequestDetailTab.RefNum,
        'Subject': '',
        'Body': '',
        'EmailTo': '',
        'Status': this.requestDetailForRequestDetailTab.Status,
        'InternalStudyId': checkedInternalStudyid.toString()
      }
      if (this.tabType == 'Breakdown') {
        this.subsService.printBreakdownRecords(true, body).subscribe((res) => {
          if (res.response != null) {
            //this.sucessMessage(res);
            this.deSelectRows();
            this.displayFile(res.response[0].fileName, res.response[0].file)
          }
        }, (err: any) => {
          this.errorMessage(err);
        });
      } else {
        this.subsService.printFilmJacketLabelRecords(true, body).subscribe((res) => {
          if (res.response != null) {
            // this.sucessMessage(res);
            this.deSelectRows();
            this.displayFile(res.response[0].fileName, res.response[0].file)
          }
        }, (err: any) => {
          this.errorMessage(err);
        });
      }
    }
  }


  getSubsDetailById(data: any) {
    this.subsId = data.subsId;  //set Current SubsId
    this.logListForLogTab = [];
    this.editPatientId = data.patientId;
    this.popUpTitle = '';
    // alert(data.patientId);
    if (data.patientId) {
      this.isShowDocTab = true;
    }
    else {
      this.isShowDocTab = false;
    }
    this.breakdownAndLabelsList = [];
    this.subsService.getSubsDetailBySubsId(true, data.subsId, data.patientId).subscribe((res) => {
      if (res.response != null) {
        //this.status = res.response[0][0]['RequestDetails_And_CustodianRecords_And_CheckDetail_Tab'][0].Status;
        //this.disableDateReady = this.status === 'READY FOR PICKUP';
        this.requestDetailForRequestDetailTab = res.response[0][0]['RequestDetails_And_CustodianRecords_And_CheckDetail_Tab'][0];
        if (res.response[1][0]['Log_Tab'] != null) {
          this.logListForLogTab = res.response[1][0]['Log_Tab'];
          this.logListForLogTabPagging = this.logListForLogTab.slice(0, this.pageSizeLog);
          this.totalRecords = res.response[1][0]['Log_Tab'].Totalrecords;
        }
        if (res.response[2][0]['Breakdown_And_Labels_Tab']) {
          this.breakdownAndLabelsList = res.response[2][0]['Breakdown_And_Labels_Tab'];
          if (this.breakdownAndLabelsList.length === 1 && !this.breakdownAndLabelsList[0].InternalStudyID) {
            this.breakdownAndLabelsList = [];
          }
        }
        // this.setEmailCustodianRecords();
        this.getAllRepNameByCompanyId(this.requestDetailForRequestDetailTab.CompanyID);
        this.setRequestDetailForm(this.requestDetailForRequestDetailTab);
        this.setCustodianRecords(this.requestDetailForRequestDetailTab);
        this.setCheckDetailForm(this.requestDetailForRequestDetailTab);
        this.getAllSubsNotes(data.subsId);
      }
    });
  }
  setRequestDetailForm(requestDetail: any) {
    
    if (requestDetail.Type != null && requestDetail.Type != '') {
      this.selectedRequestedTypeList = requestDetail.Type.toString().split(',').map(function (item) {
        return item.trim();
      });
    }
    if (requestDetail.Media != null && requestDetail.Media != '') {
      this.selectedMediaList = requestDetail.Media.toString().split(',').map(function (item) {
        return item.trim();
      });
    }

    if (requestDetail.Type != null && requestDetail.Type != '') {
      this.selectedProvidedTypeList = requestDetail.Type.toString().split(',').map(function (item) {
        return item.trim();
      });
    }

    this.selectedRapIDModel = requestDetail.RepID;
    if (this.repNameList.length == 0 && requestDetail.RepID) {
      this.tempRepName = { RepID: requestDetail.RepID, RepName: requestDetail.RepName }
      this.repNameList.push(this.tempRepName);
    }
    requestDetail.LastNameCNR = requestDetail.LastNameCNR ?? requestDetail.FAMILYNAME;
    requestDetail.FirstNameCNR = requestDetail.FirstNameCNR ?? requestDetail.GIVENNAME;
    this.popUpTitle = (requestDetail.LastNameCNR ? requestDetail.LastNameCNR : '') + ', ' + (requestDetail.FirstNameCNR ? requestDetail.FirstNameCNR : '') + ' - ' + this.subsId;
    this.selectedCompanyIDModel = requestDetail.CompanyID;

    this.imageSignature = requestDetail.Signature != null ? this.convertBase64ToImage(requestDetail.Signature) : '';
    this.requestDetailForm.patchValue({
    
      patientId: requestDetail.PATIENTID,
      familyName: requestDetail.FAMILYNAME,
      givenName: requestDetail.GIVENNAME,
      lastNameCnr: requestDetail.LastNameCNR,
      firstNameCnr: requestDetail.FirstNameCNR,
      birthDate: requestDetail.BirthDate,
      birthDateCnr: requestDetail.BirthDateCNR,
      status: requestDetail.Status,
      refNum: requestDetail.RefNum,
      secondaryRefNum: requestDetail.SecondaryRefNum,
      dateRequested: requestDetail.DateRequested,
      dateEntered: requestDetail.DateEntered,
      dateReady: requestDetail.DateReady,
      isMailedChecked: requestDetail.IsMailedChecked,
      mailedDateTime: requestDetail.MailedDateTime,
      // pickupCost: parseFloat(requestDetail.PickupCost).toFixed(2),
      pickupCost: requestDetail.PickupCost > -1 ? parseFloat(requestDetail.PickupCost).toFixed(2) : '',
      datePickedUp: requestDetail.DatePickedUp,
      pickedUpBy: requestDetail.PickedUpBy,
    });
  }
  setCustodianRecords(custodianRecords: any) {
    this.custodianRecordsForm.patchValue({
      copiedRecords: custodianRecords.CopiedRecords,
      copiedRecordsBilling: custodianRecords.CopiedRecordsBilling,
      copiedRecordsMedical: custodianRecords.CopiedRecordsMedical,
      copiedRecordsBreakdown: custodianRecords.CopiedRecordsBreakdown,
      copiedRecordsOther: custodianRecords.CopiedRecordsOther,
      copiedRecordsOtherDesc: custodianRecords.CopiedRecordsOtherDesc,
      noRecords: custodianRecords.NoRecords,
      noRecordsBilling: custodianRecords.NoRecordsBilling,
      noRecordsMedical: custodianRecords.NoRecordsMedical,
      noRecordsLost: custodianRecords.NoRecordsLost,
      noRecordsDestroyed: custodianRecords.NoRecordsDestroyed,
      noRecordsOther: custodianRecords.NoRecordsOther,
      noRecordsOtherDesc: custodianRecords.NoRecordsOtherDesc
    });
  }
  setCheckDetailForm(data: any) {
    this.selectedCompanyIDCheck1 = data.CheckCompanyId??data.CompanyID;
    this.selectedCompanyIDCheck2 = data.Check2CompanyID;
    this.selectedCompanyIDCheck3 = data.Check3CompanyID;
    this.selectedCompanyIDCheck4 = data.Check4CompanyID;
    this.selectedCompanyIDCheck5 = data.Check5CompanyID;
    this.CheckDetailFile = data.CheckDetailFile;
    this.CheckDetailFile2 = data.CheckDetailFile2;
    this.CheckDetailFile3 = data.CheckDetailFile3;
    this.CheckDetailFile4 = data.CheckDetailFile4;
    this.CheckDetailFile5 = data.CheckDetailFile5;
    this.filename = data.filename;
    this.filename2 = data.filename2;
    this.filename3 = data.filename3;
    this.filename4 = data.filename4;
    this.filename5 = data.filename5;
    this.checkDetailForm.patchValue({
      check1CompanyID: data.CheckCompanyId??data.CompanyID,
      check1Num: data.CheckNum,
      check1Date: data.CheckDate,
      check1Amount: data.CheckAmount ? parseFloat(data.CheckAmount).toFixed(2) : '',
      check1QBExp: data.CheckQBExp,
      check1QBExpDate: this.datePipe.transform(data.CheckQBExpDate, this.dateTimeFormatCustom.DateTimeWithSec),

      check2CompanyID: data.Check2CompanyId,
      check2Num: data.Check2Num,
      check2Date: data.Check2Date,
      check2Amount: data.Check2Amount ? parseFloat(data.Check2Amount).toFixed(2) : '',
      check2QBExp: data.Check2QBExp,
      check2QBExpDate: this.datePipe.transform(data.Check2QBExpDate, this.dateTimeFormatCustom.DateTimeWithSec),

      check3CompanyID: data.Check3CompanyId,
      check3Num: data.Check3Num,
      check3Date: data.Check3Date,
      check3Amount: data.Check3Amount ? parseFloat(data.Check3Amount).toFixed(2) : '',
      check3QBExp: data.Check3QBExp,
      check3QBExpDate: this.datePipe.transform(data.Check3QBExpDate, this.dateTimeFormatCustom.DateTimeWithSec),

      check4CompanyID: data.Check4CompanyId,
      check4Num: data.Check4Num,
      check4Date: data.Check4Date,
      check4Amount: data.Check4Amount ? parseFloat(data.Check4Amount).toFixed(2) : '',
      check4QBExp: data.Check4QBExp,
      check4QBExpDate: this.datePipe.transform(data.Check4QBExpDate, this.dateTimeFormatCustom.DateTimeWithSec),

      check5CompanyID: data.Check5CompanyId,
      check5Num: data.Check5Num,                                             
      check5Date: data.Check5Date,
      check5Amount: data.Check5Amount ? parseFloat(data.Check5Amount).toFixed(2) : '',
      check5QBExp: data.Check5QBExp,
      check5QBExpDate: this.datePipe.transform(data.Check5QBExpDate, this.dateTimeFormatCustom.DateTimeWithSec),
    });
  }
  getAllRepNameByCompanyId(compnayId: any) {

    this.selectedRapIDModel = null;
    this.repNameList = [];
    if (compnayId != null) {
      this.subsService.getAllRepNameByCompanyId(true, compnayId).subscribe((res) => {
        if (res.response != null) {
          this.repNameList = res.response;
          if (this.tempRepName) {
            this.repNameList.push(this.tempRepName)

          }
        }
        else {
          if (this.tempRepName) {
            this.repNameList.push(this.tempRepName)
          }
        }
      }, (err: any) => {
        this.errorMessage(err);
      });
    }
  }
  getAllSubsNotes(subsId: any) {
    this.notesListForNotesTab = [];
    this.subsService.getAllSubsNotes(true, subsId).subscribe((res) => {
      if (res.response != null) {
        this.notesListForNotesTab = res.response;
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }

  convertBase64ToImage(base64ImageText: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64ImageText);
  }
  addSubsNotes(subsNote: any) {
    if (this.subsId) {
      let body = {
        'subsID': this.subsId,
        'subsNote': subsNote,
        'username': this.storageService.user.FullName
      }
      this.subsService.addSubsNotes(true, body).subscribe((res) => {
        if (res.response) {

          this.sucessMessage(res);
          this.subsNotesModel = '';
          this.getAllSubsNotes(this.subsId);
        }
        else {
          this.unSucessMessage(res, 'Something went wrong');
          this.subsNotesModel = '';
        }
      }, (err: any) => {
        this.errorMessage(err);
      });
    } else {
      this.notificationService.showNotification({
        alertHeader: '',
        alertMessage: 'Please insert sub before adding notes',
        alertType: 400
      });

    }

  }
  updateImageCount(row: any) {
    let internalStudyId = row.data.InternalStudyID;
    let userId = Number(this.storageService.user.UserId);
    this.subsService.subsUpdateImageCount(true, internalStudyId, userId).subscribe((res) => {
      if (res.response != null) {

        this.emailPopUp.nativeElement.click();
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }
  setMailedateTime(event: any) {
    if (event.target.checked) {
      this.requestDetailForm.get('mailedDateTime').setValue(this.datePipe.transform(new Date(), this.dateTimeFormatCustom.DateTimeWithSec))
      return;
    }
    this.requestDetailForm.get('mailedDateTime').setValue('');
  }
  converNumberToDecimal(event: any, formControlName: any) {

    if (event.target.value) {
      this.checkDetailForm.get(formControlName).setValue(this.decimalPipe.transform(parseFloat(event.target.value.toString().replace(/,/g, "")).toFixed(2), '1.0-2'))
    }
  }
  converNumberToDecimal2(event: any, formControlName: any) {
    if (event.target.value) {
      this.requestDetailForm.get(formControlName).setValue(this.decimalPipe.transform(parseFloat(event.target.value.toString().replace(/,/g, "")).toFixed(2), '1.0-2'))
    }
  }
  allowNumberOnly(event: any): boolean {

    return this.commonMethodService.alowNumberOnly(event);
  }
  // common Notification Method
  unSucessMessage(data: any, message: any) {
    this.notificationService.showNotification({
      alertHeader: message,
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  onQBExportCheckChange(event: any, formControlName: any) {

    this.currentFormControlNameForQBCheck = formControlName;
    if (event.target.checked) {
      this.qbExportCurrentCheckBoxValue = true;
      this.exportCheckConfirmationMessage = 'Are you sure you want to set check to QB Exported?';
      return;
    }
    this.qbExportCurrentCheckBoxValue = false;
    this.exportCheckConfirmationMessage = 'Are you sure you want to set check to QB NOT Exported?'
  }
  qbCheckAllowExport() {

    this.checkDetailForm.get(this.currentFormControlNameForQBCheck).setValue(this.qbExportCurrentCheckBoxValue);
  }
  qbCheckNotAllowExport() {

    this.checkDetailForm.get(this.currentFormControlNameForQBCheck).setValue(!this.qbExportCurrentCheckBoxValue);
  }

  subsDeleteRequest() {

    this.subsService.subsDeleteRequest(true, this.subsId.toString()).subscribe((res) => {
      if (res.responseCode == 200) {
        this.sucessMessage(res);
        this.mainPopCloseButton.nativeElement.click();
        this.messageChildToParent.emit(true);
        this.messageToPatientDetail.emit(true);
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }
  subsDeletePickupConfirmation() {
    this.subsService.subsDeletePickupConfirmation(true, this.subsId.toString(), Number(this.storageService.user.UserId)).subscribe((res) => {
      if (res.response != null) {
        this.sucessMessage(res);
        this.getSubsDetailById(this.requestPayloadData);
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }
  subsNotReadyForPickup() {
    this.subsService.subsNotReadyForPickup(true, this.subsId.toString(), Number(this.storageService.user.UserId)).subscribe((res) => {
      if (res.response != null) {
        this.sucessMessage(res);
        this.getSubsDetailById(this.requestPayloadData);
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }
  subsReadyForPickup() {

    this.subsService.subsReadyForPickup(true, this.subsId.toString(), Number(this.storageService.user.UserId)).subscribe((res) => {
      if (res.response != null) {
        this.sucessMessage(res);  
        this.getSubsDetailById(this.requestPayloadData);

      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }
  seeAndClearNotes(isSeeNotes: boolean, popUpMessage: any) {
    this.isSeeNotes = isSeeNotes;
    this.seeAndClearNotesPopUpMessage = popUpMessage;
  }
  seeNotes() {
    this.subsService.subsSeeNotes(true, this.subsId.toString(), Number(this.storageService.user.UserId)).subscribe((res) => {
      if (res.response != null) {
        this.sucessMessage(res);
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }
  clearSeeNotes() {
    this.subsService.subsClearSeeNotes(true, this.subsId.toString(), Number(this.storageService.user.UserId)).subscribe((res) => {
      if (res.response != null) {
        this.sucessMessage(res);
      }
    }, (err: any) => {
      this.errorMessage(err);
    });
  }
  manageSeeAndClearNotes() {
    if (this.isSeeNotes) {
      this.seeNotes();
    }
    else {
      this.clearSeeNotes();
    }
  }
  createAndUpdateSubsDetail(isForSubsCreate: boolean) {
    this.isrequestDetailFormSubmitted = true;
    this.modelValue = 'modal';
    if (this.requestDetailForm.invalid || this.selectedRequestedTypeList.length == 0 || this.selectedCompanyIDModel == null || this.selectedProvidedTypeList.length == 0) {
      this.modelValue = '';
      return;
    }


    let body = {
      subsID: this.subsId,
      lastNameCNR: this.requestDetailFormControls.lastNameCnr.value,
      firstNameCNR: this.requestDetailFormControls.firstNameCnr.value,
      birthdateCNR: this.requestDetailFormControls.birthDateCnr.value,
      companyID: this.selectedCompanyIDModel,
      repID: this.selectedRapIDModel,
      refNum: this.requestDetailFormControls.refNum.value,
      secondaryRefNum: this.requestDetailFormControls.secondaryRefNum.value,
      type: this.selectedRequestedTypeList != null ? this.selectedRequestedTypeList.toString() : '',
      providedType: this.selectedProvidedTypeList != null ? this.selectedProvidedTypeList.toString() : '',
      media: this.selectedMediaList != null ? this.selectedMediaList.toString() : '',
      dateRequested: this.datePipe.transform(this.requestDetailFormControls.dateRequested.value, this.dateTimeFormatCustom.Date),
      dateEntered: this.datePipe.transform(this.requestDetailFormControls.dateEntered.value, this.dateTimeFormatCustom.Date),
      dateReady: this.datePipe.transform(this.requestDetailFormControls.dateReady.value, this.dateTimeFormatCustom.Date),
      isMailedChecked: this.requestDetailFormControls.isMailedChecked.value,
      mailedDateTime: this.requestDetailFormControls.mailedDateTime.value,
      pickupCost: this.requestDetailFormControls.pickupCost.value,
      datePickedUp: this.datePipe.transform(this.requestDetailFormControls.datePickedUp.value, this.dateTimeFormatCustom.Date),
      pickedUpBy: this.requestDetailFormControls.pickedUpBy.value,
      signature: this.requestDetailFormControls.signature.value,
      copiedRecords: this.custodianRecordsFormControls.copiedRecords.value,
      copiedRecordsBilling: this.custodianRecordsFormControls.copiedRecordsBilling.value,
      copiedRecordsMedical: this.custodianRecordsFormControls.copiedRecordsMedical.value,
      copiedRecordsBreakdown: this.custodianRecordsFormControls.copiedRecordsBreakdown.value,
      copiedRecordsOther: this.custodianRecordsFormControls.copiedRecordsOther.value,
      copiedRecordsOtherDesc: this.custodianRecordsFormControls.copiedRecordsOtherDesc.value,
      noRecords: this.custodianRecordsFormControls.noRecords.value,
      noRecordsBilling: this.custodianRecordsFormControls.noRecordsBilling.value,
      noRecordsMedical: this.custodianRecordsFormControls.noRecordsMedical.value,
      noRecordsLost: this.custodianRecordsFormControls.noRecordsLost.value,
      noRecordsDestroyed: this.custodianRecordsFormControls.noRecordsDestroyed.value,
      noRecordsOther: this.custodianRecordsFormControls.noRecordsOther.value,
      noRecordsOtherDesc: this.custodianRecordsFormControls.noRecordsOtherDesc.value,
      checkCompanyId: this.selectedCompanyIDCheck1,
      checkNum: this.checkDetailFormControls.check1Num.value,
      checkDate: this.checkDetailFormControls.check1Date.value,
      checkAmount: this.checkDetailFormControls.check1Amount.value,
      checkQBExp: this.checkDetailFormControls.check1QBExp.value,
      checkQBExpDate: this.checkDetailFormControls.check1QBExpDate.value,
      check2CompanyID: this.selectedCompanyIDCheck2,
      check2Num: this.checkDetailFormControls.check2Num.value,
      check2Date: this.checkDetailFormControls.check2Date.value,
      check2Amount: this.checkDetailFormControls.check2Amount.value,
      check2QBExp: this.checkDetailFormControls.check2QBExp.value,
      check2QBExpDate: this.checkDetailFormControls.check2QBExpDate.value,
      check3CompanyID: this.selectedCompanyIDCheck3,
      check3Num: this.checkDetailFormControls.check3Num.value,
      check3Date: this.checkDetailFormControls.check3Date.value,
      check3Amount: this.checkDetailFormControls.check3Amount.value,
      check3QBExp: this.checkDetailFormControls.check3QBExp.value,
      check3QBExpDate: this.checkDetailFormControls.check3QBExpDate.value,
      check4CompanyID: this.selectedCompanyIDCheck4,
      check4Num: this.checkDetailFormControls.check4Num.value,
      check4Date: this.checkDetailFormControls.check4Date.value,
      check4Amount: this.checkDetailFormControls.check4Amount.value,
      check4QBExp: this.checkDetailFormControls.check4QBExp.value,
      check4QBExpDate: this.checkDetailFormControls.check4QBExpDate.value,
      check5CompanyID: this.selectedCompanyIDCheck5,
      check5Num: this.checkDetailFormControls.check5Num.value,
      check5Date: this.checkDetailFormControls.check5Date.value,
      check5Amount: this.checkDetailFormControls.check5Amount.value,
      check5QBExp: this.checkDetailFormControls.check5QBExp.value,
      check5QBExpDate: this.checkDetailFormControls.check5QBExpDate.value,
      notes: this.subsNotesModel,
      userId: this.storageService.user.UserId,
      userName: this.storageService.user.FullName,
    }

    if (isForSubsCreate) {
      this.createNewSubs(body);
    }
    else {
      this.updateSubsDetail(body);
    }
    this.commonMethodService.toggleReqSearchpopup(true);
  }
  updateSubsDetail(body: any) {
    this.subsService.updateSubsDetail(true, body).subscribe((res) => {
      if (res.response != null) {
        this.sucessMessage(res);
        this.resetDetailPageForm();
        this.messageChildToParent.emit(true);
        this.messageToPatientDetail.emit(true);
      }
    }, (err) => {
      this.errorMessage(err);
    });
  }
  createNewSubs(body: any) {

    this.subsService.createNewSubs(true, body).subscribe((res) => {
      if (res.response != null) {
        this.messageChildToParent.emit(true);
        this.sucessMessage(res);
        this.resetDetailPageForm();
      }
      else {
        this.errorMessage(res);
      }
    }, (err) => {
      this.errorMessage(err);
    });
  }
  showAlert() {
    alert('Coming Soon');
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
  resetDetailPageForm() {
    this.resetSubsFormAndProperties();
    this.requestDetailForm.reset();
    this.requestDetailForm.clearValidators()
    this.requestDetailForm.markAsUntouched();
    this.isrequestDetailFormSubmitted = false;
  }
  displayFile(fileName: string, fileData: any) {
    if (fileData) {
      // if (fileName.match(/.(jpg|jpeg|png|gif)$/i)) {
      //   fileData = 'data:image/png;base64,' + fileData;
      // }
      // else if (fileName.match(/.(pdf)$/i)) {
      //   fileData = 'data:application/pdf;base64,' + fileData;
      // }
      fileData = 'data:application/pdf;base64,' + fileData;
      this.fileName = fileName;
      this.fileData = this.sanitizer.bypassSecurityTrustResourceUrl(fileData);
      this.hiddenViewFile.nativeElement.click();
    }
  }


  onPageNumberChangeLog(pageNumber: any) {

    this.pageNumberLog = pageNumber;
    this.logListForLogTabPagging = this.logListForLogTab.slice((this.pageNumberLog - 1) * this.pageSizeLog, ((this.pageNumberLog - 1) * this.pageSizeLog) + this.pageSizeLog)
  }
  get requestDetailFormControls() { return this.requestDetailForm.controls; }
  get custodianRecordsFormControls() { return this.custodianRecordsForm.controls; }
  get checkDetailFormControls() { return this.checkDetailForm.controls; }
  get emailCustodianFormControls() { return this.emailCustodianRecordsForm.controls; }


  removeComma(event: any) {
    if (event.target.value) {
      // here we just remove the commas from value
      event.target.value = event.target.value.toString().replace(/,/g, "");
    } else {
      event.target.value = "";
    }
  }
}


