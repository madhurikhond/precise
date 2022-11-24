import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { AccoutingService } from 'src/app/services/accouting-service/accouting.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SelectStudyComponent } from './select-study/select-study.component'
import { StudyNotCompletedComponent } from './study-not-completed/study-not-completed.component'
import { SettleAndMinimumAmountComponent } from './settle-and-minimum-amount/settle-and-minimum-amount.component';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';

declare const $: any;

@Component({
  selector: 'app-receive-payment',
  templateUrl: './receive-payment.component.html',
  styleUrls: ['./receive-payment.component.css']
})
export class ReceivePaymentComponent implements OnInit {

  @ViewChild('hiddenresponseConfirmPopUp', { static: false }) hiddenresponseConfirmPopUp: ElementRef;
  
  a1: any = 20;
  a2: any = 20;
  a3: any = 20;
  botomGridDataCount:any=0;
  maxDate = new Date();
  searchForm: FormGroup;
  checkdetailForm: FormGroup;
  showDropdownLoader = true;
  topTotalRecords: number = 1;
  bottomTotalRecords: number = 1;
  pageNumber: number = 1;
  pageSize: number;
  bottomPageNumber: number = 1;
  checkedData: any = 0;
  dataList: any = [];
  bottomDataList: any = [];
  isColumnVisible: boolean = false;
  attorneyList: any = [];
  statusList: any = [];
  brokerList: any = [];
  insuranceCompanyList: any = [];
  checkNumber: string;
  CheckAmount: Number = 0;
  SelectedAmount: Number = 0;
  BalanceAmount: Number = 0;
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any;
  currentFilter: any;
  showHeaderFilter: boolean;
  allMode: string;
  checkBoxesMode: string;
  dropDownText: Number;
  updateSelectedData : boolean  = false;
  data : any
  createARPayments: {
    userId: number,
    CheckNo: string,
    CheckAmount: String,
    FinancialTypeId: number
  }
  msgSelectStudyEdit: string = 'Please select a row before editing.'
  msgSelectStudy: string = 'Please select at least 1 study.'
  msgBalanceAmount: string = 'Check balance is not at $0.00 Please adjust and try to add again.'
  createARPaidStudies: {
    userId: number
  }
  selectedRows = new Array();
  bottomSelectedRows = new Array();
  SelectedRow: number = 0;
  arPaymentUpdate: {
    tobeupdated: string,
    internalstudyid: string,
    allocamount: string,
    amtdue: number,
    paidamt: number,
    payment: number,
    patientid: string,
    checknumber: string,
    isselected: boolean,
    financialtypeid: string,
    userid: string
  }
  disableTextBox: boolean = false;
  completedStudyId: number = 0;
  filename: string;
  fileData: string;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  readonly pageSizeArray = PageSizeArray;

  constructor(private fb: FormBuilder, private readonly commonMethodService: CommonMethodService,
    private readonly accountingService: AccoutingService, private readonly notificationService: NotificationService,
    private readonly storageService: StorageService, private _modalService: NgbModal,) { 
      this.commonMethodService.requestSearchObservable.subscribe((res) => {
        
       this.updateSelectedData = res ;
  
      }, (err: any) => {
      })
    }

