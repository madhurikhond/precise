import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BlockLeaseSchedulerService } from '../../../../../services/block-lease-scheduler-service/block-lease-scheduler.service';
import { NotificationService } from '../../../../../services/common/notification.service';
import { StorageService } from '../../../../../services/common/storage.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  constructor(private currencyPipe: CurrencyPipe,
    private fb: FormBuilder, public modal: NgbActiveModal,
    private readonly blockleasescheduler: BlockLeaseSchedulerService,
    private readonly storageService: StorageService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.createPayInvoiceForm();
    this.formattedInputAmount = this.currencyPipe.transform(this.AmountDetails.TotalAmount, '$');
    // this.setPayInvoiceForm();
  }
  transformAmount(element) {
    if (this.formattedInputAmount.length > 0 && this.formattedInputAmount.slice(0, 1) == '$') {
      this.formattedInputAmount = this.formattedInputAmount.slice(1, 50).toString().replace(/,/g, "");
      this.formattedInputAmount = this.currencyPipe.transform(this.formattedInputAmount, '$');
      element.target.value = this.formattedInputAmount;
    }
    else {
      this.formattedInputAmount = this.currencyPipe.transform(this.formattedInputAmount, '$');
      element.target.value = this.formattedInputAmount;
    }


  }

  createPayInvoiceForm() {
    this.payInvoiceForm = this.fb.group({
      checkId: ['', [Validators.required]],
        checkDate:[this.currentDate,[Validators.required]],
      checkAmount: ['', [Validators.required]]
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
    var grossAmount = this.payInvoiceFormControls.checkAmount.value.replace('$', '')// this.payInvoiceFormControls.checkAmount.value.slice(1,50);
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
      }
    });
  }
  keyPressAlphaNumeric(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  successNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
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
