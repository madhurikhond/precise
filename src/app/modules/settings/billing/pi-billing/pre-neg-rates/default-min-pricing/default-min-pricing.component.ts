import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-default-min-pricing',
  templateUrl: './default-min-pricing.component.html',
  styleUrls: ['./default-min-pricing.component.css']
})
export class DefaultMinPricingComponent implements OnInit {
  id: number;
  modelValue1:string='modal';
  procGroupList: any = [];
  minPricingList: any = [];
  pageNumber: number = 1;
  pageSize: number;
  totalRecords: number;
  myForm: FormGroup
  editForm: FormGroup
  submitted: boolean = false;
  submitted1: boolean = false;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  readonly pageSizeArray=PageSizeArray;
  constructor(private fb: FormBuilder,
    private readonly commonMethodService: CommonMethodService, 
    private readonly settingsService:  SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;
    
    this.commonMethodService.setTitle('Pi Billing');
    this.getAllProcGroups();
    this.getDefaultMinPricings();
    this.myForm = this.fb.group({
      procGroup:['', [Validators.required]],
      afterDate:['', [Validators.required]],
      price:['', [Validators.required]]
    });

    this.editForm = this.fb.group({
      procGroup:['', [Validators.required]],
      afterDate:['', [Validators.required]],
      price:['', [Validators.required]]
    });
  }

  getAllProcGroups(){
    this.settingsService.getAllProcGroups(true).subscribe((res) => {
      var data: any = res;      
      if (data.response != null && data.response.length > 0) {
        this.procGroupList = data.response;
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
    this.getDefaultMinPricings();
  }
  getDefaultMinPricings(){
   
    this.settingsService.getDefaultMinPricings(true, this.pageNumber, this.pageSize).subscribe((res) => {
      var data: any = res;   
      this.totalRecords=res.totalRecords;   
      if (data.response != null && data.response.length > 0) {
        this.minPricingList = data.response;
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

  onSubmit(){
    this.id = null;
    this.submitted = true;
    if (this.myForm.invalid) {
      return;
    }
    this.saveDefaultMinPricing();
  }

  onUpdateSubmit(){
    this.submitted1 = true;
    this.modelValue1 = 'modal';
    if (this.editForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.saveDefaultMinPricing();
  }

  saveDefaultMinPricing(){    
    if(this.id == null){
      var data = {
        'id': this.id,
        'procGroup': this.mForm.procGroup.value,
        'procGroupId': this.mForm.procGroup.value,
        'date': this.mForm.afterDate.value,
        'price': this.mForm.price.value
      }
      this.settingsService.addDefaultMinPricing(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getDefaultMinPricings();
        this.submitted = false;
        this.myForm.reset();
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
        'procGroup': this.eForm.procGroup.value,
        'procGroupId': this.eForm.procGroup.value,
        'date': this.eForm.afterDate.value,
        'price': this.eForm.price.value
      }
      this.settingsService.updateDefaultMinPricing(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getDefaultMinPricings();
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

  pageChanged(event){
    this.pageNumber = event;
    this.getDefaultMinPricings();
  }

  getDefaultMinPriceById(id){
    this.settingsService.getDefaultMinPricingById(true, id).subscribe((res) => {
    var data: any = res;
    if (data.response != null) {
      this.id = data.response.Id;
      this.editForm.patchValue({
        procGroup: data.response.ProcGroup,
        afterDate: this.formatDate(data.response.Date),
        price: data.response.Price
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

  delete(id){
    this.id = id;
  }

  deleteDefaultMinPricing(){
    this.settingsService.deleteDefaultMinPricing(true, this.id).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getDefaultMinPricings();    
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  get mForm() { return this.myForm.controls; }
  get eForm() { return this.editForm.controls; }
}
