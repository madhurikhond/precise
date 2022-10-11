import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { DxDataGridComponent } from 'devextreme-angular';
import DataGrid from 'devextreme/ui/data_grid';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { DatePipe } from '@angular/common';
import { ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { NgSelectComponent } from '@ng-select/ng-select'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonRegex } from 'src/app/constants/commonregex';
import { ReferrersService } from 'src/app/services/referrers.service';
import { BrokerService } from 'src/app/services/broker.service';


declare const $: any;

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
  providers: [DatePipe]
})
export class PatientComponent implements OnInit {

  @ViewChild('hiddenSavedSearchPopUpButton', { static: false }) hiddenSavedSearchPopUpButton: ElementRef;
  @ViewChild('hiddenShowopenLinkPopUp', { static: false }) hiddenShowopenLinkPopUp: ElementRef;
  @ViewChild('hiddenDisMessagePopUp', { static: false }) hiddenDisMessagePopUp: ElementRef;
  @ViewChild('LogsPopup', { static: false }) LogsPopup: ElementRef;
  @ViewChild('BillingPopup', { static: false }) BillingPopup: ElementRef;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent
  @ViewChildren('gridPatient') gridPatient: any;
  items: any;
  // billingEmail1: string = '';
  // billingEmail2: string = '';
  // billingEmail3: string = '';
  // billingEmail4: string = '';
  // billingEmail5: string = '';
  // billingFax1: string = '';
  // billingFax2: string = '';
  // billingFax3: string = '';
  // billingFax4: string = '';
  // billingFax5: string = '';
  maxDate = new Date();
  a1: any = 20;
  b: any = 20;
  c: any = 20;
  d: any = 20;
  e: any = 20;
  f: any = 20;
  g: any = 20;
  h: any = 20;
  selectedRows: any = [];
  Issubmitted: boolean = false;
  isColumnVisible: boolean = false;
  GenerateEsignLinkList: any = [];
  patientGridList: [] = [];
  attorneyList: [] = [];
  financialTypeList: [] = [];
  insuranceCompanyList: [] = [];
  referrerList: [] = [];
  brokerList: [] = [];
  facilityList: [] = [];
  parentFacilityList: [] = [];
  statusNameList = [];
  priorityNamesList: [] = [];
  modalityList: [] = [];
  marketingUserList: [] = [];
  selectedInternalPatientId: any;
  lastNameModel: string = '';
  firstNameModel: string = '';
  patientIdModel: string = '';
  dobModel: string = '';
  ssnModel: string = '';
  phoneModel: string = '';
  attorneyTypeModelList: any = [];
  doiModel: string = '';
  financialTypeModelList: any = [];
  insuranceCompanyModelList: any = [];
  accessionModel: string = '';
  referrerModelList: any = [];
  brokerModelList: any = [];
  facilityModelList: any = [];
  parentFacilityModelList: any = [];
  fromDateModel: string = '';
  toDateModel: string = '';
  fullLogList: any = [];
  appLogList: any = [];
  dateRangeModel: string = '';
  statusNameModelList: any = [];
  priorityNamesModelList: any = [];
  modalityModelList: any = [];
  cptModel: string = '';
  marketingUserModelList: any = [];
  checkNumberModel: string = '';
  checkAmountModel: string = '';
  pageNumber: number = 1;
  pageSize: number;
  modalValue: string = 'modal';
  pageSizeLogs: number = 20;
  pageNumberAppointmentLogs: number = 1;
  pageSizeAppointmentLogs: 20;
  pageNumberFullLogs: number = 1;
  totalRecord: number = 1;
  IsPatientActionHide: Boolean = true;
  Generate_PI_TC_Message: string = "";
  totalrecordsFullLog: number = 1;
  totalRecordAppLog: number = 1;
  pageNumberLogs: number = 1;
  patientBillingDetailForm: FormGroup;
  FormGroupName:FormGroup;
  patientID: any;
  BillingData: any;
  logsPageTitle: any = '';
  // Grid Properties
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  allMode: string;
  checkBoxesMode: string;
  ddlvalue = [];
  billingHeaderTitle: any = '';
  ddlCurrentValue: string = '0';
  ddlCurrentText: string = 'Select an Action';
  filterValue: any = [];
  fileList: any = [];
  LastSearchRecordList = [];
  checkedPatientIdInternalStudyid = [];
  checkedData: any = 0;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  savedSearchList: Array<Object> = [];
  filterBody: any;
  currentPageUrl: string;
  BillingDetailPageTitle: any;
  tabId: any = 1;
  selectedTab = 'full-log'
  NextSearchButtonDisabled: any;
  Changevalue: any;
  ArrayIndex: number = -1;
  nextButtonDisable: boolean = true;
  previouButtonDisable: boolean = false
  readonly pageSizeArray = PageSizeArray;
  Phoneparam: any;
  accessionnumberparam: any;
  patientidparam: any;
  readonly commonRegex = CommonRegex;

  constructor(private fb: FormBuilder, private readonly patientService: PatientService, private readonly notificationService: NotificationService,
    private readonly _commonMethodService: CommonMethodService//,public datepipe:DatePipe
    , private readonly storageService: StorageService,
    private commonService: CommonMethodService,
    private datePipe: DatePipe, private route: ActivatedRoute,
    private readonly referrersService :  ReferrersService,
    private readonly brokerService : BrokerService,
  ) {
    this.route.queryParamMap.subscribe((params: any) => {
      this.Phoneparam = params.params.Phone;
      this.accessionnumberparam = params.params.ACCESSIONNUMBER;
      this.patientidparam = params.params.patientid;
    });
  }


  ngOnInit() {
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.currentPageUrl = window.location.href;
    this.commonService.setTitle('Patient');
    this.setGridSetting();
    this.getFinancialType();
    this.getInsuranceCompanies();
    this.getAttornerNames();
    this.getreferrerNames();
    this.getBrokerNames();
    this.getFacilities();
    this.getFacilityParentNames();
    this.GetPriorityNames();
    this.getScheduledModality();
    this.getMarketingUser();
    this.getStatusNames();
    this.ddlvalue = this.selectAnActionDdl();
    this.getAllSavedSearchList();
    this.PatientActionShowHide();
    this.createPatientBillingDetailForm();
    this.GetLastSearchRecord();
    this.updateTabId(1, 'log')
    if (this.Phoneparam || this.accessionnumberparam || this.patientidparam) {
      this.phoneModel = this.Phoneparam ? this.Phoneparam : '';
      this.patientIdModel = this.patientidparam ? this.patientidparam : '';
      this.accessionModel = this.accessionnumberparam ? this.accessionnumberparam : '';
      this.pageNumber = 1;
      this.pageSize = 50;
      this.applyFilter(true);
    }
    //this.getLogs();

  }

  defaultVisibleColumn() {
    this.dataGrid.instance.columnOption('ISREADYTOBILL', 'visible', false);
    this.dataGrid.instance.columnOption('GENDER', 'visible', false);
    this.dataGrid.instance.columnOption('MissingRadFee', 'visible', false);
    this.dataGrid.instance.columnOption('PATIENTIDEXPORT', 'visible', false);
    this.dataGrid.instance.columnOption('AttorneyPrice', 'visible', false);
    this.dataGrid.instance.columnOption('FaxNumber', 'visible', false);
    this.dataGrid.instance.columnOption('Email', 'visible', false);
    this.dataGrid.instance.columnOption('BodyPartName', 'visible', false);
    this.dataGrid.instance.columnOption('INTERNALPATIENTID', 'visible', false);
    this.dataGrid.instance.columnOption('BillCreated', 'visible', false);
    this.dataGrid.instance.columnOption('INSURANCECOMPANY', 'visible', false);
    this.dataGrid.instance.columnOption('COVERAGELEVEL', 'visible', false);
    this.dataGrid.instance.columnOption('POLICYGROUP', 'visible', false);
    this.dataGrid.instance.columnOption('AuthorizationNumber', 'visible', false);
    this.dataGrid.instance.columnOption('AttorneyFullName', 'visible', false);
    this.dataGrid.instance.columnOption('AttorneyEmail', 'visible', false);
    this.dataGrid.instance.columnOption('AttorneyAddress', 'visible', false);
    this.dataGrid.instance.columnOption('DoNotDOI', 'visible', false);
    this.dataGrid.instance.columnOption('OverrideAddressForBilling', 'visible', false);
    this.dataGrid.instance.columnOption('IsNPI', 'visible', false);
    this.dataGrid.instance.columnOption('BILLINGSTATUS', 'visible', false);
    this.dataGrid.instance.columnOption('ADJUSTEDSTATUS', 'visible', false);
    this.dataGrid.instance.columnOption('COLLECTIONSSTATUS', 'visible', false);
    this.dataGrid.instance.columnOption('PAYMENTSTATUS', 'visible', false);
    this.dataGrid.instance.columnOption('WCINSSTATUS', 'visible', false);
    this.dataGrid.instance.columnOption('Laterlity', 'visible', false);
    this.dataGrid.instance.columnOption('PROCCODEDESC', 'visible', false);
  }

