import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pay-invoice-modal',
  templateUrl: './pay-invoice-modal.component.html',
  styleUrls: ['./pay-invoice-modal.component.css']
})
export class PayInvoiceModalComponent implements OnInit {
  @Input() TotalAmount: any;
  ModalResult = ModalResult;
  payInvoiceForm:FormGroup;
  dobModel: string = '';
  currentDate = new Date();
  constructor( private fb: FormBuilder,public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.createPayInvoiceForm();
    this.setPayInvoiceForm();
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
    this.payInvoiceForm.patchValue({
      checkAmount: '$'+ new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(this.TotalAmount)
    });
  }
  abc(e)
  {
    
    var x = this.payInvoiceFormControls.checkAmount.value.replace(/[^\w ]/g, '');
      console.log(x)
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
