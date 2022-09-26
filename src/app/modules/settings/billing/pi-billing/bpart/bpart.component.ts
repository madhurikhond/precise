import { NonNullAssert } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-bpart',
  templateUrl: './bpart.component.html',
  styleUrls: []
})
export class BpartComponent implements OnInit {
  totalRecords:number
  bpartList:any =[]
  pageNumber:number = 1;
  pageSize:number;
  editForm: FormGroup;
  submitted1 = false;
  id: number;
  modelValue1:string='modal';

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
    this.editForm = this.fb.group({
      bPart:['',[Validators.required]],
      descriptionText:['']
    }); 
    this.getAllMasterBpartDescriptions()
  }

  onUpdateSubmit(){
    this.submitted1 = true;
    this.modelValue1 = 'modal';
    if (this.editForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.updateMasterBPartDescription();
  }

  updateMasterBPartDescription(){
    var data = {
      'id': this.id,
      'bPart': this.eForm.bPart.value,
      'descriptionText': this.eForm.descriptionText.value
    }
    this.settingsService.updateMasterBPartDescription(true, data).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getAllMasterBpartDescriptions();
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
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this. getAllMasterBpartDescriptions();
  }
  getAllMasterBpartDescriptions(){
    this.settingsService.getAllMasterBPartDescriptions(true, this.pageNumber, this.pageSize).subscribe((res) => {
      var data: any = res;
      this.totalRecords = res.totalRecords;
      if (data.response != null && data.response.length > 0) {
        this.bpartList = data.response;
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

  refreshbpart(){
    this.getAllMasterBpartDescriptions()
  }

  edit(id){
    this.submitted1 = false;
    this.editForm.reset();
    this.id = id;
    this.getMasterBPartDescriptionById(id);
  }

  getMasterBPartDescriptionById(id){
    this.settingsService.getMasterBPartDescriptionById(true, id).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.editForm.patchValue({
          bPart: data.response.BPart,
          descriptionText: data.response.DescriptionText
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

  pageChanged(event){
    this.pageNumber = event;
    this.getAllMasterBpartDescriptions()
  }
  
  get eForm() { return this.editForm.controls; }
}
