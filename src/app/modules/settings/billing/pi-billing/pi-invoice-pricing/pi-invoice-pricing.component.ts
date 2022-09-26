import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-pi-invoice-pricing',
  templateUrl: './pi-invoice-pricing.component.html',
  styleUrls: []
})
export class PiInvoicePricingComponent implements OnInit {
  modelValue:string='modal';
  modelValue1:string='modal';
  editForm: FormGroup;
  totalRecords: number;
  pageNumber: number =1;
  pageSize : number;
  piInvoiceList : any = [];
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

    this.commonMethodService.setTitle('PI Invoice');
    this.getAllPiInvoices();

    this.editForm = this.fb.group({
      attorneyPrice:['',[Validators.required]],
      piBillingFeeGlobal:['',[Validators.required]],
      isNoPIBillFeeGlobal: ['']
    }); 
  }

 onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getAllPiInvoices();
  }
  
  getAllPiInvoices(){
    this.settingService.getAllPiInvoices(this.pageNumber, this.pageSize, true).subscribe((res) => {
      var data: any = res;
      this.totalRecords = res.totalRecords;
      if (data.response != null && data.response.length > 0) {
        this.piInvoiceList = data.response;
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

  onUpdateSubmit(){
    this.submitted1 = true;
    this.modelValue1 = 'modal';
    if (this.editForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.savePiInvoice();
  }

  savePiInvoice(){
    var data = {
      'procGroupId': this.id,
      'attorneyPrice': this.eForm.attorneyPrice.value,
      'piBillingFeeGlobal': this.eForm.piBillingFeeGlobal.value,
      'isNoPIBillFeeGlobal': this.eForm.isNoPIBillFeeGlobal.value
    }
    this.settingService.updatePiInvoice(true, data).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getAllPiInvoices();
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
  

  getPiInvoiceById(id){
    this.settingService.getPiInvoiceById(true, id).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.editForm.patchValue({
          attorneyPrice: data.response.AttorneyPrice,
          piBillingFeeGlobal: data.response.PIBillingFeeGlobal,
          isNoPIBillFeeGlobal: data.response.IsNoPIBillFeeGlobal
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

  edit(id){
    this.submitted1 = false;
    this.editForm.reset();
    this.id = id;
    this.getPiInvoiceById(id);
  }

  pageChanged(event){
    this.pageNumber = event;
    this.getAllPiInvoices()
  }

  get eForm() { return this.editForm.controls; }
}
