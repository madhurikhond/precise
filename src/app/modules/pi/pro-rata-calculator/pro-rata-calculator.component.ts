import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PiService } from 'src/app/services/pi.service';

@Component({
  selector: 'app-pro-rata-calculator',
  templateUrl: './pro-rata-calculator.component.html',
  styleUrls: ['./pro-rata-calculator.component.css']
})
export class ProRataCalculatorComponent implements OnInit {

  proRataForm: FormGroup
  prorataList: any = []
  userData: any
  userId: number
  preciseTotal: any

  netSettlementProRata: number;
  fullLienPay: number;
  percentageSettlement: number;
  proRata: number;

  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService,
    private readonly piService: PiService,
    private readonly notificationService: NotificationService) { }


  ngOnInit(): void {
    this.commonMethodService.setTitle('Pro Rata Calculator');
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.userId = this.userData.UserId
    this.proRataForm = this.fb.group({
      SettlementAmount: [0],
      Bills: [0],
      TotalPrecieBill: [0],
      AdditionalCosts: [0],
      FullLienPay1: [0],
      FullLienPay2: [0],
      FullLienPay3: [0],
      FullLienPay4: [0],
      proRata: [33.33]
    });
    this.getUserProData()
  }

  getUserProData() {
    this.piService.getUserProData(true, this.userId).subscribe((res) => {
      var data: any = res;
      this.proRataForm.patchValue({
        SettlementAmount: data.response.input.SettlementAmount,
        Bills: data.response.input.Bills,
        TotalPrecieBill: data.response.input.TotalPrecieBill,
        AdditionalCosts: data.response.input.AdditionalCosts,
        FullLienPay1: data.response.input.FullLienPay1,
        FullLienPay2: data.response.input.FullLienPay2,
        FullLienPay3: data.response.input.FullLienPay3,
        FullLienPay4: data.response.input.FullLienPay4
      });

      this.onKeyUpEvent();
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }


  CalculateNetSettlementAmount() {
    this.netSettlementProRata = parseFloat(this.proRataForm.get('SettlementAmount').value) - parseFloat(this.proRataForm.get('AdditionalCosts').value);
  }

  FullLienPay() {
    this.fullLienPay = (parseFloat(this.proRataForm.get('FullLienPay1').value) + parseFloat(this.proRataForm.get('FullLienPay2').value)
      + parseFloat(this.proRataForm.get('FullLienPay3').value) + parseFloat(this.proRataForm.get('FullLienPay4').value));
  }

  CalculatPercentageOfSettlement() {
    let val = (this.netSettlementProRata * parseFloat(this.proRataForm.get('proRata').value)) / 100;
    if (val === 0) {
      this.percentageSettlement = 0
    }
    else {
      this.percentageSettlement = val - this.fullLienPay;
    }
    this.ProRata();
  }

  ProRata() {
    let BillsValue = parseFloat(this.proRataForm.get('Bills').value);
    if (BillsValue === 0) {
      this.proRata = 0;
    }
    else {
      this.proRata = (this.percentageSettlement / BillsValue) * 100;
    }

    this.TotaltoPrecise()

  }
  TotaltoPrecise() {
    if (this.proRata === 0) {
      this.preciseTotal = 0
    }
    else {
      var TotalBillValue = parseFloat(this.proRataForm.get('TotalPrecieBill').value);
      this.preciseTotal = (TotalBillValue * this.proRata) / 100;
    }
  }

  onKeyUpEvent() {
    this.CalculateNetSettlementAmount();
    this.FullLienPay();
    this.CalculatPercentageOfSettlement()
  }

  clearCalculateProRata() {
    this.proRataForm.patchValue({
      SettlementAmount: 0,
      Bills: 0,
      TotalPrecieBill: 0,
      AdditionalCosts: 0,
      FullLienPay1: 0,
      FullLienPay2: 0,
      FullLienPay3: 0,
      FullLienPay4: 0
    });
    this.calculateProRata()
  }

  calculateProRata() {
    var body = {
      'userID': this.userId,
      'settlementAmount': parseFloat(this.cpForm.SettlementAmount.value),
      'bills': parseFloat(this.cpForm.Bills.value),
      'totalPrecieBill': parseFloat(this.cpForm.TotalPrecieBill.value),
      'additionalCosts': parseFloat(this.cpForm.AdditionalCosts.value),
      'fullLienPay1': parseFloat(this.cpForm.FullLienPay1.value),
      'fullLienPay2': parseFloat(this.cpForm.FullLienPay2.value),
      'fullLienPay3': parseFloat(this.cpForm.FullLienPay3.value),
      'fullLienPay4': parseFloat(this.cpForm.FullLienPay4.value),
      'proRata': parseFloat(this.cpForm.proRata.value),
    }

    this.piService.calculateProRata(false, body).subscribe((res) => {
      this.onKeyUpEvent()
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  inputChange(event) {

    if (event && !event.target.value) {
      this.proRataForm.get(event.currentTarget.getAttribute('formcontrolname')).setValue(0);
    }
    this.calculateProRata()
  }

  get cpForm() { return this.proRataForm.controls; }
}
