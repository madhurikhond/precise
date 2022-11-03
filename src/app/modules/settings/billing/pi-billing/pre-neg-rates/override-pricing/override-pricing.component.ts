import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-override-pricing',
  templateUrl: './override-pricing.component.html',
  styleUrls: ['./override-pricing.component.css']
})
export class OverridePricingComponent implements OnInit {
  id: number;
  showDropdownLoader = true;
  modelValue1:string='modal';
  procGroupList: any = [];
  attorneyList: any = [];
  facilityList: any = [];
  referrerList: any = [];
  overridePricingList: any = [];
  pageNumber: number = 1;
  pageSize: number ;
  totalRecords: number;
  myForm: FormGroup;
  editForm: FormGroup;
  submitted: boolean = false;
  submitted1: boolean = false;

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  readonly pageSizeArray=PageSizeArray;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
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
    this.fillDropDown();
    this.getOverridePricings();
    this.myForm = this.fb.group({
      attorney:['', [Validators.required]],
      referrer:['', [Validators.required]],
      facility:['', [Validators.required]],
      procGroup:['', [Validators.required]],
      afterDate:['', [Validators.required]],
      price:['', [Validators.required]]
    });

    this.editForm = this.fb.group({
      attorney:['', [Validators.required]],
      referrer:['', [Validators.required]],
      facility:['', [Validators.required]],
      procGroup:['', [Validators.required]],
      afterDate:['', [Validators.required]],
      price:['', [Validators.required]]
    });
  }

  fillDropDown(){
    this.settingsService.getDropdownOverridePricing(false).subscribe((res) => {
      var data: any = res;      
      if (data.response != null) {
        this.procGroupList = data.response.procGroup;
        this.attorneyList = data.response.attorney;
        this.referrerList = data.response.referrer;
        this.facilityList = data.response.facility;
      }
      else {
        this.notificationService.showNotification({
          alertHeader : data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
      this.showDropdownLoader = false;
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
      this.showDropdownLoader = false;
    });
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getOverridePricings();
  }

  getOverridePricings(){
    this.settingsService.getAllOverridePricings(true, this.pageNumber, this.pageSize).subscribe((res) => {
      var data: any = res;
      this.totalRecords=res.totalRecords;
      if (data.response != null && data.response.length > 0) {
        this.overridePricingList = data.response;
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
    this.saveOverridePricing();
  }

  onUpdateSubmit(){
    this.submitted1 = true;
    this.modelValue1 = 'modal';
    if (this.editForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.saveOverridePricing();
  }

  getOverridePriceById(id){
    this.settingsService.getOverridePricingById(true, id).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.id = data.response.Id;
        this.editForm.patchValue({
          attorney: data.response.ATTORNEY,
          referrer: data.response.Referrer,
          facility: data.response.Facility,
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

  saveOverridePricing(){    
    if(this.id == null){
      var data = {
        'id': this.id,
        'facility': this.mForm.facility.value,
        'attorney': this.mForm.attorney.value,
        'referrer': this.mForm.referrer.value,
        'procGroup': this.mForm.procGroup.value,
        'date': this.mForm.afterDate.value,
        'price': this.mForm.price.value
      }
      this.settingsService.addOverridePricing(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getOverridePricings();
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
        'facility': this.eForm.facility.value,
        'attorney': this.eForm.attorney.value,
        'referrer': this.eForm.referrer.value,
        'procGroup': this.eForm.procGroup.value,
        'date': this.eForm.afterDate.value,
        'price': this.eForm.price.value
      }
      this.settingsService.updateOverridePricing(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getOverridePricings();
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

  delete(id){
    this.id = id;
  }

  pageChanged(event){
    this.pageNumber = event;
    this.getOverridePricings();
  }

  deleteOverridePricing(){
    this.settingsService.deleteOverridePricing(true, this.id).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getOverridePricings();    
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

  copyRecord(id){
    this.settingsService.copyOverridePricing(true, id).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getOverridePricings();
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
