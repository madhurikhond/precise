import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-payment-bank',
  templateUrl: './payment-bank.component.html',
  styleUrls: ['./payment-bank.component.css']
})
export class PaymentBankComponent implements OnInit {
  modelValue:string='modal';
  modelValue1:string='modal';
  addForm: FormGroup;
  editForm: FormGroup;
  totalRecords: number;
  pageNumber: number =1;
  pageSize : number = 50;
  paymentBankList : any = [];
  submitted = false;
  submitted1 = false;
  id: number;

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  readonly pageSizeArray=PageSizeArray;
  
  constructor(private fb: FormBuilder, private settingService: SettingsService, 
    private notificationService: NotificationService, private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;

    this.commonMethodService.setTitle('Payment Bank');
    this.getAllPaymentBanks();
    this.addForm = this.fb.group({
      paymentBank:['', [Validators.required]],
      accountNumber:['', [Validators.required]],
      bankAddress:['', [Validators.required]],
      isActive: [true]
    }); 

    this.editForm = this.fb.group({
      paymentBank:['', [Validators.required]],
      accountNumber:['', [Validators.required]],
      bankAddress:['', [Validators.required]],
      isActive: [true]
    }); 
  }

  onInsertSubmit(){
    this.submitted = true;
    this.modelValue='modal';
    if (this.addForm.invalid) {
      this.modelValue='';
      return;
    }
    this.savePaymentBank();
  }

  onUpdateSubmit(){
    this.submitted1 = true;
    this.modelValue1 = 'modal';
    if (this.editForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.savePaymentBank();
  }

  add(){
    this.id = null;
    this.submitted = false;
    this.addForm.reset();
    this.addForm.patchValue({
      isActive: true
    });
  }

  edit(id){
    this.submitted1 = false;
    this.editForm.reset();
    this.id = id;
    this.getPaymentBankById(id);
  }

  delete(id){
    this.id = id;
  }

  savePaymentBank(){
    if(this.id == null){
      var data = {
        'paymentTypeBankId': this.id,
        'paymentBank': this.aForm.paymentBank.value,
        'accountNumber': this.aForm.accountNumber.value,
        'bankAddress': this.aForm.bankAddress.value,
        'isActive': this.aForm.isActive.value
      }
      this.settingService.addPaymentBank(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getAllPaymentBanks();
        this.submitted = false;
        this.addForm.reset();
      }, 
      (err : any) => {
        this.notificationService.showNotification({
          alertHeader : err.statusText,
          alertMessage:err.message,
          alertType: err.status
        });
      });
    }
    else {
      var data = {
        'paymentTypeBankId': this.id,
        'paymentBank': this.eForm.paymentBank.value,
        'accountNumber': this.eForm.accountNumber.value,
        'bankAddress': this.eForm.bankAddress.value,
        'isActive': this.eForm.isActive.value
      }
      this.settingService.updatePaymentBank(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getAllPaymentBanks();
        this.submitted1 = false;
        this.editForm.reset();
      }, 
      (err : any) => {
        this.notificationService.showNotification({
          alertHeader : err.statusText,
          alertMessage:err.message,
          alertType: err.status
        });
      });
    }
  }

  getPaymentBankById(id){
    this.settingService.getPaymentBankById(true, id).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.editForm.patchValue({
          paymentBank: data.response.PaymentBank,
          accountNumber: data.response.AccountNumber,
          bankAddress: data.response.BankAddress,
          isActive: data.response.IsDeleted
        });
      }
      else {
        this.notificationService.showNotification({
          alertHeader : data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getAllPaymentBanks();
  }
  getAllPaymentBanks(){
    this.settingService.getAllPaymentBanks(this.pageNumber, this.pageSize, true).subscribe((res) => {
      var data: any = res;
      this.totalRecords = res.totalRecords;
      if (data.response != null && data.response.length > 0) {
        this.paymentBankList = data.response;
      }
      else {
        this.notificationService.showNotification({
          alertHeader : data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

  deletePaymentBank(){
    this.settingService.deletePaymentBank(true, this.id).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getAllPaymentBanks();    
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

  pageChanged(event){
    this.pageNumber = event;
    this.getAllPaymentBanks()
  }

  get aForm() { return this.addForm.controls; }
  get eForm() { return this.editForm.controls; }
}
