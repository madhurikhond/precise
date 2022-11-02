import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrokerService } from 'src/app/services/broker.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { ReferrersService } from 'src/app/services/referrers.service';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { DxDataGridComponent } from 'devextreme-angular';
import saveAs from 'file-saver';
import { DatePipe } from '@angular/common';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { ckeConfig } from 'src/app/constants/Ckeditor';
import { CommonRegex } from 'src/app/constants/commonregex';
import { HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { LoadingService } from 'src/app/services/common/loading.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css'],
  providers: [DatePipe]
})

export class BrokerComponent implements OnInit {
  @ViewChild('gridExport', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('hiddenDXbutton', { read: ElementRef }) hiddenDXbutton: ElementRef;
  @ViewChild('hiddenSendMailbutton', { read: ElementRef }) hiddenSendMailbutton: ElementRef;
  @ViewChild('hiddenAddEditPopUpItem', { read: ElementRef }) hiddenAddEditPopUpItem: ElementRef;
  a1: any = 20;
  defaultPopupTab: string = 'Funding Company Details';
  documentTabShow: boolean= true;
  brokerName: string = null;
  modelValue: string = 'modal';
  addEditForm: FormGroup;
  searchForm: FormGroup;
  sendMailForm: FormGroup;
  mailSubmitted = false;
  mailmodelValue: string = 'modal';
  totalRecords: number;
  pageNumber: number = 1;
  pageSize: number;
  submitted = false;
  isLoading : any
  brokerId: number;
  brokerList: any = [];
  billingMethodList: any = [];
  reportList: any = [];
  documentTypeList: any = [];
  brokerFacilityPricingList: any = [];
  brokerExcludeFacilityList: any = [];
  brokerExportDataList: any = [];
  brokerPricingDataList : any = [];

  masterSelected: boolean;
  SftpList: any = [];
  docTypeList: any = [];
  selectedDocType: any = [];
  selectedDocToBroker: any = [];
  showNavButtons = true;
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  selectedCollectionsTypes: any;
  isShown: boolean = false;
  file: any;
  fileName: string = '';
  isSearchBroker: boolean = false;
  searchBrokerForm: FormGroup;
  searchText: string = '';
  @Input() isGridDisplay: boolean = true
  readonly pageSizeArray = PageSizeArray;
  readonly CkeConfig = ckeConfig;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  readonly commonRegex=CommonRegex;
  modalitiesCopyName: string = '';
  //@Input() isShowGrid:boolean=true;
  pageSizeFacilityList: number = 20;
  pageNumberFacilityList: number = 1;
  totalRecordFacilityList: number = 1;
  RecordFacilityList: any = [];
  FacilityList: any = [];
  selectedRows: number[] = [];
  BrokerPoliciesForm: FormGroup; 
  // Phone/Fax masking 
  public phoneFaxMask = {
    guide: true,
    showMask: true,
    mask: ['(', /\d/, /\d/, /\d/, ')', '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  };
  name = 'ng2-ckeditor';
  //ckeConfig: CKEDITOR.config;
  ckeConfig:any;
  mycontent: string;
  log: string = '';
  constructor(private datePipe: DatePipe, private fb: FormBuilder, private brokerService: BrokerService, private referrersService: ReferrersService,
    private notificationService: NotificationService, private readonly commonMethodService: CommonMethodService ,
    private readonly loadingService :LoadingService) {

    brokerService.sendDataToBrokerFromPatientDetail.subscribe(res => {
      if (res.brokerId) {
        this.isGridDisplay = false;
        this.brokerId = res.brokerId;
        this.brokerName = res.brokerName;
        this.edit(this.brokerId);
        this.hiddenAddEditPopUpItem.nativeElement.click();
      }
    });;
    brokerService.sendDataToBrokerFromOrderedSchedular.subscribe(res => {
       if (res.brokerId) {
         this.isGridDisplay = false;
         this.brokerId = res.brokerId;
         this.brokerName = res.brokerName;
         this.edit(this.brokerId);
         this.hiddenAddEditPopUpItem.nativeElement.click();
       }
     });
    
  }
 
  ngOnInit(): void {
  
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;
    this.brokerExportDataList = [];
    this.searchForminitialize();
    this.sendMailForminitialize();
    this.initializeForm();
    this.createGeneralPoliciesForm();
    if (this.isGridDisplay) {
      this.commonMethodService.setTitle('Funding Companies');
      this.getBrokerPageDropDown();
      this.getAllBrokers();
      this.getAllftpList();
      this.getAllDocumentTypes();
      this.isShown = false;
      this.fileName = '';
      
    }
    // ClassicEditor.inline( 'editable', {
    //   extraPlugins: 'sourcedialog'
    // });
   
  }
 
  onChange($event: any): void {
    console.log("onChange");
    //this.log += new Date() + "<br />";
  }
  
  onPaste($event: any): void {
    console.log("onPaste");
    //this.log += new Date() + "<br />";
  }
  createGeneralPoliciesForm() {
    this.BrokerPoliciesForm = this.fb.group({
      brokerPolicy: ['',]
    })
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getAllBrokers();
  }

  searchForminitialize() {
    this.searchBrokerForm = this.fb.group({
      searchText: ['']
    });
  }

  tabClick(tabName) {
    this.defaultPopupTab = tabName;
  }

  onPolicyTabClick(){
    
    this.loadingService.showLoader()
    setTimeout(() => { 
      this.loadingService.showLoader()
      this.brokerService.sendDataToLoaderFromBrokerComponent(false)
      }, 2000)
      this.brokerService.sendDataToLoaderFromBrokerComponent(true)
    }
  
    // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //   setTimeout(() => { this.loadingService.onStarted(req);
    //   }, 2000)
    //   return next
    //   .handle(req)
    // }

  add() {  
    this.defaultPopupTab = 'Funding Company Details';
    this.documentTabShow = false;
    this.brokerId = 0;
    this.submitted = false;
    this.addEditForm.reset();
    this.BrokerPoliciesForm.reset();
    this.getBrokerFacilityPricing();
    this.GetExportData();
    this.GetBrokerPricingDatas();
  }

  sendMailForminitialize() {
    this.sendMailForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.commonRegex.EmailRegex )]],
      subject: ['', [Validators.required]],
      Body: ['', [Validators.required]],
    })
  }

  edit(brokerId) { 
    this.documentTabShow = true;
    this.defaultPopupTab = 'Funding Company Details';
    this.brokerId = brokerId;
    this.submitted = false;
    this.addEditForm.reset();
    this.BrokerPoliciesForm.reset();
    this.getBrokerFacilityPricing();
    this.getBrokerById();
    this.GetExportData();
    this.GetBrokerPricingDatas();
  }

  getBrokerById() {
    this.brokerService.getBrokerById(true, this.brokerId).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.brokerName = data.response.Broker;
        if (res.response.DocID)
          this.selectedDocType = JSON.parse('[' + res.response.DocID + ']');
        if (res.response.AutoDocToBroker)
          this.selectedDocToBroker = JSON.parse('[' + res.response.AutoDocToBroker + ']');
        if (res.response.Policy){
          this.BrokerPoliciesForm.patchValue({
            brokerPolicy: data.response.Policy      
          });
        }
        this.addEditForm.patchValue({
          broker: data.response.Broker,
          mainContactName: data.response.MainContactName,
          mainContactPhone: data.response.MainContactPhone,
          mainFax: data.response.MainFax,
          mainContactEmail: data.response.MainContactEmail,
          website: data.response.Website,
          address: data.response.Address,
          city: data.response.City,
          state: data.response.State,
          zip: data.response.Zip,
          billingMethod: data.response.BillingMethod ? data.response.BillingMethod : '',
          isAutoEmailReport: data.response.IsAutoEmailReport,
          //autoEmailReport: data.response.AutoEmailReport,
          autoEmailReport:  data.response.AutoEmailReport && data.response.AutoEmailReport.includes('@')  ? data.response.AutoEmailReport  : '' ,
          isActiveBroker: data.response.IsActiveBroker,
          doNotSendliability: data.response.DoNotSendliability,
          doNotSendliabilitySecondCriteria: data.response.DoNotSendliabilitySecondCriteria,
          doNotSendScheduledSummary: data.response.DoNotSendScheduledSummary,
          doNotSendScheduledSummaryBroker: data.response.DoNotSendScheduledSummaryBroker,
          doNotSendCouldntScheduleReminderAtty: data.response.DONOTSendCouldntScheduleReminderAtty,
          doNotSendOrderedSmstoPatient: data.response.DoNotSendOrderedSmstoPatient,
          doNotSendCouldntScheduleSMS: data.response.DoNotSendCouldntScheduleSMS,
          doNotFaxReportToAttorney: data.response.DoNotFaxReportToAttorney,
          accountsPayable1Contact: data.response.AccountsPayable1Contact,
          accountsPayable1Email: data.response.AccountsPayable1Email,
          accountsPayable1Phone: data.response.AccountsPayable1Phone,
          accountsPayable1Fax: data.response.AccountsPayable1Fax,
          accountsPayable2Contact: data.response.AccountsPayable2Contact,
          accountsPayable2Email: data.response.AccountsPayable2Email,
          accountsPayable2Phone: data.response.AccountsPayable2Phone,
          accountsPayable2Fax: data.response.AccountsPayable2Fax,
          accountsPayable3Contact: data.response.AccountsPayable3Contact,
          accountsPayable3Email: data.response.AccountsPayable3Email,
          accountsPayable3Phone: data.response.AccountsPayable3Phone,
          accountsPayable3Fax: data.response.AccountsPayable3Fax,
          otherContactEmail: data.response.OtherContactEmail,
          billing1Contact: data.response.Billing1Contact,
          billing1Email: data.response.Billing1Email,
          billing1Phone: data.response.Billing1Phone,
          billing1Fax: data.response.Billing1Fax,
          billing2Contact: data.response.Billing2Contact,
          billing2Email: data.response.Billing2Email,
          billing2Phone: data.response.Billing2Phone,
          billing2Fax: data.response.Billing2Fax,
          billing3Contact: data.response.Billing3Contact,
          billing3Email: data.response.Billing3Email,
          billing3Phone: data.response.Billing3Phone,
          billing3Fax: data.response.Billing3Fax,
          reportName: data.response.ReportName,
          reportEmail: data.response.ReportEmail,
          reportFax: data.response.ReportFax,
          isNpi: data.response.IsNPI,
          npiText: data.response.NPIText,
          isExamLocation: data.response.IsExamLocation,
          autoFax: data.response.AutoFax,
          autoEmail: data.response.AutoEmail,
          isDoNotUseDxCode: data.response.ISDoNotUseDxCode,
          doNotSendPIBIll: data.response.DoNotSendPIBIll,
          doNotDOI: data.response.DoNotDOI,
          pauseSendingBill: data.response.PauseSendingBill,
          overrideAddressForBilling: data.response.OverrideAddressForBilling,
          bdCompanyName: data.response.BDCompanyName,
          bdAddress1: data.response.BDAddress1,
          bdAddress2: data.response.BBDddress2,
          bdCity: data.response.BDCity,
          bdState: data.response.BDState,
          bdZip: data.response.BDZip,
          isReferralService: data.response.IsReferralService,
          isAddendum: data.response.IsAddendum,
          addendumText: data.response.AddendumText,
          brokerReportName: data.response.BrokerReportName,
          isReqUniqueLien: data.response.IsReqUniqueLien,
          brokerUniqueLien: data.response.BrokerUniqueLien,
          missingLienEmail: data.response.MissingLienEmail,
          doNotSendEmail: data.response.DoNotSendEmail,
          doNotSendFax: data.response.DoNotSendFax,
          doNotSendMail: data.response.DoNotSendMail,
          removeAllMarketingBlast: data.response.RemoveAllMarketingBlast,
          doNotSendARPaymentSummary: data.response.DoNotSendARPaymentSummary,
          isSendBrokerPSL: data.response.IsSendBrokerPSL,
          brokerPSL1: data.response.BrokerPSL1,
          brokerPSL2: data.response.BrokerPSL2,
          brokerPSL3: data.response.BrokerPSL3,
          brokerPSL4: data.response.BrokerPSL4,
          brokerPSL5: data.response.BrokerPSL5,
          isDocManage: data.response.IsDocManage,
          isSFTP: data.response.IsSftp,
          sftpprofileId: parseInt(data.response.SFTPProfileID),
          requiredpo: data.response.RequiredPO,
        });

        this.changeAutoEmailReport()
        this.changeNPI();
        this.changeOverrideAddressForBilling();
        this.changeAddendum();
        this.changeReqUniqueLien();
        this.changeSendBrokerPSL();
        this.getBrokerPageDropDown();

      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }
  getAllftpList() {
    this.referrersService.getSFTPProfiles(true).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.SftpList = data.response;
      }
    }, (err: any) => {
      this.notificationService.showNotification({
        alertHeader: err.statusText,
        alertMessage: err.message,
        alertType: err.status
      });
    });
  }
  getAllDocumentTypes() {

    this.referrersService.getAllDocumentTypes(true, 1, 0).subscribe((res) => {
      this.docTypeList = res.response;
    }, (err: any) => {
      this.notificationService.showNotification({
        alertHeader: err.statusText,
        alertMessage: err.message,
        alertType: err.status
      });
    });
  }
  onChangeTypeDropDown(Type: string) {
    this.selectedCollectionsTypes = Type;
  }

  copyPrice(modalitiesType: string) {
    if (this.modalitiesCopyName) {
      let modalitiesValue = (document.getElementById(this.modalitiesCopyName) as HTMLInputElement).value;
      var modalitiesNewType = this.modalitiesCopyName.split("_")[0];
      if (modalitiesNewType == modalitiesType) {
        this.brokerFacilityPricingList
          .map((emp) => { emp[modalitiesType] = modalitiesValue; return emp; });
      }
    }
  }

  copyData(modalitiesCopyName: string) {
    this.modalitiesCopyName = modalitiesCopyName;
  }

  onSubmit(isClose = false) {
    this.submitted = true;
    if (isClose) {
      this.modelValue = 'modal';
    } else {
      this.modelValue = '';
    }
    if (this.addEditForm.invalid) {
      console.log(this.addEditForm)
      this.modelValue = '';
      return;
    }
    this.saveBroker()
  }

  onSearchSubmit() {
    this.pageNumber = 1;
    if (this.sForm.option.value === '1') {
      this.getAllBrokers();
    }
    else if (this.sForm.option.value === '2') {
      this.brokerService.getAllBrokers(0, 0, true).subscribe((res) => {
        var data: any = res;
        this.totalRecords = res.totalRecords;
        this.pageSize = res.totalRecords;
        if (data.response != null && data.response.length > 0) {
          this.brokerList = data.response;
        }
        else {
          this.notificationService.showNotification({
            alertHeader: data.statusText,
            alertMessage: data.message,
            alertType: data.responseCode
          });
        }
      },
        (err: any) => {
          this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
          });
        });
    }
  }

  getAllBrokers() {
 
    this.brokerService.getAllBrokers(this.pageNumber, this.pageSize, true).subscribe((res) => {
      var data: any = res;
      this.totalRecords = res.totalRecords
      if (data.response != null && data.response.length > 0) {
        this.brokerList = data.response;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  getBrokerPageDropDown() {
    this.brokerService.getBrokerDropwdowns(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.reportList = data.response.reportList;
        this.documentTypeList = data.response.documentTypeList;
        this.billingMethodList = data.response.billingMethodList;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  getBrokerFacilityPricing() {
    this.masterSelected = false;
    this.brokerService.getBrokerFacilityPricing(true, this.brokerId).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.brokerFacilityPricingList = data.response.brokerFacilityPricingList;
        this.brokerExcludeFacilityList = data.response.brokerExcludeFacilityList;
        this.FacilityList = this.brokerExcludeFacilityList.slice(0, this.pageSizeFacilityList);
        this.totalRecordFacilityList = this.brokerExcludeFacilityList.length;
        this.isAllSelected();
        this.selectedRows = this.brokerExcludeFacilityList.filter(Br => Br.IsExcluded == true);
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  saveBroker() {
    this.brokerExcludeFacilityList.map(u => u.IsExcluded = false);
    // this.selectedRows.forEach((value: any) => {
    //   this.brokerExcludeFacilityList.map(u => u.IsExcluded = u.Id == value.Id ? true : false);
    // })
    this.selectedRows.forEach((value: any) => {
      this.brokerExcludeFacilityList.map((up, i) => {
        if (up.Id == value.Id) {
          this.brokerExcludeFacilityList[i].IsExcluded = true;
        }
      });
    })

    this.brokerExcludeFacilityList
    var data = {
      'brokerId': this.brokerId,
      'broker': this.aeForm.broker.value,
      'mainContactName': this.aeForm.mainContactName.value,
      'mainContactPhone': this.aeForm.mainContactPhone.value,
      'mainFax': this.aeForm.mainFax.value,
      'mainContactEmail': this.aeForm.mainContactEmail.value,
      'website': this.aeForm.website.value,
      'address': this.aeForm.address.value,
      'city': this.aeForm.city.value,
      'state': this.aeForm.state.value,
      'zip': this.aeForm.zip.value,
      'billingMethod': this.aeForm.billingMethod.value,
      'isAutoEmailReport': this.aeForm.isAutoEmailReport.value === null ? false : this.aeForm.isAutoEmailReport.value,
      'autoEmailReport': this.aeForm.autoEmailReport.value === null ? false : this.aeForm.autoEmailReport.value,
      'isActiveBroker': this.aeForm.isActiveBroker.value === null ? false : this.aeForm.isActiveBroker.value,
      'doNotSendliability': this.aeForm.doNotSendliability.value === null ? false : this.aeForm.doNotSendliability.value,
      'doNotSendliabilitySecondCriteria': this.aeForm.doNotSendliabilitySecondCriteria.value === null ? false : this.aeForm.doNotSendliabilitySecondCriteria.value,
      'doNotSendScheduledSummary': this.aeForm.doNotSendScheduledSummary.value === null ? false : this.aeForm.doNotSendScheduledSummary.value,
      'doNotSendScheduledSummaryBroker': this.aeForm.doNotSendScheduledSummaryBroker.value === null ? false : this.aeForm.doNotSendScheduledSummaryBroker.value,
      'doNotSendCouldntScheduleReminderAtty': this.aeForm.doNotSendCouldntScheduleReminderAtty.value === null ? false : this.aeForm.doNotSendCouldntScheduleReminderAtty.value,
      'doNotSendOrderedSmstoPatient': this.aeForm.doNotSendOrderedSmstoPatient.value === null ? false : this.aeForm.doNotSendOrderedSmstoPatient.value,
      'doNotSendCouldntScheduleSMS': this.aeForm.doNotSendCouldntScheduleSMS.value === null ? false : this.aeForm.doNotSendCouldntScheduleSMS.value,
      'doNotFaxReportToAttorney': this.aeForm.doNotFaxReportToAttorney.value === null ? false : this.aeForm.doNotFaxReportToAttorney.value,
      'accountsPayable1Contact': this.aeForm.accountsPayable1Contact.value,
      'accountsPayable1Email': this.aeForm.accountsPayable1Email.value,
      'accountsPayable1Phone': this.aeForm.accountsPayable1Phone.value,
      'accountsPayable1Fax': this.aeForm.accountsPayable1Fax.value,
      'accountsPayable2Contact': this.aeForm.accountsPayable2Contact.value,
      'accountsPayable2Email': this.aeForm.accountsPayable2Email.value,
      'accountsPayable2Phone': this.aeForm.accountsPayable2Phone.value,
      'accountsPayable2Fax': this.aeForm.accountsPayable2Fax.value,
      'accountsPayable3Contact': this.aeForm.accountsPayable3Contact.value,
      'accountsPayable3Email': this.aeForm.accountsPayable3Email.value,
      'accountsPayable3Phone': this.aeForm.accountsPayable3Phone.value,
      'accountsPayable3Fax': this.aeForm.accountsPayable3Fax.value,
      'otherContactEmail': this.aeForm.otherContactEmail.value,
      'billing1Contact': this.aeForm.billing1Contact.value,
      'billing1Email': this.aeForm.billing1Email.value,
      'billing1Phone': this.aeForm.billing1Phone.value,
      'billing1Fax': this.aeForm.billing1Fax.value,
      'billing2Contact': this.aeForm.billing2Contact.value,
      'billing2Email': this.aeForm.billing2Email.value,
      'billing2Phone': this.aeForm.billing2Phone.value,
      'billing2Fax': this.aeForm.billing2Fax.value,
      'billing3Contact': this.aeForm.billing3Contact.value,
      'billing3Email': this.aeForm.billing3Email.value,
      'billing3Phone': this.aeForm.billing3Phone.value,
      'billing3Fax': this.aeForm.billing3Fax.value,
      'reportName': this.aeForm.reportName.value,
      'reportEmail': this.aeForm.reportEmail.value,
      'reportFax': this.aeForm.reportFax.value,
      'isNpi': this.aeForm.isNpi.value === null ? false : this.aeForm.isNpi.value,
      'npiText': this.aeForm.npiText.value,
      'isExamLocation': this.aeForm.isExamLocation.value === null ? false : this.aeForm.isExamLocation.value,
      'autoFax': this.aeForm.autoFax.value === null ? false : this.aeForm.autoFax.value,
      'autoEmail': this.aeForm.autoEmail.value === null ? false : this.aeForm.autoEmail.value,
      'isDoNotUseDxCode': this.aeForm.isDoNotUseDxCode.value === null ? false : this.aeForm.isDoNotUseDxCode.value,
      'doNotSendPIBIll': this.aeForm.doNotSendPIBIll.value === null ? false : this.aeForm.doNotSendPIBIll.value,
      'doNotDOI': this.aeForm.doNotDOI.value === null ? false : this.aeForm.doNotDOI.value,
      'pauseSendingBill': this.aeForm.pauseSendingBill.value === null ? false : this.aeForm.pauseSendingBill.value,
      'overrideAddressForBilling': this.aeForm.overrideAddressForBilling.value === null ? false : this.aeForm.overrideAddressForBilling.value,
      'bdCompanyName': this.aeForm.bdCompanyName.value,
      'bdAddress1': this.aeForm.bdAddress1.value,
      'bdAddress2': this.aeForm.bdAddress2.value,
      'bdCity': this.aeForm.bdCity.value,
      'bdState': this.aeForm.bdState.value,
      'bdZip': this.aeForm.bdZip.value,
      'isReferralService': this.aeForm.isReferralService.value === null ? false : this.aeForm.isReferralService.value,
      'isAddendum': this.aeForm.isAddendum.value === null ? false : this.aeForm.isAddendum.value,
      'addendumText': this.aeForm.addendumText.value,
      'brokerReportName': this.aeForm.brokerReportName.value,
      'isReqUniqueLien': this.aeForm.isReqUniqueLien.value === null ? false : this.aeForm.isReqUniqueLien.value,
      'brokerUniqueLien': this.aeForm.brokerUniqueLien.value,
      'missingLienEmail': this.aeForm.missingLienEmail.value,
      'doNotSendEmail': this.aeForm.doNotSendEmail.value === null ? false : this.aeForm.doNotSendEmail.value,
      'doNotSendFax': this.aeForm.doNotSendFax.value === null ? false : this.aeForm.doNotSendFax.value,
      'doNotSendMail': this.aeForm.doNotSendMail.value === null ? false : this.aeForm.doNotSendMail.value,
      'removeAllMarketingBlast': this.aeForm.removeAllMarketingBlast.value === null ? false : this.aeForm.removeAllMarketingBlast.value,
      'doNotSendARPaymentSummary': this.aeForm.doNotSendARPaymentSummary.value === null ? false : this.aeForm.doNotSendARPaymentSummary.value,
      'isSendBrokerPSL': this.aeForm.isSendBrokerPSL.value === null ? false : this.aeForm.isSendBrokerPSL.value,
      'brokerPSL1': this.aeForm.brokerPSL1.value,
      'brokerPSL2': this.aeForm.brokerPSL2.value,
      'brokerPSL3': this.aeForm.brokerPSL3.value,
      'brokerPSL4': this.aeForm.brokerPSL4.value,
      'brokerPSL5': this.aeForm.brokerPSL5.value,
      'brokerFacilityPricingJson': JSON.stringify(this.brokerFacilityPricingList),
      'brokerExcludeFacilityJson': JSON.stringify(this.brokerExcludeFacilityList),
      'isDocManage': this.aeForm.isDocManage.value === null ? false : this.aeForm.isDocManage.value,
      'isSFTP': this.aeForm.isSFTP.value === null ? false : this.aeForm.isSFTP.value,
      'sftpprofileId': this.aeForm.sftpprofileId.value,
      'docId': this.selectedDocType.toString(),
      'requiredpo': this.aeForm.requiredpo.value === null ? false : this.aeForm.requiredpo.value,
      'autoDocToBroker': this.selectedDocToBroker ? this.selectedDocToBroker.toString() : '',
      'Policy':this.BrokerPoliciesFormControls.brokerPolicy.value,
    }
    if (this.brokerId) {
      this.brokerService.updateBroker(true, data).subscribe((res) => {
        if (res) {
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getAllBrokers();
      },
        (err: any) => {
          this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
          });
        });
    }
    else {
      this.brokerService.addBroker(true, data).subscribe((res) => {
        if (res) {
          this.brokerId = res.response.BrokerID;
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getAllBrokers();
      },
        (err: any) => {
          this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
          });
        });
    }
  }

  initializeForm() {
    this.searchForm = this.fb.group({
      option: [null, [Validators.required]],
    });

    this.addEditForm = this.fb.group({
      broker: ['', [Validators.required]],
      mainContactName: [''],
      mainContactPhone: [null, [Validators.pattern(this.commonRegex.PhoneRegex)]],
      mainFax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      mainContactEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      website: [''],
      address: [''],
      city: [''],
      state: [''],
      zip: [''],
      billingMethod: ['', [Validators.required]],
      isAutoEmailReport: [false],
      autoEmailReport: [''],
      isActiveBroker: [false],
      doNotSendliability: [false],
      doNotSendliabilitySecondCriteria: [false],
      doNotSendScheduledSummary: [false],
      doNotSendScheduledSummaryBroker: [false],
      doNotSendCouldntScheduleReminderAtty: [false],
      doNotSendOrderedSmstoPatient: [false],
      doNotSendCouldntScheduleSMS: [false],
      doNotFaxReportToAttorney: [false],
      accountsPayable1Contact: [''],
      accountsPayable1Email: ['', [Validators.pattern(this.commonRegex.EmailRegex  )]],
      accountsPayable1Phone: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      accountsPayable1Fax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      accountsPayable2Contact: [''],
      accountsPayable2Email: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      accountsPayable2Phone: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      accountsPayable2Fax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      accountsPayable3Contact: [''],
      accountsPayable3Email: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      accountsPayable3Phone: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      accountsPayable3Fax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      otherContactEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      billing1Contact: [''],
      billing1Email: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      billing1Phone: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      billing1Fax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      billing2Contact: [''],
      billing2Email: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      billing2Phone: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      billing2Fax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      billing3Contact: [''],
      billing3Email: ['', [Validators.pattern(this.commonRegex.EmailRegex  )]],
      billing3Phone: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      billing3Fax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      reportName: [''],
      reportEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      reportFax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      isNpi: [false],
      npiText: [''],
      isExamLocation: [false],
      autoFax: [false],
      autoEmail: [false],
      isDoNotUseDxCode: [false],
      doNotSendPIBIll: [false],
      doNotDOI: [false],
      pauseSendingBill: [false],
      overrideAddressForBilling: [false],
      bdCompanyName: [''],
      bdAddress1: [''],
      bdAddress2: [''],
      bdCity: [''],
      bdState: [''],
      bdZip: [''],
      isReferralService: [false],
      isAddendum: [false],
      addendumText: [''],
      brokerReportName: [''],
      isReqUniqueLien: [false],
      brokerUniqueLien: [''],
      missingLienEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex )]],
      doNotSendEmail: [false],
      doNotSendFax: [false],
      doNotSendMail: [false],
      removeAllMarketingBlast: [false],
      doNotSendARPaymentSummary: [false],
      isSendBrokerPSL: [false],
      brokerPSL1: [''],
      brokerPSL2: [''],
      brokerPSL3: [''],
      brokerPSL4: [''],
      brokerPSL5: [''],
      isDocManage: [false],
      isSFTP: [false],
      sftpprofileId: [''],
      docId: [''],
      requiredpo: [false],
      autoDocToBroker: [''],
    });
  }

  changeAutoEmailReport() {
    const autoEmailReportControl = this.addEditForm.get('autoEmailReport');
    if (this.addEditForm.get('isAutoEmailReport').value) {
      autoEmailReportControl.setValidators([Validators.required, Validators.pattern(this.commonRegex.EmailRegex )]);
    }
    else {
      autoEmailReportControl.setValidators(null);
    }
    autoEmailReportControl.updateValueAndValidity();
  }
  changedocManagerFiles() {

  }

  changeNPI() {
    const npiTextControl = this.addEditForm.get('npiText');
    if (this.addEditForm.get('isNpi').value) {
      npiTextControl.setValidators([Validators.required]);
    }
    else {
      npiTextControl.setValidators(null);
    }
    npiTextControl.updateValueAndValidity();
  }

  changeOverrideAddressForBilling() {
    const bdCompanyNameControl = this.addEditForm.get('bdCompanyName');
    const bdAddress1Control = this.addEditForm.get('bdAddress1');
    if (this.addEditForm.get('overrideAddressForBilling').value) {
      bdCompanyNameControl.setValidators([Validators.required]);
      bdAddress1Control.setValidators([Validators.required]);
    }
    else {
      bdCompanyNameControl.setValidators(null);
      bdAddress1Control.setValidators(null);
    }
    bdCompanyNameControl.updateValueAndValidity();
    bdAddress1Control.updateValueAndValidity();
  }

  changeAddendum() {
    const addendumTextControl = this.addEditForm.get('addendumText');
    if (this.addEditForm.get('isAddendum').value) {
      addendumTextControl.setValidators([Validators.required]);
    }
    else {
      addendumTextControl.setValidators(null);
    }
    addendumTextControl.updateValueAndValidity();
  }

  changeReqUniqueLien() {
    const brokerUniqueLienControl = this.addEditForm.get('brokerUniqueLien');
    const missingLienEmailControl = this.addEditForm.get('missingLienEmail');
    if (this.addEditForm.get('isReqUniqueLien').value) {
      brokerUniqueLienControl.setValidators([Validators.required]);
      missingLienEmailControl.setValidators([Validators.pattern(this.commonRegex.EmailRegex)]);
    }
    else {
      brokerUniqueLienControl.setValidators(null);
      missingLienEmailControl.setValidators(null);
    }
    brokerUniqueLienControl.updateValueAndValidity();
    missingLienEmailControl.updateValueAndValidity();
  }

  changeSendBrokerPSL() {
    const brokerPSL1Control = this.addEditForm.get('brokerPSL1');
    const brokerPSL2Control = this.addEditForm.get('brokerPSL2');
    const brokerPSL3Control = this.addEditForm.get('brokerPSL3');
    const brokerPSL4Control = this.addEditForm.get('brokerPSL4');
    const brokerPSL5Control = this.addEditForm.get('brokerPSL5');
    if (this.addEditForm.get('isSendBrokerPSL').value) {
      brokerPSL1Control.setValidators([Validators.required, Validators.pattern(this.commonRegex.EmailRegex )]);
      brokerPSL2Control.setValidators([Validators.pattern(this.commonRegex.EmailRegex )]);
      brokerPSL3Control.setValidators([Validators.pattern(this.commonRegex.EmailRegex )]);
      brokerPSL4Control.setValidators([Validators.pattern(this.commonRegex.EmailRegex )]);
      brokerPSL5Control.setValidators([Validators.pattern(this.commonRegex.EmailRegex )]);
    }
    else {
      brokerPSL1Control.setValidators(null);
      brokerPSL2Control.setValidators(null);
      brokerPSL3Control.setValidators(null);
      brokerPSL4Control.setValidators(null);
      brokerPSL5Control.setValidators(null);
    }
    brokerPSL1Control.updateValueAndValidity();
    brokerPSL2Control.updateValueAndValidity();
    brokerPSL3Control.updateValueAndValidity();
    brokerPSL4Control.updateValueAndValidity();
    brokerPSL5Control.updateValueAndValidity();
  }

  pageChanged(event) {
    this.pageNumber = event;
    if (this.isSearchBroker) {
      this.searchAllBrokers();
    } else {
      this.getAllBrokers()
    }
  }
  //pageChangedSchedulingFacilities(event) {
  //  this.pageNumber = event;
  //  this.getSchedulingFacilities()
  //}
  checkUncheckAll() {
    for (var i = 0; i < this.brokerExcludeFacilityList.length; i++) {
      this.brokerExcludeFacilityList[i].IsExcluded = this.masterSelected;
    }
  }

  isAllSelected() {
    this.masterSelected = this.brokerExcludeFacilityList.every(function (item: any) {
      return item.IsExcluded === true;
    });
  }

  showDocManager() {
    let Data = {
      UploadedPage: 'Broker',
      ReferreId: this.brokerId,
      ReferrerName: this.brokerName
    }
    this.commonMethodService.sendDataToDocumentManagerForRefAndFundingCo(Data);
  }
  AdjustColumnWidth(worksheet) {
    worksheet.columns.forEach(column => {
      const lengths = column.values.map(v => v.toString().length);
      const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
      column.width = maxLength;
    });
  }
  GetExportData() {
    this.brokerService.getBrokerPricingExportData(true, this.brokerId).subscribe((res) => {
      if (res.response) {
        this.brokerExportDataList = res.response;
      }
    });
  }
  ExportFile() {
    this.hiddenDXbutton.nativeElement.click();
  }
  sendEmail() {
    this.mailSubmitted = true;
    this.mailmodelValue = 'modal';
    if (this.sendMailForm.invalid) {
      this.mailmodelValue = '';
      return;
    }
    this.hiddenSendMailbutton.nativeElement.click();
  }
  exportExcel(e, from: string) {
    this.brokerService.getBrokerPricingExportData(true, this.brokerId).subscribe((res) => {
      if (res.response) {
        this.brokerExportDataList = res.response;
        this.isShown = true;
        setTimeout(() => {
          let latest_date = this.datePipe.transform(new Date(), 'MM/dd/yy').replace('/', '')
          this.fileName = (this.brokerName + '_Facility_Pricing_' + latest_date.toString().replace('/', '')).replace(/\s/g, '') + '.xlsx'
          const context = this;
          const workbook = new Workbook();
          const worksheet = workbook.addWorksheet('BrokerPricngExcel');
          function setAlternatingRowsBackground(gridCell, excelCell) {
            if (gridCell.rowType === 'header' || gridCell.rowType === 'data') {
              if (excelCell.fullAddress.row % 2 === 0) {
                excelCell.fill = {
                  type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' }, bgColor: { argb: 'D3D3D3' },
                };
              }
            }
          }
          exportDataGrid({
            component: context.dataGrid.instance,
            worksheet,
            keepColumnWidths: true,
            topLeftCell: { row: 4, column: 2 },
            customizeCell: ({ gridCell, excelCell }) => {
              setAlternatingRowsBackground(gridCell, excelCell);
            },
            loadPanel: {
              enabled: false
            },
          }).then((cellRange) => {
          }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
              if (from === 'export') {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), this.fileName);
              } else {
                this.file = new Blob([buffer], { type: 'application/octet-stream' }), this.fileName;
                this.sendmailToservice();
              }
              this.isShown = false;
            });
          });
          e.cancel = true;
        },100);
      }
    }); 
  }
  GetBrokerPricingDatas(){
  this.brokerService.getPricingData(true,this.brokerId).subscribe((res)=>{
    if (res.response) {
      this.brokerPricingDataList = res.response;
    }
  });
}
  sendmailToservice() {
    if (this.file) {
      var formData = new FormData();
      formData.append('email', this.mailForm.email.value);
      formData.append('subject', this.mailForm.subject.value);
      formData.append('Body', this.mailForm.Body.value);
      formData.append('fileName', this.fileName);
      formData.append('file', this.file);
      this.brokerService.sendEmailBroker(true, formData).subscribe((res) => {
        if (res.responseCode === 200) {
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.message,
            alertType: res.responseCode
          })
        } else {
          this.notificationService.showNotification({
            alertHeader: res.response,
            alertMessage: res.response,
            alertType: res.responseCode
          });
        }
      }, (err) => {
        console.log(err);
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
    }
  }

  ngOnDestroy() {
    this.brokerService.emptyTempDirectory(true).subscribe();
  }
  fromReset() {
    this.mailSubmitted = false;
    this.sendMailForm.reset();
  }
  searchBrokers() {
    debugger
    this.pageNumber = 1;
    this.pageSize = 20;
    this.isSearchBroker = true;

    // if (this.searchBrForm.searchText.value === '') {
    //   return;
    // }
    if (this.searchBrForm.searchText.value == null || this.searchBrForm.searchText.value == '') {

      this.searchText = ' ';
      this.getAllBrokers();
    }
    else {

      this.searchText = this.searchBrForm.searchText.value;
      this.searchAllBrokers();
    }


  }
  searchAllBrokers() {
    this.brokerService.getBrokerSearch(true, this.searchText, this.pageNumber, this.pageSize).subscribe((res) => {
      var data: any = res;
      if (res.response != null && res.response.length > 0) {

        this.brokerList = res.response;
        this.totalRecords = res.totalRecords;
      }
      else {

        // this.notificationService.showNotification({
        //   alertHeader: data.statusText,
        //   alertMessage: data.message,
        //   alertType: data.responseCode
        // })
        this.brokerList = [];
        this.totalRecords = 1;
      }
    }, (err: any) => {
      this.notificationService.showNotification({
        alertHeader: err.statusText,
        alertMessage: err.message,
        alertType: err.status
      });
    });
  }
  clearBrokers() {
    this.pageNumber = 1;
    this.pageSize = 20;
    this.isSearchBroker = false;

    if (this.searchBrForm.searchText.value === '') {
      return;
    }
    this.searchText = ''
    this.searchBrForm.searchText.setValue('')
    this.getAllBrokers()
  }
  onPageNumberChangeFacilityList(pageNumber: any) {
    this.pageNumberFacilityList = pageNumber;
    this.FacilityList = this.brokerExcludeFacilityList.slice((this.pageNumberFacilityList - 1) * this.pageSizeFacilityList, ((this.pageNumberFacilityList - 1) * this.pageSizeFacilityList) + this.pageSizeFacilityList)
  }

  get aeForm() { return this.addEditForm.controls; }
  get sForm() { return this.searchForm.controls; }
  get mailForm() { return this.sendMailForm.controls; }
  get searchBrForm() { return this.searchBrokerForm.controls; }
  get BrokerPoliciesFormControls() { return this.BrokerPoliciesForm.controls; }

  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
