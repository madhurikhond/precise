import { Component, OnInit,ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';
declare var $: any
@Component({
  selector: 'app-alert-type',
  templateUrl: './alert-type.component.html',
  styleUrls: ['./alert-type.component.css']
})

export class AlertTypeComponent implements OnInit {
  
  alertTypeForm:FormGroup;
 
  title:string='Add';
  modelValue:string
  IsSubmitted:boolean=false;
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any;
  currentFilter: any;
  showHeaderFilter: boolean;
  alertTypeList:any=[];
  pageNumber:number=1;
  pageSize:number;
  totalRecords: number=1;
  readonly pageSizeArray=PageSizeArray;
  constructor(private fb: FormBuilder,private settingsService:SettingsService,private notificationService:NotificationService,
    private readonly commonMethodService: CommonMethodService) { 
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately'
  }, {
      key: 'onClick',
      name: 'On Button Click'
  }];
  }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.alertTypeForm = this.fb.group({
      cid:[''],
      alerttype: ['',[Validators.required]],
      isActive: ['']
    });
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;
    this.commonMethodService.setTitle('Alert');
    this.getAlertTypes();
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.  getAlertTypes();
  }

  getAlertTypes()
  {
    this.settingsService.getAlertTypes(true,this.pageNumber, this.pageSize).subscribe((res)=>{
      var data: any = res;
      this.totalRecords = res.totalRecords;
      if (data.response != null && data.response.length > 0) {
        this.alertTypeList = data.response;
        this.restForm();
      }
      else {
        this.totalRecords = 1;        
        this.alertTypeList = [];
      }

    },(err : any) => {
      this.showError(err);
    }
    );
  }
  // common Notification Method
showNotification(data: any) {
  this.notificationService.showNotification({
    alertHeader : 'Record Not Found',
    alertMessage: data.message,
    alertType: data.responseCode
      });
}
showNotificationOnSucess(data: any) {
  this.notificationService.showNotification({
        alertHeader : 'Success',
        alertMessage: data.message,
        alertType: data.responseCode
      });
}
// common Error Method
showError(err: any) {
  this.notificationService.showNotification({
      alertHeader : err.statusText,
      alertMessage:err.message,
      alertType: err.status
    });
}
getCurrentRowDetail(event:any)
  {
   document.getElementById('btnUpdate').innerText='Update';
   var data=event.row.data;
   this.title=data.alerttype;
   this.alertTypeForm.patchValue({
    cid:data.cid,
    alerttype:data.alerttype,
    isActive:data.isActive
  });
  } 
  onSubmit()
  {
  this.IsSubmitted=true;
  this.modelValue='modal';
    if (this.alertTypeForm.invalid) {
      this.modelValue='';
      return;
    }
    var body={
      cid:this.getFromControls.cid.value,
      alerttype:this.getFromControls.alerttype.value,
      isActive: this.getFromControls.isActive.value == null ? false : this.getFromControls.isActive.value,
    }
    if(body.cid)
    {
      this.settingsService.updateAlertTypes(true,body).subscribe((res)=>{
        var data: any = res;
        if (data.response != null) {
          this.showNotificationOnSucess(data);
          this.getAlertTypes();
         
        }
        else {
          this.showNotification(data);
        }
  
      },(err : any) => {
        this.showError(err);
      }
      );
    }
    else{
      this.settingsService.addAlertTypes(true,body).subscribe((res)=>{
        var data: any = res;
        if (data.response != null) {
          this.showNotificationOnSucess(data);
          this.getAlertTypes();
        }
        else {
          this.showNotification(data);
        }
  
      },(err : any) => {
        this.showError(err);
      }
      );
    }
  }
  restForm()
  {
    this.title='Add';
    this.IsSubmitted=false;
    document.getElementById('btnUpdate').innerText='Add';
    this.alertTypeForm.reset();
  }
  rebindGrid()
  {
    this.pageSize=20;
    this.pageNumber=1;
    this.getAlertTypes();
  }
  
  pageChanged(event) { 
    this.pageNumber = event;
    this.getAlertTypes()
  }

  get getFromControls() { return this.alertTypeForm.controls; }
}
