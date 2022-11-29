import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BlockLeaseSchedulerService } from '../../../../../services/block-lease-scheduler-service/block-lease-scheduler.service';
import { NotificationService } from '../../../../../services/common/notification.service';
import { StorageService } from '../../../../../services/common/storage.service';
import { CommonModule, CurrencyPipe} from '@angular/common';
@Component({
  selector: 'app-pay-invoice-modal',
  templateUrl: './pay-invoice-modal.component.html',
  styleUrls: ['./pay-invoice-modal.component.css']
})
export class PayInvoiceModalComponent implements OnInit {
  @Input() AmountDetails: any;
  @Input() selectedleases: any;
  @Input() selectedCreditIds: any;
  @Input() facilityId: any;
  ModalResult = ModalResult;
  payInvoiceForm:FormGroup;
  dobModel: string = '';
  currentDate = new Date();
  
  formattedInputAmount: any;
  inputAmount: any;
  constructor( private currencyPipe : CurrencyPipe,
    private fb: FormBuilder, public modal: NgbActiveModal,
    private readonly blockleasescheduler: BlockLeaseSchedulerService,
    private readonly storageService: StorageService,
    private readonly notificationService: NotificationService  ) { }

  ngOnInit(): void {
    this.createPayInvoiceForm();
   // this.setPayInvoiceForm();
  }
  transformAmount(element){
    this.formattedInputAmount = this.currencyPipe.transform(this.formattedInputAmount,'$');
    element.target.value = this.formattedInputAmount;
  }
  createPayInvoiceForm()
  {
    this.payInvoiceForm = this.fb.group({
      checkId:['',[Validators.required]],
      // checkDate:['',[Validators.required]],
      checkAmount:['',[Validators.required]]
    });
  }
  close() {
    this.modal.dismiss(ModalResult.CLOSE);
  }

  cancel() {
    this.modal.dismiss(ModalResult.CANCEL);
  }
  setPayInvoiceForm()
  {
    // this.payInvoiceForm.patchValue({
    //   checkAmount: new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(this.AmountDetails.TotalAmount)
    // });
  }
  MakePayment(e)
  {   
    var grossAmount = this.payInvoiceFormControls.checkAmount.value.slice(1,50);
    var data = {
      "FacilityId": this.facilityId,
      "Credits": this.selectedCreditIds,
      "GrossAmount": this.AmountDetails.TotalAmount,
      "Leases": this.selectedleases,
      "CheckNumber": this.payInvoiceForm.value.checkId,
      "CheckAmount": grossAmount,
      "TotalCreditsAmount": this.AmountDetails.TotalCreditsAmount,
      "TotalLeasesAmount": this.AmountDetails.TotalLeasesAmount,
      "UserId": this.storageService.user.UserId,
      "CheckDate": moment(this.currentDate).format('MM/DD/YYYY hh:mm:ss')
    }
    this.blockleasescheduler.CreatePayments(false, data).subscribe((res) => {
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
