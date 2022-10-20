import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { ReferrersService } from 'src/app/services/referrers.service';
import { ActionMenuConstant, SubsService } from 'src/app/services/subs-service/subs.service';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { BrokerService } from 'src/app/services/broker.service';
import { CommonRegex } from 'src/app/constants/commonregex';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { patientPortalResponseStatus } from 'src/app/models/patient-response';

declare const $: any;
@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css'],
  providers: [DatePipe]
})
export class PatientDetailComponent implements OnInit {
  @ViewChild('hiddenButton1', { static: false }) hiddenButton1: ElementRef;
  @ViewChild('hiddenBtnWarningMsg', { static: false }) hiddenBtnWarningMsg: ElementRef;
  @ViewChild('closebtn', { static: false }) closebtn: ElementRef;
  @ViewChild('notes') inputNotes;

  patientDetailForm: FormGroup;
  patientStudyDetailForm: FormGroup;
  patientPIDetailForm: FormGroup;
  patientDetail: any;
  patientCompareDetail: any = {};
  patientDetailInsuranceCoverage: [] = [];
  patientDetailNotes: [] = [];
  patientStudySummary: [] = [];
  patientStudySummaryList = [];
  1;
  studyDetail: any;
  procedureCode: [] = [];
  studyNotes: [] = [];
  piDetails: any
  piNotes: [] = [];
  allNotes: [] = [];
  alertList: [] = [];
  fullLog: [] = [];
  Issubmitted: boolean = false;
  fullLogList: any = [];
  appointmentLog: [] = [];
  appointmentLogList: any = [];
  patientDetailTabNotesModel: string;
  studyDetailTabNotesModel: string;
  piDetailTabNotesModel: string;
  allNotesTabModel: string;
  Reason: any;
  modalValue: string = 'modal';
  // Grid Properties
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  allMode: string;
  checkBoxesMode: string;
  //
  totalSchedulingFacility: number;
  alertDetail: string;
  PatientID: string;
  patientDetailPageTitle: string;
  isStudySummaryRowClicked: boolean = false;
  selectedInternalstudyId: string;
  selectedInternalPatientId: string;
  isHasAlert: boolean = false;
  isHasAlertSelectedTab: boolean = false;
  isPatient: boolean = true;
  editPatientId: string = '';
  pageNumber: number = 1;
  pageSize: number = 20;
  totalRecords: number;
  totalRecordsCreateAlerts: number = 1;
  totalrecordsFullLog: number = 2;
  filterBody: any = {};
  isShowColumnWithNoData = true;
  status: any;
  studySummaryrowData :any ;
  subsTabClick: boolean = true;
  isPatientDataFound:boolean = false;
  readonly commonRegex = CommonRegex;
  //// Subs tab fields

