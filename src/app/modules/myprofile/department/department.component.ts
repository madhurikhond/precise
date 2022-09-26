import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { MyprofileService } from 'src/app/services/myprofile/myprofile.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentsComponent implements OnInit {
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any;
  currentFilter: any;
  showHeaderFilter: boolean;
  pageNumber:number=1;
  pageSize:number=20;
  totalRecords:number;
  departmentList: any = [];
  search: string = '';
  constructor(private readonly myprofileService:MyprofileService
    ,private readonly notificationService:NotificationService,
    private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Departments');
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately'
  }, {
      key: 'onClick',
      name: 'On Button Click'
  }];
  this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;
    this.getDepartments();
  }
  applyFilter() {
    this.pageNumber = 1
    this.getDepartmentsNew();
  }
  getDepartments()
  {
    this.myprofileService.getMasterDepartments(true,this.pageNumber,this.pageSize).subscribe((res)=>{
      if (res.response != null  )
      {
        this.departmentList=res.response;
        this.totalRecords=res.totalRecords;
      }
      else {
        this.departmentList = [];
     this.unSuccessNotification(res,'Record not found.')
      }
    },(err:any)=>{
      this.errorNotification(err);
    });
  }

  getDepartmentsNew() {
    this.myprofileService.getMasterDepartmentsNew(true, this.pageNumber, this.pageSize,this.search).subscribe((res) => {
      if (res.response != null && res.response.length > 0) { 
        this.departmentList = res.response;
        this.totalRecords = res.totalRecords;
      }
      else {
        this.totalRecords = 1
        this.departmentList = [];
        //this.unSuccessNotification(res, 'Record not found.')
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  unSuccessNotification(res:any,msg:any)
  {
    
    this.notificationService.showNotification({
      alertHeader : msg,
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }
  errorNotification(err:any)
  {
    this.notificationService.showNotification({
      alertHeader : err.statusText,
      alertMessage:err.message,
      alertType: err.status
    });
  }
  pageChanged(event){
    this.pageNumber = event;
    this.getDepartments();
  }
  clearFilters() {
    this.pageNumber = 1
    this.search = ''
    this.getDepartmentsNew();
  }
}
