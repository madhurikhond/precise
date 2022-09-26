import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-payment-type',
  templateUrl: './payment-type.component.html',
  styleUrls: ['./payment-type.component.css']
})
export class PaymentTypeComponent implements OnInit {
  modelValue:string='modal';
  modelValue1:string='modal';
  addForm: FormGroup;
  editForm: FormGroup;
  totalRecords: number;
  pageNumber: number =1;
  pageSize : number;
  paymentTypeList : any = [];
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
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;

    this.commonMethodService.setTitle('Ar Settings');
    this.getAllPaymentTypes();
    this.addForm = this.fb.group({
      paymentType:['', [Validators.required]],
      paymentCode:['', [Validators.required]],
      isActive: [true]
    }); 

    this.editForm = this.fb.group({
      paymentType:['', [Validators.required]],
      paymentCode:['', [Validators.required]],
      isActive: ['']
    }); 
  }

  onInsertSubmit(){
    this.submitted = true;
    this.modelValue='modal';
    if (this.addForm.invalid) {
      this.modelValue='';
      return;
    }
    this.savePaymentType();
  }

  onUpdateSubmit(){
    this.submitted1 = true;
    this.modelValue1 = 'modal';
    if (this.editForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.savePaymentType();
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
    this.getPaymentTypeById(id);
  }

  delete(id){
    this.id = id;
  }

  savePaymentType(){
    if(this.id == null){
      var data = {
        'paymentTypeId': this.id,
        'paymentType': this.aForm.paymentType.value,
        'paymentCode': this.aForm.paymentCode.value,
        'isActive': this.aForm.isActive.value
      }
      this.settingService.addPaymentType(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getAllPaymentTypes();
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
        'paymentTypeId': this.id,
        'paymentType': this.eForm.paymentType.value,
        'paymentCode': this.eForm.paymentCode.value,
        'isActive': this.eForm.isActive.value
      }
      this.settingService.updatePaymentType(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getAllPaymentTypes();
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

  getPaymentTypeById(id){
    this.settingService.getPaymentTypeById(true, id).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.editForm.patchValue({
          paymentType: data.response.PaymentType,
          paymentCode: data.response.PaymentCode,
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
    this.  getAllPaymentTypes();
  }

  getAllPaymentTypes(){
    this.settingService.getAllPaymentTypes(this.pageNumber, this.pageSize, true).subscribe((res) => {
      var data: any = res;
      this.totalRecords = res.totalRecords;
      if (data.response != null && data.response.length > 0) {
        this.paymentTypeList = data.response;
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

  deletePaymentType(){
    this.settingService.deletePaymentType(true, this.id).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getAllPaymentTypes();    
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
    this.getAllPaymentTypes()
  }

  get aForm() { return this.addForm.controls; }
  get eForm() { return this.editForm.controls; }
}