  ngOnInit(): void {
    
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.setGridSetting();
    this.commonMethodService.setTitle('Receive Payment');
    this.getDropdown();
    this.getBottomGrid();
    this.checkedData = [null]
    this.searchForm = this.fb.group({
      lastName: [''],
      firstName: [''],
      patientId: [''],
      dob: [''],
      attorney: [null],
      doi: [''],
      accession: [''],
      examFromDate: [''],
      examToDate: [''],
      status: [''],
      broker: [''],
      insuranceCompany: [''],
    });
    this.checkdetailForm = this.fb.group({
      chkNumber: '',
      chkAmount: '',
    });
    this.GetPendingCheque();
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
    this.getBottomGrid();
    this.onSearchSubmit();
  }
  GetPendingCheque() {

    this.accountingService.GetPendingCheque(false, this.storageService.user.UserId).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        if (data.response[0].CheckAmount != null || data.response[0].CheckAmount != 0) {
          this.disableTextBox = true;
          this.checkdetailForm.patchValue({
            chkNumber: data.response[0].CheckNo,
            chkAmount: data.response[0].CheckAmount,
          });
        }
      }
    })
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
  getBottomGrid() {

    this.accountingService.getBottomGrid(true, this.bottomPageNumber, this.pageSize, Number(this.storageService.user.UserId)).subscribe((res) => {
      if(res.response.length>0){
        this.botomGridDataCount=res.response.length;
      }
      else{
        this.botomGridDataCount=0;
      }
      var data: any = res;
      this.bottomDataList = data.response;
      this.bottomTotalRecords = data.totalRecords;
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  option1Go() {
    if (this.dropDownText == 1) {
      this.removeChecks();
    }
  }

  option2Go() {
    if (this.dropDownText == 3) {
      this.exportChecks();
    }
    if (this.dropDownText == 4) {
      // this.saveNoExport();
    }
    if (this.dropDownText == 5) {
      this.removeChecksandPayment();
    }
  }

  onDropdownChange(e) {
    this.dropDownText = e;
  }

  removeChecks() {
    this.createARPaidStudies = {
      userId: Number(this.storageService.user.UserId)
    }
    if (this.cform.chkNumber.value === '' || this.cform.chkAmount.value === '' || this.cform.chkNumber.value == null || this.cform.chkAmount.value == null) {
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'No pending check to remove',
        alertType: ResponseStatusCode.BadRequest
      });
      this.onReset();

    }
    else {
      this.accountingService.removeChecks(true, this.createARPaidStudies).subscribe((res) => {

        var data: any = res;
        if (data.responseCode === 200) {
          this.showNotificationOnSucess(res);
          this.disableTextBox = false;
          this.onReset();
          this.checkdetailForm.reset();
          this.getBottomGrid();
          this.CheckAmount = 0;
          this.SelectedAmount = 0;
          this.BalanceAmount = 0;
        }
        else {
          this.errorNotification(res);
        }
      },
        (err: any) => {
          this.errorNotification(err);
        });
    }
  }

  removeChecksandPayment() {
    if (this.bottomSelectedRows.length > 0) {
      for (var key of this.bottomSelectedRows) {
        this.accountingService.removeChecksandPayment(true, String(key)).subscribe((res) => {
          var data: any = res;
          if (data.responseCode == 200) {
            this.showNotificationOnSucess(res);
            this.getBottomGrid();
          }
          else {
            this.errorNotification(res);
          }
        },
          (err: any) => {
            this.errorNotification(err);
          });
      }
    }
    else {
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'Please select Atleast one record.',
        alertType: ResponseStatusCode.BadRequest
      });

    }
  }

  exportChecks() {
    if (this.bottomSelectedRows.length > 0) {
      for (var key of this.bottomSelectedRows) {
        this.accountingService.ExportAllChecks(true, String(key)).subscribe((res) => {
          var data: any = res;
          if (data.responseCode == 200) {
            this.fileData = data.response;
            this.filename = data.message;
            this.hiddenresponseConfirmPopUp.nativeElement.click();
            this.getBottomGrid();
          }
          else {
            this.errorNotification(res);
          }
        },
          (err: any) => {
            this.errorNotification(err);
          });
      }
    }
    else {
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'Please select atleast one record.',
        alertType: ResponseStatusCode.BadRequest
      });
    }
  }

  downloadCSV() {
    if (this.fileData && this.filename) {
      let csvContent = atob(this.fileData);
      var blob = new Blob([csvContent], { type: "data:application/octet-stream;base64" });
      var url = window.URL.createObjectURL(blob);
      var dlnk = document.createElement('a');
      dlnk.href = url;
      dlnk.download = `${this.filename}`
      dlnk.click();
    }
  }

  saveNoExport() {
    this.accountingService.removeChecksandPayment(true, String(this.storageService.user.UserId)).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {

      }
      else {
      }
    },
      (err: any) => {

      });
  }

  getDropdown() {
    this.accountingService.getReceivePaymentDropDown(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.attorneyList = data.response.attorneyList;
        this.statusList = data.response.statusList;
        this.brokerList = data.response.brokerList;
        this.insuranceCompanyList = data.response.insuranceCompanyList;
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

  onReset() {
    this.searchForm.reset();
    this.dataList = [];
    this.bottomDataList = [];
  }

  onSearchSubmit() {
    this.checkNumber = this.cform.chkNumber.value;
    this.CheckAmount = Number(this.cform.chkAmount.value);
    if (this.checkNumber.trim() == '' || this.CheckAmount == 0) {
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'Please enter check number and check amount.',
        alertType: ResponseStatusCode.BadRequest
      });
    }
    else {
      var data = {
        'patientId': this.sForm.patientId.value ? this.sForm.patientId.value : null,
        'lastName': this.sForm.lastName.value ? this.sForm.lastName.value : null,
        'firstName': this.sForm.firstName.value ? this.sForm.firstName.value : null,
        'birthDate': this.sForm.dob.value ? this.sForm.dob.value : null,
        'attorney': this.sForm.attorney.value,
        'injuryDate': this.sForm.doi.value ? this.sForm.doi.value : null,
        'fromStudyDatetime': this.sForm.examFromDate.value ? this.sForm.examFromDate.value : null,
        'toStudyDatetime': this.sForm.examToDate.value ? this.sForm.examToDate.value : null,
        'status': this.sForm.status.value ? this.sForm.status.value.toString() : null,
        'broker': this.sForm.broker.value ? this.sForm.broker.value.toString() : null,
        'insuranceCompany': this.sForm.insuranceCompany.value ? this.sForm.insuranceCompany.value.toString() : null,
        'accessionNumber': this.sForm.accession.value ? this.sForm.accession.value : null,

      }
      this.accountingService.getARPaymentData(true, data, this.pageNumber, this.pageSize).subscribe((res) => {
        if (res) {
          
          var data: any = res;
          this.dataList = data.response;
          this.SelectedAmount = 0;
          this.BalanceAmount = this.CheckAmount;
          this.topTotalRecords = res.totalRecords;
          if (this.dataList != null) {
            for (var i = 0; i < this.dataList.length; i++) {
              if (this.dataList[i].IsSelected === 1) {
                this.selectedRows.push(this.dataList[i].INTERNALSTUDYID)
                this.SelectedAmount = Number(this.SelectedAmount) + Number(this.dataList[i].Nowpaid)
              }
            }
          }
          this.BalanceAmount = Number(this.CheckAmount) - Number(this.SelectedAmount)
        }
      },
        (err: any) => {
          this.errorNotification(err);
        });
    }
  }

  topGridPageChanged(event) {
    this.pageNumber = event;
    this.onSearchSubmit();
  }
  bottomGridPageChanged(event) {
    this.bottomPageNumber = event;
    this.getBottomGrid();
    //this.onSearchSubmit();
  }
  onEditorPreparing(e) {
    setTimeout(() => {
      if (e.dataField == 'Nowpaid') {
        if (!e.row.data.Nowpaid) {
          e.editorOptions.value = parseFloat('0.00').toFixed(2);
          e.setValue(e.editorOptions.value);
        } else if (e.row.data.Nowpaid == 0) {
          e.editorOptions.value == '';
          e.setValue(e.editorOptions.value);
        }
      }
      else if (e.dataField == 'AllocatedAmount') {
        if (!e.row.data.AllocatedAmount) {
          e.editorOptions.value = parseFloat('0.00').toFixed(2);
          e.setValue(e.editorOptions.value);
        } else if (e.row.data.AllocatedAmount == 0) {
          e.editorOptions.value == '';
          e.setValue(e.editorOptions.value);
        }

      }
    }, 200);
  }
  OnRowselected(data: any) {
    
    this.SelectedRow = data.selectedRowsData.length;
    if (data.selectedRowsData.length > 0) {
      this.oncreateARPayments(data);
      this.disableTextBox = true;
    }
    this.onDeleteCurrentSelectedStudy(data);
  }
  onSaving(e) {
  }
  onCellUpdating(data: any) {
    
    var e = false;
    let ssx:any ={...data.oldData}; 
    var a: NgbModalRef;
    // if (!data.newData.Nowpaid ) {
    //   data.newData.Nowpaid = '0.00'
    // } 
    if (data.newData != null && (data.newData.Nowpaid && data.newData.Nowpaid != 0)) {
      if (data.oldData.AllocatedAmount && Number(data.oldData.AllocatedAmount) > Number(data.newData.Nowpaid)) { e = true; }
      else if (data.oldData.MinSettleMent && Number(data.oldData.MinSettleMent) > Number(data.newData.Nowpaid)) { e = true; }
      if (e === true) {
        const modalReff = this._modalService.open(SettleAndMinimumAmountComponent,
          { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
        modalReff.componentInstance.data = data       
          modalReff.result.then((res: any) => {           
          }, (reson) => {           
            // if (!reson) {
            //   if(this.updateSelectedData){
            //         
            //     this.SelectedAmount = Number(this.SelectedAmount) + Number(data.newData.Nowpaid) - Number(ssx.Nowpaid);
            //     this.BalanceAmount = Number(this.CheckAmount) - Number(this.SelectedAmount);
            //   }
            //   else{
            //         data.newData.Nowpaid = '0.00'
            //         data.oldData.Nowpaid = '0.00'
            //   }
            // }
            if (!this.updateSelectedData)
            {
              data.newData.Nowpaid = '0.00'
              data.oldData.Nowpaid = '0.00'
            }
            this.SelectedAmount = Number(this.SelectedAmount) + Number(data.newData.Nowpaid) - Number(ssx.Nowpaid);
            this.BalanceAmount = Number(this.CheckAmount) - Number(this.SelectedAmount);
          })
          modalReff.componentInstance.checkNumber = this.checkNumber;
      }
      else {
        this.CreateCurrentSelectedStudy(data);
        this.SelectedAmount = Number(this.SelectedAmount) + Number(data.newData.Nowpaid) - Number(ssx.Nowpaid);
        this.BalanceAmount = Number(this.CheckAmount) - Number(this.SelectedAmount);
      }
    }
    else if (data.newData.AllocatedAmount) {
      this.onUpdateSettleAlloc(data)
    }

    if (data.newData.Nowpaid == '-3.00') {
      data.newData.Nowpaid = '0.00'
    }
    if (this.updateSelectedData == false)
    {
      //data.oldData.Nowpaid = '0.00'

    }
    if (data.oldData.Nowpaid && (data.newData.Nowpaid == '' || Number(data.newData.Nowpaid) == 0)) {
      data.newData.Nowpaid = data.oldData.Nowpaid;
    }
    else if (data.newData.Nowpaid == '') {
      data.newData.Nowpaid = '0.00'
    }
    else if (data.newData.AllocatedAmount == '') {
      data.newData.AllocatedAmount = '0.00'
    }
  }
  CreateCurrentSelectedStudy(data: any) {
    this.arPaymentUpdate = {
      tobeupdated: 'Row_Select_DeSelect',
      internalstudyid: data.oldData.INTERNALSTUDYID,
      allocamount: data.oldData.AllocatedAmount,
      amtdue: data.oldData.AMTDUE,
      paidamt: data.oldData.PaidAmt,
      payment: data.newData.Nowpaid,
      patientid: data.oldData.NewPatientId,
      checknumber: this.checkNumber,
      isselected: true,
      financialtypeid: data.oldData.FINANCIALTYPEID,
      userid: this.storageService.user.UserId
    }
    this.accountingService.ArPaymentUpdate(true, this.arPaymentUpdate).subscribe((res) => {
      var data: any = res;
      if (data.responseCode == 200) {
        //this.showNotificationOnSucess(res);
      }
      else {
        this.errorNotification(res);
      }
    },
      (err: any) => {
        this.errorNotification(err);
      });
  }

  onUpdateSettleAlloc(data: any) {
    if (data.newData.AllocatedAmount) {
      this.arPaymentUpdate = {
        tobeupdated: 'Settle Amount',
        internalstudyid: data.oldData.INTERNALSTUDYID,
        allocamount: data.newData.AllocatedAmount,
        amtdue: data.oldData.AMTDUE,
        paidamt: data.oldData.PaidAmt,
        payment: data.oldData.Nowpaid,
        patientid: data.oldData.NewPatientId,
        checknumber: this.checkNumber,
        isselected: true,
        financialtypeid: data.oldData.FINANCIALTYPEID,
        userid: this.storageService.user.UserId
      }
      this.accountingService.ArPaymentUpdate(true, this.arPaymentUpdate).subscribe((res) => {
        var data: any = res;
        if (data.responseCode == 200) {
          //this.showNotificationOnSucess(res);
        }
        else {
          this.errorNotification(res);
        }
      },
        (err: any) => {
          this.errorNotification(err);
        });
    }
  }

  onDeleteCurrentSelectedStudy(data: any) {
    if (data.currentDeselectedRowKeys.length > 0) {
      for (let i = 0; i < data.currentDeselectedRowKeys.length; i++) {
        
        let deselectedKey = data.currentDeselectedRowKeys[i];
        let deselectedrow = this.dataList.filter(x => x.INTERNALSTUDYID === deselectedKey);
        this.SelectedAmount = Number(this.SelectedAmount) - Number(deselectedrow[0].Nowpaid);
        this.BalanceAmount = Number(this.CheckAmount) - Number(this.SelectedAmount);
        this.arPaymentUpdate = {
          tobeupdated: 'Row_Select_DeSelect',
          internalstudyid: deselectedrow[0].INTERNALSTUDYID,
          allocamount: deselectedrow[0].AllocatedAmount,
          amtdue: deselectedrow[0].AMTDUE,
          paidamt: (deselectedrow[0].PaidAmt),
          payment: deselectedrow[0].Nowpaid,
          patientid: deselectedrow[0].NewPatientId,
          checknumber: this.checkNumber,
          isselected: false,
          financialtypeid: deselectedrow[0].FINANCIALTYPEID,
          userid: this.storageService.user.UserId
        }
        this.accountingService.ArPaymentUpdate(true, this.arPaymentUpdate).subscribe((res) => {
          var data: any = res;
          if (data.responseCode == 200) {
            //this.showNotificationOnSucess(res);THE PAYMENT AMOUNT IS LESS THAN SETTLEMENT. DO YOU WISH TO CONTINUE?
          }
          else {
            this.errorNotification(res);
          }
        },
          (err: any) => {
            this.errorNotification(err);
          });
        var index = this.dataList.findIndex(x => x.INTERNALSTUDYID === deselectedKey)
        this.dataList[index].Nowpaid = '0.00';
      }
      // let deselectedKey = data.currentDeselectedRowKeys[0];
      // let deselectedrow = this.dataList.filter(x => x.INTERNALSTUDYID === deselectedKey);
      // this.SelectedAmount = Number(this.SelectedAmount) - Number(deselectedrow[0].Nowpaid);
      // this.BalanceAmount = Number(this.CheckAmount) - Number(this.SelectedAmount);
      // this.arPaymentUpdate = {
      //   tobeupdated: 'Row_Select_DeSelect',
      //   internalstudyid: deselectedrow[0].INTERNALSTUDYID,
      //   allocamount: deselectedrow[0].AllocatedAmount,
      //   amtdue: deselectedrow[0].AMTDUE,
      //   paidamt: (deselectedrow[0].PaidAmt),
      //   payment: deselectedrow[0].Nowpaid,
      //   patientid: deselectedrow[0].NewPatientId,
      //   checknumber: this.checkNumber,
      //   isselected: false,
      //   financialtypeid: deselectedrow[0].FINANCIALTYPEID,
      //   userid: this.storageService.user.UserId
      // }
      // this.accountingService.ArPaymentUpdate(true, this.arPaymentUpdate).subscribe((res) => {
      //   var data: any = res;
      //   if (data.responseCode == 200) {
      //     //this.showNotificationOnSucess(res);
      //   }
      //   else {
      //     this.errorNotification(res);
      //   }
      // },
      //   (err: any) => {
      //     this.errorNotification(err);
      //   });
      // var index = this.dataList.findIndex(x => x.INTERNALSTUDYID === deselectedKey)
      // this.dataList[index].Nowpaid = 0;
    }
  }

  oncreateARPayments(data: any) {
    this.checkedData = data.selectedRowsData;
    if (this.checkedData.length > 0) {
      this.createARPayments = {
        CheckNo: this.checkNumber,
        CheckAmount: String(this.CheckAmount),
        FinancialTypeId: this.checkedData[0].FINANCIALTYPEID,
        userId: Number(this.storageService.user.UserId)
      }
      this.accountingService.CreateARPayments(true, this.createARPayments).subscribe((res) => {
        var data: any = res;
        if (data.responseCode === 200) {
          //this.showNotificationOnSucess(res);
        }
        else {
          this.errorNotification(res);
        }
      },
        (err: any) => {
          this.errorNotification(err);
        });
    }
  }
  AddSelected() {
    if (this.selectedRows !== null) {
      if (Number(this.BalanceAmount) === 0 && this.CheckAmount !== 0 && this.SelectedAmount !== 0) {
        this.createARPaidStudies = {
          userId: Number(this.storageService.user.UserId)
        }
        this.accountingService.CreateARPaidStudies(true, this.createARPaidStudies).subscribe((res) => {
          var data: any = res;
          if (data.responseCode == 200) {

            this.showNotificationOnSucess(res);
            this.disableTextBox = false;
            this.SelectedAmount = 0;
            this.CheckAmount = 0;
            this.onReset();
            this.checkdetailForm.reset();
            this.dataList = [];
            this.getBottomGrid();
          } else {
            this.errorNotification(data);
          }
        },
          (err: any) => {
            this.errorNotification(err);
          });
      }
      else {
        const modalReff = this._modalService.open(SelectStudyComponent,
          { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
        modalReff.componentInstance.data = this.msgBalanceAmount
        modalReff.result.then((res: any) => {
          //on close
        }, (reson) => {
          //on dismiss
        })
      }
    }
    else {
      const modalReff = this._modalService.open(SelectStudyComponent,
        { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
      modalReff.componentInstance.data = this.msgSelectStudy
      modalReff.result.then((res: any) => {
        //on close
      }, (reson) => {
        //on dismiss
      })
    }
  }

  onEditingStart(e) {
    e.cancel = true;
    var IsMark = e.data.IsMarkCompleted
    for (var key of this.selectedRows) {
      if (e.key === key) {
        e.cancel = false;
        if (IsMark != 1) {
          if (this.completedStudyId != e.key) {
            const modalReff = this._modalService.open(StudyNotCompletedComponent,
              { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
            modalReff.componentInstance.e = e;
            modalReff.result.then((res: any) => {
              if (res) {
                this.completedStudyId = e.data.INTERNALSTUDYID;
              } else {
                $('.dx-command-select[role="columnheader"]').find('.dx-select-checkbox[aria-checked="mixed"').trigger('click')
                $('.dx-command-select[role="columnheader"]').find('.dx-select-checkbox[aria-checked="true"').trigger('click')
              };
            }, (reson) => {
            })
          }
        }
      }
    }
    if (e.cancel === true) {
      const modalReff = this._modalService.open(SelectStudyComponent,
        { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
      modalReff.componentInstance.data = this.msgSelectStudyEdit
      modalReff.result.then((res: any) => {
      }, (reson) => {
      })
    }
    else {
      if (e.column.dataField == 'Nowpaid') {
        if (e.data.Nowpaid < 1) {
          e.data.Nowpaid = '';
        }
      }
      else if (e.column.dataField == 'AllocatedAmount') {
        if (e.data.AllocatedAmount < 0.01) {
          e.data.AllocatedAmount = '';
        }
      }
    }
  }

  get sForm() { return this.searchForm.controls; }
  get cform() { return this.checkdetailForm.controls; }

  ValidateMultiSelectTextLength(id, a)
  {
    a =this.commonMethodService.ValidateMultiSelectTextLength(id,a);
  return a;
  }
}
