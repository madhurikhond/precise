import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/common/notification.service';
import { AccoutingService } from 'src/app/services/accouting-service/accouting.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { createPartiallyEmittedExpression } from 'typescript';

@Component({
  selector: 'app-settle-and-minimum-amount',
  templateUrl: './settle-and-minimum-amount.component.html',
  styleUrls: ['./settle-and-minimum-amount.component.css']
})
export class SettleAndMinimumAmountComponent implements OnInit {
  @Input() data : any;
  @Input() checkNumber : any;
  arPaymentUpdate: {
    tobeupdated : string,
    internalstudyid : string,
    allocamount : string,
    amtdue : number,
    paidamt : number,
    payment : number,
    patientid : string,
    checknumber : string,
    isselected : boolean,
    financialtypeid : string,
    userid : string
}
  constructor(
    private activeModal: NgbActiveModal,private readonly storageService: StorageService,
     private readonly accountingService: AccoutingService,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
  close(loadApi: Boolean = false): void {
    this.activeModal.dismiss(loadApi);
  }
  createARPayment(){
     this.createPaymemts(this.data);
     this.close();
  }
  createPaymemts(data){
    debugger;
    this.arPaymentUpdate = {
      tobeupdated : 'Row_Select_DeSelect',
      internalstudyid : data.oldData.INTERNALSTUDYID,
      allocamount : data.oldData.AllocatedAmount,
      amtdue : data.oldData.AMTDUE,
      paidamt : data.oldData.PaidAmt,
      payment : data.newData.Nowpaid,
      patientid : data.oldData.NewPatientId,
      checknumber : this.checkNumber,
      isselected : true,
      financialtypeid : data.oldData.FINANCIALTYPEID,
      userid : this.storageService.user.UserId
    }
    this.accountingService.ArPaymentUpdate(true,this.arPaymentUpdate).subscribe((res) => {
    var data: any = res;
    if (data.response != null) {
 
    }
    else {
    }
  },
  (err : any) => {  
    
  });
  this.arPaymentUpdate.tobeupdated = 'Payment Amount';
  this.accountingService.ArPaymentUpdate(true,this.arPaymentUpdate).subscribe((res) => {
    var data: any = res;
    if (data.response != null) {
      
    }
    else {
    }
  },
  (err : any) => {  
    
  });
  }
}
