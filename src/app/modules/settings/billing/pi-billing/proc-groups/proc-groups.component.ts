import { Component, OnInit,NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';



@Component({
  selector: 'app-proc-groups',
  templateUrl: './proc-groups.component.html',
  styleUrls: []
})
export class ProcGroupsComponent implements OnInit {
  modelValue:string='modal';
  modelValue1:string='modal';
  addForm: FormGroup;
  editForm: FormGroup;
  totalRecords: number;
  pageNumber: number =1;
  pageSize : number ;
  procGroupList : any = [];
  submitted = false;
  submitted1 = false;
  id: number;
  masterModalityList: any = [];

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
    this.commonMethodService.setTitle('Proc. Groups');
    this.getAllProcGroups();
    this.getModalityList();
    this.addForm = this.fb.group({
      procGroupName: ['', [Validators.required]],
      procNoShowFee: ['', [Validators.required]],
      masterModality:[0]
    }); 

    this.editForm = this.fb.group({
      procGroupName: ['', [Validators.required]],
      procNoShowFee: ['', [Validators.required]],
      masterModality:[0]
    }); 
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getAllProcGroups();
  }
  getModalityList()
   {
   
    this.settingService.getAllMasterModalities(true).subscribe((res)=>{
     if(res.response!=null)
     {
       this.masterModalityList=res.response; 
     }
    },(err : any) => {
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
    this.saveProcGroup();
  }

  onUpdateSubmit(){
    this.submitted1 = true;
    this.modelValue1 = 'modal';
    if (this.editForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.saveProcGroup();
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
    this.getProcGroupById(id);
  }

  delete(id){
    this.id = id;
  }

  saveProcGroup(){
    if(this.id == null){
      var data = {
        'procGroupId': this.id,
        'procGroupName': this.aForm.procGroupName.value,
        'procNoShowFee': this.aForm.procNoShowFee.value,
        'masterModality': (this.aForm.masterModality.value === '0') ? null : this.aForm.masterModality.value,
   
      }  
      this.settingService.addProcGroup(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          });
        }
        this.getAllProcGroups();
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
        'procGroupId': this.id,
        'procGroupName': this.eForm.procGroupName.value,
        'procNoShowFee': this.eForm.procNoShowFee.value,        
        'masterModality': (this.eForm.masterModality.value === '0') ? null : this.eForm.masterModality.value,
        //'masterModalityID': this.eForm.masterModalityID.value.toString()     
      }     
      console.log(this.eForm.masterModalityID.value);
      this.settingService.updateProcGroup(true, data).subscribe((res) =>{      
        if (res) {
          this.notificationService.showNotification({ 
            alertHeader : 'Success' ,
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getAllProcGroups();
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

  getProcGroupById(id){  
    this.settingService.getProcGroupById(true, id).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
              
        this.editForm.patchValue({         
          procGroupName: data.response.ProcGroupName,
          procNoShowFee: data.response.ProcNoShowFee,
          masterModality: (data.response.MasterModalityID) ? data.response.MasterModalityID : 0, 
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

  getAllProcGroups(){
    this.settingService.getProcGroups(this.pageNumber, this.pageSize, true).subscribe((res) => {
      var data: any = res;
      this.totalRecords = res.totalRecords;
      if (data.response != null && data.response.length > 0) {
        this.procGroupList = data.response;
     
        console.log(this.procGroupList);
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

  deleteProcGroup(){
    this.settingService.deleteProcGroup(true, this.id).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getAllProcGroups();    
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
    this.getAllProcGroups()
  }

  getCellValue(data:any)
  {
   if(data!=null)
     return data.split(',').map(Number);

     return data;
  }

  onRowUpdated(e) {    
    var data = {
      'procGroupId': e.data.ProcGroupId,
      'procGroupName': e.data.ProcGroupName,
      'procNoShowFee': e.data.ProcNoShowFee,
      'masterModalityID':e.data.MasterModalityID  
    } 
    this.settingService.updateProcGroup(true, data).subscribe((res) =>{      
      if (res) {
        this.notificationService.showNotification({ 
          alertHeader : 'Success' ,
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getAllProcGroups();
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

  // onRoleValueChanged(event:any,cell:any) {  
  //   console.log(event.value);
  //   console.log(cell.data);
  //   var data = {
  //     'procGroupId': cell.data.ProcGroupId,
  //     'procGroupName': cell.data.ProcGroupName,
  //     'procNoShowFee': cell.data.ProcNoShowFee,
  //     'masterModalityID':event.value.toString()  
  //   } 
  //   this.settingService.updateProcGroup(true, data).subscribe((res) =>{      
  //     if (res) {
  //       this.notificationService.showNotification({ 
  //         alertHeader : 'Success' ,
  //         alertMessage: res.message,
  //         alertType: res.responseCode
  //       })
  //     }
  //     this.getAllProcGroups();
  //     this.submitted1 = false;
  //     this.editForm.reset();
  //   }, 
  //   (err : any) => {
  //     this.notificationService.showNotification({
  //       alertHeader : err.statusText,
  //       alertMessage:err.message,
  //       alertType: err.status
  //     });
  //   });    
  // } 
  get aForm() { return this.addForm.controls; }
  get eForm() { return this.editForm.controls; }
}