  dropDownActionList: any = [
    { actionName: 'Ready for Pickup' },
    { actionName: 'Not Ready for Pickup' },
    { actionName: 'Delete Pickup Confirmation' },
    { actionName: 'Delete Request' }];
  requestTypeList: any = [{ Name: 'Medical' },
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
  schedulingFacilityList: any[] = [];
  subsPageNumber: number = 1;
  subsPageSize: number = 20;
  subsTotalRecords: number;
  subsTabTopForm: FormGroup;
  subsGridList: [] = [];
  susbGridSelectedRows: any = [];
  companyList: any = [];
  repNameList1: any = [];
  repNameList2: any = [];
  repNameList3: any = [];
  subsList: any = [];
  selectedDropDownActionModel: any;

  selectedCompanyIDModel1: any;
  selectedCompanyIDModel2: any;
  selectedCompanyIDModel3: any;
  selectedRapIDModel1: string;
  selectedRapIDModel2: string;
  selectedRapIDModel3: string;
  susbErrorMsg: string = '';

  readonly dateTimeFormatCustom = DateTimeFormatCustom;

  patientID: any;
  ID; any;
  Alert: any;
  tabId: string = '1'

  pageNumberStudy: number = 1;
  pageSizeStudySummary = 20;
  totalRecordsStudySummary = 1;

  pageNumberLog: number = 1;
  pageSizeLog: number = 20;
  totalRecordLog: number = 1;

  pageNumberAppLog: number = 1;
  pageSizeAppLog: number = 20;
  totalRecordAppLog: number = 1;

  studySummaryClick: boolean = false;

  @Input() pateintIdDynamic: any;
  divPatientId: any = 'patient-Detail-Window';

  constructor(private fb: FormBuilder, private readonly patientService: PatientService,
    private notificationService: NotificationService, private readonly storageService: StorageService,
    private readonly referrersService: ReferrersService, private subsService: SubsService,
    private datePipe: DatePipe, private commonMethodService: CommonMethodService,
    private readonly facilityService: FacilityService,
    private readonly patientPortalService : PatientPortalService,
    private readonly workflowService: WorkflowService,
    private brokerService: BrokerService, private decimalPipe: DecimalPipe) {
    patientService.sendDataToPatientDetail.subscribe(res => {
      this.patientID = res.PatientId;
      this.studySummaryClick = res.click ;
      this.totalRecordsCreateAlerts = 1;
      this.totalrecordsFullLog = 2;
      this.resetPateintDetailFormAndFields();
      this.isHasAlert = res.hasAlert == true ? true : false;
      this.isHasAlertSelectedTab = res.isHasAlertSelectedTab == 1 ? true : false;
      this.editPatientId = res.internalPatientId;
      this.subsTabClick = true;
      //this.subsDateRequest1=this.datePipe.transform(new Date(),'MM/dd/yyyy');
      this.isStudySummaryRowClicked = false;
      this.selectedInternalstudyId = null;
      //this.gridPatient.instance.refresh();
      this.getPatientDetailById(res.internalPatientId, res.internalStudyId);
      if (!this.isHasAlertSelectedTab) {
        this.updateTabId('1')
      }
      else {
        this.onTabclick(true)
      }

    });

    this.commonMethodService.getCreateAlerts$.subscribe((res) => {
      if (res) {
        this.studyAlertByPatientId(true)
      }
    }, (err: any) => {
    });
  }
  ngOnInit(): void {
    if (this.pateintIdDynamic) {
      this.divPatientId = this.pateintIdDynamic;
    }
    this.onPageSizeChange();
    this.setGridSetting();
    this.createPatientDetailFormForPatientDetailTab();
    this.createPatientStudyDetailFormForStudyDetailTab();
    this.createPatientPIDetailFormForPITab();
    this.createSubsTabTopForm();
    this.totalSchedulingFacility = 1;
  }



  createSubsTabTopForm() {
    this.subsTabTopForm = this.fb.group({
      selectedCompanyIDModel1: [''],
      selectedRapIDModel1: [''],
      subsRefNumber1: [''],
      subsDateRequest1: [this.datePipe.transform(new Date(), this.dateTimeFormatCustom.Date)],
      subsCheckNumber1: [''],
      subsCheckDate1: [''],
      subsCheckAmount1: [''],
      subsDueAmount1: [''],
      subsReadyForPickUp1: [false],
      selectedRequestedTypeList1: [''],
      selectedMediaList1: [''],

      selectedCompanyIDModel2: [''],
      selectedRapIDModel2: [''],
      subsRefNumber2: [''],
      subsDateRequest2: [''],
      subsCheckNumber2: [''],
      subsCheckDate2: [''],
      subsCheckAmount2: [''],
      subsDueAmount2: [''],
      subsReadyForPickUp2: [false],
      selectedRequestedTypeList2: [''],
      selectedMediaList2: [''],

      selectedCompanyIDModel3: [''],
      selectedRapIDModel3: [''],
      subsRefNumber3: [''],
      subsDateRequest3: [''],
      subsCheckNumber3: [''],
      subsCheckDate3: [''],
      subsCheckAmount3: [''],
      subsDueAmount3: [''],
      subsReadyForPickUp3: [false],
      selectedRequestedTypeList3: [''],
      selectedMediaList3: ['']

    });
  }
  setGridSetting() {
    this.allMode = 'page';
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
    this.columnResizingMode = this.resizingModes[0];
    this.currentFilter = this.applyFilterTypes[0].key;
  }
  getAllSchedulingFacility(filterBody: any) {

    this.facilityService.getSchedulingFacilityData(true, filterBody, this.pageNumber, this.pageSize).subscribe((res) => {
      this.schedulingFacilityList = [];
      if (res.response != null) {
        this.totalSchedulingFacility = res.totalRecords;
        this.schedulingFacilityList = res.response;
      }
      else {
        this.schedulingFacilityList = [];
        this.totalSchedulingFacility = 1;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  pageChanged(event) {
    this.pageNumber = event;
    this.studyAlertByPatientId(false);
  }

  onPageSizeChange() {
    this.pageSize = this.pageSize;
  }
  createPatientDetailFormForPatientDetailTab() {
    
    this.patientDetailForm = this.fb.group({
      patientId: [''],
      familyName: [''],
      givenName: [''],
      birthDate: [''],
      financialTypeName: [''],
      sex: [''],
      address: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      homePhone: [''],
      cellPhone: [''],
      email: [''],
      businessPhone: [''],
      faxNumber: [''],
      isSmsOff: ['']
    });
  }
  createPatientStudyDetailFormForStudyDetailTab() {
    this.patientStudyDetailForm = this.fb.group({
      patientId: [''],
      familyName: [''],
      givenName: [''],
      status: [''],
      requiredPo: [''],
      studyDescription: [''],
      studyId: [''],
      reqProcedureId: [''],
      internalStudyId: [''],
      accessionNumber: [''],
      studyDateTime: [''],
      scheduledModality: [''],
      scheduledLaterality: [''],
      scheduledBodyPartExamined: [''],
      referringPhysician: [''],
      readingPhysician: [''],
      broker: [''],
      attorney: [''],
      transcriptionist: [''],
      comments: [''],
      history: [''],
      notes: [''],
      referrerId: [''],
      brokerId: [''],
      attorneyId: [''],
    });
  }
  createPatientPIDetailFormForPITab() {
    this.patientPIDetailForm = this.fb.group({
      doiLmp: [''],
      patientLien: [''],
      attorneyLien: [''],
      isNotLienReminder: [''],
      isSentPatAttorney: [''],
      accidentTypeCode: [''],
      billingEmail1: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      billingEmail2: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      billingEmail3: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      billingEmail4: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      billingEmail5: ['', [Validators.email, Validators.pattern(this.commonRegex.EmailRegex)]],
      billingFax1: ['', [Validators.minLength(10)]],
      billingFax2: ['', [Validators.minLength(10)]],
      billingFax3: ['', [Validators.minLength(10)]],
      billingFax4: ['', [Validators.minLength(10)]],
      billingFax5: ['', [Validators.minLength(10)]],
    });
  }

  setPatientDetailFormForPatientDetailTab(data: any) {
    
    this.patientID = data.PATIENTID;
    this.patientDetailPageTitle = data.PATIENTID + ', ' + data.FAMILYNAME + ' ' + data.GIVENNAME + ', ' + this.datePipe.transform(data.BIRTHDATE, this.dateTimeFormatCustom.Date) + ', ' + data.FINANCIALTYPENAME
    this.patientDetailForm.patchValue({
      patientId: data.PATIENTID,
      familyName: data.FAMILYNAME,
      givenName: data.GIVENNAME,
      birthDate: data.BIRTHDATE,
      financialTypeName: data.FINANCIALTYPENAME,
      sex: data.SEX,
      address: data.ADDRESS,
      city: data.CITY,
      state: data.STATE,
      zipCode: data.ZIPCODE,
      homePhone: data.HOMEPHONE,
      cellPhone: data.CELLPHONE,
      email: data.EMAIL,
      businessPhone: data.BUSINESSPHONE,
      faxNumber: data.FAXNUMBER,
      isSmsOff: data.IsSmsOff
    });

  }

  setPatientStudyDetailFormForStudyDetailTab(data: any) {
    this.patientStudyDetailForm.patchValue({
      patientId: data.PATIENTID,
      familyName: data.FAMILYNAME,
      givenName: data.GIVENNAME,
      status: data.STATUS,
      requiredPo: data.RequiredPO,
      studyDescription: data.STUDYDESCRIPTION,
      studyId: data.STUDYID,
      reqProcedureId: data.REQPROCEDUREID,
      internalStudyId: data.INTERNALSTUDYID,
      accessionNumber: data.ACCESSIONNUMBER,
      studyDateTime: data.STUDYDATETIME,
      scheduledModality: data.SCHEDULEDMODALITY,
      scheduledLaterality: data.SCHEDULEDLATERALITY,
      scheduledBodyPartExamined: data.SCHEDULEDBODYPARTEXAMINED,
      referringPhysician: data.REFERRINGPHYSICIAN,
      readingPhysician: data.READINGPHYSICIAN,
      broker: data.BROKER,
      attorney: data.ATTORNEY,
      transcriptionist: data.TRANSCRIPTIONIST,
      comments: data.Comments,
      history: data.History,
      notes: data.Notes,
      referrerId: data.ReferrerID,
      brokerId: data.BrokerID,
      attorneyId: data.AttorneyID,
    });
  }

  setPatientPIDetailFormForPITab(data: any) {
    this.patientPIDetailForm.patchValue({
      doiLmp: data.Doilmp,
      patientLien: data.PatientLien,
      attorneyLien: data.AttorneyLien,
      isNotLienReminder: data.IsNotLienReminder,
      isSentPatAttorney: data.IsSentPatAttorney,
      accidentTypeCode: data.ACCIDENTTYPECODE,
      billingEmail1: data.BillingEmail1,
      billingEmail2: data.BillingEmail2,
      billingEmail3: data.BillingEmail3,
      billingEmail4: data.BillingEmail4,
      billingEmail5: data.BillingEmail5,
      billingFax1: data.BillingFax1,
      billingFax2: data.BillingFax2,
      billingFax3: data.BillingFax3,
      billingFax4: data.BillingFax4,
      billingFax5: data.BillingFax5,
    });
  }

  getPatientDetailById(internalPatientId: string, internalStudyId: string) {
    let operation = 1;
    this.status = 0;
    this.selectedInternalPatientId = internalPatientId;
    this.selectedInternalstudyId = internalStudyId;
    this.patientService.getPatientDetail(true, this.selectedInternalPatientId, this.selectedInternalstudyId, operation,this.pageNumber,this.pageSize).subscribe((res) => {
      this.getAllCopyServiceCompany();
      if (res.response != null) {
        this.patientDetailNotes = null;
        this.studyNotes = null;
        this.piNotes = null;
        this.allNotes = null;
        this.patientDetail = res.response[0][0]['Patient Detail'][0];
        this.patientDetailInsuranceCoverage = res.response[1][0]['Insurance Coverage Detail'];

        this.patientStudySummary = res.response[3][0]['Patient Study Summary'];
        this.patientStudySummaryList = this.patientStudySummary.slice(0, this.pageSizeStudySummary);
        this.studyDetail = res.response[4][0]['Study Details'][0];
        this.procedureCode = res.response[5][0]['Procedure Code'];

        if (res.response[3][0]['Patient Study Summary'].length > 0 && JSON.stringify(res.response[3][0]['Patient Study Summary'][0]) != '{}') {
          this.totalRecordsStudySummary = this.patientStudySummary.length > 0 ? this.patientStudySummary.length : 1;
        }

        if (res.response[2][0]['Patien Detail Notes'].length > 0 && JSON.stringify(res.response[2][0]['Patien Detail Notes'][0]) != '{}') {
          this.patientDetailNotes = res.response[2][0]['Patien Detail Notes'];
        }

        if (res.response[6][0]['Study Notes'].length > 0 && JSON.stringify(res.response[6][0]['Study Notes'][0]) != '{}') {
          this.studyNotes = res.response[6][0]['Study Notes'];
        }

        this.piDetails = res.response[7][0]['PI Detail'][0];

        if (res.response[8][0]['PI Notes'].length > 0 && JSON.stringify(res.response[8][0]['PI Notes'][0]) != '{}') {
          this.piNotes = res.response[8][0]['PI Notes'];
        }
        if (res.response[9][0]['All Notes'].length > 0 && JSON.stringify(res.response[9][0]['All Notes'][0]) != '{}') {
          this.allNotes = res.response[9][0]['All Notes'];
        }

        if (res.response[10][0]['All Alerts'].length > 0 && JSON.stringify(res.response[10][0]['All Alerts'][0]) != '{}') {
          this.alertList = res.response[10][0]['All Alerts'];
          this.totalRecordsCreateAlerts = this.alertList.length > 0 ? res.response[10][0]['All Alerts'][0].Totalrecords : 1;
          this.Alert = res.response[10][0]['All Alerts'][0].Alert;
          this.Reason = res.response[10][0]['All Alerts'][0].Reason;
          this.ID = res.response[10][0]['All Alerts'][0].ID;
          this.status = this.alertList.filter((x: any) => x.HasAlert == '1').length;
        }
        else {
          this.alertList = [];
          this.totalRecordsCreateAlerts = 1;
        }

        if (res.response[11][0]['Full Log'].length > 0 && JSON.stringify(res.response[11][0]['Full Log'][0]) != '{}') {

          this.fullLogList = res.response[11][0]['Full Log'];
          this.fullLog = this.fullLogList.slice(0, this.pageSizeLog);
          this.totalRecordLog = this.fullLogList.length > 0 ? res.response[11][0]['Full Log'][0].Totalrecords : 1;
        }

        if (res.response[12][0]['Appointment Log'].length > 0 && JSON.stringify(res.response[12][0]['Appointment Log'][0]) != '{}') {
          this.appointmentLogList = res.response[12][0]['Appointment Log'];
          this.appointmentLog = this.appointmentLogList.slice(0, this.pageSizeAppLog);
          this.totalRecordAppLog = this.appointmentLogList.length> 0 ? res.response[12][0]['Appointment Log'][0].Totalrecords : 1;
        }
        if (res.response[13][0]['Subs Grid Study'].length > 0 && JSON.stringify(res.response[13][0]['Subs Grid Study'][0]) != '{}') {
          this.subsGridList = res.response[13][0]['Subs Grid Study'];
          this.subsTotalRecords = this.subsGridList.length > 0 ? this.subsGridList.length : 1;
        }
        else {
          this.subsTotalRecords = 1;
        }
        this.setPatientDetailFormForPatientDetailTab(this.patientDetail);
        this.setPatientStudyDetailFormForStudyDetailTab(this.studyDetail);
        this.setPatientPIDetailFormForPITab(this.piDetails);
        this.isPatientDataFound = false;
        this.GetPatientDetailsCompare();
      } else {
        setTimeout(() => {
          this.closebtn.nativeElement.click();
          this.notificationService.showNotification({
            alertHeader: '',
            alertMessage: 'Patient record not found.',
            alertType: 400
          });
        }, 1000);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  resetPateintDetailFormAndFields() {
    this.patientDetailForm.reset();
    this.patientStudyDetailForm.reset();
    this.patientPIDetailForm.reset();
    this.patientDetail = '';
    this.patientDetailInsuranceCoverage = [];
    this.patientDetailNotes = [];
    this.patientStudySummary = [];
    this.studyDetail = '';
    this.procedureCode = [];
    this.studyNotes = [];
    this.piDetails = ''
    this.piNotes = [];
    this.allNotes = [];
    this.subsGridList = [];
    this.alertList = [];
    this.fullLog = [];
    this.fullLogList = [];
    this.appointmentLog = [];
    this.appointmentLogList = [];
    this.patientDetailTabNotesModel = '';
    this.studyDetailTabNotesModel = '';
    this.piDetailTabNotesModel = '';
    this.allNotesTabModel = '';
    this.clearSubsFields();
  }
  clearSubsFields() {
    // subs Fields
    this.selectedDropDownActionModel = null;
    this.selectedCompanyIDModel1 = null;
    this.selectedCompanyIDModel2 = null;
    this.selectedCompanyIDModel3 = null;
    this.selectedRapIDModel1 = null;
    this.selectedRapIDModel2 = null;
    this.selectedRapIDModel3 = null;
    this.subsTabTopForm.reset();
    //
  }
  saveSusbTapTopForm() {
    this.subsList = [];
    var errorMessage = '';
    const fmc = this.subsTabTopFormControls;

    if (!(checkTopSubsRow(fmc.selectedCompanyIDModel1.value, fmc.subsRefNumber1.value, fmc.subsDateRequest1.value, fmc.selectedRequestedTypeList1.value,
      fmc.selectedMediaList1.value) || checkTopSubsRow(fmc.selectedCompanyIDModel2.value, fmc.subsRefNumber2.value, fmc.subsDateRequest2.value,
        fmc.selectedRequestedTypeList2.value, fmc.selectedMediaList2.value) || checkTopSubsRow(fmc.selectedCompanyIDModel3.value, fmc.subsRefNumber3.value,
          fmc.subsDateRequest3.value, fmc.selectedRequestedTypeList3.value, fmc.selectedMediaList3.value))) {
      errorMessage = SubsService.susbFieldsRequirdErrorMsg;
    }
    if ((fmc.subsRefNumber1.value != null && (fmc.subsRefNumber1.value == fmc.subsRefNumber2.value || fmc.subsRefNumber1.value == fmc.subsRefNumber3.value)) ||
      (fmc.subsRefNumber2.value != null && (fmc.subsRefNumber2.value == fmc.subsRefNumber3.value)) ||
      (fmc.subsCheckNumber1.value != null && (fmc.subsCheckNumber1.value == fmc.subsCheckNumber2.value)) ||
      (fmc.subsCheckNumber2.value != null && (fmc.subsCheckNumber2.value == fmc.subsCheckNumber3.value))) {
      errorMessage = errorMessage != '' ? errorMessage + '<br>' + SubsService.susbFieldsSameValueErrorMsg : SubsService.susbFieldsSameValueErrorMsg;
    }

    if ((fmc.subsCheckNumber1.value != null && (fmc.subsCheckDate1.value == null ||
      fmc.subsCheckAmount1.value == null)) || (fmc.subsCheckNumber2.value != null
        && (fmc.subsCheckDate2.value == null || fmc.subsCheckAmount2.value == null)) || (fmc.subsCheckNumber3.value != null
          && (fmc.subsCheckDate3.value == null || fmc.subsCheckAmount3.value == null))) {
      errorMessage = errorMessage != '' ? errorMessage + '<br>' + SubsService.susbFieldCannotBlank : SubsService.susbFieldCannotBlank;
    }
    if (errorMessage != '') {
      this.susbErrorMsg = errorMessage;
      this.hiddenBtnWarningMsg.nativeElement.click();
      return;
    }

    if (fmc.selectedCompanyIDModel1.value != null && fmc.subsRefNumber1.value != null && fmc.subsDateRequest1.value != null && fmc.selectedRequestedTypeList1.value != null && fmc.selectedMediaList1.value != null) {
      this.subsList.push({
        'companyID': fmc.selectedCompanyIDModel1.value,
        'repID': fmc.selectedRapIDModel1.value,
        'refNum': fmc.subsRefNumber1.value,
        'dateRequested': fmc.subsDateRequest1.value,
        'checkNum': fmc.subsCheckNumber1.value,
        'checkDate': fmc.subsCheckDate1.value,
        'checkAmount': fmc.subsCheckAmount1.value != null ? parseFloat(fmc.subsCheckAmount1.value).toFixed(2) : null,
        'type': fmc.selectedRequestedTypeList1.value.toString(),
        'media': fmc.selectedMediaList1.value.toString(),
        'pickupCost': fmc.subsDueAmount1.value != null ? parseFloat(fmc.subsDueAmount1.value).toFixed(2) : null,
        'isReadyForPickUp': fmc.subsReadyForPickUp1.value != null ? fmc.subsReadyForPickUp1.value : false,
        'internalPatientID': this.editPatientId,
        'userId': Number(this.storageService.user.UserId),
      });
    }

    if (fmc.selectedCompanyIDModel2.value != null && fmc.subsRefNumber2.value != null && fmc.subsDateRequest2.value != null && fmc.selectedRequestedTypeList2.value != null
      && fmc.selectedMediaList2.value != null) {
      this.subsList.push({
        'companyID': fmc.selectedCompanyIDModel2.value,
        'repID': fmc.selectedRapIDModel2.value,
        'refNum': fmc.subsRefNumber2.value,
        'dateRequested': fmc.subsDateRequest2.value,
        'checkNum': fmc.subsCheckNumber2.value,
        'checkDate': fmc.subsCheckDate2.value,
        'checkAmount': fmc.subsCheckAmount2.value != null ? parseFloat(fmc.subsCheckAmount2.value).toFixed(2) : null,
        'type': fmc.selectedRequestedTypeList2.value.toString(),
        'media': fmc.selectedMediaList2.value.toString(),
        'pickupCost': fmc.subsDueAmount2.value != null ? parseFloat(fmc.subsDueAmount2.value).toFixed(2) : null,
        'isReadyForPickUp': fmc.subsReadyForPickUp2.value != null ? fmc.subsReadyForPickUp2.value : false,
        'internalPatientID': this.editPatientId,
        'userId': Number(this.storageService.user.UserId),
      });
    }

    if (fmc.selectedCompanyIDModel3.value != null && fmc.subsRefNumber3.value != null && fmc.subsDateRequest3.value != null && fmc.selectedRequestedTypeList3.value != null
      && fmc.selectedMediaList3.value != null) {
      this.subsList.push({
        'companyID': fmc.selectedCompanyIDModel3.value,
        'repID': fmc.selectedRapIDModel3.value,
        'refNum': fmc.subsRefNumber3.value,
        'dateRequested': fmc.subsDateRequest3.value,
        'checkNum': fmc.subsCheckNumber3.value,
        'checkDate': fmc.subsCheckDate3.value,
        'checkAmount': fmc.subsCheckAmount3.value != null ? parseFloat(fmc.subsCheckAmount3.value).toFixed(2) : null,
        'type': fmc.selectedRequestedTypeList3.value.toString(),
        'media': fmc.selectedMediaList3.value.toString(),
        'pickupCost': fmc.subsDueAmount3.value != null ? parseFloat(fmc.subsDueAmount3.value).toFixed(2) : null,
        'isReadyForPickUp': fmc.subsReadyForPickUp3.value != null ? fmc.subsReadyForPickUp3.value : false,
        'internalPatientID': this.editPatientId,
        'userId': Number(this.storageService.user.UserId),
      });
    }

    this.subsService.createNewSubsInBulk(true, this.editPatientId, this.subsList).subscribe((res) => {
      if (res.responseCode == 200) {
        this.subsApplyFilter(this.editPatientId);
        this.showNotificationOnSucess(res);
      }
      else if (res.responseCode == 501) {
        this.errorNotification(res);

      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }


  receiveMessageFromRequestSearch($event) {
    if ($event) {
      this.subsApplyFilter(this.editPatientId);
    }
  }

  getAlertInternalNotesDetail(data: any) {
    this.alertDetail = data.value;
  }

  handleClear() {
    // clearing the value
    this.inputNotes.nativeElement.value = ' ';
  }

  updatePatientDetail(isPopUpClose: boolean) {
    this.modalValue = 'modal';
    this.handleClear();
    if (this.patientPIDetailForm.invalid) {
      this.modalValue = '';
      this.Issubmitted = true;
      return;
    }

    let body = {
      'patientLien': this.patientPIDetailFormControls.patientLien.value,
      'attorneyLien': this.patientPIDetailFormControls.attorneyLien.value,
      'isNotLienReminder': this.patientPIDetailFormControls.isNotLienReminder.value,
      'internalPatientID': this.selectedInternalPatientId,
      'internalStudyID': this.selectedInternalstudyId,
      'username': this.storageService.user.FullName,
      'userID': this.storageService.user.UserId,
      'patientNote': this.patientDetailTabNotesModel == undefined ? '' : this.patientDetailTabNotesModel.toString(),
      'piNote': this.piDetailTabNotesModel == undefined ? '' : this.piDetailTabNotesModel.toString(),
      'studyNote': this.studyDetailTabNotesModel == undefined ? '' : this.studyDetailTabNotesModel.toString(),
      'billingEmail1': this.patientPIDetailFormControls.billingEmail1.value,
      'billingEmail2': this.patientPIDetailFormControls.billingEmail2.value,
      'billingEmail3': this.patientPIDetailFormControls.billingEmail3.value,
      'billingEmail4': this.patientPIDetailFormControls.billingEmail4.value,
      'billingEmail5': this.patientPIDetailFormControls.billingEmail5.value,
      'billingFax1': this.patientPIDetailFormControls.billingFax1.value,
      'billingFax2': this.patientPIDetailFormControls.billingFax2.value,
      'billingFax3': this.patientPIDetailFormControls.billingFax3.value,
      'billingFax4': this.patientPIDetailFormControls.billingFax4.value,
      'billingFax5': this.patientPIDetailFormControls.billingFax5.value,
      'requiredPO': this.patientStudyDetailFormControls.requiredPo.value,
      'isSmsOff': this.patientDetailFormControls.isSmsOff.value
    }

    this.patientService.updatePatientDetail(true, body).subscribe((res) => {
      if (res.responseCode == 200) {
        this.showNotificationOnSucess(res);
        this.piDetailTabNotesModel = null;
        this.patientDetailTabNotesModel = null;
        this.studyDetailTabNotesModel = null;
        this.getPatientDetailById(this.selectedInternalPatientId, this.selectedInternalstudyId);
      }
      else {
        this.showNotificationOnFailure(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  studyAlertByPatientId(isPopUpClose: any) {
    // this.getPatientDetailById(this.selectedInternalPatientId, this.selectedInternalstudyId);
    if (this.patientID) {
      let body = { 'PatientId': this.patientID, 'pageNumber': this.pageNumber, 'pageSize': this.pageSize }
      this.patientService.GetCreateAlertByPatientId(true, body).subscribe((res) => {
        this.alertList = res[0].response;
        this.status = this.alertList.filter((x: any) => x.HasAlert == '1').length;
      });
    }
  }

  studyDescriptionCheckBoxChange(event: any, internalStudyID: any) {

    let isReadyToBill = event.target.checked ? 1 : 0;
    let body = { 'internalStudyID': internalStudyID, 'isReadyToBill': isReadyToBill }
    this.patientService.markPatientStudyReadyToBill(true, JSON.stringify(JSON.stringify(body))).subscribe((res) => {
      console.log(res)
      if (res.responseCode == 200) {
        this.showNotificationOnSucess(res);
      }
      else {
        this.errorNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  onFocusedRowChanged(e: any) {
    
    this.studySummaryrowData = e.row && e.row.data;
    for (let index = 0; index < e.row.cells.length; index++) {
      e.row.cells[index].cellElement.parentElement.classList.add("dx-row-focused");
    }
    this.isStudySummaryRowClicked = true;
    this.selectedInternalstudyId = this.studySummaryrowData.INTERNALSTUDYID;
    let operation = 2;
    this.patientService.getPatientDetail(this.isStudySummaryRowClicked, this.selectedInternalPatientId, this.selectedInternalstudyId, operation,this.pageNumber,this.pageSize).subscribe((res) => {
      if (res.response != null) {
        this.alertList = res.response[10][0]['All Alerts'];
        this.studyDetail = res.response[4][0]['Study Details'][0];
        this.procedureCode = res.response[5][0]['Procedure Code'];
        //this.studyNotes=res.response[6][0]['Study Notes'];
        this.studyNotes = null;
        if (res.response[6][0]['Study Notes'].length > 0 && JSON.stringify(res.response[6][0]['Study Notes'][0]) != '{}') {
          this.studyNotes = res.response[6][0]['Study Notes'];
        }
        this.setPatientStudyDetailFormForStudyDetailTab(this.studyDetail);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getReferrerDetailById(referrerName: any, referrerId: any) {
    if (referrerId) {
      let body = { 'title': referrerName, 'referrerId': referrerId };
      this.referrersService.sendDataToReferrerDetailWindow(body);
    }
  }

  getBrokerDetailById(brokerName: string, brokerId: any) {
    
    if (brokerId) {
      let body = { 'brokerId': brokerId, 'brokerName': brokerName };
      this.brokerService.sendDataToBrokerFromPatientDetailWin(body);
    }
  }

  updateTabId(tabName: string) {
    this.tabId = tabName;
    if (this.tabId == '7' && this.subsTabClick) {
      this.subsApplyFilter(this.editPatientId);
      this.subsTabClick = false;
    }
  }

  onTabclick(isAlertTabClick: boolean) {
    
    if (this.studySummaryClick || this.tabId == '2') {
      let studySummary: any = document.getElementsByTagName("tr");
      for (var i = 0; i < studySummary.length; i++) {
        studySummary[i].classList.remove("dx-row-focused")
      } 
    }
    this.studySummaryClick = false ; 
    this.isPatient = false;
    if (isAlertTabClick) {
      this.isHasAlertSelectedTab = true;
      this.updateTabId('8')
    }
    else
      this.isHasAlertSelectedTab = false;
  }
  subsPageChanged(event: any) {
    this.subsPageNumber = event;
    this.subsApplyFilter(this.editPatientId);
  }
  subsApplyFilter(patientId: any) {

    let body = { 'patientID': patientId };
    this.subsService.getSubsDataByFilter(true, body, this.subsPageNumber, this.subsPageSize).subscribe((res) => {
      if (res.response != null) {
        this.subsGridList = res.response;
        this.subsTotalRecords = res.totalRecords;
      }
      else {
        this.subsGridList = [];
        this.subsTotalRecords = 1;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  getSubsDetail(row: any) {
    if (row.data.SubsID) {
      let body: any = { 'subsId': row.data.SubsID, 'patientId': row.data.PATIENTID }
      this.subsService.sendDataToRequestSearchDetailPage(body);
    }
  }

  goButtonClick() {
    if (this.susbGridSelectedRows.length > 0) {
      if (this.selectedDropDownActionModel == ActionMenuConstant.readyforPickup) {
        this.subsReadyForPickup();
      }
      else if (this.selectedDropDownActionModel == ActionMenuConstant.notReadyforPickup) {
        this.subsNotReadyForPickup();
      }
      else if (this.selectedDropDownActionModel == ActionMenuConstant.deletePickupConfirmation) {                                                                           // Use For Cancel Pick Up
        this.subsDeletePickupConfirmation();
      }
      else if (this.selectedDropDownActionModel == ActionMenuConstant.deleteRequest) {
        this.subsDeleteRequest();
      }
    }
    else {
      this.hiddenButton1.nativeElement.click();
    }
  }

  subsDeleteRequest() {
    this.subsService.subsDeleteRequest(true, this.susbGridSelectedRows.toString()).subscribe((res) => {
      if (res.responseCode == 200) {
        this.showNotificationOnSucess(res);
        this.subsApplyFilter(this.editPatientId);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  subsDeletePickupConfirmation() {
    this.subsService.subsDeletePickupConfirmation(true, this.susbGridSelectedRows.toString(), Number(this.storageService.user.UserId)).subscribe((res) => {
      if (res.response != null) {
        this.showNotificationOnSucess(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  subsNotReadyForPickup() {
    this.subsService.subsNotReadyForPickup(true, this.susbGridSelectedRows.toString(), Number(this.storageService.user.UserId)).subscribe((res) => {
      if (res.response != null) {
        this.showNotificationOnSucess(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  subsReadyForPickup() {
    this.subsService.subsReadyForPickup(true, this.susbGridSelectedRows.toString(), Number(this.storageService.user.UserId)).subscribe((res) => {
      if (res.response != null) {
        this.showNotificationOnSucess(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  getAllCopyServiceCompany() {
    this.companyList = [];
    this.subsService.getAllCopyServiceCompany(false).subscribe((res) => {
      if (res.response != null) {
        this.companyList = res.response;
      }

    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  getAllRepNameByCompanyId(compnayId: any, number: any) {
    if (number === 1) {
      this.selectedRapIDModel1 = null;
    }
    if (number === 2) {
      this.selectedRapIDModel2 = null;
    }
    if (number === 3) {
      this.selectedRapIDModel3 = null;
    }

    if (compnayId != null) {
      this.subsService.getAllRepNameByCompanyId(true, compnayId).subscribe((res) => {
        if (res.response != null) {
          //this.repNameList=res.response;
          this.bindRepList(res.response, number);
        }
        else {
          this.clearRepList(number);
        }
      }, (err: any) => {
        this.errorNotification(err);
      });
    }
  }

  bindRepList(response: any, number: any) {
    if (number == 1) {
      this.repNameList1 = response;
    }
    else if (number == 2) {
      this.repNameList2 = response;
    }
    else if (number == 3) {
      this.repNameList3 = response;
    }
  }

  clearRepList(number: any) {
    if (number == 1) {
      this.repNameList1 = [];
    }
    else if (number == 2) {
      this.repNameList2 = [];
    }
    else if (number == 3) {
      this.repNameList3 = [];
    }
  }
  allowNumberOnly(event: any): boolean {
    return this.commonMethodService.alowNumberOnly(event);
  }
  converNumberToDecimal(event: any) {
    if (event.target.value) {
      event.target.value = this.decimalPipe.transform(parseFloat(event.target.value.toString().replace(/,/g, "")).toFixed(2), '1.0-2')
    }
  }
  removeComma(event: any) {
    if (event.target.value) {
      // here we just remove the commas from value
      event.target.value = event.target.value.toString().replace(/,/g, "");
    } else {
      event.target.value = "";
    }
  }

  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  showNotificationOnSucess(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'SUCCESS',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  showNotificationOnFailure(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Fail',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }

  showDocManager() {
    const patientId = this.editPatientId.toLowerCase().includes('pre') ? this.editPatientId : 'PRE' + this.editPatientId;
    this.commonMethodService.sendDataToDocumentManager(patientId);
  }
  get patientDetailFormControls() { return this.patientDetailForm.controls; }
  get patientPIDetailFormControls() { return this.patientPIDetailForm.controls; }
  get patientStudyDetailFormControls() { return this.patientStudyDetailForm.controls; }
  get subsTabTopFormControls() { return this.subsTabTopForm.controls; }

  createAlert() {
    
    $('.caPatientID').val(this.patientID);
    this.commonMethodService.sendDatatoCreateAlertPage(true);
    setTimeout(() => {
      $('.caPatientID').focus();
      setTimeout(() => {
        $('.caPatientID').blur();
      }, 0)
    }, 1000);
  }

  onPageNumberChangeStudySummary(pageNumber: number) {
    
    this.pageNumberStudy = pageNumber
    this.patientStudySummaryList = this.patientStudySummary.slice((this.pageNumberStudy - 1) * this.pageSizeStudySummary, ((this.pageNumberStudy - 1) * this.pageSizeStudySummary) + this.pageSizeStudySummary)
  }

  onPageNumberChangeLog(pageNumber: any) {
    this.pageNumberLog = pageNumber;
    this.fullLog = this.fullLogList.slice((this.pageNumberLog - 1) * this.pageSizeLog, ((this.pageNumberLog - 1) * this.pageSizeLog) + this.pageSizeLog)
  }

  onPageNumberChangeAppLog(pageNumber: any) {
    this.pageNumberAppLog = pageNumber;
    this.appointmentLog = this.appointmentLogList.slice((this.pageNumberAppLog - 1) * this.pageSizeAppLog, ((this.pageNumberAppLog - 1) * this.pageSizeAppLog) + this.pageSizeAppLog)
  }

  getClearResultByPatientId(ID: any) {
    let body: any = { 'patientId': this.patientID, 'Alert': this.Alert, 'Reason': this.Reason, 'ID': ID }
    this.patientService.getClearResultByPatientId(true, JSON.stringify(JSON.stringify(body))).subscribe((res) => {
      if (res.responseCode == 200) {
        this.showNotificationOnSucess(res);
        this.studyAlertByPatientId(true);
      }
      else {
        this.showNotificationOnFailure(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  CopyRowData(index: any) {
    if (index === 0) {
      this.subsTabTopForm.patchValue({
        selectedCompanyIDModel2: this.subsTabTopForm.get('selectedCompanyIDModel1').value,
        selectedRapIDModel2: this.subsTabTopForm.get('selectedRapIDModel1').value,
        subsRefNumber2: this.subsTabTopForm.get('subsRefNumber1').value,
        subsDateRequest2: this.subsTabTopForm.get('subsDateRequest1').value,
        subsCheckNumber2: this.subsTabTopForm.get('subsCheckNumber1').value,
        subsCheckDate2: this.subsTabTopForm.get('subsCheckDate1').value,
        subsCheckAmount2: this.subsTabTopForm.get('subsCheckAmount1').value,
        subsDueAmount2: this.subsTabTopForm.get('subsDueAmount1').value,
        subsReadyForPickUp2: this.subsTabTopForm.get('subsReadyForPickUp1').value,
        selectedRequestedTypeList2: this.subsTabTopForm.get('selectedRequestedTypeList1').value,
        selectedMediaList2: this.subsTabTopForm.get('selectedMediaList1').value,
      });
      this.repNameList2 = this.repNameList1;
    }
    else if (index === 1) {
      this.subsTabTopForm.patchValue({
        selectedCompanyIDModel3: this.subsTabTopForm.get('selectedCompanyIDModel2').value,
        selectedRapIDModel3: this.subsTabTopForm.get('selectedRapIDModel2').value,
        subsRefNumber3: this.subsTabTopForm.get('subsRefNumber2').value,
        subsDateRequest3: this.subsTabTopForm.get('subsDateRequest2').value,
        subsCheckNumber3: this.subsTabTopForm.get('subsCheckNumber2').value,
        subsCheckDate3: this.subsTabTopForm.get('subsCheckDate2').value,
        subsCheckAmount3: this.subsTabTopForm.get('subsCheckAmount2').value,
        subsDueAmount3: this.subsTabTopForm.get('subsDueAmount2').value,
        subsReadyForPickUp3: this.subsTabTopForm.get('subsReadyForPickUp2').value,
        selectedRequestedTypeList3: this.subsTabTopForm.get('selectedRequestedTypeList2').value,
        selectedMediaList3: this.subsTabTopForm.get('selectedMediaList2').value,
      });
      this.repNameList3 = this.repNameList2;
    }
  }

  GetPatientDetailsCompare(){
    var request ={
     patientId : this.patientDetail.PATIENTID
    }
     this.patientPortalService.GetPatientDetailsCompare(request).subscribe(res=>{
       if(res.responseStatus == patientPortalResponseStatus.Success)
       {
         if(res.result.isPatientPortalFound == true)
         {
           this.patientCompareDetail = res.result;
           this.isPatientDataFound = true;
         }
       }
     })
   }
 
   ApprovePatientDetail(key,status,patientValue){
     if(!patientValue)
       patientValue = '';
     var request ={
       patientId : this.patientDetail.PATIENTID,
       key: key,
       status: status,
       value: patientValue,
      }
 
      this.patientPortalService.PatientStatusChecked(request).subscribe(res=>{
       this.GetPatientDetailsCompare();
     })
   }
 
   RejectPatientDetail(key,status,patientValue){
     if(!patientValue)
       patientValue = '';
     var request ={
       patientId : this.patientDetail.PATIENTID,
       key: key,
       status: status,
       value: patientValue,
      }
 
      this.patientPortalService.PatientStatusChecked(request).subscribe(res=>{
       this.GetPatientDetailsCompare();
 
     })
   }
}

function checkTopSubsRow(companyID: any, refNumber: any, requestDate: any, requestType: any, media: any): boolean {
  let isRowValid: boolean = false;
  if (companyID != null && refNumber != null && requestDate != null && requestType != null && media != null) {
    isRowValid = !isRowValid;
    return isRowValid;
  }
  else
    return isRowValid;
}