  createPatientBillingDetailForm() {
    this.patientBillingDetailForm = this.fb.group({
      isSentPatAttorney: [false],
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
  setpatientBillingDetailFormData(data: any) {

    // this.patientID = data.PATIENTID;
    // this.BillingDetailPageTitle = data.PATIENTID + ', ' + data.FAMILYNAME + ' ' + data.GIVENNAME + ', ' + this.datePipe.transform(data.BIRTHDATE, this.dateTimeFormatCustom.Date) + ', ' + data.FINANCIALTYPENAME
    this.patientBillingDetailForm.patchValue({

      billingEmail1: data.BillingEmail1,
      billingEmail2: data.BillingEmail2,
      billingEmail3: data.BillingEmail3,
      billingEmail4: data.BillingEmail4,
      billingEmail5: data.BillingEmail5,
      billingFax1: data.BillingFax1,
      billingFax2: data.BillingFax2,
      billingFax3: data.BillingFax3,
      billingFax4: data.BillingFax4,
      billingFax5: data.BillingFax5
    });
  }

  close() {
    this.Issubmitted = false;
    this.patientBillingDetailForm.reset();
  }

  PatientActionShowHide() {
    var data = this.storageService.UserRole;
    if (data) {
      let list: any = [];
      let responseHierarchy = JSON.parse(data);
      if (responseHierarchy && responseHierarchy.length) {
        responseHierarchy.forEach(value => {
          if (value && value.hierarchy) {
            value.hierarchy = JSON.parse(value.hierarchy);
          }
        })
      }
      for (let i = 0; i < responseHierarchy.length; i++) {
        list.push(responseHierarchy[i].hierarchy);
      }
      let getData = list.filter(obj => obj.PageTitle.toLowerCase() == 'patients');
      if (getData.length > 0) {
        this.IsPatientActionHide = JSON.parse(getData[0].IsPatientActionHide);
      }
    }
  }

  openLogsPopUp() {
    this.updateTabId(1, 'log');
    // $('#divlog').trigger('click')
    this.LogsPopup.nativeElement.click();
    this.getLogs();

  }

  openBillingPopUp() {
    this.BillingPopup.nativeElement.click();
    this.crudBillingPaymentDestination(4);
  }

  columnChooserClick(e: any): void {
    $('.dx-overlay-content').toggle();
    this.gridPatient.first.columnChooser.mode = 'select';
    this.gridPatient.first.instance.showColumnChooser();
    var columnChooserView = this.gridPatient.first.instance.getView('columnChooserView');
    if (!columnChooserView._popupContainer) {
      columnChooserView._initializePopupContainer();
      columnChooserView.render();
    }

    $('.dx-datagrid-column-chooser').find('ul').find('.dx-item').unbind()
    $('.dx-datagrid-column-chooser').find('ul').find('.dx-item').click(function () {
      $(this).parent().find('.dx-checkbox').click();
    })
    columnChooserView._popupContainer.option('dragEnabled', false)
    columnChooserView._popupContainer.option('position', { of: e.element, my: 'right top', at: 'right top', offset: '0 50' });
  }

  selectAnActionDdl() {
    return [
      { value: '0', Text: 'Select an Action' },
      { value: '1', Text: 'Export Outside Billing' },
      { value: '2', Text: 'Save Search As' },
      { value: '3', Text: 'Save Grid' },
      { value: '4', Text: 'Ready To Bill' },
      { value: '5', Text: 'Not Ready To Bill' },
      { value: '6', Text: 'Gross Receipts' },
      { value: '7', Text: 'Generate e-Sign Link' },
      { value: '8', Text: 'Generate PI TC & P PI Lien' },
      { value: '9', Text: 'Generate PI TC Lien' },
      { value: '10', Text: 'Generate PI P Lien' },
      { value: '11', Text: 'Generate Attorney Bill' },
      { value: '12', Text: 'Generate Revised Attorney Bill' },
      { value: '13', Text: 'Preview Attorney Bill' },
      // { value: '14', Text: 'Patient Lien Signed' },
      //{ value: '15', Text: 'Patient Lien Not Signed' },
      // { value: '16', Text: 'Attorney Lien Signed' },
      //   { value: '17', Text: 'Attorney Not Lien Signed' },
      { value: '18', Text: 'Tech ASL Signed' },
      { value: '19', Text: 'Tech ASL Not Signed' },
      { value: '20', Text: 'Rad ASL Signed' },
      { value: '21', Text: 'Rad ASL Not Signed' },
      { value: '22', Text: 'Tech PSL Signed' },
      { value: '23', Text: 'Tech PSL Not Signed' },
      { value: '24', Text: 'Rad PSL Signed' },
      { value: '25', Text: 'Rad PSL Not Signed' },
      { value: '26', Text: 'Bill NOT Sent' },
      // { value: '27', Text: 'Send Patient Appt Reminder' },
      { value: '28', Text: 'Create Intake Packet' },
      { value: '29', Text: 'Create XRAY Preg Waiver' },
      { value: '30', Text: 'Show Missing Patient' },
      { value: '31', Text: 'Charge A No Show Fee' },
      { value: '32', Text: 'Remove No Show Fee' },
      { value: '33', Text: 'Do Not Send SMS' }
    ];
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

    this.patientService.getPersistentGridSetting(false, this.storageService.user.UserId, 'Patient').subscribe((res) => {
      if (res.response != null) {
        var state = JSON.parse(res.response.GridSettings);
        this.dataGrid.instance.refresh();
        this.dataGrid.instance.state(state);
      } else {
        this.defaultVisibleColumn();
      }
    },
      (err: any) => {
        this.error(err);
      });
  }
  onInitialized(e) {

    setTimeout(() => {
      e.component.option('stateStoring', { ignoreColumnOptionNames: [true] });
    }, 100)
  }

  getPatientDetailById(e: any) {
    debugger
    let body = {
      'patientID': e.data.PATIENTID,
      'internalPatientId': e.data.INTERNALPATIENTID,
      'internalStudyId': e.data.Internalstudyid,
      'hasAlert': e.data.HasAlert,
      'click': true
    }

    let dataGridalltrList: any = document.getElementsByTagName("tr");
    for (var i = 0; i < dataGridalltrList.length; i++) {
      dataGridalltrList[i].classList.remove("custom-patient-row-selection")
    }

    for (let index = 0; index < e.row.cells.length; index++) {
      e.row.cells[index].cellElement.parentElement.classList.add("custom-patient-row-selection");
    }

    this.patientService.sendDataToPatientDetailWindow(body);
  }

  getFinancialType() {
    this.patientService.getFinancialTypes(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.financialTypeList = data.response;
      }
      else {
        this.unSuccess(data);
      }
    },
      (err: any) => {
        this.error(err);
      });
  }
  getInsuranceCompanies() {
    this.patientService.getInsuranceCompanies(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.insuranceCompanyList = data.response;
      }
      else {
        this.unSuccess(data);
      }
    },
      (err: any) => {
        this.error(err);
      });
  }
  getUnique(arr, comp) {
    const unique = arr.map(e => e[comp])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e]).map(e => arr[e]);
    return unique;
  }
  getFacilities() {
    this.facilityList = [];
    this.patientService.getFacilities(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.facilityList = data.response;
      }
      else {
        this.unSuccess(data);
      }
    },
      (err: any) => {
        this.error(err);
      });
  }
  getFacilityParentNames() {
    this.parentFacilityList = [];
    this.patientService.getFacilityParentNames(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.parentFacilityList = data.response;
      }
      else {
        this.unSuccess(data);
      }
    },
      (err: any) => {
        this.error(err);
      });
  }

  GetPriorityNames() {
    this.priorityNamesList = [];
    this.patientService.getPriorityNames(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.priorityNamesList = data.response;
      }
      else {
        this.unSuccess(data);
      }
    },
      (err: any) => {
        this.error(err);
      });
  }

  getStatusNames() {
    //this.statusNameList = [];
    this.patientService.getStatusNames(false).subscribe((res) => {
      var data: any = res;
      this.statusNameList = [];
      if (data.response != null && data.response.length > 0) {
        this.statusNameList.push({ status: 'DOI MISSING', statusorder: 'DOI MISSING' });
        this.statusNameList.push({ status: 'DOI ENTERED', statusorder: 'DOI ENTERED' });
        this.statusNameList.push({ status: 'AUTO BILL SENT', statusorder: 'AUTO BILL SENT' });
        this.statusNameList.push({ status: 'AUTO BILL NOT SENT', statusorder: 'AUTO BILL NOT SENT' });
        this.statusNameList.push({ status: 'READY TO BILL', statusorder: 'READY TO BILL' });
        this.statusNameList.push({ status: 'NOT READY TO BILL', statusorder: 'NOT READY TO BILL' });
        this.statusNameList.push({ status: 'Tech PSL Signed', statusorder: 'Tech PSL Signed' });
        this.statusNameList.push({ status: 'Tech PSL Not Signed', statusorder: 'Tech PSL Not Signed' });
        this.statusNameList.push({ status: 'Tech ASL Signed', statusorder: 'Tech ASL Signed' });
        this.statusNameList.push({ status: 'Tech ASL Not Signed', statusorder: 'Tech ASL Not Signed' });
        this.statusNameList.push({ status: 'Rad PSL Signed', statusorder: 'Rad PSL Signed' });
        this.statusNameList.push({ status: 'Rad PSL Not Signed', statusorder: 'Rad PSL Not Signed' });
        this.statusNameList.push({ status: 'Rad ASL Signed', statusorder: 'Rad ASL Signed' });
        this.statusNameList.push({ status: 'Rad ASL Not Signed', statusorder: 'Rad ASL Not Signed' });
        this.statusNameList.push({ status: 'VIEW ALL COMPLETED STUDIES', statusorder: 'VIEW ALL COMPLETED STUDIES' });
        this.statusNameList.push({ status: 'HAS A NO SHOW', statusorder: 'HAS A NO SHOW' });

        this.statusNameList.push({ status: '--------------', statusorder: 'Dash', disabled: true });
        for (let i = 0; i < data.response.length; i++) {
          this.statusNameList.push({ status: data.response[i]['status'], statusorder: data.response[i]['statusorder'] });
        }
        this.statusNameList.push({ status: '--------------', statusorder: 'Dash' });
        this.statusNameList.push({ status: 'Inside LA County', statusorder: 'Inside LA County' });
        this.statusNameList.push({ status: 'Outside LA County', statusorder: 'Outside LA County' });
        this.statusNameList.push({ status: '--------------', statusorder: '--------------', disabled: true });
        this.statusNameList.push({ status: 'ALERTS', statusorder: 'ALERTS', disabled: true });
        this.statusNameList.push({ status: 'Patient with Active/Cleared Alerts', statusorder: 'Patient with Active/Cleared Alerts' });
        this.statusNameList.push({ status: 'Patient with NO Alerts', statusorder: 'Patient with NO Alerts' });
        this.statusNameList.push({ status: '--------------', statusorder: '--------------', disabled: true });
        this.statusNameList.push({ status: 'PENDING AUTH', statusorder: 'PENDING AUTH', disabled: true });
        this.statusNameList.push({ status: 'Pending Accept Liability Attorney', statusorder: 'Pending Accept Liability Attorney' });
        this.statusNameList.push({ status: '--------------', statusorder: '--------------', disabled: true });
        this.statusNameList.push({ status: 'MISSING INFO', statusorder: 'MISSING INFO', disabled: true });
        this.statusNameList.push({ status: 'Missing Patient DOB', statusorder: 'Missing Patient DOB' });
        this.statusNameList.push({ status: 'Missing RX', statusorder: 'Missing RX' });
        this.statusNameList.push({ status: 'Ordering Missing Doctor Name', statusorder: 'Ordering Missing Doctor Name' });
        this.statusNameList.push({ status: 'Patient Needs Metal/Bullet XRAY Clearance', statusorder: 'Patient Needs Metal/Bullet XRAY Clearance' });
        this.statusNameList.push({ status: 'Patient Needs Orbit XRAY', statusorder: 'Patient Needs Orbit XRAY' });
        this.statusNameList.push({ status: 'Phone Number for Patient Missing', statusorder: 'Phone Number for Patient Missing' });
        this.statusNameList.push({ status: 'Phone Number for Patient wrong/disconnected', statusorder: 'Phone Number for Patient wrong/disconnected' });
        this.statusNameList.push({ status: 'RX illegible', statusorder: 'RX illegible' });
        this.statusNameList.push({ status: 'RX missing signature', statusorder: 'RX missing signature' });

        this.statusNameList.push({ status: 'Study Clarification Needed', statusorder: 'Study Clarification Needed' });
      }
      else {
        this.unSuccess(data);
      }
    },
      (err: any) => {
        this.error(err);
      });
  }
  getScheduledModality() {
    this.modalityList = [];
    this.patientService.getScheduledModality(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.modalityList = data.response;
      }
      else {
        this.unSuccess(data);
      }
    },
      (err: any) => {
        this.error(err);
      });
  }

  getMarketingUser() {
    this.marketingUserList = [];
    this.patientService.getMarketingUser(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.marketingUserList = data.response;
      }
      else {
        this.unSuccess(data);
      }
    },
      (err: any) => {
        this.error(err);
      });
  }

  getBrokerNames() {
    this.patientService.getBrokerNames(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.brokerList = data.response;
      }
      else {
        this.unSuccess(data);
      }
    },
      (err: any) => {
        this.error(err);
      });
  }
  updateTabId(tabName: any, click: string) {
    this.tabId = tabName;
    if (click == 'tab') {
      this.pageNumberAppointmentLogs = 1;
      this.pageNumberFullLogs = 1;
    }
  }
  changelanguage(event) {
    this.patientBillingDetailForm.patchValue({
      isSentPatAttorney: event.target.checked,

    });

  }
  getLogs() {
    this.pageNumberLogs = this.tabId == 1 ? this.pageNumberFullLogs : this.pageNumberAppointmentLogs
    let body = {
      'internalPatientID': this.selectedInternalPatientId,
      'pageSize': this.pageSizeLogs,
      'pageNumber': this.pageNumberLogs,
    }
    this.appLogList = [];
    this.fullLogList = [];
    this.totalrecordsFullLog = 1;
    this.totalRecordAppLog = 1;
    this.patientService.getLogs(true, JSON.stringify(JSON.stringify(body))).subscribe((res) => {
      var data: any = res;
      if (res !== null) {
        this.logsPageTitle = JSON.parse(res.response[0].JsonPatientDetailForDetailTab)['Patient Detail'][0].PATIENTID + ', ' + JSON.parse(res.response[0].JsonPatientDetailForDetailTab)['Patient Detail'][0].FAMILYNAME + ' ' + JSON.parse(res.response[0].JsonPatientDetailForDetailTab)['Patient Detail'][0].GIVENNAME + ', ' + this.datePipe.transform(JSON.parse(res.response[0].JsonPatientDetailForDetailTab)['Patient Detail'][0].BIRTHDATE, this.dateTimeFormatCustom.Date);
        this.appLogList = JSON.parse(res.response[0].JsonPatientAppointmentLogForLogTab);
        this.fullLogList = JSON.parse(res.response[0].JsonPatientFullLogForLogTab);
        this.totalrecordsFullLog = JSON.parse(res.response[0].JsonPatientFullLogForLogTab)[0] ? JSON.parse(res.response[0].JsonPatientFullLogForLogTab)[0].Totalrecords : 1;
        this.totalRecordAppLog = JSON.parse(res.response[0].JsonPatientAppointmentLogForLogTab)[0] ? JSON.parse(res.response[0].JsonPatientAppointmentLogForLogTab)[0].Totalrecords : 1;
      }
    });
  }
  crudBillingPaymentDestination(operation: number) {
    this.modalValue = 'modal';
    if (this.patientBillingDetailForm.invalid) {
      this.modalValue = '';
      this.Issubmitted = true;
      return;
    }
    let body = {
      //'internalPatientID': 'selectedInternalPatientId',
      'internalPatientID': this.selectedInternalPatientId,
      'Operation': operation,
      'isSentPatAttorney': this.patientBillingDetailFormControls.isSentPatAttorney.value,
      'billingEmail1': this.patientBillingDetailFormControls.billingEmail1.value,
      'billingEmail2': this.patientBillingDetailFormControls.billingEmail2.value,
      'billingEmail3': this.patientBillingDetailFormControls.billingEmail3.value,
      'billingEmail4': this.patientBillingDetailFormControls.billingEmail4.value,
      'billingEmail5': this.patientBillingDetailFormControls.billingEmail5.value,
      'billingFax1': this.patientBillingDetailFormControls.billingFax1.value,
      'billingFax2': this.patientBillingDetailFormControls.billingFax2.value,
      'billingFax3': this.patientBillingDetailFormControls.billingFax3.value,
      'billingFax4': this.patientBillingDetailFormControls.billingFax4.value,
      'billingFax5': this.patientBillingDetailFormControls.billingFax5.value,

    }
    this.patientService.crudBillingPaymentDestination(true, JSON.stringify(JSON.stringify(body))).subscribe((res) => {
      if (operation === 2) {

        if (res.response != null) {
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.response.Message,
            alertType: res.response.ResponseCode
          });
        } else {
          this.notificationService.showNotification({
            alertHeader: 'Error',
            alertMessage: res.response.Message,
            alertType: res.response.ResponseCode
          });
        }
      }

      if (res !== null && operation === 4) {
        this.billingHeaderTitle = JSON.parse(res.response[0].JsonPatientDetailForDetailTab)['Patient Detail'][0].PATIENTID + ', ' + JSON.parse(res.response[0].JsonPatientDetailForDetailTab)['Patient Detail'][0].FAMILYNAME + ' ' + JSON.parse(res.response[0].JsonPatientDetailForDetailTab)['Patient Detail'][0].GIVENNAME + ', ' + this.datePipe.transform(JSON.parse(res.response[0].JsonPatientDetailForDetailTab)['Patient Detail'][0].BIRTHDATE, this.dateTimeFormatCustom.Date);
        this.BillingData = res.response[0]
        this.setpatientBillingDetailFormData(this.BillingData)
        console.log(this.patientBillingDetailForm)
      }
    });
  }

  getAttornerNames() {
    let body = {
      'brokerId': this.storageService.user.BrokerId,
      'dropDownText': '',
      'userType': this.storageService.user.UserType
    }
    this.attorneyList = [];
    this.patientService.getAttorneys(false, body).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.attorneyList = data.response.map(function (item) {
          return item.attorney;
        });
      }
      else {
        this.unSuccess(data);
      }
    },
      (err: any) => {
        this.error(err);
      });
  }

  getreferrerNames() {
    let brokerId = this.storageService.user.BrokerId;
    let GetReferringPhysicians = '';
    let userType = this.storageService.user.UserType;
    this.referrerList = [];
    this.patientService.getReferringPhysicians(false, brokerId, GetReferringPhysicians, userType).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.referrerList = data.response.map(function (item) {
          return item.referringphysician;
        });
      }
      else {
        this.unSuccess(data);
      }
    },
      (err: any) => {
        this.error(err);
      });
  }
  customSearchFn(term: string, item: any) {

    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 ||
      item.countryName.toLocaleLowerCase().indexOf(term) > -1;
  }
  showReport() {
    let reportPath = '';
    let reportName = '';


    this.patientService.GetReportPath().subscribe((res) => {
      //if (res.response != null && res.response.length > 0) {
      //console.log(res);

      //}
    },
      (err: any) => {
        this.error(err);
      });
  }

  applyFilter(isSearchBtn = false) {
    if (isSearchBtn) {
      this.InsertLastSearchRecord()
    }

    debugger
    let brokerId = this.storageService.user?.UserType !== '' && this.storageService.user.UserType.toLowerCase() !== 'precise imaging employee' && this.storageService.user.UserType.toLowerCase() !== 'admin' ? this.storageService.user.BrokerId : ''
    let facilityId = this.storageService.user?.UserType !== '' && this.storageService.user.UserType.toLowerCase() !== 'precise imaging employee' && this.storageService.user.UserType.toLowerCase() !== 'admin' ? this.storageService.user.FacilityID : '';
    let facilityParentId = this.storageService.user?.UserType !== '' && this.storageService.user.UserType.toLowerCase() !== 'precise imaging employee' && this.storageService.user.UserType.toLowerCase() !== 'admin' ? this.storageService.user.FacilityParentID : '';
    let referrelId = this.storageService.user?.UserType !== '' && this.storageService.user.UserType.toLowerCase() !== 'precise imaging employee' && this.storageService.user.UserType.toLowerCase() !== 'admin' ? this.storageService.user.ReferrerId : '';
    let userId = this.storageService.user?.UserType !== '' && this.storageService.user.UserType.toLowerCase() !== 'precise imaging employee' && this.storageService.user.UserType.toLowerCase() !== 'admin' ? this.storageService.user.UserId : '';
    let body =
    {
      'id': 0,
      'isSelected': 0,
      'firstName': this.firstNameModel,
      'lastName': this.lastNameModel,
      'patientID': this.patientIdModel,
      'birthDate': this.dobModel,
      'ssn': this.ssnModel,
      'phone': this.phoneModel,
      'attorney': this.attorneyTypeModelList ? this.attorneyTypeModelList.toString() : '',
      'doi': this.doiModel,
      'financialType': this.financialTypeModelList ? this.financialTypeModelList.join("~") : '',
      'insuranceCompany': this.insuranceCompanyModelList ? this.insuranceCompanyModelList.join("~") : '',
      'accession': this.accessionModel,
      'refPhysician': this.referrerModelList ? this.referrerModelList.toString() : '',
      'broker': this.brokerModelList ? this.brokerModelList.join("~") : '',
      'facility': this.facilityModelList ? this.facilityModelList.join("~") : '',
      'parentCompany': this.parentFacilityModelList ? this.parentFacilityModelList.join("~") : '',
      'fromDate': this.fromDateModel,
      'toDate': this.toDateModel,
      'dateRage': this.dateRangeModel,
      'status': this.statusNameModelList ? this.statusNameModelList.join("~") : '',
      'priority': this.priorityNamesModelList ? this.priorityNamesModelList.join("~") : '',
      'modality': this.modalityModelList ? this.modalityModelList.join("~") : '',
      'cpt': this.cptModel,
      'userId': userId,
      'marketingUser': this.marketingUserModelList ? this.marketingUserModelList.join("~") : '',
      'checkNo': this.checkNumberModel,
      'checkAmount': this.checkAmountModel,
      'userType': this.storageService.user.UserType,
      'brokerId': brokerId,
      'facilityId': facilityId,
      'facilityParentId': facilityParentId,
      'referrelId': referrelId
    }
    this.filterBody = body;
    if (isSearchBtn) {
      this.pageNumber = 1;
    }
    this.patientService.getPatientData(true, body, this.pageNumber, this.pageSize).subscribe((res) => {

      if (res.response != null && res.response.length > 0) {
        debugger
        this.patientGridList = res.response;
        this.totalRecord = res.totalRecords;
        this.dataGrid.instance.refresh();
        //this.isShowColumnWithNoData = true;
      }
      else {
        this.patientGridList = [];
        this.totalRecord = 1;
        ///this.isShowColumnWithNoData = false;
      }
    },
      (err: any) => {
        this.error(err);
      });
    this.GetLastSearchRecord()
  }
  onFullLogsPageNumberChange(pageNumber: any) {
    this.pageNumberFullLogs = pageNumber;
    this.getLogs();

  }
  onAppointmentLogsPageNumberChange(pageNumber: any) {
    this.pageNumberAppointmentLogs = pageNumber;
    this.getLogs();
  }
  onPageNumberChange(pageNumber: any) {
    this.pageNumber = pageNumber;
    this.applyFilter();
  }
  onPageSizeChange(pageSize: any) {
    this.pageNumber = 1;
    this.pageSize = pageSize;
    this.applyFilter();
  }
  getReason(rowData: any) {

    if (rowData.HasAlert == true) {
      return rowData.PATIENTID + ' (' + rowData.Reason + ' )';
    }
    return rowData.PATIENTID;
  }

  clearFilter(isClear: boolean = true) {

    if (isClear) {
      this.patientGridList = [];
    }
    this.lastNameModel = '';
    this.firstNameModel = '';
    this.patientIdModel = '';
    this.dobModel = '';
    this.ssnModel = '';
    this.phoneModel = '';
    this.attorneyTypeModelList = '';
    this.doiModel = '';
    this.financialTypeModelList = [];
    this.insuranceCompanyModelList = [];
    this.accessionModel = '';
    this.referrerModelList = '';
    this.brokerModelList = [];
    this.facilityModelList = [];
    this.parentFacilityModelList = [];
    this.fromDateModel = '';
    this.toDateModel = '';
    this.dateRangeModel = '';
    this.statusNameModelList = [];
    this.priorityNamesModelList = [];
    this.modalityModelList = [];
    this.cptModel = '';
    this.marketingUserModelList = [];
    this.checkNumberModel = '';
    this.checkAmountModel = '';
    this.totalRecord = 1;
    //this.applyFilter();
  }
  onExporting() {
    let element = document.getElementById('patient-grid-container');
    let instance = DataGrid.getInstance(element) as DataGrid;
    this.commonService.onExporting(instance, 'Patient')
  }

  saveGridSetting() {
    let state = this.dataGrid.instance.state();
    // Saves the state in the local storage
    let gridSetting = JSON.stringify(state);
    let body =
    {
      'id': 0,
      'userId': this.storageService.user.UserId,
      'pageName': 'Patient',
      'gridSettings': gridSetting
    }
    this.patientService.updatePersistentGridSetting(true, body).subscribe((res) => {
      if (res.response != null) {
        this.notificationService.showNotification({
          alertHeader: 'Success',
          alertMessage: res.message,
          alertType: res.responseCode
        });
      } else {
        this.notificationService.showNotification({
          alertHeader: 'Error',
          alertMessage: res.message,
          alertType: 400
        });
      }
    },
      (err: any) => {
        this.error(err);
      });
  }
  //// Common Notification Method

  success(data: any) {
    let alertMessage = data.response[0].Result;
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: alertMessage,
      alertType: data.responseCode
    });
  }
  unSuccess(data: any) {
    this.notificationService.showNotification({
      alertHeader: data.statusText,
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }

  error(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }

  onChangeDdlAction(index) {

    this.ddlCurrentValue = index.value;
    this.ddlCurrentText = index.Text;
  }

  selectionChanged(data: any) {
    debugger
    this.selectedRows = [];
    this.checkedData = data.selectedRowsData;
    this.selectedInternalPatientId = data.selectedRowKeys[0] ? data.selectedRowKeys[0].INTERNALPATIENTID : '';

    // this.itemClick(data.selectedRows);
  }
  _base64ToArrayBuffer(base64: any) {
    
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  randomString(length) {
    var randomChars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  goButtonClick() {

    debugger
    if (this.ddlCurrentValue == '2')//'Save Grid'
    {
      let setting = { ...this.filterBody };
      setting.financialType = this.financialTypeModelList ? this.financialTypeModelList.toString() : null;

      let body = {
        'userId': this.storageService.user.UserId,
        'pageName': 'patient',
        'PageSettings': JSON.stringify(setting)
      }
      this.commonService.sendDataToSavedSearchComponent(body)
      this.hiddenSavedSearchPopUpButton.nativeElement.click();
      return;
    }
    else if (this.ddlCurrentValue == '3')//'Save Grid'
    {
      this.saveGridSetting();
      return;
    }
    if (this.checkedData == 0) {
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'No studies are selected',
        alertType: ResponseStatusCode.BadRequest
      });
      return false;

    } else {
      if (this.ddlCurrentValue == '1')//' Export Outside Billing '
      {
        for (let i = 0; i < this.checkedData.length; i++) {
          this.checkedPatientIdInternalStudyid.push({
            '   ': '',
            '    ': '',
            'LAST NAME': this.checkedData[i].LastName,
            'FIRST NAME': this.checkedData[i].FirstName,
            'PATIENTIDEXPORT': this.checkedData[i].PATIENTID,
            'ADDRESS': this.checkedData[i].FullAddress,
            'DOB': this.datePipe.transform(this.checkedData[i].DOB, this.dateTimeFormatCustom.Date), //.toLocaleDateString(),
            'GENDER': this.checkedData[i].Gender,
            'BillSent': this.checkedData[i].BillSent,
            'INSURANCE COMPANY': this.checkedData[i].FINANCIALTYPENAME,
            'COVERAGE LEVEL': this.checkedData[i].COVERAGELEVEL,
            'INSURED ID': this.checkedData[i].INSUREDID,
            'POLICY GROUP': this.checkedData[i].POLICYGROUP,
            'NOTES': this.checkedData[i].Notes,
            'ATTORNEY': this.checkedData[i].ATTORNEY,
            'Business Phone Number': this.checkedData[i].BusinessPhoneNumber,
            'DOS': this.checkedData[i].STUDYDATETIME,
            'CPT': this.checkedData[i].PROCCODENAME,
            'PROC CODE DESC': this.checkedData[i].PROCCODENAME,
            'REFERRING PHYSICIAN': this.checkedData[i].REFERRINGPHYSICIAN,
            'INTERNALSTUDYID': this.checkedData[i].Internalstudyid,
            '': '',
            ' ': '',
            'RAD PSL': this.checkedData[i].RadPSL,
            'REPORT SIGNED TIME': this.checkedData[i].REPORTSIGNEDTIME,
            'TECH PSL': this.checkedData[i].TechPSL,
            'RAD ASL': this.checkedData[i].RadASL,
            'NoShowFee': this.checkedData[i].NoShowFee,
            'TECH ASL': this.checkedData[i].TechASL,
          });
        }

        let now = this.datePipe.transform(new Date(), this.dateTimeFormatCustom.DateTime)
        //let latest_date =this.datepipe.transform(now, 'M/d/yy, h:mm a');
        //console.log(this.checkedPatientIdInternalStudyid);
        this.exportOutSideBillingToExcel(this.checkedPatientIdInternalStudyid, 'ExportOutsideBilling', 'Export Outside Billing ' + now)
        //this.patientService.downloadFile(this.checkedPatientIdInternalStudyid, 'Export Outside Billing ' + now);
        this.checkedPatientIdInternalStudyid = [];
      }
      else if (this.ddlCurrentValue == '6') {
        // Gross Receipts 

        let body =

        {
          'firstName': this.firstNameModel,
          'lastName': this.lastNameModel,
          'patientID': this.patientIdModel,
          'birthDate': this.dobModel,
          'ssn': this.ssnModel,
          'phone': this.phoneModel,
          'attorney': this.attorneyTypeModelList.toString(),
          'doi': this.doiModel,
          'financialType': this.financialTypeModelList.toString(),
          'insuranceCompany': this.insuranceCompanyModelList.toString(),
          'accession': this.accessionModel,
          'refPhysician': this.referrerModelList.toString(),
          'broker': this.brokerModelList.toString(),
          'facility': this.facilityModelList.toString(),
          'fromDate': this.fromDateModel,
          'toDate': this.toDateModel,
          'status': this.statusNameModelList.toString(),
          'priority': this.priorityNamesModelList.toString(),
          'modality': this.modalityModelList.toString(),
          'cpt': this.cptModel,
        }
        this.patientService.getGrossReceipts(body).subscribe((res) => {
          this.checkedPatientIdInternalStudyid = [];
          if (res.response != null) {

            let now = this.datePipe.transform(new Date(), this.dateTimeFormatCustom.Date)
            this.exportArrayToExcel(res.response.studyList, 'study', res.response.receiptList, 'receipt', 'GReceipts__' + now);
          }
        },
          (err: any) => {
            this.error(err);
          });
      }
      else if (this.ddlCurrentValue == '7') {
        //  Generate e-Sign Link    
        debugger
        for (let i = 0; i < this.checkedData.length; i++) {
          console.log(this.checkedPatientIdInternalStudyid);
          const results = this.checkedPatientIdInternalStudyid.filter(pt => {
            return pt.PATIENTIDEXPORT === this.checkedData[i].PATIENTID && pt.InternalStudyId === this.checkedData[i].Internalstudyid;
          });
          if (results.length == 0) {
            this.checkedPatientIdInternalStudyid.push({
              PATIENTIDEXPORT: this.checkedData[i].PATIENTID,
              InternalStudyId: this.checkedData[i].Internalstudyid,
              token: this.randomString(10)
            });
          }
        }
        this.patientService.getGenerateEsignLink(JSON.stringify(JSON.stringify(this.checkedPatientIdInternalStudyid))).subscribe((res) => {
          this.checkedPatientIdInternalStudyid = [];
          if (res.response != null) {
            this.success(res);
            this.GenerateEsignLinkList = this.getUnique(res.response, 'patientid'); res.response;
            this.hiddenShowopenLinkPopUp.nativeElement.click();
          }
        },
          (err: any) => {
            this.error(err);
          });

      } else if (this.ddlCurrentValue == '8') {
        //  Generate_PI_TC_P_PI_Lien 
        for (let i = 0; i < this.checkedData.length; i++) {
          this.checkedPatientIdInternalStudyid.push({
            patientId: this.checkedData[i].PATIENTID,
            internalStudyId: this.checkedData[i].Internalstudyid,
            firstName: this.checkedData[i].FirstName,
            lastName: this.checkedData[i].LastName,
          });
        }
        let data = {
          'parameter': JSON.stringify(this.checkedPatientIdInternalStudyid)
        }
        this.patientService.getGeneratePI_TC_P_PI_Lien(true, JSON.stringify(JSON.stringify(data))).subscribe((res) => {
          this.checkedPatientIdInternalStudyid = [];
          if (res.response != null) {
            // this.success(res);             
            if (res.message.toString().toLowerCase() != 'success') {
              this.hiddenDisMessagePopUp.nativeElement.click();
              this.Generate_PI_TC_Message = res.message;
            }
            this.fileList = res.response;
            for (let result of this.fileList) {
              let ArrayBuff = this._base64ToArrayBuffer(result.file);
              let file = new Blob([ArrayBuff], { type: 'application/pdf' });
              // var newWin=
            
              window.open(URL.createObjectURL(file), '_blank');
            }
          } else {
            this.error(res);
          }
        },
          (err: any) => {
            this.error(err);
          });
      } else if (this.ddlCurrentValue == '9') {
        //  Generate_PI_TC_Lien         
        for (let i = 0; i < this.checkedData.length; i++) {
          this.checkedPatientIdInternalStudyid.push({
            patientId: this.checkedData[i].PATIENTID,
            internalStudyId: this.checkedData[i].Internalstudyid,
            firstName: this.checkedData[i].FirstName,
            lastName: this.checkedData[i].LastName,
          });
        }
        let data = {
          'parameter': JSON.stringify(this.checkedPatientIdInternalStudyid)
        }
        this.patientService.getGeneratePI_TC_Lien(true, JSON.stringify(JSON.stringify(data))).subscribe((res) => {

          this.checkedPatientIdInternalStudyid = [];
          if (res.response != null) {
            //console.log(res);
            this.fileList = res.response;
            for (let result of this.fileList) {
              let ArrayBuff = this._base64ToArrayBuffer(result.file);
              let file = new Blob([ArrayBuff], { type: 'application/pdf' });
              
              window.open(URL.createObjectURL(file), '_blank');
            
              //  this.success(res);
            }
          } else {
            this.error(res);
          }
        },
          (err: any) => {
            this.error(err);
          });
      } else if (this.ddlCurrentValue == '10') {
        //  Generate_P_PI_Lien         
        for (let i = 0; i < this.checkedData.length; i++) {
          this.checkedPatientIdInternalStudyid.push({
            patientId: this.checkedData[i].PATIENTID,
            internalStudyId: this.checkedData[i].Internalstudyid,
            firstName: this.checkedData[i].FirstName,
            lastName: this.checkedData[i].LastName,
          });
        }
        let data = {
          'parameter': JSON.stringify(this.checkedPatientIdInternalStudyid)
        }

        this.patientService.getGenerateP_PI_Lien(true, JSON.stringify(JSON.stringify(data))).subscribe((res) => {
          this.checkedPatientIdInternalStudyid = [];
          if (res.responseCode == 200) {
            //console.log(res);            
            if (res.message.toString().toLowerCase() != 'success') {
              this.hiddenDisMessagePopUp.nativeElement.click();
              this.Generate_PI_TC_Message = res.message;
            }
            if (res.response != null) {
              this.fileList = res.response;
              for (let result of this.fileList) {
                let ArrayBuff = this._base64ToArrayBuffer(result.file);
                let file = new Blob([ArrayBuff], { type: 'application/pdf' });
                window.open(URL.createObjectURL(file), '_blank');
                //  this.success(res);
              }
            }

          } else {
            this.error(res);
          }
        },
          (err: any) => {
            this.error(err);
          });
      } else if (this.ddlCurrentValue == '11' || this.ddlCurrentValue == '12' || this.ddlCurrentValue == '13') {
        //  Generate Attorney Bill
        this.checkedPatientIdInternalStudyid = [];
        let RevisedBill = false;
        let IsPreview = false;
        if (this.ddlCurrentValue == '12') {
          RevisedBill = true;
          IsPreview = false;
        }
        if (this.ddlCurrentValue == '13') {
          RevisedBill = false;
          IsPreview = true;
        }
        for (let i = 0; i < this.checkedData.length; i++) {
          this.checkedPatientIdInternalStudyid.push({
            patientIdExport: this.checkedData[i].PATIENTID,
            FINANCIALTYPENAME: this.checkedData[i].FINANCIALTYPENAME,
            STUDYDESCRIPTION: this.checkedData[i].STUDYDESCRIPTION,
            IsReferralService: this.checkedData[i].IsReferralService,
            StudyPart: this.checkedData[i].StudyPart,
            DXCode: this.checkedData[i].DXCode,
            ATTORNEYLF: this.checkedData[i].ATTORNEYLF,
            BDCompanyName: this.checkedData[i].BDCompanyName,
            BrokerOverRideAddress: this.checkedData[i].BrokerOverRideAddress,
            AttorneyFaxNumber: this.checkedData[i].AttorneyFaxNumber,
            InjuryDate: this.checkedData[i].InjuryDate,
            isExamLocation: this.checkedData[i].IsExamLocation,
            ISREADYTOBILL: this.checkedData[i].ISREADYTOBILL,
            internalStudyId: this.checkedData[i].Internalstudyid,
            firstName: this.checkedData[i].FirstName,
            lastName: this.checkedData[i].LastName,
            address: this.checkedData[i].FullAddress,
            dob: this.checkedData[i].DOB,
            businessPhoneNumber: this.checkedData[i].BusinessPhoneNumber,
            dos: this.checkedData[i].STUDYDATETIME,
            cpt: this.checkedData[i].PROCCODENAME,
            reportType: '',   //need to discuss
            attorneyEmail: this.checkedData[i].AttorneyEmail,
            BillingMethod: this.checkedData[i].BillingMethod,
            ACCESSIONNUMBER: this.checkedData[i].ACCESSIONNUMBER,
            SCHEDULEDLATERALITY: this.checkedData[i].SCHEDULEDLATERALITY,
            PSL_P: this.checkedData[i].RADPSL,
            PSL_TC: this.checkedData[i].TECHPSL,
            RevisedBill: RevisedBill,
            IsPreview: IsPreview,
            AttorneyLien: this.checkedData[i].AttorneyLien,
            ASL_P: this.checkedData[i].RADASL,
            ASL_TC: this.checkedData[i].TECHASL,
            OverrideAddressForBilling: this.checkedData[i].OverrideAddressForBilling,
            CELLPHONE: this.checkedData[i].CELLPHONEDISPLAY,
            HOMEPHONE: this.checkedData[i].HOMEPHONEDISPLAY,
            FAXNUMBER: this.checkedData[i].AttorneyFaxNumber,
            EMAIL: this.checkedData[i].AttorneyEmail
          });

          if (this.ddlCurrentValue == '11' || this.ddlCurrentValue == '12') {
            if (this.checkedData[i].FINANCIALTYPENAME.toLocaleLowerCase() !== 'personal injury' && this.checkedData[i].FINANCIALTYPENAME.toLocaleLowerCase() !== 'broker') {
              this.notificationService.showNotification({
                alertHeader: null,
                alertMessage: 'Some of the selected patient(s) Financial Type are not Personal Injury OR Broker',
                alertType: ResponseStatusCode.BadRequest
              });
              return false;
            } else if (!this.checkedData[i].ISREADYTOBILL) {
              this.notificationService.showNotification({
                alertHeader: null,
                alertMessage: 'Some of the selected patient(s) are not ready to be billed',
                alertType: ResponseStatusCode.BadRequest
              });
              return false;
            }
          }
        }

        this.patientService.getGenerateAttorneyBill(true, JSON.stringify(JSON.stringify(this.checkedPatientIdInternalStudyid))).subscribe((res) => {
          this.checkedPatientIdInternalStudyid = [];
          if (res.response != null) {

            this.fileList = res.response;
            for (let result of this.fileList) {
              let ArrayBuff = this._base64ToArrayBuffer(result.file);
              let file = new Blob([ArrayBuff], { type: 'application/pdf' });
              // var newWin=
              window.open(URL.createObjectURL(file), '_blank');
            }
          } else {
            this.notificationService.showNotification({
              alertHeader: 'Error',
              alertMessage: res.message,
              alertType: res.responseCode
            });
          }
        },
          (err: any) => {
            this.error(err);
          });
      }
      else if (this.ddlCurrentValue == '4' || this.ddlCurrentValue == '5')
      //|| DropDownObject.value == '14' || DropDownObject.value == '15' || DropDownObject.value == '16' || DropDownObject.value == '17' || DropDownObject.value == '18' || DropDownObject.value == '19')
      //4- Ready to Bill
      //5- Not Ready to Bill
      //14- Patient Lien Signed 
      //15- Patient Lien Not Signed 
      //16- Attorney Lien Signed 
      //17- Attorney Not Lien Signed 
      //18- Tech ASL Signed 
      //19- Tech ASL Not Signed 
      {
        this.checkedPatientIdInternalStudyid = [];
        for (let i = 0; i < this.checkedData.length; i++) {
          this.checkedPatientIdInternalStudyid.push({
            PATIENTID: this.checkedData[i].PATIENTID,
            InternalStudyId: this.checkedData[i].Internalstudyid,
            Condition: this.ddlCurrentValue,
            AttorneyBillingId: this.checkedData[i].AttorneyBillingId,
            Userid: this.storageService.user.UserId
          });
        }
        let data = {
          'parameter': JSON.stringify(this.checkedPatientIdInternalStudyid)
        }
        this.patientService.getReadyToBill(true, JSON.stringify(JSON.stringify(data))).subscribe((res) => {
          this.checkedPatientIdInternalStudyid = [];
          if (res.response != null) {

            this.notificationService.showNotification({
              alertHeader: 'Success',
              alertMessage: res.response[0].Result,
              alertType: res.responseCode
            });
            this.applyFilter();
            $('.dx-command-select[role="columnheader"]').find('.dx-select-checkbox[aria-checked="mixed"').trigger('click')
            $('.dx-command-select[role="columnheader"]').find('.dx-select-checkbox[aria-checked="true"').trigger('click')
          } else {
            this.error(res);
          }
        },
          (err: any) => {
            this.error(err);
          });

      }
      else if (this.ddlCurrentValue == '14' || this.ddlCurrentValue == '15' || this.ddlCurrentValue == '16' || this.ddlCurrentValue == '17' ||
        this.ddlCurrentValue == '18' || this.ddlCurrentValue == '19' || this.ddlCurrentValue == '20' || this.ddlCurrentValue == '21' ||
        this.ddlCurrentValue == '22' || this.ddlCurrentValue == '23' || this.ddlCurrentValue == '24' || this.ddlCurrentValue == '25' ||
        this.ddlCurrentValue == '26' || this.ddlCurrentValue == '31' || this.ddlCurrentValue == '32') {

        let internalStudyIds = '';
        let internalPatientIds = '';
        let actionOrderNo = this.ddlCurrentValue;
        for (let i = 0; i < this.checkedData.length; i++) {
          // this.checkedPatientIdInternalStudyid.push({
          // InternalStudyId: this.checkedData[i].Internalstudyid,            
          // })
          if (i < this.checkedData.length - 1) {
            internalPatientIds += this.checkedData[i].INTERNALPATIENTID + ',';
            internalStudyIds += this.checkedData[i].Internalstudyid + ',';
          }
          else {
            internalPatientIds += this.checkedData[i].INTERNALPATIENTID;
            internalStudyIds += this.checkedData[i].Internalstudyid;
          }
        }
        let data = {
          'internalStudyIds': internalStudyIds,
          'internalPatientIds': internalPatientIds,
          'actionOrderNo': actionOrderNo
        }
        this.patientService.updateActionOnSelect(true, JSON.stringify(JSON.stringify(data))).subscribe((res) => {
          this.checkedPatientIdInternalStudyid = [];
          if (res.response != null) {
            // this.success(res.response[0].result);
            // console.log(res.response[0].result);

            this.notificationService.showNotification({
              alertHeader: 'Success',
              alertMessage: res.response[0].Result,
              alertType: res.responseCode
            });
            this.applyFilter();
          } else {
            this.error(res);

          }
        })
      }
      else if (this.ddlCurrentValue == '33') {//Do Not Send SMS
        let msg = '';
        let userId = '';
        let internalPatientIds = '';
        let actionOrderNo = this.ddlCurrentValue;
        //console.log(this.checkedData);

        for (let i = 0; i < this.checkedData.length; i++) {
          if (i < this.checkedData.length - 1) {
            internalPatientIds += this.checkedData[i].PATIENTID + ',';
            userId += this.storageService.user.UserId + ',';
          }
          else {
            internalPatientIds += this.checkedData[i].PATIENTID;
            userId += this.storageService.user.UserId;
          }
        }
        let data = {
          'userId': userId,
          'internalPatientIds': internalPatientIds

        }

        this.patientService.CreateNoSMSPatient(true, JSON.stringify(JSON.stringify(data))).subscribe((res) => {
          this.checkedPatientIdInternalStudyid = [];
          if (res.response != null) {
            // this.success(res.response[0].result);
            // console.log(res.response[0].result);
            this.notificationService.showNotification({
              alertHeader: 'Success',
              alertMessage: res.response[0].result,
              alertType: res.responseCode
            });
          } else {
            this.error(res);

          }
        })

      }
      else if (this.ddlCurrentValue == '28') {
        // Create Intake Packet
        let msg = '';
        let internalStudyIds = '';
        let internalPatientIds = '';
        let studyStatus = ''; let financialType = ''; let readingPhysician = '';

        let actionOrderNo = this.ddlCurrentValue;
        //console.log(this.checkedData);
        var uniqueData;
        if (this.checkedData.length > 0) {
          uniqueData = this.checkedData
            .map(e => e['PATIENTID'])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(obj => this.checkedData[obj])
            .map(e => this.checkedData[e]);
        }



        if (uniqueData.length == 1) {
          this.checkedPatientIdInternalStudyid = [];
          for (let i = 0; i < this.checkedData.length; i++) {
            this.checkedPatientIdInternalStudyid.push({

              patiendId: this.checkedData[i].PATIENTID,
              InternalStudyId: this.checkedData[i].Internalstudyid,
              financialType: this.checkedData[i].FINANCIALTYPENAME,
              studyStatus: this.checkedData[i].STATUS,
              readingPhysician: this.checkedData[i].READINGPHYSICIAN,
              Rad_PSL: this.checkedData[i].RadPSL,
              Tech_PSL: this.checkedData[i].TechPSL,
            });
          }
          this.patientService.CreateIntakePacket(true, this.checkedPatientIdInternalStudyid).subscribe((res) => {
            if (res.response) {
              // contentType: string='image/png'
              const blobData = this.convertBase64ToBlobData(res.response[0].file);
              const blob = new Blob([blobData], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              window.open(url);
            } else {
              this.error(res);

            }
          })
        }
        else {
          this.notificationService.showNotification({
            alertHeader: 'Error',
            alertMessage: 'Multiple patients selected. Cannot create intake packet',
            alertType: 400
          });
        }
      }
      else if (this.ddlCurrentValue == '29') {

        // Create XRAY Preg Waiver
        let msg = '';

        let internalStudyIds = '';
        let internalPatientIds = '';
        let actionOrderNo = this.ddlCurrentValue;
        //console.log(this.checkedData);

        if (this.checkedData.length == 1) {
          for (let i = 0; i < this.checkedData.length; i++) {
            var data = {
              'internalStudyIds': this.checkedData[i].Internalstudyid,
              'internalPatientIds': this.checkedData[i].PATIENTID,
              'financialType': this.checkedData[i].FINANCIALTYPENAME,
              'studyStatus': this.checkedData[i].STATUS,
              'readingPhysician': this.checkedData[i].READINGPHYSICIAN
            }
          }
          this.patientService.CreateXRAYPregWaiver(true, JSON.stringify(JSON.stringify(data))).subscribe((res) => {
            this.checkedPatientIdInternalStudyid = [];
            if (res.response) {
              //console.log(res.response[0].file);
              // contentType: string='image/png'
              const blobData = this.convertBase64ToBlobData(res.response[0].file);
              const blob = new Blob([blobData], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              window.open(url);
            } else {
              this.error(res);

            }
          })
        }
        else {
          this.notificationService.showNotification({
            alertHeader: 'Error',
            alertMessage: 'Multiple patients selected. Cannot create waiver',
            alertType: 400
          });
        }
      }
      // else if (DropDownObject.value == '32') {
      //   let internalPatientIds = '';
      //   let userName = this.storageService.user.UserName;
      //   let condition = 1;
      //   //console.log(userName);
      //   for (let i = 0; i < this.checkedData.length; i++) {
      //     if (i < this.checkedData.length - 1) { internalPatientIds += this.checkedData[i].PATIENTID.substring(3) + ','; }
      //     else { internalPatientIds += this.checkedData[i].PATIENTID.substring(3); }
      //   }
      //   this.patientService.CreateNoSMSPatient(internalPatientIds, userName, condition).subscribe((res) => {
      //     if (res.response != null) {
      //       // this.success(res.response[0].result);
      //       // console.log(res.response[0].result);
      //       this.notificationService.showNotification({
      //         alertHeader: 'Success',
      //         alertMessage: res.response[0].result,
      //         alertType: res.responseCode
      //       });
      //     }
      //   })
      // }

    }
  }
  showDocManager(e: any) {

    let dataGridalltrList: any = document.getElementsByTagName("tr");
    for (var i = 0; i < dataGridalltrList.length; i++) {
      dataGridalltrList[i].classList.remove("custom-patient-row-selection")
    }
    for (let index = 0; index < e.row.cells.length; index++) {
      e.row.cells[index].cellElement.parentElement.classList.add("custom-patient-row-selection");
    }

    this.commonService.sendDataToDocumentManager(e.data.PATIENTID);
  }
  convertBase64ToBlobData(base64Data: string, contentType: string = 'application/pdf', sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  exportArrayToExcel(arr: any[], sheetName: string, arr1: any[], sheetName1: string, filename: string) {
    //let { sheetName, fileName } = getFileName(name);
    let fileName = filename;

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(arr);
    var ws1 = XLSX.utils.json_to_sheet(arr1);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.utils.book_append_sheet(wb, ws1, sheetName1);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  lastSearchPatch(event) {
    debugger
    let stringInput = JSON.parse(event.PageSettings);
    this.clearFilter(false);
    let a = stringInput.patientID;
    // console.log(stringInput);    
    this.lastNameModel = stringInput.lastName;
    this.firstNameModel = stringInput.firstName;
    this.patientIdModel = stringInput.patientID;
    this.dobModel = stringInput.birthDate;
  }


  ClearAttorney(e) {
    let isValid = false;
    this.attorneyList.forEach(function (players) {
      if (players === e.target.value && !isValid) {
        isValid = true;
      }
    });
    if (!isValid) {
      this.attorneyTypeModelList = ''
    }
  }

  ClearReferrerPhysician(e: any) {
    let isValid = false;
    this.referrerList.forEach(function (players) {
      if (players === e.target.value && !isValid) {
        isValid = true;
      }
    });
    if (!isValid) {
      this.referrerModelList = ''
    }
  }

  exportOutSideBillingToExcel(arr: any[], sheetName: string, filename: string) {
    //let { sheetName, fileName } = getFileName(name);
    let fileName = filename;
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(arr);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  InsertLastSearchRecord() {
    debugger
    let body = {
      'id': 0,
      'isSelected': 0,
      'firstName': this.firstNameModel,
      'LastName': this.lastNameModel,
      'patientID': this.patientIdModel,
      'birthDate': this.dobModel,
      'ssn': this.ssnModel,
      'phone': this.phoneModel,
      'attorney': this.attorneyTypeModelList ? this.attorneyTypeModelList.toString() : '',
      'doi': this.doiModel,
      'financialType': this.financialTypeModelList ? this.financialTypeModelList.join(",") : '',
      'insuranceCompany': this.insuranceCompanyModelList ? this.insuranceCompanyModelList.join(",") : '',
      'accession': this.accessionModel,
      'refPhysician': this.referrerModelList ? this.referrerModelList.toString() : '',
      'broker': this.brokerModelList ? this.brokerModelList.join(",") : '',
      'facility': this.facilityModelList ? this.facilityModelList.join(",") : '',
      'parentCompany': this.parentFacilityModelList ? this.parentFacilityModelList.join(",") : '',
      'fromDate': this.fromDateModel,
      'toDate': this.toDateModel,
      'dateRage': this.dateRangeModel,
      'status': this.statusNameModelList ? this.statusNameModelList.join(",") : '',
      'priority': this.priorityNamesModelList ? this.priorityNamesModelList.join(",") : '',
      'modality': this.modalityModelList ? this.modalityModelList.join(",") : '',
      'cpt': this.cptModel,
      'userId': this.storageService.user.UserId,
      'marketingUser': this.marketingUserModelList ? this.marketingUserModelList.join(",") : '',
      'checkNo': this.checkNumberModel,
      'checkAmount': this.checkAmountModel
    }
    this.patientService.InsertLastSearchRecord(true, JSON.stringify(JSON.stringify(body))).subscribe((res) => {
      var data: any = res;
      console.log(data);
    }
    )
  }

  GetLastSearchRecord() {
    debugger
    this.patientService.GetLastSearchRecord(true).subscribe((res) => {
      this.LastSearchRecordList = res.response
      if (this.LastSearchRecordList == null) {
        this.previouButtonDisable = true;
        this.nextButtonDisable = true;
      }
    })
  }

  recordChange(ArrayIndex: any, isDisable: any) {
    if (!isDisable) {
      if (ArrayIndex == 0) {
        this.ArrayIndex = this.ArrayIndex + 1;
        this.nextButtonDisable = false;

      }
      else if (ArrayIndex == 1) {
        this.ArrayIndex = this.ArrayIndex - 1;
        this.previouButtonDisable = false;
      }
      if (this.ArrayIndex >= this.LastSearchRecordList.length - 1) {
        this.previouButtonDisable = true;
      }
      if (this.ArrayIndex == 0) {
        this.nextButtonDisable = true;
      }

      let array: any = this.LastSearchRecordList;
      this.lastNameModel = array[this.ArrayIndex].LastName;
      this.firstNameModel = array[this.ArrayIndex].FirstName;
      this.patientIdModel = array[this.ArrayIndex].PatientID;
      this.dobModel = array[this.ArrayIndex].BirthDate != '1900-01-01' ? array[this.ArrayIndex].BirthDate : '';
      this.ssnModel = array[this.ArrayIndex].Ssn;
      this.phoneModel = array[this.ArrayIndex].Phone;
      this.attorneyTypeModelList = array[this.ArrayIndex].Attorney;
      this.doiModel = array[this.ArrayIndex].Doi != '1900-01-01' ? array[this.ArrayIndex].Doi : '';
      this.financialTypeModelList = array[this.ArrayIndex].FinancialType ? array[this.ArrayIndex].FinancialType.split(',') : '';
      this.insuranceCompanyModelList = array[this.ArrayIndex].InsuranceCompany ? array[this.ArrayIndex].InsuranceCompany.split(',') : '';
      this.accessionModel = array[this.ArrayIndex].Accession;
      this.referrerModelList = array[this.ArrayIndex].RefPhysician ? array[this.ArrayIndex].RefPhysician.split(',') : '';
      this.facilityModelList = array[this.ArrayIndex].FacilityId ? array[this.ArrayIndex].FacilityId.split(',') : '';
      this.facilityModelList = array[this.ArrayIndex].Facility ? array[this.ArrayIndex].Facility.split(',') : '';
      this.parentFacilityModelList = array[this.ArrayIndex].ParentCompany ? array[this.ArrayIndex].ParentCompany.split(',').map(x => +x) : '';
      this.fromDateModel = array[this.ArrayIndex].FromDate != '1900-01-01' ? array[this.ArrayIndex].FromDate : '';
      this.toDateModel = array[this.ArrayIndex].ToDate != '1900-01-01' ? array[this.ArrayIndex].ToDate : '';
      this.dateRangeModel = array[this.ArrayIndex].DateRage;
      this.statusNameModelList = array[this.ArrayIndex].Status ? array[this.ArrayIndex].Status.split(',') : '';
      this.priorityNamesModelList = array[this.ArrayIndex].Priority ? array[this.ArrayIndex].Priority.split(',') : '';
      this.modalityModelList = array[this.ArrayIndex].Modality ? array[this.ArrayIndex].Modality.split(',') : '';
      this.cptModel = array[this.ArrayIndex].Cpt;
      this.marketingUserModelList = array[this.ArrayIndex].MarketingUser ? array[this.ArrayIndex].MarketingUser.split(',').map(x => +x) : '';
      this.checkNumberModel = array[this.ArrayIndex].CheckNo;
      this.checkAmountModel = array[this.ArrayIndex].CheckAmount;
      this.applyFilter()
    }
  }

  onChangeSavedSearch(event) {
    debugger
    //this.clearFilter();
    let stringInput = JSON.parse(event.PageSettings);
    this.clearFilter(false);
    let a = stringInput.patientID;
    // console.log(stringInput);    
    this.lastNameModel = stringInput.lastName;
    this.firstNameModel = stringInput.firstName;
    this.patientIdModel = stringInput.patientID;
    this.dobModel = stringInput.birthDate;
    this.ssnModel = stringInput.ssn;
    this.phoneModel = stringInput.phone;
    this.attorneyTypeModelList = stringInput.attorney;
    this.doiModel = stringInput.doi;
    this.financialTypeModelList = stringInput.financialType ? stringInput.financialType.split(',') : this.financialTypeModelList;
    this.insuranceCompanyModelList = stringInput.insuranceCompany ? stringInput.insuranceCompany.split(',') : this.insuranceCompanyModelList;
    this.accessionModel = stringInput.accession;
    //this.referrerModelList = stringInput.referrelId ? stringInput.referrelId.split(',') : this.referrerModelList;
    //update by Maninder
    this.referrerModelList = stringInput.refPhysician ? stringInput.refPhysician.split(',') : this.referrerModelList;
    //
    //this.brokerModelList = stringInput.brokerId ? stringInput.brokerId.split(',') : this.brokerModelList;
    //update by Maninder
    this.brokerModelList = stringInput.broker ? stringInput.broker.split(',') : this.brokerModelList;
    //
    this.facilityModelList = stringInput.facilityId ? stringInput.facilityId.split(',') : this.facilityModelList;
    //update by Maninder
    this.facilityModelList = stringInput.facility ? stringInput.facility.split(',') : this.facilityModelList;
    //
    this.parentFacilityModelList = stringInput.parentCompany ? stringInput.parentCompany.split(',').map(x => +x) : this.parentFacilityModelList;
    this.fromDateModel = stringInput.fromDate;
    this.toDateModel = stringInput.toDate;
    this.dateRangeModel = stringInput.dateRage;
    this.statusNameModelList = stringInput.status ? stringInput.status.split(',') : this.statusNameModelList;
    this.priorityNamesModelList = stringInput.priority ? stringInput.priority.split(',') : this.priorityNamesModelList;
    this.modalityModelList = stringInput.modality ? stringInput.modality.split(',') : this.modalityModelList;
    this.cptModel = stringInput.cpt;
    this.marketingUserModelList = stringInput.marketingUser ? stringInput.marketingUser.split(',').map(x => +x) : this.marketingUserModelList;
    this.checkNumberModel = stringInput.checkNo;
    this.checkAmountModel = stringInput.checkAmount;
  }
  getAllSavedSearchList() {
    this._commonMethodService.getSavedSearchList(true, this.storageService.user.UserId, 'patient').subscribe((res) => {
      if (res.response != null) {
        this.savedSearchList = res.response;
      }
      else {
        this.savedSearchList = [];
      }
    }, (err) => {
      this.error(err);
    });
  }


  get patientBillingDetailFormControls() { return this.patientBillingDetailForm.controls; }

  onContextMenuPreparing(e) {

    const that = this;
    if (e?.row?.rowType === "data") {
      if (!e.items) e.items = [];

      e.items.push({
        text: "BILLING",
        items: [{
          text: "Add bill/payment destination",
          onItemClick: function () {
            if (e.row.data.INTERNALPATIENTID) {
              that.selectedInternalPatientId = e.row.data.INTERNALPATIENTID;
            }
            else {
              that.selectedInternalPatientId = that.findByRecursion(e.row.data);
            }
            that.openBillingPopUp();
          }
        }]
      },
        {
          text: "LOG",
          onItemClick: function () {
            if (e.row.data.INTERNALPATIENTID) {
              that.selectedInternalPatientId = e.row.data.INTERNALPATIENTID;
            }
            else {
              that.selectedInternalPatientId = that.findByRecursion(e.row.data);
            }
            that.openLogsPopUp();
          }

        }
      );
    }
  }
  findByRecursion(res: any) {
    if (res.items && res.items.length && res.key != true) {
      return this.findByRecursion(res.items[0])
    } else {
      return res && res.INTERNALPATIENTID ? res.INTERNALPATIENTID : 0;
    }
  }
 
ValidateMultiSelectTextLength(id, a)
  {
    a =this._commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
  copyToClipboard(currentPageUrl) {
    debugger
     navigator.clipboard.writeText(currentPageUrl).catch(() => {
      console.error("Unable to copy text");
    });
     this.notificationService.showToaster({
       alertHeader: '',
      alertMessage: currentPageUrl,
       alertType: null
     });
  }
  getReferrerDetailById(referrerName: any, referrerId: any,isPoliciesTab:any) {
    debugger
      if (referrerId) {
      let body = { 'title': referrerName, 'referrerId': referrerId, 'isPoliciesTab' : true};
      this.referrersService.sendDataToReferrerDetailWindowFromOrderedSchedular(body);
    }
  }
  getBrokerDetailById(brokerName: string, brokerId: any) {
    if (brokerId) {
      let body = { 'brokerId': brokerId, 'brokerName': brokerName };
      this.brokerService.sendDataToBrokerFromOrderedSchedularComponent(body);
    }
  }
  getReferringPhyDetailById(referringPhysician: string, ReferringPhyId: any) {
    debugger
    if (ReferringPhyId) {
      let body = { 'title': referringPhysician, 'referrerId': ReferringPhyId, 'isPoliciesTab' : true};
      this.referrersService.sendDataToReferrerDetailWindowFromOrderedSchedular(body);
    }
  }
  getReadingPhysicianById(readingPhysician: string, RadlogistId: any) {
    debugger
    if (RadlogistId) {
      let body = { 'title': readingPhysician, 'referrerId': RadlogistId, 'isPoliciesTab' : true};
      this.referrersService.sendDataToReferrerDetailWindowFromOrderedSchedular(body);
    }
  }
}
