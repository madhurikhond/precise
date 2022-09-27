import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  modelValue:string='modal';
  modelValue1:string='modal';
  addDepartmentForm: FormGroup;
  editDepartmentForm: FormGroup;
  totalRecords: number;
  pageNumber: number =1;
  pageSize : number;
  searchText:any;
  departmentList : any =[]
  submitted = false;
  departmentId: number;

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  readonly pageSizeArray=PageSizeArray;
  SearchForm: FormGroup;
  constructor(private fb: FormBuilder, private settingService: SettingsService, 
    private notificationService:NotificationService, private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter=false;

    this.commonMethodService.setTitle('Department');
    this.getDepartments();
    this.addDepartmentForm = this.fb.group({
      departmentName: ['', [Validators.required]],
      directPhone:['',[Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)]],
      fax:['',[Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)]],
      extension:[''],
      email:['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
    }); 

    this.editDepartmentForm = this.fb.group({
      departmentName: ['', [Validators.required]],
      directPhone:['',[Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)]],
      fax:['',[Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)]],
      extension:[''],
      email:['', [Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
    }); 

    this.SearchForm = this.fb.group({
      Search: [''] 
    });
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getDepartments();
  }
  getDepartments(){
    this.settingService.getDepartments(true, this.pageNumber, this.pageSize,this.searchText).subscribe((res) => {
      var data: any = res;
      this.departmentList=[];
      this.totalRecords=1;
      if (data.response != null && data.response.length > 0) {
        this.departmentList = data.response;
        this.totalRecords=res.totalRecords
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
    this.getDepartments()
  }
  Search(){
    this.searchText= this.SearchForm.get('Search').value
    this.getDepartments()
  }
  Clear(){
    this.SearchForm.patchValue({
      Search:''
    });
    this.searchText='';
    this.getDepartments()
  }

  onInsertSubmit(){
    this.submitted = true;
    this.modelValue='modal';
    if (this.addDepartmentForm.invalid) {
      this.modelValue='';
      return;
    }
    this.saveDepartment();
  }

  onUpdateSubmit(){

    this.submitted = true;
    this.modelValue1 = 'modal';
    if (this.editDepartmentForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.saveDepartment();
  }

  add(){
    this.departmentId = null;
    this.submitted = false;
    this.addDepartmentForm.reset();
  }

  edit(departmentId){
    this.submitted = false;
    this.editDepartmentForm.reset();
    this.departmentId = departmentId;
    this.getDepartmentById(departmentId);
  }

  delete(departmentId){
    this.departmentId = departmentId;
  }

  getDepartmentById(departmentId){
      this.settingService.getDepartmentById(true, departmentId).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.departmentId = data.response.Did;
        this.editDepartmentForm.patchValue({
          departmentName: data.response.DepartmentName,
          directPhone: data.response.DirectPhone,
          fax: data.response.Fax,
          extension: data.response.Extension,
          email: data.response.Email
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

  saveDepartment(){    
    if(this.departmentId == null){
      var data = {
        'did': this.departmentId,
        'departmentName': this.addForm.departmentName.value,
        'directPhone': this.addForm.directPhone.value,
        'fax': this.addForm.fax.value,
        'extension': this.addForm.extension.value,
        'email': this.addForm.email.value
      }
      this.settingService.addDepartment(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getDepartments();    
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
        'did': this.departmentId,
        'departmentName': this.editForm.departmentName.value,
        'directPhone': this.editForm.directPhone.value,
        'fax': this.editForm.fax.value,
        'extension': this.editForm.extension.value,
        'email': this.editForm.email.value
      }
      this.settingService.updateDepartment(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getDepartments();    
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

  deleteDepartment(){
    this.settingService.deleteDepartment(true, this.departmentId).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getDepartments();    
    }, 
    (err : any) => {
      this.notificationService.showNotification({
        alertHeader : err.statusText,
        alertMessage:err.message,
        alertType: err.status
      });
    });
  }

  get addForm() { return this.addDepartmentForm.controls; }
  get editForm() { return this.editDepartmentForm.controls; }
}
