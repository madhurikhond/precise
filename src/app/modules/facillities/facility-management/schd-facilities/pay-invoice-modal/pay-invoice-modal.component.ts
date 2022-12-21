import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BlockLeaseSchedulerService } from '../../../../../services/block-lease-scheduler-service/block-lease-scheduler.service';
import { NotificationService } from '../../../../../services/common/notification.service';
import { StorageService } from '../../../../../services/common/storage.service';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { parse } from 'path';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
@Component({
  selector: 'app-pay-invoice-modal',
  templateUrl: './pay-invoice-modal.component.html',
  styleUrls: ['./pay-invoice-modal.component.css']
})
export class PayInvoiceModalComponent implements OnInit {
  @Input() AmountDetails: any;
  @Input() selectedleases: any;
  @Input() selectedCreditIds: any;
  @Input() TotalCreditsAmount: any;
  @Input() TotalLeasesAmount: any;
  @Input() facilityId: any;
  ModalResult = ModalResult;
  payInvoiceForm: FormGroup;
  dobModel: string = '';
  currentDate = new Date();

  formattedInputAmount: any;
  inputAmount: any;
  strAmount: string = '';
  formattedInputCheckNumber: any;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  constructor(private decimalPipe: DecimalPipe,
    private fb: FormBuilder, public modal: NgbActiveModal,
    private readonly blockleasescheduler: BlockLeaseSchedulerService,
    private readonly storageService: StorageService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.createPayInvoiceForm();
    this.formattedInputAmount = this.decimalPipe.transform(this.AmountDetails.TotalAmount, '0.2-2');
  this.formattedInputCheckNumber = this.payInvoiceForm.controls['checkId'].value;
    // this.setPayInvoiceForm();
  }
  transformAmount(element) {
      this.formattedInputAmount = this.decimalPipe.transform(this.formattedInputAmount, '0.2-2'); 
    if (!isNaN(this.formattedInputAmount))
      this.formattedInputAmount = Number(this.formattedInputAmount).toLocaleString();
  }

  createPayInvoiceForm() {
    this.payInvoiceForm = this.fb.group({
      checkId: ['', [Validators.required]],
      checkDate: [this.currentDate, [Validators.required]],
      checkAmount: ['', [Validators.required,Validators.maxLength(9),Validators.minLength(1), Validators.pattern('([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]')]]
    });
  }
  close() {
    this.modal.dismiss(ModalResult.CLOSE);
  }

  cancel() {
    this.modal.dismiss(ModalResult.CANCEL);
  }
  setPayInvoiceForm() {
    // this.payInvoiceForm.patchValue({
    //   checkAmount: new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(this.AmountDetails.TotalAmount)
    // });
  }
  MakePayment(e) {
    var grossAmount = this.payInvoiceFormControls.checkAmount.value//.replace('$', '')// this.payInvoiceFormControls.checkAmount.value.slice(1,50);
    var data = {
      "FacilityId": this.facilityId,
      "Credits": this.selectedCreditIds,
      "GrossAmount": this.AmountDetails.TotalAmount,
      "Leases": this.selectedleases,
      "CheckNumber": this.payInvoiceForm.value.checkId,
      "CheckAmount": grossAmount,
      "TotalCreditsAmount": this.TotalCreditsAmount,
      "TotalLeasesAmount": this.TotalLeasesAmount,
      "UserId": this.storageService.user.UserId,
      "CheckDate": moment(this.payInvoiceFormControls.checkDate.value).format('MM/DD/YYYY hh:mm:ss')
    }
    this.blockleasescheduler.CreatePayments(true, data).subscribe((res) => {
      if (res && res.responseCode == 200) {
        this.successNotification(res);
        this.modal.dismiss(ModalResult.SAVE);
      } else {
        this.errorNotification(res);
      }
    });
  }
  keyPressAlphaNumeric(e) {
debugger
var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
 
  }
  onPaste(e) {
    debugger
    this.formattedInputCheckNumber = this.payInvoiceForm.controls['checkId'].value;
   // alert('Value:' +  this.formattedInputCheckNumber);
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
     
        return true;
    }
    else{
      var amtStr=  this.formattedInputCheckNumber.replace(/[^a-zA-Z0-9]/g, '');
      this.payInvoiceForm.patchValue({
        checkId:amtStr,
      });
      return true;
    }
 
  }
 
  successNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status,
    });
  }
  // delete() {
  //   this.modal.dismiss(ModalResult.DELETE);
  // }
  get payInvoiceFormControls() { return this.payInvoiceForm.controls; }
}
export enum ModalResult {
  BACKDROP_CLICK = 0,
  ESC = 1,
  CLOSE = 3,
  CANCEL = 4,
  SAVE = 5,
  DELETE = 6
}
