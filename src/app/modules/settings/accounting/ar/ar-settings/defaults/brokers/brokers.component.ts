import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-brokers',
  templateUrl: './brokers.component.html',
  styleUrls: ['./brokers.component.css']
})
export class BrokersComponent implements OnInit {
  modelValue:string='modal';
  modelValue1:string='modal';
  addForm: FormGroup;
  editForm: FormGroup;
  totalRecords: number;
  pageNumber: number =1;
  pageSize : number;
  paymentBasedBrokerList : any = [];
  submitted = false;
  submitted1 = false;
  id: number;

  brokerList:any = [];
  paymentTypeList:any = [];
  paymentBankList:any = [];
  qbAccountList:any = [];
  payeeList:any = [];

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
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;
    
    this.commonMethodService.setTitle('Funding Company');
    this.getAllPaymentBasedBrokerTypes();
    this.getARSettingDropdown();
    this.addForm = this.fb.group({
      brokerId:[null, [Validators.required]],
      paymentTypeId:[null, [Validators.required]],
      paymentBankId:[null, [Validators.required]],
      payeeId:[null, [Validators.required]],
      qbAccountId:[null, [Validators.required]]
    }); 

    this.editForm = this.fb.group({
      brokerId:['', [Validators.required]],
      paymentTypeId:['', [Validators.required]],
      paymentBankId:['', [Validators.required]],
      payeeId:['', [Validators.required]],
      qbAccountId:['', [Validators.required]]
    }); 
  }

  getARSettingDropdown(){
    this.settingService.getARSettingDropdown(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.brokerList = data.response.broker;
        this.paymentTypeList = data.response.paymentType;
        this.paymentBankList = data.response.paymentBank;
        this.qbAccountList = data.response.qbAccount;
        this.payeeList = data.response.payee;
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

  onInsertSubmit(){
    this.submitted = true;
    this.modelValue='modal';
    if (this.addForm.invalid) {
      this.modelValue='';
      return;
    }
    this.savePaymentBasedBrokerTypes();
  }

  onUpdateSubmit(){
    this.submitted1 = true;
    this.modelValue1 = 'modal';
    if (this.editForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.savePaymentBasedBrokerTypes();
  }

  add(){
    this.id = null;
    this.submitted = false;
    this.addForm.reset();
  }

  edit(id){
    this.submitted1 = false;
    this.editForm.reset();
    this.id = id;
    this.getPaymentBasedBrokerTypeById(id);
  }

  delete(id){
    this.id = id;
  }

  savePaymentBasedBrokerTypes(){
    if(this.id == null){
      var data = {
        'id': this.id,
        'brokerId': this.aForm.brokerId.value,
        'paymentTypeId': this.aForm.paymentTypeId.value,
        'paymentBankId': this.aForm.paymentBankId.value,
        'payeeId': this.aForm.payeeId.value,
        'qbAccountId': this.aForm.qbAccountId.value
      }
      this.settingService.addPaymentBasedBrokerType(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getAllPaymentBasedBrokerTypes();
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
        'id': this.id,
        'brokerId': this.eForm.brokerId.value,
        'paymentTypeId': this.eForm.paymentTypeId.value,
        'paymentBankId': this.eForm.paymentBankId.value,
        'payeeId': this.eForm.payeeId.value,
        'qbAccountId': this.eForm.qbAccountId.value
      }
      this.settingService.updatePaymentBasedBrokerType(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getAllPaymentBasedBrokerTypes();
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

  getPaymentBasedBrokerTypeById(id){
    this.settingService.getPaymentBasedBrokerTypeById(true, id).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.editForm.patchValue({
          brokerId: data.response.BrokerId,
          paymentTypeId: data.response.PaymentTypeId,
          paymentBankId: data.response.PaymentBankId,
          payeeId: data.response.PayeeId,
          qbAccountId: data.response.QBAccountId
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
    this.  getAllPaymentBasedBrokerTypes()
  }
  
  getAllPaymentBasedBrokerTypes() {
    debugger
    this.settingService.getAllPaymentBasedBrokerTypes(this.pageNumber, this.pageSize, true).subscribe((res) => {
      var data: any = res;
      this.totalRecords = res.totalRecords;
      if (data.response != null && data.response.length > 0) {
        this.paymentBasedBrokerList = data.response;
      }
      else {
        //this.notificationService.showNotification({
        //  alertHeader : data.statusText,
        //  alertMessage: data.message,
        //  alertType: data.responseCode
        //});
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

  deletePaymentBasedBrokerType(){
    this.settingService.deletePaymentBasedBrokerType(true, this.id).subscribe((res) =>{      
      if (res) {
        if((this.paymentBasedBrokerList.length-1)===0)      
         if(this.pageNumber !=1){
          this.pageNumber--;
         }
         else{
           this.paymentBasedBrokerList = [];
         }
       
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getAllPaymentBasedBrokerTypes();    
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
    this.getAllPaymentBasedBrokerTypes()
  }

  get aForm() { return this.addForm.controls; }
  get eForm() { return this.editForm.controls; }
}
