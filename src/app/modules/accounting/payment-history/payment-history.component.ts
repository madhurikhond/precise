import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { AccoutingService } from 'src/app/services/accouting-service/accouting.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { PageSizeArray } from 'src/app/constants/pageNumber';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
  searchForm: FormGroup;
  deleteForm: FormGroup;
  showDropdownLoader = true;
  submitted = false;
  submitted1 = false;
  totalRecords: number = 1;
  pageNumber: number = 1;
  pageSize: number;
  paymentHistoryList: any = [];
  isDeletePayment: boolean = false;
  isPdf: boolean = false;
  pdfSrc: SafeResourceUrl;

  attorneyList: any = [];
  statusList: any = [];
  brokerList: any = [];
  insuranceCompanyList: any = [];
  paymentBankList: any = [];
  qbAccountList: any = [];
  paymentTypeList: any = [];

  selectedStatus: any = [];
  selectedBroker: any = [];
  selectedInsuranceCompany: any = [];
  selectedBank: any = [];
  selectedQBAccount: any = [];
  selectedPaymentType: any = [];

  selectedRows: number[];

  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last 3 Months': [moment().subtract(89, 'days'), moment()],
    'Last 6 Months': [moment().subtract(179, 'days'), moment()],
    'Last 1 Year': [moment().subtract(364, 'days'), moment()],
    'This Year': [moment().startOf('year'), moment().endOf('year')]
  };
  filterRange;
  filterRange1;
  minDate = moment().subtract(365, 'days');

  resizingModes: string[] = ["nextColumn", "widget"];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: "auto", name: "Immediately" }, { key: "onClick", name: "On Button Click" }];
  currentFilter: any;
  showHeaderFilter: boolean;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  readonly pageSizeArray=PageSizeArray;
  constructor(private fb: FormBuilder, private readonly commonMethodService: CommonMethodService, private sanitizer: DomSanitizer,
    private readonly accountingService: AccoutingService, private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;

    this.commonMethodService.setTitle('Payment History');
    this.getDropdown();

    this.deleteForm = this.fb.group({
      action: [null, Validators.required],
    });

    this.searchForm = this.fb.group({
      patientId: [''],
      lastName: [''],
      firstName: [''],
      dob: [''],
      attorney: [null],
      doi: [''],
      accession: [''],
      //examDateRange: [''],
      examFromDate: [''],
      examToDate: [''],
      status: [''],
      broker: [''],
      insuranceCompany: [''],
      checkNumber: [''],
      checkAmount: [''],
      bankName: [''],
      qbAccount: [''],
      paymentType: [''],
      fromDate: [''],
      toDate: ['']
      //dateRange: [''],
    });
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getPaymentHistory();
  }
  getDropdown() {
    this.accountingService.getPaymentHistoryDropDown(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.attorneyList = data.response.attorneyList;
        this.statusList = data.response.statusList;
        this.brokerList = data.response.brokerList;
        this.insuranceCompanyList = data.response.insuranceCompanyList;
        this.paymentBankList = data.response.paymentBankList;
        this.qbAccountList = data.response.qbAccountList;
        this.paymentTypeList = data.response.paymentTypeList;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
      this.showDropdownLoader = false;
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
        this.showDropdownLoader = false;
      });
  }

  onSearchSubmit() {
    var BreakException = {};
    this.pageNumber = 1;
    this.pageSize = 20;
    this.submitted = true;
    var searchControl = false;
    try {
      Object.keys(this.searchForm.controls).forEach(key => {
        var val = this.searchForm.controls[key].value;
        if (val) {
          if (key === "status" || key === "broker" || key === "insuranceCompany" || key === "bankName" || key == "qbAccount" || key === "paymentType") {
            if (val.length > 0) {
              this.getPaymentHistory();
              searchControl = true;
              throw BreakException;
            }
          }
          else {
            this.getPaymentHistory();
            searchControl = true;
            throw BreakException;
          }
        }
      });
      if (!searchControl) {
        this.notificationService.showNotification({
          alertHeader: null,
          alertMessage: "Please set a criteria.",
          alertType: ResponseStatusCode.NotFound
        });
      }
    }
    catch (e) {

    }
  }

  onDeletePaymentHistory() {
    this.submitted1 = true;
    if (this.deleteForm.invalid) {
      return;
    }
    if (!this.selectedRows || this.selectedRows.length === 0) {
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'Please select al least one record from the below table.',
        alertType: ResponseStatusCode.BadRequest
      });
    }
    else {
      this.isDeletePayment = true;
    }
  }

  closeModal() {
    this.isDeletePayment = false;
  }

  closeModal1() {
    this.isPdf = false;
  }


  deletePaymentHistory() {
    this.accountingService.deletePaymentHistory(true, this.selectedRows.toString()).subscribe((res) => {
      if (res) {
        this.notificationService.showNotification({
          alertHeader: "Success",
          alertMessage: res.message,
          alertType: res.responseCode
        });
      }
      this.submitted1 = false;
      this.getPaymentHistory();
      this.deleteForm.reset();
      this.selectedRows = null;
      this.isDeletePayment = false;
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  onReset() {
    this.submitted = false;
    this.searchForm.reset();
    this.totalRecords = 1;
    this.paymentHistoryList = [];
  }

  getPaymentHistory() {
    var data = {
      "patientId": this.sForm.patientId.value,
      "lastName": this.sForm.lastName.value,
      "firstName": this.sForm.firstName.value,
      "birthday": this.sForm.dob.value ? this.sForm.dob.value : null,
      "attorney": this.sForm.attorney.value,
      "injuryDate": this.sForm.doi.value ? this.sForm.doi.value : null,
      "accessionNumber": this.sForm.accession.value,
      "fromStudyDateTime": this.sForm.examFromDate.value ? this.sForm.examFromDate.value : null,
      "toStudyDateTime": this.sForm.examToDate.value ? this.sForm.examToDate.value : null,
      "ADJUSTEDSTATUS": this.sForm.status.value ? this.sForm.status.value.toString() : null,
      "Broker": this.sForm.broker.value ? this.sForm.broker.value.toString() : null,
      "INSURANCECOMPANY": this.sForm.insuranceCompany.value ? this.sForm.insuranceCompany.value.toString() : null,
      "CheckNumber": this.sForm.checkNumber.value,
      "CheckAmount": this.sForm.checkAmount.value,
      "BankName": this.sForm.bankName.value ? this.sForm.bankName.value.toString() : null,
      "QBAccount": this.sForm.qbAccount.value ? this.sForm.qbAccount.value.toString() : null,
      "PaymentType": this.sForm.paymentType.value ? this.sForm.paymentType.value.toString() : null,
      "FromDATE": this.sForm.fromDate.value ? this.sForm.fromDate.value : null,
      "ToDATE": this.sForm.toDate.value ? this.sForm.toDate.value : null
    }
    
    this.accountingService.getPaymentHistory(true, data, this.pageNumber, this.pageSize).subscribe((res) => {
      if (res) {
        if (res.totalRecords > 0) {
          var data: any = res;
          this.totalRecords = res.totalRecords;
          this.paymentHistoryList = data.response;
        }
        else {
          this.totalRecords = 1;
          this.paymentHistoryList = [];
        }
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

  pageChanged(event) {
    this.pageNumber = event;
    this.getPaymentHistory()
  }

  showCheck(patientId, fileName) {
    this.accountingService.getPatientPaymentCheck(true, patientId, fileName).subscribe((res) => {
      var data: any = res;
      debugger
      if (data.response) {
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(data.response);
        //this.pdfSrc = data.response;
        this.isPdf = true;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: "Not found",
          alertMessage: data.message,
          alertType: data.responseCode
        });
        this.isPdf = false;
      }
      this.showDropdownLoader = false;
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
        this.showDropdownLoader = false;
      });
  }

  get sForm() { return this.searchForm.controls; }
  get dForm() { return this.deleteForm.controls; }
}
